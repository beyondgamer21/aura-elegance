# AURA Clothing E-commerce Platform

## Overview

AURA is a modern e-commerce platform for a premium clothing brand, built with a React frontend and Express.js backend. The application features a sophisticated product catalog, shopping cart functionality, and order management system with a dark, elegant design theme.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **Styling**: Tailwind CSS with custom CSS variables for brand theming
- **UI Components**: Comprehensive component library using Radix UI primitives
- **State Management**: React Context for cart state, TanStack Query for server state
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Module System**: ES Modules (type: "module")
- **API Pattern**: RESTful API with JSON responses
- **Error Handling**: Centralized error handling middleware
- **Logging**: Custom request/response logging for API endpoints

### Database & ORM
- **Database**: PostgreSQL (configured for Neon Database)
- **ORM**: Drizzle ORM with type-safe queries
- **Schema**: Shared schema definition between frontend and backend
- **Migrations**: Drizzle Kit for database migrations

## Key Components

### Product Management
- Product catalog with categories (dresses, casual, formal, accessories)
- Product details including pricing, stock management, and image URLs
- Category-based filtering and product search functionality
- In-memory storage implementation with sample data for development

### Shopping Cart System
- Context-based cart state management
- Add, remove, and update quantity operations
- Real-time cart total calculations
- Persistent cart state during session
- Side-panel cart interface with smooth animations

### Order Processing
- Customer information collection with form validation
- Order creation with cart items serialization
- Zod schema validation for type safety
- Order status tracking system

### UI/UX Design
- Dark theme with gradient accents (purple, gold, emerald)
- Responsive design with mobile-first approach
- Smooth animations and transitions
- Professional product photography integration
- Brand-focused design language

## Data Flow

### Product Display Flow
1. Frontend requests products from `/api/products` or `/api/products/category/:category`
2. Backend retrieves products from storage layer (currently in-memory)
3. Products displayed in responsive grid with category filtering
4. Users can add products to cart with immediate feedback

### Order Processing Flow
1. User fills out checkout form with customer details
2. Form validation using React Hook Form and Zod schemas
3. Order data (customer info + cart items) sent to `/api/orders`
4. Backend validates and stores order information
5. Success response triggers cart clearing and confirmation message

### State Management Flow
- Cart state managed through React Context
- Server data cached with TanStack Query
- Form state handled by React Hook Form
- Toast notifications for user feedback

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: Neon PostgreSQL serverless driver
- **drizzle-orm**: Type-safe SQL ORM
- **@tanstack/react-query**: Server state management
- **react-hook-form**: Form handling and validation
- **zod**: Schema validation
- **tailwindcss**: Utility-first CSS framework

### UI Component Library
- **@radix-ui/***: Comprehensive set of accessible UI primitives
- **lucide-react**: Icon library
- **class-variance-authority**: Utility for creating component variants
- **embla-carousel-react**: Carousel functionality

### Development Tools
- **vite**: Build tool and dev server
- **typescript**: Type safety
- **tsx**: TypeScript execution for Node.js
- **esbuild**: Fast JavaScript bundler for production

## Deployment Strategy

### Development Setup
- Vite dev server for frontend with HMR
- Express server with TypeScript execution via tsx
- Database connection to Neon PostgreSQL
- Environment variable configuration for database URL

### Production Build
- Frontend: Vite build to static assets in `dist/public`
- Backend: esbuild compilation to `dist/index.js`
- Static file serving from Express for production
- Database migrations via Drizzle Kit

### Environment Configuration
- `NODE_ENV` for environment detection
- `DATABASE_URL` for PostgreSQL connection
- Replit-specific plugins for development environment
- Build scripts for development (`dev`) and production (`start`)

### File Structure
```
├── client/          # React frontend
├── server/          # Express backend
├── shared/          # Shared types and schemas
├── migrations/      # Database migrations
└── dist/           # Production build output
```

The application follows a monorepo structure with clear separation between frontend, backend, and shared code, enabling efficient development and deployment workflows.