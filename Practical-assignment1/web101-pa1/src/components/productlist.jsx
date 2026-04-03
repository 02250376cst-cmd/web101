import ProductCard from "./ProductCard"
import "../styles/ProductList.css"

function ProductList({ setCartCount }) {
  const products = [
    {
      id: 1,
      title: "iPhone 14",
      price: 999,
      image: "https://m.media-amazon.com/images/I/61cwywLZR-L._AC_SL1500_.jpg"
    },
    {
      id: 2,
      title: "Laptop",
      price: 800,
      image: "https://m.media-amazon.com/images/I/71jG+e7roXL._AC_SL1500_.jpg"
    },
    {
      id: 3,
      title: "Headphones",
      price: 120,
      image: "https://m.media-amazon.com/images/I/61CGHv6kmWL._AC_SL1500_.jpg"
    },
    {
      id: 4,
      title: "Smart Watch",
      price: 150,
      image: "https://m.media-amazon.com/images/I/61y2VVWcGBL._AC_SL1500_.jpg"
    }
  ]

  return (
    <div className="products">
      {products.map(p => (
        <ProductCard
          key={p.id}
          title={p.title}
          price={p.price}
          image={p.image}
          setCartCount={setCartCount}
        />
      ))}
    </div>
  )
}

export default ProductList