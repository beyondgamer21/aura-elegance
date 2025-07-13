import { products, orders, type Product, type Order, type InsertProduct, type InsertOrder } from "@shared/schema";

export interface IStorage {
  // Products
  getProducts(): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  getProductsByCategory(category: string): Promise<Product[]>;
  
  // Orders
  createOrder(order: InsertOrder): Promise<Order>;
  getOrder(id: number): Promise<Order | undefined>;
  getOrders(): Promise<Order[]>;
}

export class MemStorage implements IStorage {
  private products: Map<number, Product>;
  private orders: Map<number, Order>;
  private currentProductId: number;
  private currentOrderId: number;

  constructor() {
    this.products = new Map();
    this.orders = new Map();
    this.currentProductId = 1;
    this.currentOrderId = 1;
    this.initializeProducts();
  }

  private initializeProducts() {
    const sampleProducts: Product[] = [
      {
        id: 1,
        name: "Midnight Elegance Dress",
        description: "Premium Collection",
        price: "299.00",
        category: "dresses",
        imageUrl: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=1200",
        inStock: 10,
      },
      {
        id: 2,
        name: "Urban Chic Ensemble",
        description: "Casual Collection",
        price: "189.00",
        category: "casual",
        imageUrl: "https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=800",
        inStock: 15,
      },
      {
        id: 3,
        name: "Executive Power Suit",
        description: "Business Collection",
        price: "449.00",
        category: "formal",
        imageUrl: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=1200",
        inStock: 8,
      },
      {
        id: 4,
        name: "Silk Evening Dress",
        description: "Elegant Collection",
        price: "349.00",
        category: "dresses",
        imageUrl: "https://images.unsplash.com/photo-1566479179817-c0b7b0c8e0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=800",
        inStock: 5,
      },
      {
        id: 5,
        name: "Premium Denim Set",
        description: "Casual Collection",
        price: "159.00",
        category: "casual",
        imageUrl: "https://images.unsplash.com/photo-1582418702523-a331e5f37aa5?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=800",
        inStock: 20,
      },
      {
        id: 6,
        name: "Tailored Blazer",
        description: "Formal Collection",
        price: "279.00",
        category: "formal",
        imageUrl: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=800",
        inStock: 12,
      },
      {
        id: 7,
        name: "Designer Handbag",
        description: "Accessories",
        price: "199.00",
        category: "accessories",
        imageUrl: "https://images.unsplash.com/photo-1591561954557-26941169b49e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=800",
        inStock: 25,
      },
      {
        id: 8,
        name: "Statement Jewelry Set",
        description: "Accessories",
        price: "119.00",
        category: "accessories",
        imageUrl: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=800",
        inStock: 30,
      },
    ];

    sampleProducts.forEach(product => {
      this.products.set(product.id, product);
      this.currentProductId = Math.max(this.currentProductId, product.id + 1);
    });
  }

  async getProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async getProduct(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    if (category === "all") {
      return this.getProducts();
    }
    return Array.from(this.products.values()).filter(
      product => product.category === category
    );
  }

  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const id = this.currentOrderId++;
    const order: Order = {
      ...insertOrder,
      id,
      status: insertOrder.status || "pending",
      specialInstructions: insertOrder.specialInstructions || null,
      createdAt: new Date(),
    };
    this.orders.set(id, order);
    return order;
  }

  async getOrder(id: number): Promise<Order | undefined> {
    return this.orders.get(id);
  }

  async getOrders(): Promise<Order[]> {
    return Array.from(this.orders.values());
  }
}

export const storage = new MemStorage();
