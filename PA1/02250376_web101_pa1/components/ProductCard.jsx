// ProductCard - reusable card component used in DealsSection and other product listings
// Props: title, price, originalPrice, rating, image
export default function ProductCard({ title, price, originalPrice, rating, image }) {

  // Render star rating from number (e.g. 4 → ★★★★☆)
  const renderStars = (count) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={i < count ? "text-yellow-400" : "text-gray-300"}>★</span>
    ));
  };

  return (
    <div className="bg-white rounded shadow hover:shadow-lg transition-shadow p-4 flex flex-col gap-2 cursor-pointer">
      <img src={image} alt={title} className="w-full h-40 object-contain rounded" />
      <h3 className="text-sm font-semibold text-gray-800 line-clamp-2">{title}</h3>
      <div className="flex items-center gap-1 text-sm">{renderStars(rating)}</div>
      <div className="flex items-center gap-2">
        <span className="text-red-600 font-bold">{price}</span>
        <span className="text-gray-400 line-through text-xs">{originalPrice}</span>
      </div>
      <button className="mt-auto bg-yellow-400 hover:bg-yellow-500 text-sm font-semibold py-1 rounded">
        Add to Cart
      </button>
    </div>
  );
}