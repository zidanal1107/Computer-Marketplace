import { useEffect } from "react";
import { animate, stagger } from "animejs";
import { useTheme } from "../context/ThemeContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Tentang() {
    const { isDark } = useTheme();

    const bg = isDark ? "bg-gray-950 text-white" : "bg-gray-50 text-gray-800";
    const bgCard = isDark ? "bg-gray-900" : "bg-white border border-gray-200";
    const bgCard2 = isDark ? "bg-gray-800" : "bg-gray-100";
    const bgSection = isDark ? "bg-gray-900" : "bg-gray-100";
    const textMuted = isDark ? "text-gray-400" : "text-gray-500";

    useEffect(() => {
        animate(".fade-up", {
            opacity: { from: 0, to: 1 },
            translateY: { from: 40, to: 0 },
            duration: 700,
            delay: stagger(100),
            easing: "easeOutExpo",
        });
    }, []);

    return (
        <div className={`min-h-screen ${bg}`}>
            <Navbar />

            <section className={`px-6 py-16 text-center ${isDark ? "bg-gradient-to-b from-blue-950 to-gray-950" : "bg-gradient-to-b from-blue-100 to-gray-50"}`}>
                <h1 className="fade-up opacity-0 text-3xl md:text-4xl font-bold mb-3">
                    Tentang <span className="text-blue-500">TechStore</span>
                </h1>
                <p className={`fade-up opacity-0 ${textMuted} max-w-xl mx-auto`}>
                    Toko teknologi terpercaya di Kediri sejak 2015. Melayani jual beli laptop, komputer, hardware, dan service profesional.
                </p>
            </section>

            <section className="px-6 py-12 max-w-6xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className={`fade-up opacity-0 ${bgCard} rounded-xl p-8 border-t-4 border-blue-500`}>
                        <div className="text-5xl mb-4">🎯</div>
                        <h3 className="text-2xl font-bold mb-3">Visi</h3>
                        <p className={textMuted}>Menjadi toko teknologi terpercaya dan terlengkap di Jawa Timur yang memberikan solusi terbaik bagi pelanggan dengan harga terjangkau dan pelayanan profesional.</p>
                    </div>
                    <div className={`fade-up opacity-0 ${bgCard} rounded-xl p-8 border-t-4 border-green-500`}>
                        <div className="text-5xl mb-4">🚀</div>
                        <h3 className="text-2xl font-bold mb-3">Misi</h3>
                        <ul className={`${textMuted} space-y-2`}>
                            <li>✔️ Menyediakan produk teknologi berkualitas</li>
                            <li>✔️ Memberikan layanan service cepat & bergaransi</li>
                            <li>✔️ Harga transparan tanpa biaya tersembunyi</li>
                            <li>✔️ Kepuasan pelanggan adalah prioritas utama</li>
                        </ul>
                    </div>
                </div>
            </section>

            <section className={`px-6 py-12 ${bgSection}`}>
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-2xl font-bold text-center mb-10">TechStore dalam Angka</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {[
                            { angka: "10+", label: "Tahun Pengalaman", icon: "🏆" },
                            { angka: "5000+", label: "Pelanggan Puas", icon: "😊" },
                            { angka: "200+", label: "Produk Tersedia", icon: "📦" },
                            { angka: "98%", label: "Tingkat Kepuasan", icon: "⭐" },
                        ].map((item, i) => (
                            <div key={i} className={`fade-up opacity-0 ${bgCard2} rounded-xl p-6 text-center`}>
                                <div className="text-4xl mb-2">{item.icon}</div>
                                <p className="text-3xl font-bold text-blue-500">{item.angka}</p>
                                <p className={`${textMuted} text-sm mt-1`}>{item.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="px-6 py-12 max-w-6xl mx-auto">
                <h2 className="text-2xl font-bold text-center mb-10">Tim Kami</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        { nama: "Budi Santoso", jabatan: "CEO & Founder", icon: "👨‍💼" },
                        { nama: "Andi Wijaya", jabatan: "Teknisi Senior", icon: "👨‍🔧" },
                        { nama: "Sari Dewi", jabatan: "Customer Service", icon: "👩‍💻" },
                    ].map((tim, i) => (
                        <div key={i} className={`fade-up opacity-0 ${bgCard} rounded-xl p-8 text-center border ${isDark ? "border-gray-800 hover:border-blue-500" : "border-gray-200 hover:border-blue-400"} transition`}>
                            <div className="text-6xl mb-4">{tim.icon}</div>
                            <h3 className="text-xl font-bold mb-1">{tim.nama}</h3>
                            <p className="text-blue-500 text-sm">{tim.jabatan}</p>
                        </div>
                    ))}
                </div>
            </section>

            <section className={`px-6 py-12 ${bgSection}`}>
                <div className="max-w-3xl mx-auto text-center">
                    <h2 className="fade-up opacity-0 text-2xl font-bold mb-8">📍 Lokasi Kami</h2>
                    <div className={`fade-up opacity-0 ${bgCard2} rounded-xl p-8 space-y-4`}>
                        <p>🏠 Jl. Teknologi No. 123, Kediri, Jawa Timur</p>
                        <p>📞 0812-3456-7890</p>
                        <p>📧 techstore@email.com</p>
                        <p>🕐 Senin - Sabtu: 08.00 - 20.00 WIB</p>
                        <a href="https://wa.me/6281234567890" target="_blank" rel="noreferrer"
                            className="inline-block mt-4 bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-full font-semibold transition">
                            💬 Hubungi via WhatsApp
                        </a>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}

export default Tentang;