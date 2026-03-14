import { useEffect, useState } from "react";
import { animate, stagger } from "animejs";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useKeranjang } from "../context/KeranjangContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import API_URL from "../config/api";

function Home() {
    const navigate = useNavigate();
    const { isDark } = useTheme();
    const { keranjang, tambahKeranjang } = useKeranjang();

    const [produkUnggulan, setProdukUnggulan] = useState([]);
    const [loadingProduk, setLoadingProduk] = useState(true);

    const bg = isDark ? "bg-gray-950 text-white" : "bg-gray-50 text-gray-800";
    const bgCard = isDark ? "bg-gray-900" : "bg-white border border-gray-200";
    const bgCard2 = isDark ? "bg-gray-800" : "bg-white border border-gray-200";
    const bgSection = isDark ? "bg-gray-900" : "bg-gray-100";
    const textMuted = isDark ? "text-gray-400" : "text-gray-500";

    const formatRupiah = (num) => "Rp " + Number(num).toLocaleString("id-ID");

    useEffect(() => {
        animate(".hero-title", { opacity: { from: 0, to: 1 }, translateY: { from: -50, to: 0 }, duration: 1000, easing: "easeOutExpo" });
        animate(".hero-subtitle", { opacity: { from: 0, to: 1 }, translateY: { from: -30, to: 0 }, duration: 1000, delay: 300, easing: "easeOutExpo" });
        animate(".hero-btn", { opacity: { from: 0, to: 1 }, translateY: { from: 30, to: 0 }, duration: 1000, delay: 600, easing: "easeOutExpo" });
    }, []);

    useEffect(() => {
        const fetchProdukUnggulan = async () => {
            setLoadingProduk(true);
            try {
                const res = await fetch(`${API_URL}/produk`);
                const data = await res.json();
                // Ambil 8 produk pertama sebagai unggulan
                setProdukUnggulan(Array.isArray(data) ? data.slice(0, 8) : []);
            } catch (err) {
                console.error(err);
            } finally {
                setLoadingProduk(false);
            }
        };
        fetchProdukUnggulan();
    }, []);

    useEffect(() => {
        if (!loadingProduk && produkUnggulan.length > 0) {
            animate(".product-card", {
                opacity: { from: 0, to: 1 },
                translateY: { from: 50, to: 0 },
                duration: 800,
                delay: stagger(150),
                easing: "easeOutExpo",
            });
        }
    }, [loadingProduk, produkUnggulan]);

    return (
        <div className={`min-h-screen ${bg}`}>
            <Navbar />

            {/* Hero Section */}
            <section className={`flex flex-col items-center justify-center text-center px-6 py-24 md:py-36 ${isDark ? "bg-gradient-to-b from-blue-950 to-gray-950" : "bg-gradient-to-b from-blue-100 to-gray-50"}`}>
                <h1 className="hero-title opacity-0 text-3xl md:text-5xl font-bold mb-4">
                    Solusi <span className="text-blue-500">Teknologi</span> Terpercaya
                </h1>
                <p className={`hero-subtitle opacity-0 ${textMuted} text-base md:text-lg mb-8 max-w-2xl`}>
                    Jual beli laptop, komputer, hardware berkualitas. Didukung layanan service profesional dan bergaransi.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                    <button onClick={() => navigate("/produk")} className="hero-btn opacity-0 bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-full font-semibold transition shadow-lg shadow-blue-900">
                        Lihat Produk
                    </button>
                    <button onClick={() => navigate("/service")} className="hero-btn opacity-0 border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white px-8 py-3 rounded-full font-semibold transition">
                        Service Sekarang
                    </button>
                </div>
            </section>

            {/* Layanan Section */}
            <section className="px-6 py-16 max-w-6xl mx-auto">
                <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">Layanan Kami</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        { icon: "🛒", judul: "Jual Beli Laptop", desc: "Laptop baru & bekas berkualitas dari berbagai merek ternama dengan harga terbaik.", warna: "border-blue-500", path: "/produk" },
                        { icon: "🔧", judul: "Service & Repair", desc: "Teknisi berpengalaman siap memperbaiki laptop dan komputer kamu dengan cepat.", warna: "border-green-500", path: "/service" },
                        { icon: "🖥️", judul: "Jual Hardware", desc: "RAM, SSD, VGA, PSU, Motherboard dan komponen PC lainnya tersedia lengkap.", warna: "border-purple-500", path: "/produk" },
                    ].map((item, i) => (
                        <div key={i} onClick={() => navigate(item.path)}
                            className={`${bgCard} border-t-4 ${item.warna} rounded-xl p-8 hover:shadow-lg transition cursor-pointer hover:scale-105`}>
                            <div className="text-5xl mb-4">{item.icon}</div>
                            <h3 className="text-xl font-bold mb-2">{item.judul}</h3>
                            <p className={`${textMuted} text-sm`}>{item.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Produk Unggulan */}
            <section className={`px-6 py-16 ${bgSection}`}>
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">Produk Unggulan</h2>

                    {loadingProduk ? (
                        <div className="text-center py-10">
                            <p className="text-4xl animate-bounce mb-2">⏳</p>
                            <p className={textMuted}>Memuat produk...</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {produkUnggulan.map((produk) => {
                                const sudahAda = keranjang.find((p) => p.id === produk.id);
                                const stokHabis = produk.jumlah_stok <= 0;
                                return (
                                    <div key={produk.id}
                                        onClick={() => navigate(`/produk/${produk.id}`)}
                                        className={`product-card opacity-0 ${bgCard2} rounded-xl p-4 hover:shadow-lg transition cursor-pointer`}>
                                        <div className="text-4xl md:text-5xl text-center mb-3">{produk.icon}</div>
                                        <span className="text-xs bg-blue-900 text-blue-300 px-2 py-1 rounded-full">{produk.kategori}</span>
                                        <h3 className="text-sm md:text-base font-bold mt-2 mb-1">{produk.nama}</h3>
                                        <p className={`text-xs mb-2 ${stokHabis ? "text-red-400" : "text-green-500"}`}>
                                            {stokHabis ? "❌ Habis" : `✅ ${produk.jumlah_stok} unit`}
                                        </p>
                                        <div className="flex justify-between items-center">
                                            <span className="text-blue-500 font-bold text-xs md:text-sm">{formatRupiah(produk.harga)}</span>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    if (!stokHabis) tambahKeranjang(produk);
                                                }}
                                                disabled={stokHabis}
                                                className={`px-2 py-1 rounded-full text-xs font-semibold transition text-white ${stokHabis ? "bg-gray-500 cursor-not-allowed" : sudahAda ? "bg-green-600 hover:bg-green-700" : "bg-blue-500 hover:bg-blue-600"}`}
                                            >
                                                {stokHabis ? "Habis" : sudahAda ? `✓ ${sudahAda.qty}` : "+ Beli"}
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    <div className="text-center mt-8">
                        <button onClick={() => navigate("/produk")} className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-full font-semibold transition">
                            Lihat Semua Produk →
                        </button>
                    </div>
                </div>
            </section>

            {/* Paket Service */}
            <section className="px-6 py-16 max-w-6xl mx-auto">
                <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">Paket Service</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        { paket: "Service Ringan", harga: "Rp 50.000", list: ["Bersihkan debu", "Install ulang OS", "Optimasi sistem"] },
                        { paket: "Service Sedang", harga: "Rp 150.000", list: ["Ganti thermal paste", "Perbaikan software", "Upgrade RAM/SSD"] },
                        { paket: "Service Berat", harga: "Rp 300.000", list: ["Perbaikan motherboard", "Ganti LCD/layar", "Perbaikan charging port"] },
                    ].map((item, i) => (
                        <div key={i} className={`${bgCard} rounded-xl p-8 border ${isDark ? "border-gray-700 hover:border-blue-500" : "border-gray-200 hover:border-blue-400"} transition`}>
                            <h3 className="text-xl font-bold mb-2">{item.paket}</h3>
                            <p className="text-blue-500 text-2xl font-bold mb-6">{item.harga}</p>
                            <ul className={`${textMuted} text-sm space-y-2 mb-6`}>
                                {item.list.map((l, j) => <li key={j}>✔️ {l}</li>)}
                            </ul>
                            <button onClick={() => navigate("/service")} className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-full font-semibold transition">
                                Pesan Service
                            </button>
                        </div>
                    ))}
                </div>
            </section>

            <Footer />
        </div>
    );
}

export default Home;