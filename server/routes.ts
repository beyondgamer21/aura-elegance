import type { Express } from "express";
import { createServer, type Server } from "http";
import { Resend } from "resend";
import { storage } from "./storage";
import { insertOrderSchema, orderFormSchema, type CartItem } from "@shared/schema";
import { z } from "zod";

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all products
  app.get("/api/products", async (req, res) => {
    try {
      const products = await storage.getProducts();
      res.json(products);
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  // Get products by category
  app.get("/api/products/category/:category", async (req, res) => {
    try {
      const { category } = req.params;
      const products = await storage.getProductsByCategory(category);
      res.json(products);
    } catch (error) {
      console.error("Error fetching products by category:", error);
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  // Get single product
  app.get("/api/products/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const product = await storage.getProduct(id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      console.error("Error fetching product:", error);
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });

  // Create order
  app.post("/api/orders", async (req, res) => {
    try {
      console.log("Received order request:", JSON.stringify(req.body, null, 2));

      // Validate the order form data
      const orderFormData = orderFormSchema.parse(req.body.orderForm);
      const cartItems: CartItem[] = req.body.cartItems;

      if (!cartItems || cartItems.length === 0) {
        return res.status(400).json({ message: "Cart cannot be empty" });
      }

      // Calculate total
      const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

      // Create order
      const orderData = {
        customerName: orderFormData.customerName,
        customerEmail: orderFormData.customerEmail,
        customerPhone: orderFormData.customerPhone,
        customerAddress: orderFormData.customerAddress,
        customerCity: orderFormData.customerCity,
        customerPostalCode: orderFormData.customerPostalCode,
        specialInstructions: orderFormData.specialInstructions || "",
        items: JSON.stringify(cartItems),
        total: total.toFixed(2),
        status: "pending",
      };

      const order = await storage.createOrder(orderData);

      // Send notifications
      await sendNotifications(order, cartItems);

      res.json({ 
        success: true, 
        orderId: order.id,
        message: "Order placed successfully" 
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid order data", 
          errors: error.errors 
        });
      }
      console.error("Error creating order:", error);
      res.status(500).json({ message: "Failed to create order" });
    }
  });

  // Get all orders (for admin purposes)
  app.get("/api/orders", async (req, res) => {
    try {
      const orders = await storage.getOrders();
      res.json(orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

async function sendNotifications(order: any, cartItems: CartItem[]) {
  try {
    // Email notification using Resend - always send to your email address
    const ownerEmail = "kaleshreyash940@gmail.com"; // Your verified email address
    const fromEmail = "onboarding@resend.dev"; // Resend's default verified domain
    const emailSubject = `New Order #${order.id} - Aura Clothing`;
    const emailBody = formatEmailMessage(order, cartItems);

    if (process.env.RESEND_API_KEY) {
      try {
        const emailResult = await resend.emails.send({
          from: `Aura Clothing <${fromEmail}>`,
          to: [ownerEmail],
          subject: emailSubject,
          html: emailBody,
        });
        console.log("✅ Email sent successfully to:", ownerEmail);
        console.log("📧 Email ID:", emailResult.data?.id);
        console.log("📧 Full response:", JSON.stringify(emailResult, null, 2));
      } catch (emailError) {
        console.error("❌ Failed to send email:", emailError);
        console.error("❌ Error details:", emailError.message);
      }
    } else {
      console.log("⚠️ RESEND_API_KEY not found, email not sent");
    }

    // WhatsApp notification (console log for now)
    const whatsappNumber = process.env.WHATSAPP_NUMBER || process.env.OWNER_WHATSAPP || "+1234567890";
    const whatsappMessage = formatWhatsAppMessage(order, cartItems);

    console.log("📱 WhatsApp notification:");
    console.log("To:", whatsappNumber);
    console.log("Message:", whatsappMessage);
    console.log("💡 To enable WhatsApp, use WhatsApp Business API or services like Twilio");

  } catch (error) {
    console.error("Error sending notifications:", error);
  }
}

function formatWhatsAppMessage(order: any, cartItems: CartItem[]): string {
  const itemsList = cartItems.map(item => 
    `• ${item.name} x${item.quantity} - $${(item.price * item.quantity).toFixed(2)}`
  ).join('\n');

  return `🛍️ *New Order Received - Aura Clothing*

📋 *Order ID:* #${order.id}
👤 *Customer:* ${order.customerName}
📧 *Email:* ${order.customerEmail}
📱 *Phone:* ${order.customerPhone}

📍 *Delivery Address:*
${order.customerAddress}
${order.customerCity}, ${order.customerPostalCode}

🛒 *Items Ordered:*
${itemsList}

💰 *Total Amount:* $${order.total}

${order.specialInstructions ? `📝 *Special Instructions:* ${order.specialInstructions}` : ''}

⏰ *Order Time:* ${new Date().toLocaleString()}

Please process this order as soon as possible!`;
}

function formatEmailMessage(order: any, cartItems: CartItem[]): string {
  const itemsList = cartItems.map(item => 
    `<tr>
      <td style="padding: 8px; border-bottom: 1px solid #ddd;">${item.name}</td>
      <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: center;">${item.quantity}</td>
      <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right;">$${item.price.toFixed(2)}</td>
      <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right;">$${(item.price * item.quantity).toFixed(2)}</td>
    </tr>`
  ).join('');

  return `
  <html>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #8B5CF6; text-align: center;">New Order Received</h1>

        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h2>Order Details</h2>
          <p><strong>Order ID:</strong> #${order.id}</p>
          <p><strong>Order Date:</strong> ${new Date().toLocaleString()}</p>
        </div>

        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h2>Customer Information</h2>
          <p><strong>Name:</strong> ${order.customerName}</p>
          <p><strong>Email:</strong> ${order.customerEmail}</p>
          <p><strong>Phone:</strong> ${order.customerPhone}</p>
          <p><strong>Address:</strong><br>
             ${order.customerAddress}<br>
             ${order.customerCity}, ${order.customerPostalCode}</p>
          ${order.specialInstructions ? `<p><strong>Special Instructions:</strong> ${order.specialInstructions}</p>` : ''}
        </div>

        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h2>Order Items</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="background: #e9ecef;">
                <th style="padding: 12px; text-align: left; border-bottom: 2px solid #ddd;">Product</th>
                <th style="padding: 12px; text-align: center; border-bottom: 2px solid #ddd;">Qty</th>
                <th style="padding: 12px; text-align: right; border-bottom: 2px solid #ddd;">Price</th>
                <th style="padding: 12px; text-align: right; border-bottom: 2px solid #ddd;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsList}
              <tr style="background: #e9ecef; font-weight: bold;">
                <td colspan="3" style="padding: 12px; text-align: right;">Order Total:</td>
                <td style="padding: 12px; text-align: right;">$${order.total}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p style="text-align: center; color: #666; font-size: 14px;">
          This is an automated notification from Aura Clothing
        </p>
      </div>
    </body>
  </html>`;
}