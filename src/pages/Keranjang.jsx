import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useKeranjang } from "../context/KeranjangContext";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext"; // ← tambah import useAuth
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Keranjang() {
    const [checkout, setCheckout] = useState(false);
    const navigate = useNavigate();
    const { keranjang, kurangQty, tambahKeranjang, hapusProduk, kosongkanKeranjang, totalHarga, simpanPesanan } = useKeranjang();
    const { isDark } = useTheme();
    const { user } = useAuth(); // ← ambil data user

    const alamatTersimpan = JSON.parse(localStorage.getItem("alamat_pengiriman") || "null");

    const bg = isDark ? "bg-gray-950 text-white" : "bg-gray-50 text-gray-800";
    const bgCard = isDark ? "bg-gray-900" : "bg-white border border-gray-200";
    const bgBtn = isDark ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-200 hover:bg-gray-300";
    const bgInfo = isDark ? "bg-gray-800" : "bg-gray-100";
    const textMuted = isDark ? "text-gray-400" : "text-gray-500";

    const formatRupiah = (num) => "Rp " + num.toLocaleString("id-ID");

    // Cek kondisi sebelum checkout
    const belumLogin = !user;
    const belumAlamat = !alamatTersimpan?.namaPenerima;
    const bisaCheckout = !belumLogin && !belumAlamat;

    const handleCheckout = () => {
        // Blokir kalau belum login
        if (belumLogin) {
            navigate("/login");
            return;
        }
        // Blokir kalau belum isi alamat
        if (belumAlamat) {
            navigate("/profil");
            return;
        }
        simpanPesanan(keranjang, totalHarga, alamatTersimpan);
        kosongkanKeranjang();
        setCheckout(true);
    };

    return (
        <div className={`min-h-screen ${bg}`}>
            <Navbar />

            {/* Header */}
            <section className={`px-6 py-10 text-center ${isDark ? "bg-gradient-to-b from-blue-950 to-gray-950" : "bg-gradient-to-b from-blue-100 to-gray-50"}`}>
                <h1 className="text-3xl md:text-4xl font-bold mb-2">🛒 Keranjang <span className="text-blue-500">Belanja</span></h1>
                <p className={textMuted}>Periksa pesanan kamu sebelum checkout</p>
            </section>

            <section className="px-6 py-10 max-w-5xl mx-auto">

                {/* State: Checkout Sukses */}
                {checkout ? (
                    <div className={`${bgCard} rounded-xl p-10 text-center`}>
                        <p className="text-6xl mb-4">✅</p>
                        <h3 className="text-2xl font-bold mb-2">Pesanan Berhasil!</h3>
                        <p className={`${textMuted} mb-4`}>Terima kasih telah berbelanja di TechStore. Kami akan segera memproses pesanan kamu.</p>

                        {/* Alamat tujuan pengiriman */}
                        {alamatTersimpan?.namaPenerima && (
                            <div className={`text-left rounded-xl p-4 mb-6 text-sm ${bgInfo}`}>
                                <p className="font-bold mb-2">📍 Dikirim ke:</p>
                                <p className="font-semibold">{alamatTersimpan.namaPenerima} | {alamatTersimpan.noHp}</p>
                                <p className={textMuted}>{alamatTersimpan.jalan}</p>
                                <p className={textMuted}>{alamatTersimpan.kelurahan}, {alamatTersimpan.kecamatan}, {alamatTersimpan.kota}</p>
                                <p className={textMuted}>{alamatTersimpan.provinsi} {alamatTersimpan.kodePos}</p>
                                {alamatTersimpan.pesanKurir && <p className={`mt-1 ${textMuted}`}>📝 {alamatTersimpan.pesanKurir}</p>}
                            </div>
                        )}

                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <button onClick={() => { setCheckout(false); navigate("/"); }}
                                className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-full font-semibold transition">
                                Kembali ke Home
                            </button>
                            <button onClick={() => { setCheckout(false); navigate("/profil"); }}
                                className={`px-8 py-3 rounded-full font-semibold transition border ${isDark ? "border-gray-600 text-gray-300 hover:border-blue-500 hover:text-blue-400" : "border-gray-300 text-gray-600 hover:border-blue-400 hover:text-blue-500"}`}>
                                Lihat Riwayat Pesanan
                            </button>
                        </div>
                    </div>

                ) : keranjang.length === 0 ? (

                    /* State: Keranjang Kosong */
                    <div className="text-center py-20">
                        <p className="text-6xl mb-4">🛒</p>
                        <h3 className="text-xl font-bold mb-2">Keranjang Kosong</h3>
                        <p className={`${textMuted} mb-6`}>Belum ada produk di keranjang kamu</p>
                        <button onClick={() => navigate("/produk")} className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-full font-semibold transition">
                            Mulai Belanja
                        </button>
                    </div>

                ) : (

                    /* State: Ada Produk */
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                        {/* Daftar Produk */}
                        <div className="md:col-span-2 space-y-4">
                            {keranjang.map((produk) => (
                                <div key={produk.id} className={`${bgCard} rounded-xl p-5 flex items-center gap-4`}>
                                    <div className="text-5xl">{produk.icon}</div>
                                    <div className="flex-1">
                                        <span className="text-xs bg-blue-900 text-blue-300 px-2 py-1 rounded-full">{produk.kategori}</span>
                                        <h3 className="font-bold mt-1">{produk.nama}</h3>
                                        <p className="text-blue-500 font-semibold">{formatRupiah(produk.harga)}</p>
                                    </div>
                                    {/* Tombol kurang/tambah qty */}
                                    <div className="flex items-center gap-2">
                                        <button onClick={() => kurangQty(produk.id)} className={`${bgBtn} text-current w-8 h-8 rounded-full font-bold transition`}>-</button>
                                        <span className="w-6 text-center font-bold">{produk.qty}</span>
                                        <button onClick={() => tambahKeranjang(produk)} className={`${bgBtn} text-current w-8 h-8 rounded-full font-bold transition`}>+</button>
                                    </div>
                                    {/* Tombol hapus produk */}
                                    <button onClick={() => hapusProduk(produk.id)} className="text-red-400 hover:text-red-300 text-xl transition ml-2">🗑️</button>
                                </div>
                            ))}
                        </div>

                        {/* Ringkasan Pesanan */}
                        <div className={`${bgCard} rounded-xl p-6 h-fit sticky top-24`}>
                            <h3 className="text-xl font-bold mb-4">Ringkasan Pesanan</h3>

                            {/* Detail item */}
                            <div className="space-y-2 mb-4">
                                {keranjang.map((p) => (
                                    <div key={p.id} className={`flex justify-between text-sm ${textMuted}`}>
                                        <span>{p.nama} x{p.qty}</span>
                                        <span>{formatRupiah(p.harga * p.qty)}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Total harga */}
                            <div className={`border-t ${isDark ? "border-gray-700" : "border-gray-200"} pt-4 mb-4`}>
                                <div className="flex justify-between font-bold text-lg">
                                    <span>Total</span>
                                    <span className="text-blue-500">{formatRupiah(totalHarga)}</span>
                                </div>
                            </div>

                            {/* Peringatan belum login */}
                            {belumLogin && (
                                <div className="bg-yellow-900 border border-yellow-600 text-yellow-300 text-xs px-3 py-2 rounded-lg mb-3">
                                    ⚠️ Kamu belum login.{" "}
                                    <button onClick={() => navigate("/login")} className="underline font-semibold hover:text-yellow-200">
                                        Masuk sekarang
                                    </button>
                                </div>
                            )}

                            {/* Peringatan belum isi alamat */}
                            {!belumLogin && belumAlamat && (
                                <div className="bg-yellow-900 border border-yellow-600 text-yellow-300 text-xs px-3 py-2 rounded-lg mb-3">
                                    ⚠️ Belum ada alamat pengiriman.{" "}
                                    <button onClick={() => navigate("/profil")} className="underline font-semibold hover:text-yellow-200">
                                        Isi alamat di profil
                                    </button>
                                </div>
                            )}

                            {/* Info alamat kalau sudah diisi */}
                            {alamatTersimpan?.namaPenerima && (
                                <div className={`text-xs rounded-lg p-3 mb-4 ${bgInfo}`}>
                                    <p className="font-bold mb-1">📍 Kirim ke:</p>
                                    <p className={textMuted}>{alamatTersimpan.namaPenerima}</p>
                                    <p className={textMuted}>{alamatTersimpan.jalan}, {alamatTersimpan.kota}</p>
                                    <button onClick={() => navigate("/profil")} className="text-blue-500 hover:underline mt-1 block">
                                        ✏️ Ubah alamat
                                    </button>
                                </div>
                            )}

                            {/* Tombol checkout — disabled kalau belum login atau belum isi alamat */}
                            <button
                                onClick={handleCheckout}
                                disabled={!bisaCheckout}
                                className={`w-full py-3 rounded-full font-semibold transition text-white ${bisaCheckout ? "bg-blue-500 hover:bg-blue-600" : "bg-gray-600 cursor-not-allowed opacity-60"}`}
                            >
                                {belumLogin ? "🔒 Login untuk Checkout" : belumAlamat ? "📍 Isi Alamat untuk Checkout" : "Checkout Sekarang 🚀"}
                            </button>

                            {/* Tombol tambah produk lagi */}
                            <button onClick={() => navigate("/produk")}
                                className={`w-full mt-3 border ${isDark ? "border-gray-600 text-gray-400 hover:border-blue-500 hover:text-blue-400" : "border-gray-300 text-gray-500 hover:border-blue-400 hover:text-blue-500"} py-3 rounded-full font-semibold transition`}>
                                + Tambah Produk
                            </button>
                        </div>
                    </div>
                )}
            </section>

            <Footer />
        </div>
    );
}

export default Keranjang;