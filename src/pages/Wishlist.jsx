import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useKeranjang } from "../context/KeranjangContext";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import dataProduk from "../data/produk";

function Wishlist() {
    const navigate = useNavigate();
    const { keranjang, tambahKeranjang } = useKeranjang();
    const { isDark } = useTheme();
    const { user } = useAuth();

    const [wishlist, setWishlist] = useState(() => {
        const saved = localStorage.getItem("wishlist");
        return saved ? JSON.parse(saved) : [];
    });
    const [notif, setNotif] = useState("");

    const bg = isDark ? "bg-gray-950 text-white" : "bg-gray-50 text-gray-800";
    const bgCard = isDark ? "bg-gray-900" : "bg-white border border-gray-200";
    const bgSection = isDark ? "bg-gray-800" : "bg-gray-100";
    const textMuted = isDark ? "text-gray-400" : "text-gray-500";

    const formatRupiah = (num) => "Rp " + num.toLocaleString("id-ID");

    // Ambil data produk yang ada di wishlist
    const produkWishlist = dataProduk.filter((p) => wishlist.includes(p.id));

    const hapusDariWishlist = (id) => {
        const updated = wishlist.filter((w) => w !== id);
        setWishlist(updated);
        localStorage.setItem("wishlist", JSON.stringify(updated));
    };

    const kosongkanWishlist = () => {
        setWishlist([]);
        localStorage.removeItem("wishlist");
    };

    const handleTambahKeranjang = (produk) => {
        tambahKeranjang(produk);
        setNotif(`✅ ${produk.nama} ditambahkan ke keranjang!`);
        setTimeout(() => setNotif(""), 2500);
    };

    const handleTambahSemuaKeranjang = () => {
        produkWishlist.forEach((p) => tambahKeranjang(p));
        setNotif("✅ Semua produk wishlist ditambahkan ke keranjang!");
        setTimeout(() => setNotif(""), 2500);
    };

    // Redirect kalau belum login
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

            {/* Notif toast */}
            {notif && (
                <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-green-600 text-white px-6 py-3 rounded-full shadow-lg text-sm font-semibold">
                    {notif}
                </div>
            )}

            <Navbar />

            {/* Header */}
            <section className={`px-6 py-12 text-center ${isDark ? "bg-gradient-to-b from-blue-950 to-gray-950" : "bg-gradient-to-b from-blue-100 to-gray-50"}`}>
                <h1 className="text-3xl md:text-4xl font-bold mb-2">❤️ Wishlist <span className="text-blue-500">Saya</span></h1>
                <p className={textMuted}>Produk yang kamu simpan untuk dibeli nanti</p>
            </section>

            <section className="px-6 py-10 max-w-5xl mx-auto">

                {/* Kosong */}
                {produkWishlist.length === 0 ? (
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

                                        {/* Icon klik ke detail */}
                                        <div
                                            onClick={() => navigate(`/produk/${produk.id}`)}
                                            className="text-4xl md:text-5xl text-center mb-3 cursor-pointer"
                                        >
                                            {produk.icon}
                                        </div>

                                        {/* Badge kategori */}
                                        <span className="text-xs bg-blue-900 text-blue-300 px-2 py-1 rounded-full w-fit mb-2">{produk.kategori}</span>

                                        {/* Nama produk */}
                                        <h3
                                            onClick={() => navigate(`/produk/${produk.id}`)}
                                            className="text-sm md:text-base font-bold mb-1 cursor-pointer hover:text-blue-500 transition line-clamp-2"
                                        >
                                            {produk.nama}
                                        </h3>

                                        {/* Spek */}
                                        <p className={`text-xs ${textMuted} mb-1`}>{produk.spek}</p>

                                        {/* Garansi */}
                                        <p className={`text-xs ${textMuted} mb-2`}>🛡️ {produk.garansi}</p>

                                        {/* Stok */}
                                        <p className="text-green-500 text-xs mb-3">✅ {produk.stok}</p>

                                        {/* Harga + tombol */}
                                        <div className="mt-auto space-y-2">
                                            <p className="text-blue-500 font-bold text-sm">{formatRupiah(produk.harga)}</p>
                                            <button
                                                onClick={() => handleTambahKeranjang(produk)}
                                                className={`w-full py-2 rounded-full text-xs font-semibold transition text-white ${sudahAda ? "bg-green-600 hover:bg-green-700" : "bg-blue-500 hover:bg-blue-600"}`}
                                            >
                                                {sudahAda ? `✓ Di Keranjang (${sudahAda.qty})` : "+ Tambah ke Keranjang"}
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