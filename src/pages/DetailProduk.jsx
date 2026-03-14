import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { animate } from "animejs";
import { useKeranjang } from "../context/KeranjangContext";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import API_URL from "../config/api";

function DetailProduk() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { keranjang, tambahKeranjang } = useKeranjang();
    const { isDark } = useTheme();
    const { user, token } = useAuth();

    const [produk, setProduk] = useState(null);
    const [rekomendasi, setRekomendasi] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [wishlist, setWishlist] = useState(() => {
        const saved = localStorage.getItem("wishlist");
        return saved ? JSON.parse(saved) : [];
    });

    const [ulasan, setUlasan] = useState([]);
    const [formUlasan, setFormUlasan] = useState({ rating: 5, komentar: "" });
    const [notifUlasan, setNotifUlasan] = useState("");
    const [loadingUlasan, setLoadingUlasan] = useState(false);
    const [notif, setNotif] = useState("");

    const bg = isDark ? "bg-gray-950 text-white" : "bg-gray-50 text-gray-800";
    const bgCard = isDark ? "bg-gray-900" : "bg-white border border-gray-200";
    const bgSection = isDark ? "bg-gray-800" : "bg-gray-100";
    const bgInput = isDark ? "bg-gray-800 text-white placeholder-gray-500" : "bg-gray-100 text-gray-800 placeholder-gray-400";
    const textMuted = isDark ? "text-gray-400" : "text-gray-500";

    // Fetch ulasan dari API
    const fetchUlasan = async () => {
        try {
            const res = await fetch(`${API_URL}/ulasan/${id}`);
            const data = await res.json();
            setUlasan(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error(err);
        }
    };

    // Fetch produk dari API
    useEffect(() => {
        const fetchProduk = async () => {
            setLoading(true);
            setError("");
            try {
                const res = await fetch(`${API_URL}/produk/${id}`);
                const data = await res.json();
                if (!res.ok) throw new Error(data.message);
                setProduk(data);

                const resAll = await fetch(`${API_URL}/produk`);
                const allProduk = await resAll.json();
                const rek = allProduk
                    .filter((p) => p.kategori === data.kategori && p.id !== data.id)
                    .slice(0, 4);
                setRekomendasi(rek);
            } catch (err) {
                setError("Produk tidak ditemukan");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchProduk();
        fetchUlasan();
        window.scrollTo(0, 0);
    }, [id]);

    useEffect(() => {
        if (!loading && produk) {
            animate(".detail-content", {
                opacity: { from: 0, to: 1 },
                translateY: { from: 30, to: 0 },
                duration: 700,
                easing: "easeOutExpo",
            });
        }
    }, [loading, produk]);

    if (loading) {
        return (
            <div className={`min-h-screen ${bg} flex flex-col items-center justify-center gap-4`}>
                <p className="text-6xl animate-bounce">⏳</p>
                <p className={textMuted}>Memuat produk...</p>
            </div>
        );
    }

    if (error || !produk) {
        return (
            <div className={`min-h-screen ${bg} flex flex-col items-center justify-center gap-4`}>
                <Navbar />
                <p className="text-6xl">😕</p>
                <h2 className="text-2xl font-bold">Produk tidak ditemukan</h2>
                <button onClick={() => navigate("/produk")} className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-full font-semibold transition">
                    Kembali ke Produk
                </button>
            </div>
        );
    }

    const sudahAda = keranjang.find((p) => p.id === produk.id);
    const diWishlist = wishlist.includes(produk.id);
    const stokHabis = produk.jumlah_stok <= 0;
    const formatRupiah = (num) => "Rp " + Number(num).toLocaleString("id-ID");

    const rataRating = ulasan.length > 0
        ? (ulasan.reduce((acc, u) => acc + u.rating, 0) / ulasan.length).toFixed(1)
        : null;

    const handleWishlist = () => {
        const updated = diWishlist
            ? wishlist.filter((w) => w !== produk.id)
            : [...wishlist, produk.id];
        setWishlist(updated);
        localStorage.setItem("wishlist", JSON.stringify(updated));
    };

    const handleTambahKeranjang = () => {
        if (stokHabis) {
            setNotif("❌ Stok produk habis!");
            setTimeout(() => setNotif(""), 2500);
            return;
        }
        tambahKeranjang(produk);
        setNotif("✅ Ditambahkan ke keranjang!");
        setTimeout(() => setNotif(""), 2500);
    };

    const handleKirimUlasan = async () => {
        if (!user) {
            setNotifUlasan("⚠️ Kamu harus login untuk memberi ulasan!");
            setTimeout(() => setNotifUlasan(""), 3000);
            return;
        }
        if (!formUlasan.komentar.trim()) {
            setNotifUlasan("⚠️ Tulis komentar dulu!");
            setTimeout(() => setNotifUlasan(""), 3000);
            return;
        }
        setLoadingUlasan(true);
        try {
            const res = await fetch(`${API_URL}/ulasan/${id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(formUlasan),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);
            setFormUlasan({ rating: 5, komentar: "" });
            setNotifUlasan("✅ Ulasan berhasil dikirim!");
            setTimeout(() => setNotifUlasan(""), 3000);
            fetchUlasan();
        } catch (err) {
            setNotifUlasan("⚠️ " + err.message);
            setTimeout(() => setNotifUlasan(""), 3000);
        } finally {
            setLoadingUlasan(false);
        }
    };

    const handleHapusUlasan = async (ulasanId) => {
        if (!window.confirm("Hapus ulasan ini?")) return;
        try {
            await fetch(`${API_URL}/ulasan/${ulasanId}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchUlasan();
        } catch (err) {
            console.error(err);
        }
    };

    const renderBintang = (rating, size = "text-base") => {
        return Array.from({ length: 5 }, (_, i) => (
            <span key={i} className={`${size} ${i < rating ? "text-yellow-400" : "text-gray-600"}`}>★</span>
        ));
    };

    return (
        <div className={`min-h-screen ${bg}`}>

            {notif && (
                <div className={`fixed top-20 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-full shadow-lg text-sm font-semibold text-white ${notif.startsWith("❌") ? "bg-red-600" : "bg-green-600"}`}>
                    {notif}
                </div>
            )}

            <Navbar />

            <section className="px-6 py-10 max-w-5xl mx-auto">

                {/* Breadcrumb */}
                <div className={`flex items-center gap-2 text-sm ${textMuted} mb-6 flex-wrap`}>
                    <button onClick={() => navigate("/")} className="hover:text-blue-500 transition">Home</button>
                    <span>/</span>
                    <button onClick={() => navigate("/produk")} className="hover:text-blue-500 transition">Produk</button>
                    <span>/</span>
                    <span className="text-blue-400">{produk.kategori}</span>
                    <span>/</span>
                    <span className="text-blue-500 truncate max-w-32">{produk.nama}</span>
                </div>

                <div className="detail-content opacity-0 space-y-6">

                    {/* ── Info Utama ── */}
                    <div className={`${bgCard} rounded-2xl p-6 md:p-10 grid grid-cols-1 md:grid-cols-2 gap-10`}>

                        {/* Icon Produk */}
                        <div className="relative">
                            <div className={`${bgSection} rounded-2xl flex items-center justify-center p-10 text-9xl`}>
                                {produk.icon}
                            </div>
                            <button
                                onClick={handleWishlist}
                                className={`absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center text-xl transition shadow ${diWishlist ? "bg-red-500 text-white" : isDark ? "bg-gray-700 text-gray-400 hover:bg-red-500 hover:text-white" : "bg-white text-gray-400 hover:bg-red-500 hover:text-white"}`}
                                title={diWishlist ? "Hapus dari wishlist" : "Tambah ke wishlist"}
                            >
                                {diWishlist ? "❤️" : "🤍"}
                            </button>
                        </div>

                        {/* Info */}
                        <div className="flex flex-col justify-between">
                            <div>
                                <div className="flex items-center gap-2 mb-3 flex-wrap">
                                    <span className="text-xs bg-blue-900 text-blue-300 px-3 py-1 rounded-full">{produk.kategori}</span>
                                    {rataRating && (
                                        <span className="flex items-center gap-1 text-xs text-yellow-400 font-semibold">
                                            ★ {rataRating} <span className={textMuted}>({ulasan.length} ulasan)</span>
                                        </span>
                                    )}
                                </div>

                                <h1 className="text-2xl md:text-3xl font-bold mb-2">{produk.nama}</h1>
                                <p className={`text-sm ${textMuted} mb-4`}>{produk.deskripsi}</p>

                                {/* Spesifikasi */}
                                <div className={`${bgSection} rounded-xl p-4 space-y-2 mb-4`}>
                                    <p className="font-semibold text-sm mb-2">📋 Spesifikasi:</p>
                                    {[
                                        { label: "Spek", value: produk.spek },
                                        { label: "Garansi", value: produk.garansi },
                                        { label: "Berat", value: produk.berat },
                                        { label: "Stok", value: stokHabis ? "Habis" : `${produk.jumlah_stok} unit` },
                                    ].map((item, i) => (
                                        <div key={i} className="flex justify-between text-sm">
                                            <span className={textMuted}>{item.label}</span>
                                            <span className={`font-semibold ${item.label === "Stok" ? stokHabis ? "text-red-400" : "text-green-500" : ""}`}>
                                                {item.label === "Garansi" ? `🛡️ ${item.value}` : item.value}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Harga & Tombol */}
                            <div>
                                <p className="text-3xl font-bold text-blue-500 mb-4">{formatRupiah(produk.harga)}</p>
                                <div className="flex gap-3">
                                    <button
                                        onClick={handleTambahKeranjang}
                                        disabled={stokHabis}
                                        className={`flex-1 py-3 rounded-full font-semibold transition text-white ${stokHabis ? "bg-gray-500 cursor-not-allowed" : sudahAda ? "bg-green-600 hover:bg-green-700" : "bg-blue-500 hover:bg-blue-600"}`}
                                    >
                                        {stokHabis ? "Stok Habis" : sudahAda ? `✓ Di Keranjang (${sudahAda.qty})` : "+ Tambah ke Keranjang"}
                                    </button>
                                    <button
                                        onClick={() => { if (!stokHabis) { tambahKeranjang(produk); navigate("/keranjang"); } }}
                                        disabled={stokHabis}
                                        className={`flex-1 py-3 rounded-full font-semibold transition text-white ${stokHabis ? "bg-gray-500 cursor-not-allowed" : "bg-orange-500 hover:bg-orange-600"}`}
                                    >
                                        🛒 Beli Sekarang
                                    </button>
                                </div>
                                <button
                                    onClick={() => navigate("/keranjang")}
                                    className={`w-full mt-3 border ${isDark ? "border-gray-600 text-gray-400 hover:border-blue-500 hover:text-blue-400" : "border-gray-300 text-gray-500 hover:border-blue-400 hover:text-blue-500"} py-3 rounded-full font-semibold transition text-sm`}
                                >
                                    Lihat Keranjang 🧺
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* ── Garansi ── */}
                    <div className={`${bgCard} rounded-2xl p-6`}>
                        <h2 className="text-lg font-bold mb-4">🛡️ Informasi Garansi</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {[
                                { icon: "🛡️", judul: "Garansi Resmi", desc: produk.garansi || "Sesuai ketentuan" },
                                { icon: "🔄", judul: "Garansi Toko", desc: "7 hari pengembalian barang jika ada kerusakan pabrik" },
                                { icon: "📞", judul: "Klaim Garansi", desc: "Hubungi kami via WhatsApp atau datang langsung ke toko" },
                            ].map((item, i) => (
                                <div key={i} className={`${bgSection} rounded-xl p-4 flex gap-3`}>
                                    <span className="text-3xl">{item.icon}</span>
                                    <div>
                                        <p className="font-semibold text-sm">{item.judul}</p>
                                        <p className={`text-xs ${textMuted} mt-1`}>{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ── Rating & Ulasan ── */}
                    <div className={`${bgCard} rounded-2xl p-6`}>
                        <h2 className="text-lg font-bold mb-4">⭐ Rating & Ulasan</h2>

                        {notifUlasan && (
                            <div className={`px-4 py-3 rounded-lg text-sm mb-4 ${notifUlasan.startsWith("⚠️") ? "bg-red-900 border border-red-500 text-red-300" : "bg-green-900 border border-green-500 text-green-300"}`}>
                                {notifUlasan}
                            </div>
                        )}

                        {/* Ringkasan rating */}
                        {rataRating && (
                            <div className={`${bgSection} rounded-xl p-4 flex items-center gap-6 mb-6`}>
                                <div className="text-center">
                                    <p className="text-5xl font-bold text-yellow-400">{rataRating}</p>
                                    <div className="flex justify-center mt-1">{renderBintang(Math.round(rataRating))}</div>
                                    <p className={`text-xs ${textMuted} mt-1`}>{ulasan.length} ulasan</p>
                                </div>
                                <div className="flex-1 space-y-1">
                                    {[5, 4, 3, 2, 1].map((star) => {
                                        const count = ulasan.filter((u) => u.rating === star).length;
                                        const pct = ulasan.length > 0 ? (count / ulasan.length) * 100 : 0;
                                        return (
                                            <div key={star} className="flex items-center gap-2 text-xs">
                                                <span className={textMuted}>{star}★</span>
                                                <div className={`flex-1 rounded-full h-2 ${isDark ? "bg-gray-700" : "bg-gray-200"}`}>
                                                    <div className="bg-yellow-400 h-2 rounded-full transition-all" style={{ width: `${pct}%` }} />
                                                </div>
                                                <span className={textMuted}>{count}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Form tulis ulasan */}
                        <div className={`${bgSection} rounded-xl p-4 mb-6`}>
                            <p className="font-semibold text-sm mb-3">✍️ Tulis Ulasan</p>
                            <div className="flex gap-1 mb-3">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button key={star} onClick={() => setFormUlasan({ ...formUlasan, rating: star })}
                                        className={`text-2xl transition ${star <= formUlasan.rating ? "text-yellow-400" : "text-gray-600"}`}>
                                        ★
                                    </button>
                                ))}
                                <span className={`text-sm ml-2 ${textMuted} self-center`}>{formUlasan.rating}/5</span>
                            </div>
                            <textarea
                                placeholder={user ? "Tulis pengalaman kamu dengan produk ini..." : "Login dulu untuk menulis ulasan"}
                                value={formUlasan.komentar}
                                onChange={(e) => setFormUlasan({ ...formUlasan, komentar: e.target.value })}
                                rows={3}
                                disabled={!user}
                                className={`w-full px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 resize-none text-sm ${bgInput} disabled:opacity-50`}
                            />
                            <div className="flex justify-between items-center mt-3">
                                {!user && (
                                    <button onClick={() => navigate("/login")} className="text-blue-500 hover:underline text-sm">
                                        Login untuk ulasan
                                    </button>
                                )}
                                <button
                                    onClick={handleKirimUlasan}
                                    disabled={!user || loadingUlasan}
                                    className="ml-auto bg-blue-500 hover:bg-blue-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-6 py-2 rounded-full text-sm font-semibold transition"
                                >
                                    {loadingUlasan ? "Mengirim..." : "Kirim Ulasan"}
                                </button>
                            </div>
                        </div>

                        {/* Daftar ulasan */}
                        {ulasan.length === 0 ? (
                            <div className="text-center py-8">
                                <p className="text-4xl mb-2">💬</p>
                                <p className={textMuted}>Belum ada ulasan. Jadilah yang pertama!</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {ulasan.map((u) => (
                                    <div key={u.id} className={`${bgSection} rounded-xl p-4`}>
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <p className="font-semibold text-sm">👤 {u.nama}</p>
                                                <p className={`text-xs ${textMuted}`}>
                                                    {new Date(u.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="flex">{renderBintang(u.rating, "text-sm")}</div>
                                                {/* Tombol hapus hanya untuk pemilik ulasan */}
                                                {user && user.id === u.user_id && (
                                                    <button
                                                        onClick={() => handleHapusUlasan(u.id)}
                                                        className="text-red-400 hover:text-red-300 text-xs transition"
                                                        title="Hapus ulasan"
                                                    >
                                                        🗑️
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                        <p className={`text-sm ${textMuted}`}>{u.komentar}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* ── Rekomendasi ── */}
                    {rekomendasi.length > 0 && (
                        <div className={`${bgCard} rounded-2xl p-6`}>
                            <h2 className="text-xl font-bold mb-4">Produk Serupa</h2>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {rekomendasi.map((item) => {
                                    const adaRek = keranjang.find((p) => p.id === item.id);
                                    const rekHabis = item.jumlah_stok <= 0;
                                    return (
                                        <div key={item.id} className={`${bgSection} rounded-xl p-4 hover:shadow-lg transition cursor-pointer`}
                                            onClick={() => navigate(`/produk/${item.id}`)}>
                                            <div className="text-4xl text-center mb-2">{item.icon}</div>
                                            <h3 className="text-sm font-bold mb-1 line-clamp-2">{item.nama}</h3>
                                            <p className={`text-xs ${textMuted} mb-1`}>{item.spek}</p>
                                            <p className={`text-xs ${textMuted} mb-2`}>🛡️ {item.garansi}</p>
                                            <p className={`text-xs mb-2 ${rekHabis ? "text-red-400" : "text-green-500"}`}>
                                                {rekHabis ? "❌ Habis" : `✅ ${item.jumlah_stok} unit`}
                                            </p>
                                            <p className="text-blue-500 font-bold text-sm mb-2">{formatRupiah(item.harga)}</p>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); if (!rekHabis) tambahKeranjang(item); }}
                                                disabled={rekHabis}
                                                className={`w-full text-xs py-1.5 rounded-full font-semibold transition text-white ${rekHabis ? "bg-gray-500 cursor-not-allowed" : adaRek ? "bg-green-600 hover:bg-green-700" : "bg-blue-500 hover:bg-blue-600"}`}
                                            >
                                                {rekHabis ? "Habis" : adaRek ? `✓ ${adaRek.qty}` : "+ Beli"}
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                </div>
            </section>

            <Footer />
        </div>
    );
}

export default DetailProduk;