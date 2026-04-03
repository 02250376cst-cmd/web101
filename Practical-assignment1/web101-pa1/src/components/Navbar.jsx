import "../styles/Navbar.css";

function Navbar({ cartCount, searchTerm, setSearchTerm }) {
  return (
    <div className="navbar">
      <div className="nav-logo">Amazon</div>

      <input
        className="nav-search"
        placeholder="Search Amazon"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <div className="nav-right">
        <p>Hello, Sign in</p>
        <button className="cart-btn">🛒 Cart ({cartCount})</button>
      </div>
    </div>
  );
}

export default Navbar;