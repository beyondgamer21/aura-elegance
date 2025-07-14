import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import session from "express-session";
import connectPg from "connect-pg-simple";
import bcrypt from "bcrypt";
import { eq, or } from "drizzle-orm";
import type { Express, RequestHandler } from "express";
import { db } from "./db";
import { users, type User } from "@shared/schema";

// Session configuration
export function getSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1000; // 1 week
  const pgStore = connectPg(session);
  const sessionStore = new pgStore({
    conString: process.env.DATABASE_URL,
    createTableIfMissing: true,
    ttl: sessionTtl,
    tableName: "sessions",
  });

  return session({
    secret: process.env.SESSION_SECRET || "aura-clothing-secret-key",
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: sessionTtl,
    },
  });
}

// Passport configuration
export function setupAuth(app: Express) {
  app.use(getSession());
  app.use(passport.initialize());
  app.use(passport.session());

  // Local strategy for email/phone + password authentication
  passport.use(new LocalStrategy(
    {
      usernameField: 'identifier', // Can be email or phone
      passwordField: 'password'
    },
    async (identifier, password, done) => {
      try {
        // Check if identifier is email or phone
        const isEmail = identifier.includes('@');
        
        const user = await db.select().from(users).where(
          isEmail 
            ? eq(users.email, identifier)
            : eq(users.phone, identifier)
        ).limit(1);

        if (!user.length) {
          return done(null, false, { message: 'Invalid credentials' });
        }

        const userRecord = user[0];
        
        if (!userRecord.passwordHash) {
          return done(null, false, { message: 'Invalid credentials' });
        }

        const isValid = await bcrypt.compare(password, userRecord.passwordHash);
        
        if (!isValid) {
          return done(null, false, { message: 'Invalid credentials' });
        }

        return done(null, userRecord);
      } catch (error) {
        return done(error);
      }
    }
  ));

  // Serialize user for session
  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  // Deserialize user from session
  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await db.select().from(users).where(eq(users.id, id)).limit(1);
      if (user.length) {
        done(null, user[0]);
      } else {
        done(null, false);
      }
    } catch (error) {
      done(error);
    }
  });
}

// Middleware to check if user is authenticated
export const isAuthenticated: RequestHandler = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "Unauthorized - Please log in" });
};

// Middleware to check if user is authenticated (returns null instead of 401)
export const optionalAuth: RequestHandler = (req, res, next) => {
  // Always continue, authentication is optional
  next();
};

// Helper function to hash passwords
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12;
  return bcrypt.hash(password, saltRounds);
}

// Helper function to generate verification tokens
export function generateToken(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}