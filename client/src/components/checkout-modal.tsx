import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCart } from "@/hooks/use-cart";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { orderFormSchema, type OrderForm, type CartItem } from "@shared/schema";
import { Loader2, User } from "lucide-react";

export function CheckoutModal({ isOpen, onClose }: CheckoutModalProps) {
  const { items, clearCart } = useCart();
  const { user, userProfile } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<OrderForm>({
    resolver: zodResolver(orderFormSchema),
    defaultValues: {
      customerName: userProfile?.fullName || "",
      customerEmail: userProfile?.email || user?.email || "",
      customerPhone: userProfile?.phone || user?.phoneNumber || "",
    }
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Checkout</DialogTitle>
        </DialogHeader>

        {!user && (
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-center gap-2 text-amber-700">
              <User className="h-5 w-5" />
              <span className="font-medium">Please sign in to continue</span>
            </div>
            <p className="text-sm text-amber-600 mt-1">
              You need to be signed in to place an order.
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit(async (data) => {
          setIsSubmitting(true);
          console.log(data);

          // Simulate order submission
          await new Promise((resolve) => setTimeout(resolve, 2000));

          setIsSubmitting(false);
          toast({
            title: "Order placed!",
            description: "Your order has been placed successfully.",
          });
          clearCart();
          reset();
          onClose();
        })}>
          <div className="grid gap-4 py-4">
            <div>
              <Label htmlFor="customerName">Full Name</Label>
              <Input
                id="customerName"
                defaultValue={userProfile?.fullName}
                placeholder="John Doe"
                className="mt-1"
                {...register("customerName")}
              />
            </div>
            <div>
              <Label htmlFor="customerEmail">Email</Label>
              <Input
                id="customerEmail"
                defaultValue={userProfile?.email || user?.email}
                placeholder="johndoe@example.com"
                type="email"
                className="mt-1"
                {...register("customerEmail")}
              />
            </div>
            <div>
              <Label htmlFor="customerPhone">Phone Number</Label>
              <Input
                id="customerPhone"
                defaultValue={userProfile?.phone || user?.phoneNumber}
                placeholder="123-456-7890"
                type="tel"
                className="mt-1"
                {...register("customerPhone")}
              />
            </div>
            <div>
              <Label htmlFor="customerAddress">Address</Label>
              <Input
                id="customerAddress"
                placeholder="123 Main St"
                className="mt-1"
                {...register("customerAddress")}
              />
            </div>
            <div>
              <Label htmlFor="customerCity">City</Label>
              <Input
                id="customerCity"
                placeholder="New York"
                className="mt-1"
                {...register("customerCity")}
              />
            </div>
            <div>
              <Label htmlFor="customerPostalCode">Postal Code</Label>
              <Input
                id="customerPostalCode"
                placeholder="10001"
                className="mt-1"
                {...register("customerPostalCode")}
              />
            </div>
            <div>
              <Label htmlFor="specialInstructions">Special Instructions</Label>
              <Textarea
                id="specialInstructions"
                placeholder="Leave a note for the delivery driver"
                className="mt-1 resize-none"
                {...register("specialInstructions")}
              />
            </div>
          </div>
          <Button 
            type="submit" 
            className="w-full"
            disabled={isSubmitting || !user}
          >
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {user ? `Place Order ($${total.toFixed(2)})` : "Sign In Required"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}