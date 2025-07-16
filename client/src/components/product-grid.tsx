import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Heart, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import type { Product } from "@shared/schema";

interface ProductGridProps {
  featured?: boolean;
}

export default function ProductGrid({ featured = false }: ProductGridProps) {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const { addToCart } = useCart();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const { data: categoryProducts = [] } = useQuery<Product[]>({
    queryKey: ["/api/products/category", selectedCategory],
    enabled: selectedCategory !== "all",
  });

  const displayProducts = selectedCategory === "all" ? products : categoryProducts;
  const finalProducts = featured ? displayProducts.slice(0, 3) : displayProducts;

  const categories = [
    { id: "all", label: "All Items" },
    { id: "dresses", label: "Dresses" },
    { id: "casual", label: "Casual" },
    { id: "formal", label: "Formal" },
    { id: "accessories", label: "Accessories" },
  ];

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation(); // Prevent navigation when clicking add to cart
    addToCart({
      id: product.id.toString(),
      name: product.name,
      price: parseFloat(product.price),
      quantity: 1,
      imageUrl: product.imageUrl,
    });
    
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const handleProductClick = (productId: number) => {
    setLocation(`/product/${productId}`);
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-gray-800 rounded-2xl aspect-[3/4] mb-4"></div>
            <div className="h-4 bg-gray-800 rounded mb-2"></div>
            <div className="h-3 bg-gray-800 rounded mb-2 w-3/4"></div>
            <div className="h-4 bg-gray-800 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div>
      {!featured && (
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-6 py-3 rounded-full transition-all duration-300 ${
                selectedCategory === category.id
                  ? "bg-purple-600 text-white border-purple-600"
                  : "border-gray-600 text-gray-400 hover:border-purple-600 hover:text-purple-400"
              }`}
            >
              {category.label}
            </Button>
          ))}
        </div>
      )}

      <div className={`grid grid-cols-1 sm:grid-cols-2 ${featured ? 'lg:grid-cols-3' : 'lg:grid-cols-4'} gap-8`}>
        {finalProducts.map((product) => (
          <div 
            key={product.id} 
            className="elegant-card shimmer-effect group"
            onClick={() => handleProductClick(product.id)}
          >
            <div className="relative overflow-hidden aspect-[3/4] mb-4">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <button 
                onClick={(e) => e.stopPropagation()}
                className="absolute top-4 right-4 bg-white/20 backdrop-blur-md p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white/30 hover:scale-110"
              >
                <Heart className="h-4 w-4 text-white" />
              </button>
              <button
                onClick={(e) => handleAddToCart(e, product)}
                className="absolute bottom-4 right-4 bg-gradient-to-r from-purple-600 to-purple-700 p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:from-purple-700 hover:to-purple-800 hover:scale-110 shadow-lg"
              >
                <ShoppingCart className="h-4 w-4 text-white" />
              </button>
            </div>
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-2 group-hover:text-purple-300 transition-colors duration-300">{product.name}</h3>
              <p className="text-gray-400 text-sm mb-3">{product.description}</p>
              <p className="text-xl font-bold gradient-text">₹
{product.price}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
