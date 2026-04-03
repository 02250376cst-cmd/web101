import "../styles/ProductCard.css"
import { useState } from "react"

function ProductCard({ title, price, image, setCartCount }) {
  const [added, setAdded] = useState(false)

  const handleCart = () => {
    setAdded(true)
    setCartCount(prev => prev + 1)
  }

  return (
    <div className="card">
      <img src={image} alt="product" />
      <h4>{title}</h4>
      <p className="price">${price}</p>

      <button onClick={handleCart}>
        {added ? "Added ✅" : "Add to Cart"}
      </button>
    </div>
  )
}

export default ProductCard