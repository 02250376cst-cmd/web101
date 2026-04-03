import { useState } from "react"
import Navbar from "./components/Navbar"
import Banner from "./components/Banner"
import ProductList from "./components/productlist"
import "./index.css"

function App() {
  const [cartCount, setCartCount] = useState(0)

  return (
    <>
      <Navbar cartCount={cartCount} />
      <Banner />
      <ProductList setCartCount={setCartCount} />
    </>
  )
}

export default App