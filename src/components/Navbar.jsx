import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useKeranjang } from "../context/KeranjangContext";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";

function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { totalItem } = useKeranjang();
    const { isDark, toggleTheme } = useTheme();
    const { user } = useAuth();

    const navLinks = [
        { label: "Home", path: "/" },
        { label: "Produk", path: "/produk" },
        { label: "Service", path: "/service" },
        { label: "Tentang", path: "/tentang" },
    ];

    return (
        <nav className={`shadow-lg px-6 py-4 sticky top-0 z-50 ${isDark ? "bg-gray-900" : "bg-white border-b border-gray-200"}`}>
            <div className="flex justify-between items-center max-w-6xl mx-auto">
                <h1 onClick={() => navigate("/")} className="text-2xl font-bold text-blue-500 cursor-pointer">
                    💻 TechStore
                </h1>

                {/* Desktop Menu */}
                <div className="hidden md:flex gap-6 font-semibold">
                    {navLinks.map((link, i) => (
                        <a key={i} href={link.path} className={`transition border-b-2 pb-1 ${location.pathname === link.path ? "text-blue-500 border-blue-500" : `${isDark ? "text-gray-400" : "text-gray-600"} border-transparent hover:text-blue-500 hover:border-blue-500`}`}>
                            {link.label}
                        </a>
                    ))}
                </div>

                {/* Kanan Desktop */}
                <div className="hidden md:flex items-center gap-3">
                    <button onClick={toggleTheme} className={`w-10 h-10 rounded-full flex items-center justify-center transition text-xl ${isDark ? "bg-gray-800 hover:bg-gray-700" : "bg-gray-100 hover:bg-gray-200"}`}>
                        {isDark ? "🌙" : "☀️"}
                    </button>

                    {user ? (
                        <div className="flex items-center gap-3">
                            <button onClick={() => navigate("/profil")} className={`text-sm px-4 py-2 rounded-full font-semibold transition ${isDark ? "bg-gray-800 hover:bg-gray-700 text-gray-300" : "bg-gray-200 hover:bg-gray-300 text-gray-700"}`}>
                                👤 Profil
                            </button>
                        </div>
                    ) : (
                        <button onClick={() => navigate("/login")} className={`text-sm px-4 py-2 rounded-full font-semibold transition ${isDark ? "bg-gray-800 hover:bg-gray-700 text-gray-300" : "bg-gray-200 hover:bg-gray-300 text-gray-600"}`}>
                            Masuk
                        </button>
                    )}

                    <button onClick={() => navigate("/wishlist")} className={`w-10 h-10 rounded-full flex items-center justify-center transition text-xl ${isDark ? "bg-gray-800 hover:bg-gray-700" : "bg-gray-100 hover:bg-gray-200"}`}
                        title="Wishlist">
                        ❤️
                    </button>

                    <button onClick={() => navigate("/keranjang")} className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-full text-sm font-semibold transition relative">
                        🛒 Keranjang
                        {totalItem > 0 && (
                            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                                {totalItem}
                            </span>
                        )}
                    </button>
                </div>

                {/* Mobile Kanan */}
                <div className="md:hidden flex items-center gap-3">
                    <button onClick={toggleTheme} className={`w-9 h-9 rounded-full flex items-center justify-center transition text-lg ${isDark ? "bg-gray-800" : "bg-gray-100"}`}>
                        {isDark ? "🌙" : "☀️"}
                    </button>
                    <button className={`text-2xl ${isDark ? "text-gray-400" : "text-gray-600"}`} onClick={() => setMenuOpen(!menuOpen)}>
                        {menuOpen ? "✕" : "☰"}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {menuOpen && (
                <div className="md:hidden flex flex-col gap-4 mt-4 px-4 pb-4 font-semibold">
                    {navLinks.map((link, i) => (
                        <a key={i} href={link.path} className={`transition ${location.pathname === link.path ? "text-blue-500 border-l-4 border-blue-500 pl-3" : `${isDark ? "text-gray-400" : "text-gray-600"} hover:text-blue-500 pl-3`}`}>
                            {link.label}
                        </a>
                    ))}
                    {user ? (
                        <>
                            <button onClick={() => navigate("/profil")} className={`text-sm px-4 py-2 rounded-full font-semibold transition ${isDark ? "bg-gray-800 hover:bg-gray-700 text-gray-300" : "bg-gray-200 hover:bg-gray-300 text-gray-700"}`}>
                                👤 Profil
                            </button>
                        </>
                    ) : (
                        <button onClick={() => navigate("/login")} className={`text-sm px-4 py-2 rounded-full font-semibold transition ${isDark ? "bg-gray-800 text-gray-300" : "bg-gray-200 text-gray-600"}`}>
                            Masuk
                        </button>
                    )}
                    <button onClick={() => navigate("/keranjang")} className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-full text-sm font-semibold transition relative">
                        🛒 Keranjang
                        {totalItem > 0 && (
                            <span className="bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full ml-1">
                                {totalItem}
                            </span>
                        )}
                    </button>
                </div>
            )}
        </nav>
    );
}

export default Navbar;