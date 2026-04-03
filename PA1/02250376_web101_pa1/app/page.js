// Main page - assembles all sections together
import Navbar from "../components/Navbar";
import HeroBanner from "../components/HeroBanner";
import CategoryGrid from "../components/CategoryGrid";
import DealsSection from "../components/DealsSection";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <main className="bg-gray-100 min-h-screen">
      <Navbar />
      <HeroBanner />
      <CategoryGrid />
      <DealsSection />
      <Footer />
    </main>
  );
}