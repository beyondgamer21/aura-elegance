import Navigation from "@/components/navigation";
import HeroSection from "@/components/hero-section";
import ProductGrid from "@/components/product-grid";
import AboutSection from "@/components/about-section";
import ContactSection from "@/components/contact-section";
import Footer from "@/components/footer";
import ShoppingCart from "@/components/shopping-cart";
import CheckoutModal from "@/components/checkout-modal";

export default function Home() {
  return (
    <div className="min-h-screen bg-brand-black text-white overflow-x-hidden">
      <Navigation />
      <HeroSection />
      
      {/* Featured Products */}
      <section className="py-20 bg-brand-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-slide-up">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Featured <span className="gradient-text">Collection</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Handpicked pieces that embody sophistication and contemporary style
            </p>
          </div>
          <ProductGrid featured={true} />
        </div>
      </section>

      {/* Shop Section */}
      <section id="shop" className="py-20 bg-brand-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Shop <span className="gradient-text">Collections</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Explore our curated selection of premium fashion pieces
            </p>
          </div>
          <ProductGrid />
        </div>
      </section>

      <AboutSection />
      <ContactSection />
      <Footer />
      <ShoppingCart />
      <CheckoutModal />
    </div>
  );
}
