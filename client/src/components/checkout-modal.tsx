
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCart } from "@/hooks/use-cart";
import { useToast } from "@/hooks/use-toast";
import { orderFormSchema, type OrderForm } from "@shared/schema";
import { Loader2 } from "lucide-react";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CheckoutModal({ isOpen, onClose }: CheckoutModalProps) {
  const { items, clearCart, isCheckoutOpen, closeCheckout } = useCart();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<OrderForm>({
    resolver: zodResolver(orderFormSchema),
  });

  const onSubmit = async (data: OrderForm) => {
    setIsSubmitting(true);
    
    try {
      console.log("Submitting order data:", {
        orderForm: data,
        cartItems: items
      });

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderForm: data,
          cartItems: items
        }),
      });

      const result = await response.json();

      if (response.ok) {
        console.log("Order success:", result);
        toast({
          title: "Order placed successfully!",
          description: `Order #${result.orderId} has been received. We'll send you an email confirmation shortly.`,
        });
        clearCart();
        reset();
        closeCheckout();
      } else {
        throw new Error(result.message || "Failed to place order");
      }
    } catch (error) {
      console.error("Order submission error:", error);
      toast({
        title: "Order failed",
        description: error instanceof Error ? error.message : "Failed to place order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isCheckoutOpen} onOpenChange={closeCheckout}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Checkout</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid gap-4">
            <div>
              <Label htmlFor="customerName">Full Name</Label>
              <Input
                id="customerName"
                placeholder="John Doe"
                className="mt-1"
                {...register("customerName")}
              />
              {errors.customerName && (
                <p className="text-sm text-red-500 mt-1">{errors.customerName.message}</p>
              )}
            </div>
            
            <div>
              <Label htmlFor="customerEmail">Email</Label>
              <Input
                id="customerEmail"
                placeholder="johndoe@example.com"
                type="email"
                className="mt-1"
                {...register("customerEmail")}
              />
              {errors.customerEmail && (
                <p className="text-sm text-red-500 mt-1">{errors.customerEmail.message}</p>
              )}
            </div>
            
            <div>
              <Label htmlFor="customerPhone">Phone Number</Label>
              <Input
                id="customerPhone"
                placeholder="123-456-7890"
                type="tel"
                className="mt-1"
                {...register("customerPhone")}
              />
              {errors.customerPhone && (
                <p className="text-sm text-red-500 mt-1">{errors.customerPhone.message}</p>
              )}
            </div>
            
            <div>
              <Label htmlFor="customerAddress">Address</Label>
              <Input
                id="customerAddress"
                placeholder="123 Main St"
                className="mt-1"
                {...register("customerAddress")}
              />
              {errors.customerAddress && (
                <p className="text-sm text-red-500 mt-1">{errors.customerAddress.message}</p>
              )}
            </div>
            
            <div>
              <Label htmlFor="customerCity">City</Label>
              <Input
                id="customerCity"
                placeholder="New York"
                className="mt-1"
                {...register("customerCity")}
              />
              {errors.customerCity && (
                <p className="text-sm text-red-500 mt-1">{errors.customerCity.message}</p>
              )}
            </div>
            
            <div>
              <Label htmlFor="customerPostalCode">Postal Code</Label>
              <Input
                id="customerPostalCode"
                placeholder="10001"
                className="mt-1"
                {...register("customerPostalCode")}
              />
              {errors.customerPostalCode && (
                <p className="text-sm text-red-500 mt-1">{errors.customerPostalCode.message}</p>
              )}
            </div>
            
            <div>
              <Label htmlFor="specialInstructions">Special Instructions (Optional)</Label>
              <Textarea
                id="specialInstructions"
                placeholder="Leave a note for the delivery driver"
                className="mt-1 resize-none"
                {...register("specialInstructions")}
              />
            </div>
          </div>

          <div className="border-t pt-4">
            <div className="flex justify-between items-center text-lg font-semibold mb-4">
              <span>Total:</span>
              <span>${total.toFixed(2)}</span>
            </div>
            
            <Button 
              type="submit" 
              className="w-full"
              disabled={isSubmitting || items.length === 0}
            >
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isSubmitting ? "Placing Order..." : `Place Order ($${total.toFixed(2)})`}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default CheckoutModal;
