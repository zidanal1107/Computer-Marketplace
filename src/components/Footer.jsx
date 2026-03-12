import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

function Footer() {
    const navigate = useNavigate();
    const { isDark } = useTheme();

    const bg = isDark ? "bg-gray-900 border-gray-800 text-gray-400" : "bg-gray-100 border-gray-200 text-gray-500";
    const textHeading = isDark ? "text-white" : "text-gray-800";
    const hover = isDark ? "hover:text-blue-400" : "hover:text-blue-500";

    return (
        <footer className={`${bg} border-t`}>
            <div className="max-w-6xl mx-auto px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">

                    {/* Brand */}
                    <div className="md:col-span-1">
                        <h2 className={`text-2xl font-bold text-blue-500 mb-3`}>💻 TechStore</h2>
                        <p className="text-sm leading-relaxed">
                            Toko teknologi terpercaya di Kediri sejak 2015. Melayani jual beli dan service profesional.
                        </p>
                        <div className="flex gap-3 mt-4">
                            <a href="https://wa.me/6281234567890" target="_blank" rel="noreferrer"
                                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-full text-xs font-semibold transition">
                                💬 WhatsApp
                            </a>
                        </div>
                    </div>

                    {/* Menu */}
                    <div>
                        <h3 className={`font-bold mb-4 ${textHeading}`}>Menu</h3>
                        <ul className="space-y-2 text-sm">
                            {[
                                { label: "Home", path: "/" },
                                { label: "Produk", path: "/produk" },
                                { label: "Service", path: "/service" },
                                { label: "Tentang", path: "/tentang" },
                                { label: "Keranjang", path: "/keranjang" },
                            ].map((link, i) => (
                                <li key={i}>
                                    <button onClick={() => navigate(link.path)} className={`transition ${hover}`}>
                                        {link.label}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Layanan */}
                    <div>
                        <h3 className={`font-bold mb-4 ${textHeading}`}>Layanan</h3>
                        <ul className="space-y-2 text-sm">
                            <li>💻 Jual Beli Laptop</li>
                            <li>🖥️ Jual Komputer</li>
                            <li>🔧 Service & Repair</li>
                            <li>🔩 Jual Hardware</li>
                            <li>⌨️ Aksesoris</li>
                        </ul>
                    </div>

                    {/* Kontak */}
                    <div>
                        <h3 className={`font-bold mb-4 ${textHeading}`}>Kontak</h3>
                        <ul className="space-y-2 text-sm">
                            <li>🏠 Jl. Teknologi No. 123, Kediri</li>
                            <li>📞 0812-3456-7890</li>
                            <li>📧 techstore@email.com</li>
                            <li>🕐 Senin - Sabtu: 08.00 - 20.00</li>
                        </ul>
                    </div>

                </div>

                {/* Bottom */}
                <div className={`border-t ${isDark ? "border-gray-800" : "border-gray-200"} pt-6 flex flex-col md:flex-row justify-between items-center gap-3 text-sm`}>
                    <p>© 2026 <span className={`font-semibold ${textHeading}`}>TechStore</span>. Semua hak dilindungi.</p>
                    <p>Made with ❤️ in Kediri</p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;