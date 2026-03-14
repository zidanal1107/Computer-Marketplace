import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useKeranjang } from "../context/KeranjangContext";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import API_URL from "../config/api";

function Wishlist() {
    const navigate = useNavigate();
    const { keranjang, tambahKeranjang } = useKeranjang();
    const { isDark } = useTheme();
    const { user } = useAuth();

    const [wishlist, setWishlist] = useState(() => {
        const saved = localStorage.getItem("wishlist");
        return saved ? JSON.parse(saved) : [];
    });
    const [produkWishlist, setProdukWishlist] = useState([]);
    const [loading, setLoading] = useState(true);
    const [notif, setNotif] = useState("");

    const bg = isDark ? "bg-gray-950 text-white" : "bg-gray-50 text-gray-800";
    const bgCard = isDark ? "bg-gray-900" : "bg-white border border-gray-200";
    const textMuted = isDark ? "text-gray-400" : "text-gray-500";

    const formatRupiah = (num) => "Rp " + Number(num).toLocaleString("id-ID");

    // Fetch produk wishlist dari API
    useEffect(() => {
        const fetchProdukWishlist = async () => {
            if (wishlist.length === 0) {
                setProdukWishlist([]);
                setLoading(false);
                return;
            }
            setLoading(true);
            try {
                const res = await fetch(`${API_URL}/produk`);
                const data = await res.json();
                const filtered = Array.isArray(data)
                    ? data.filter((p) => wishlist.includes(p.id))
                    : [];
                setProdukWishlist(filtered);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchProdukWishlist();
    }, [wishlist]);

    const hapusDariWishlist = (id) => {
        const updated = wishlist.filter((w) => w !== id);
        setWishlist(updated);
        localStorage.setItem("wishlist", JSON.stringify(updated));
    };

    const kosongkanWishlist = () => {
        setWishlist([]);
        localStorage.removeItem("wishlist");
        setProdukWishlist([]);
    };

    const handleTambahKeranjang = (produk) => {
        if (produk.jumlah_stok <= 0) {
            setNotif(`❌ Stok ${produk.nama} habis!`);
            setTimeout(() => setNotif(""), 2500);
            return;
        }
        tambahKeranjang(produk);
        setNotif(`✅ ${produk.nama} ditambahkan ke keranjang!`);
        setTimeout(() => setNotif(""), 2500);
    };

    const handleTambahSemuaKeranjang = () => {
        const tersedia = produkWishlist.filter((p) => p.jumlah_stok > 0);
        tersedia.forEach((p) => tambahKeranjang(p));
        if (tersedia.length === 0) {
            setNotif("❌ Semua produk wishlist sedang habis stok!");
        } else {
            setNotif(`✅ ${tersedia.length} produk ditambahkan ke keranjang!`);
        }
        setTimeout(() => setNotif(""), 2500);
    };

    if (!user) {
        return (
            <div className={`min-h-screen ${bg} flex flex-col items-center justify-center gap-4`}>
                <p className="text-5xl">🔒</p>
                <h2 className="text-2xl font-bold">Kamu belum login</h2>
                <p className={textMuted}>Silakan masuk untuk melihat wishlist kamu</p>
                <button onClick={() => navigate("/login")} className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-full font-semibold transition">
                    Masuk Sekarang
                </button>
            </div>
        );
    }

    return (
        <div className={`min-h-screen ${bg}`}>

            {notif && (
                <div className={`fixed top-20 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-full shadow-lg text-sm font-semibold text-white ${notif.startsWith("❌") ? "bg-red-600" : "bg-green-600"}`}>
                    {notif}
                </div>
            )}

            <Navbar />

            <section className={`px-6 py-12 text-center ${isDark ? "bg-gradient-to-b from-blue-950 to-gray-950" : "bg-gradient-to-b from-blue-100 to-gray-50"}`}>
                <h1 className="text-3xl md:text-4xl font-bold mb-2">❤️ Wishlist <span className="text-blue-500">Saya</span></h1>
                <p className={textMuted}>Produk yang kamu simpan untuk dibeli nanti</p>
            </section>

            <section className="px-6 py-10 max-w-5xl mx-auto">

                {/* Loading */}
                {loading ? (
                    <div className="text-center py-20">
                        <p className="text-4xl animate-bounce mb-2">⏳</p>
                        <p className={textMuted}>Memuat wishlist...</p>
                    </div>

                ) : produkWishlist.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-6xl mb-4">🤍</p>
                        <h3 className="text-xl font-bold mb-2">Wishlist Kosong</h3>
                        <p className={`${textMuted} mb-6`}>Kamu belum menyimpan produk apapun</p>
                        <button onClick={() => navigate("/produk")} className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-full font-semibold transition">
                            Jelajahi Produk
                        </button>
                    </div>

                ) : (
                    <>
                        {/* Toolbar */}
                        <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
                            <p className={textMuted}>{produkWishlist.length} produk tersimpan</p>
                            <div className="flex gap-3">
                                <button
                                    onClick={handleTambahSemuaKeranjang}
                                    className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-full text-sm font-semibold transition"
                                >
                                    🛒 Tambah Semua ke Keranjang
                                </button>
                                <button
                                    onClick={kosongkanWishlist}
                                    className={`px-5 py-2 rounded-full text-sm font-semibold transition border ${isDark ? "border-red-700 text-red-400 hover:bg-red-900" : "border-red-300 text-red-500 hover:bg-red-50"}`}
                                >
                                    🗑️ Kosongkan
                                </button>
                            </div>
                        </div>

                        {/* Grid Produk */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {produkWishlist.map((produk) => {
                                const sudahAda = keranjang.find((p) => p.id === produk.id);
                                const stokHabis = produk.jumlah_stok <= 0;
                                return (
                                    <div key={produk.id} className={`${bgCard} rounded-xl p-4 flex flex-col hover:shadow-lg transition relative`}>

                                        {/* Tombol hapus wishlist */}
                                        <button
                                            onClick={() => hapusDariWishlist(produk.id)}
                                            className="absolute top-3 right-3 w-7 h-7 rounded-full bg-red-500 hover:bg-red-600 text-white text-xs flex items-center justify-center transition"
                                            title="Hapus dari wishlist"
                                        >
                                            ✕
                                        </button>

                                        {/* Icon */}
                                        <div onClick={() => navigate(`/produk/${produk.id}`)}
                                            className="text-4xl md:text-5xl text-center mb-3 cursor-pointer">
                                            {produk.icon}
                                        </div>

                                        {/* Badge kategori */}
                                        <span className="text-xs bg-blue-900 text-blue-300 px-2 py-1 rounded-full w-fit mb-2">{produk.kategori}</span>

                                        {/* Nama */}
                                        <h3 onClick={() => navigate(`/produk/${produk.id}`)}
                                            className="text-sm md:text-base font-bold mb-1 cursor-pointer hover:text-blue-500 transition line-clamp-2">
                                            {produk.nama}
                                        </h3>

                                        <p className={`text-xs ${textMuted} mb-1`}>{produk.spek}</p>
                                        <p className={`text-xs ${textMuted} mb-2`}>🛡️ {produk.garansi}</p>

                                        {/* Stok */}
                                        <p className={`text-xs mb-3 ${stokHabis ? "text-red-400" : "text-green-500"}`}>
                                            {stokHabis ? "❌ Stok Habis" : `✅ ${produk.jumlah_stok} unit`}
                                        </p>

                                        {/* Harga + tombol */}
                                        <div className="mt-auto space-y-2">
                                            <p className="text-blue-500 font-bold text-sm">{formatRupiah(produk.harga)}</p>
                                            <button
                                                onClick={() => handleTambahKeranjang(produk)}
                                                disabled={stokHabis}
                                                className={`w-full py-2 rounded-full text-xs font-semibold transition text-white ${stokHabis ? "bg-gray-500 cursor-not-allowed" : sudahAda ? "bg-green-600 hover:bg-green-700" : "bg-blue-500 hover:bg-blue-600"}`}
                                            >
                                                {stokHabis ? "Habis" : sudahAda ? `✓ Di Keranjang (${sudahAda.qty})` : "+ Tambah ke Keranjang"}
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </>
                )}
            </section>

            <Footer />
        </div>
    );
}

export default Wishlist;