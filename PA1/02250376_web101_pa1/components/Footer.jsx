"use client";

// Footer - Amazon-style multi-column footer with links
const footerLinks = {
  "Get to Know Us": ["Careers", "Blog", "About Amazon", "Investor Relations"],
  "Make Money with Us": ["Sell on Amazon", "Associates Program", "Advertise"],
  "Amazon Payment Products": ["Amazon Business Card", "Shop with Points", "Reload Your Balance"],
  "Let Us Help You": ["Your Account", "Your Orders", "Shipping Rates", "Help"],
};

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-gray-300 mt-8">
      <div
        className="bg-gray-600 hover:bg-gray-500 text-center py-3 cursor-pointer text-sm"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        Back to top
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 px-8 py-8">
        {Object.entries(footerLinks).map(([heading, links]) => (
          <div key={heading}>
            <h4 className="font-bold text-white mb-2">{heading}</h4>
            <ul className="space-y-1">
              {links.map((link) => (
                <li key={link}>
                  <a href="#" className="text-sm hover:underline">{link}</a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-gray-600 text-center py-4 text-xs text-gray-400">
        © 2026 Amazon 
      </div>
    </footer>
  );
}