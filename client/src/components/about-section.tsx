import { Award, Truck } from "lucide-react";

export default function AboutSection() {
  return (
    <section id="about" className="py-20 bg-brand-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              About <span className="gradient-text">AURA</span>
            </h2>
            <p className="text-xl text-gray-300 mb-6">
              Founded on the belief that fashion is an art form, AURA Clothing brings you carefully curated pieces that embody sophistication, elegance, and contemporary style.
            </p>
            <p className="text-gray-400 mb-8">
              Each garment in our collection is selected for its exceptional quality, unique design, and ability to enhance your personal aura. We believe that what you wear should not just complement your style, but elevate your entire presence.
            </p>
            <div className="flex flex-col sm:flex-row gap-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-amber-500 rounded-full flex items-center justify-center">
                  <Award className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold">Premium Quality</h4>
                  <p className="text-gray-400 text-sm">Hand-selected materials</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-emerald-500 rounded-full flex items-center justify-center">
                  <Truck className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold">Fast Delivery</h4>
                  <p className="text-gray-400 text-sm">Express shipping worldwide</p>
                </div>
              </div>
            </div>
          </div>
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
              alt="Fashion boutique interior"
              className="rounded-2xl shadow-2xl"
            />
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-gradient-to-r from-purple-600 to-amber-500 rounded-2xl animate-float"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
