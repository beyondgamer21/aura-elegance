import { X, Plus, Minus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { useState } from "react";
import { CheckoutModal } from "./checkout-modal";

interface ShoppingCartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ShoppingCartModal({ isOpen, onClose }: ShoppingCartModalProps) {
  const { items, removeFromCart, updateQuantity, total, openCheckout } =
    useCart();

  const handleCheckout = () => {
    if (items.length === 0) {
      return;
    }
    openCheckout();
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={onClose}
        />
      )}
      
      {/* Cart Modal */}
      <div
        className={`fixed right-0 top-0 h-full w-96 bg-brand-dark border-l border-gray-800 transform transition-transform duration-300 z-50 overflow-y-auto ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-semibold">Shopping Cart</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors duration-300"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="space-y-4 mb-6">
          {items.length === 0 ? (
            <p className="text-gray-400 text-center py-8">Your cart is empty</p>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="flex items-center space-x-4 bg-gray-800 p-4 rounded-lg"
              >
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded-lg"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold truncate">{item.name}</h4>
                  <p className="text-amber-400">${item.price.toFixed(2)}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="w-6 h-6 bg-gray-700 rounded flex items-center justify-center hover:bg-gray-600 transition-colors duration-300"
                  >
                    <Minus className="h-3 w-3" />
                  </button>
                  <span className="w-8 text-center">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="w-6 h-6 bg-gray-700 rounded flex items-center justify-center hover:bg-gray-600 transition-colors duration-300"
                  >
                    <Plus className="h-3 w-3" />
                  </button>
                </div>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-red-400 hover:text-red-300 transition-colors duration-300"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-gray-700 pt-6">
            <div className="flex justify-between text-xl font-semibold mb-6">
              <span>Total:</span>
              <span className="gradient-text">${total.toFixed(2)}</span>
            </div>
            <Button onClick={handleCheckout} className="w-full btn-primary">
              Checkout
            </Button>
          </div>
        )}
      </div>
      <CheckoutModal />
      </div>
    </>
  );
}

export default function ShoppingCart() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleCart = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <Button onClick={toggleCart}>Open Cart</Button>
      <ShoppingCartModal isOpen={isOpen} onClose={toggleCart} />
    </>
  );
}
