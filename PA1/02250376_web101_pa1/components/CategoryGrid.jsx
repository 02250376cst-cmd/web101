const categories = [
  { id: 1, title: "Electronics", image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=300&h=200&fit=crop" },
  { id: 2, title: "Books", image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300&h=200&fit=crop" },
  { id: 3, title: "Fashion", image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=300&h=200&fit=crop" },
  { id: 4, title: "Home & Kitchen", image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=200&fit=crop" },
  { id: 5, title: "Sports", image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=300&h=200&fit=crop" },
  { id: 6, title: "Toys", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=200&fit=crop" },
  { id: 7, title: "Beauty", image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=300&h=200&fit=crop" },
  { id: 8, title: "Automotive", image: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=300&h=200&fit=crop" },
];

export default function CategoryGrid() {
  return (
    <section className="px-4 md:px-8 py-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Shop by Category</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {categories.map((cat) => (
          <div key={cat.id} className="bg-white rounded-lg shadow hover:shadow-xl transition-shadow cursor-pointer overflow-hidden group">
            <div className="overflow-hidden h-36">
              <img
                src={cat.image}
                alt={cat.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="p-3">
              <p className="font-bold text-gray-800">{cat.title}</p>
              <a href="#" className="text-blue-600 text-sm hover:underline">Shop now →</a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}