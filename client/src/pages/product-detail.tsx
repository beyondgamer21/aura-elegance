import { useState } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Heart, ShoppingCart, Star, Truck, Shield, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/hooks/use-cart";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/navigation";
import ShoppingCartComponent from "@/components/shopping-cart";
import CheckoutModal from "@/components/checkout-modal";
import type { Product } from "@shared/schema";

export default function ProductDetail() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const { addToCart } = useCart();
  const { toast } = useToast();
  
  // State for product customization
  const [selectedSize, setSelectedSize] = useState("S");
  const [selectedColor, setSelectedColor] = useState("Black");
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const { data: product, isLoading } = useQuery<Product>({
    queryKey: ["/api/products", id],
    queryFn: async () => {
      const response = await fetch(`/api/products/${id}`);
      if (!response.ok) throw new Error("Product not found");
      return response.json();
    },
  });

  // Available options
  const availableSizes = ["XS", "S", "M", "L", "XL", "XXL"];
  const availableColors = [
    { name: "Black", value: "#000000", image: product?.imageUrl },
    { name: "Navy", value: "#1f2937", image: product?.imageUrl },
    { name: "Charcoal", value: "#374151", image: product?.imageUrl },
    { name: "Burgundy", value: "#7f1d1d", image: product?.imageUrl },
  ];

  const productImages = [
    product?.imageUrl,
    product?.imageUrl,
    product?.imageUrl,
    product?.imageUrl,
  ].filter(Boolean);

  const handleColorChange = (colorName: string) => {
    setSelectedColor(colorName);
    // Reset to first image when color changes to show new color variation
    setSelectedImageIndex(0);
  };

  const handleAddToCart = () => {
    if (!product) return;
    
    addToCart({
      id: `${product.id}-${selectedSize}-${selectedColor}`,
      name: `${product.name} (${selectedSize}, ${selectedColor})`,
      price: parseFloat(product.price),
      quantity: 1,
      imageUrl: product.imageUrl,
      size: selectedSize,
      color: selectedColor,
    });
    
    toast({
      title: "Added to cart",
      description: `${product.name} in ${selectedSize} size and ${selectedColor} color has been added to your cart.`,
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-brand-black text-white pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="animate-pulse">
              <div className="aspect-square bg-gray-800 rounded-2xl mb-4"></div>
              <div className="grid grid-cols-4 gap-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="aspect-square bg-gray-800 rounded-lg"></div>
                ))}
              </div>
            </div>
            <div className="animate-pulse">
              <div className="h-8 bg-gray-800 rounded mb-4"></div>
              <div className="h-6 bg-gray-800 rounded mb-6 w-3/4"></div>
              <div className="h-4 bg-gray-800 rounded mb-2"></div>
              <div className="h-4 bg-gray-800 rounded mb-8 w-5/6"></div>
              <div className="h-12 bg-gray-800 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-brand-black text-white pt-20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Product Not Found</h1>
          <Button onClick={() => setLocation("/")} className="btn-primary">
            Return Home
          </Button>
        </div>
      </div>
    );
  }

  const categoryColors = {
    dresses: "bg-purple-600",
    casual: "bg-blue-600", 
    formal: "bg-emerald-600",
    accessories: "bg-amber-600",
  };

  return (
    <div className="min-h-screen bg-brand-black text-white">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => setLocation("/")}
          className="mb-8 text-gray-400 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Products
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square rounded-2xl overflow-hidden bg-brand-dark">
              <img
                src={productImages[selectedImageIndex] || product.imageUrl}
                alt={`${product.name} - ${selectedColor}`}
                className="w-full h-full object-cover hover:scale-105 transition-all duration-700"
              />
            </div>
            <div className="grid grid-cols-4 gap-2">
              {productImages.map((image, i) => (
                <div 
                  key={i} 
                  className={`aspect-square rounded-lg overflow-hidden bg-brand-dark border cursor-pointer transition-all duration-300 ${
                    selectedImageIndex === i 
                      ? "border-purple-500 ring-2 ring-purple-500/50" 
                      : "border-gray-700 hover:border-gray-600"
                  }`}
                  onClick={() => setSelectedImageIndex(i)}
                >
                  <img
                    src={image}
                    alt={`${product.name} view ${i + 1}`}
                    className={`w-full h-full object-cover transition-opacity duration-300 ${
                      selectedImageIndex === i ? "opacity-100" : "opacity-60 hover:opacity-100"
                    }`}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge className={`${categoryColors[product.category as keyof typeof categoryColors]} text-white`}>
                  {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
                </Badge>
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                  <span className="ml-2 text-sm text-gray-400">(4.8) 124 reviews</span>
                </div>
              </div>
              <h1 className="text-4xl font-bold mb-2">{product.name}</h1>
              <p className="text-xl text-gray-400 mb-4">{product.description}</p>
              <div className="flex items-center gap-4 mb-6">
                <span className="text-3xl font-bold gradient-text">${product.price}</span>
                <span className="text-lg text-gray-500 line-through">$399.00</span>
                <Badge variant="destructive">25% OFF</Badge>
              </div>
            </div>

            {/* Size Selection */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Size: <span className="text-purple-400">{selectedSize}</span></h3>
              <div className="flex gap-2">
                {availableSizes.map((size) => (
                  <Button
                    key={size}
                    variant="outline"
                    onClick={() => setSelectedSize(size)}
                    className={`w-12 h-12 transition-all duration-300 ${
                      selectedSize === size
                        ? "border-purple-500 bg-purple-600/30 text-purple-300"
                        : "border-gray-600 hover:border-purple-600 hover:bg-purple-600/20"
                    }`}
                  >
                    {size}
                  </Button>
                ))}
              </div>
            </div>

            {/* Color Selection */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Color: <span className="text-purple-400">{selectedColor}</span></h3>
              <div className="flex gap-2">
                {availableColors.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => handleColorChange(color.name)}
                    className={`w-8 h-8 rounded-full border-2 transition-all duration-300 hover:scale-110 ${
                      selectedColor === color.name
                        ? "border-purple-500 ring-2 ring-purple-500/50"
                        : "border-gray-600 hover:border-white"
                    }`}
                    style={{ backgroundColor: color.value }}
                    title={color.name}
                  >
                    {selectedColor === color.name && (
                      <div className="w-full h-full rounded-full border border-white/30" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Stock Status */}
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-green-400">In Stock - {product.inStock} items available</span>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <Button
                onClick={handleAddToCart}
                className="flex-1 btn-primary h-12"
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                Add to Cart
              </Button>
              <Button
                variant="outline"
                className="h-12 px-6 border-gray-600 hover:border-purple-600 hover:bg-purple-600/20"
              >
                <Heart className="h-5 w-5" />
              </Button>
            </div>

            {/* Product Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-gray-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-600/20 rounded-full flex items-center justify-center">
                  <Truck className="h-5 w-5 text-purple-400" />
                </div>
                <div>
                  <p className="font-semibold text-sm">Free Shipping</p>
                  <p className="text-xs text-gray-400">On orders over $100</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-600/20 rounded-full flex items-center justify-center">
                  <Shield className="h-5 w-5 text-emerald-400" />
                </div>
                <div>
                  <p className="font-semibold text-sm">Secure Payment</p>
                  <p className="text-xs text-gray-400">100% protected</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-600/20 rounded-full flex items-center justify-center">
                  <RotateCcw className="h-5 w-5 text-amber-400" />
                </div>
                <div>
                  <p className="font-semibold text-sm">Easy Returns</p>
                  <p className="text-xs text-gray-400">30 day policy</p>
                </div>
              </div>
            </div>

            {/* Product Description */}
            <div className="pt-6 border-t border-gray-800">
              <h3 className="text-xl font-semibold mb-4">Product Details</h3>
              <div className="prose prose-gray max-w-none text-gray-300">
                <p>
                  Experience the perfect blend of sophistication and comfort with our {product.name}. 
                  Crafted from premium materials and designed with meticulous attention to detail, 
                  this piece embodies the essence of modern elegance.
                </p>
                <ul className="mt-4 space-y-2">
                  <li>• Premium quality fabric with excellent durability</li>
                  <li>• Expertly tailored for a perfect fit</li>
                  <li>• Versatile design suitable for multiple occasions</li>
                  <li>• Easy care and maintenance</li>
                  <li>• Sustainable and ethically sourced materials</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <ShoppingCartComponent />
      <CheckoutModal />
    </div>
  );
}