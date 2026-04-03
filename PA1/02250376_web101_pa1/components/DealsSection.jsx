"use client";
import ProductCard from "./ProductCard";

const deals = [
  { id: 1, title: "Wireless Earbuds Pro", price: "$29.99", originalPrice: "$59.99", rating: 4, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=200&fit=crop" },
  { id: 2, title: "Phone Stand Adjustable", price: "$12.99", originalPrice: "$24.99", rating: 5, image: "https://images.unsplash.com/photo-1586105251261-72a756497a11?w=200&h=200&fit=crop" },
  { id: 3, title: "USB-C Hub 7-in-1", price: "$34.99", originalPrice: "$49.99", rating: 4, image: "https://images.unsplash.com/photo-1625895197185-efcec01cffe0?w=200&h=200&fit=crop" },
  { id: 4, title: "Laptop Sleeve 15\"", price: "$19.99", originalPrice: "$35.99", rating: 3, image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=200&h=200&fit=crop" },
  { id: 5, title: "Mechanical Keyboard", price: "$79.99", originalPrice: "$120.00", rating: 5, image: "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=200&h=200&fit=crop" },
  { id: 6, title: "HD Webcam 1080p", price: "$44.99", originalPrice: "$70.00", rating: 4, image: "https://images.unsplash.com/photo-1587826080692-f439cd0b70da?w=200&h=200&fit=crop" },
];

export default function DealsSection() {
  return (
    <section className="px-4 md:px-8 py-6 bg-gray-50">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Today's Deals</h2>
        <a href="#" className="text-blue-600 hover:underline text-sm font-medium">See all deals →</a>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {deals.map((product) => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>
    </section>
  );
}