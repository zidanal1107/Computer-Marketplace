import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { useKeranjang } from "../context/KeranjangContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import API_URL from "../config/api";

// ═══════════════ KOMPONEN RIWAYAT BOOKING ═══════════════
function RiwayatBooking({ token, isDark, bgCard, bgSection, textMuted }) {
    const [booking, setBooking] = useState([]);
    const [loading, setLoading] = useState(true);
    const [buka, setBuka] = useState(null);

    useEffect(() => {
        const fetchBooking = async () => {
            if (!token) { setLoading(false); return; }
            try {
                const res = await fetch(`${API_URL}/booking/saya`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const data = await res.json();
                setBooking(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchBooking();
    }, [token]);

    const warnaBadge = (status) => {
        if (status === "Menunggu") return "bg-yellow-500 text-white";
        if (status === "Diproses") return "bg-blue-500 text-white";
        if (status === "Selesai") return "bg-green-600 text-white";
        if (status === "Dibatalkan") return "bg-red-600 text-white";
        return "bg-gray-500 text-white";
    };

    return (
        <div className={`${bgCard} rounded-xl p-6`}>
            <h2 className="text-xl font-bold mb-2">🔧 Riwayat Booking Service</h2>
            <p className={`text-sm ${textMuted} mb-6`}>Daftar booking service yang pernah kamu buat</p>

            {loading ? (
                <div className="text-center py-8">
                    <p className="text-4xl animate-bounce mb-2">⏳</p>
                    <p className={textMuted}>Memuat riwayat booking...</p>
                </div>
            ) : booking.length === 0 ? (
                <div className="text-center py-8">
                    <p className="text-4xl mb-2">🔧</p>
                    <p className={textMuted}>Belum ada booking service</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {booking.map((b) => (
                        <div key={b.id} className={`rounded-xl border ${isDark ? "border-gray-700" : "border-gray-200"} overflow-hidden`}>
                            <div className={`flex items-center justify-between px-4 py-3 ${bgSection}`}>
                                <div>
                                    <p className="font-bold text-sm">#{String(b.id).padStart(4, "0")} · {b.paket}</p>
                                    <p className={`text-xs ${textMuted}`}>{b.created_at?.slice(0, 10)}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className={`text-xs px-3 py-1 rounded-full font-semibold ${warnaBadge(b.status)}`}>
                                        {b.status}
                                    </span>
                                    <button onClick={() => setBuka(buka === b.id ? null : b.id)}
                                        className={`text-xs px-3 py-1 rounded-full transition ${isDark ? "bg-gray-700 hover:bg-gray-600 text-gray-300" : "bg-gray-200 hover:bg-gray-300 text-gray-600"}`}>
                                        {buka === b.id ? "Tutup" : "Detail"}
                                    </button>
                                </div>
                            </div>

                            {buka === b.id && (
                                <div className={`px-4 py-4 space-y-2 border-t ${isDark ? "border-gray-700" : "border-gray-200"}`}>
                                    {[
                                        { label: "Nama", value: b.nama },
                                        { label: "HP", value: b.hp },
                                        { label: "Perangkat", value: b.perangkat },
                                        { label: "Keluhan", value: b.keluhan },
                                        { label: "Paket", value: b.paket },
                                        { label: "Tgl Kerjakan", value: b.tanggal_pengerjaan?.slice(0, 10) || "-" },
                                    ].map((item, i) => (
                                        <div key={i} className={`flex gap-3 p-2 rounded-lg ${bgSection}`}>
                                            <p className={`text-xs ${textMuted} w-20 shrink-0`}>{item.label}</p>
                                            <p className="text-sm font-semibold">{item.value}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

// ═══════════════ HALAMAN PROFIL ═══════════════
function Profil() {
    const { user, token, updateProfil, logout } = useAuth();
    const { isDark } = useTheme();
    const { keranjang, konfirmasiTerima } = useKeranjang();
    const navigate = useNavigate();

    const [editMode, setEditMode] = useState(false);
    const [form, setForm] = useState({ nama: user?.nama || "", email: user?.email || "" });
    const [sukses, setSukses] = useState("");
    const [alamatSukses, setAlamatSukses] = useState("");
    const [bukaRiwayat, setBukaRiwayat] = useState(null);
    const [riwayat, setRiwayat] = useState([]);
    const [loadingRiwayat, setLoadingRiwayat] = useState(false);

    const [alamat, setAlamat] = useState(() => {
        const saved = localStorage.getItem("alamat_pengiriman");
        return saved ? JSON.parse(saved) : {
            namaPenerima: "", noHp: "", jalan: "", kelurahan: "",
            kecamatan: "", kota: "", provinsi: "", kodePos: "", pesanKurir: ""
        };
    });

    const bg = isDark ? "bg-gray-950 text-white" : "bg-gray-50 text-gray-800";
    const bgCard = isDark ? "bg-gray-900" : "bg-white border border-gray-200";
    const bgInput = isDark ? "bg-gray-800 text-white placeholder-gray-500" : "bg-gray-100 text-gray-800 placeholder-gray-400";
    const textMuted = isDark ? "text-gray-400" : "text-gray-500";
    const bgSection = isDark ? "bg-gray-800" : "bg-gray-100";

    const fetchRiwayat = async () => {
        if (!token) return;
        setLoadingRiwayat(true);
        try {
            const res = await fetch(`${API_URL}/pesanan/saya`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            setRiwayat(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoadingRiwayat(false);
        }
    };

    useEffect(() => { fetchRiwayat(); }, [token]);

    if (!user) {
        return (
            <div className={`min-h-screen ${bg} flex flex-col items-center justify-center gap-4`}>
                <p className="text-5xl">🔒</p>
                <h2 className="text-2xl font-bold">Kamu belum login</h2>
                <p className={textMuted}>Silakan masuk untuk melihat profil kamu</p>
                <button onClick={() => navigate("/login")} className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-full font-semibold transition">
                    Masuk Sekarang
                </button>
            </div>
        );
    }

    const handleSimpan = async () => {
        if (!form.nama || !form.email) return;
        try {
            await updateProfil(form.nama, form.email);
            setSukses("✅ Profil berhasil diperbarui!");
            setEditMode(false);
            setTimeout(() => setSukses(""), 3000);
        } catch (err) {
            setSukses("⚠️ " + err.message);
            setTimeout(() => setSukses(""), 3000);
        }
    };

    const handleSimpanAlamat = () => {
        const wajib = ["namaPenerima", "noHp", "jalan", "kelurahan", "kecamatan", "kota", "provinsi", "kodePos"];
        if (wajib.some((k) => !alamat[k])) {
            setAlamatSukses("⚠️ Harap isi semua field wajib!");
            setTimeout(() => setAlamatSukses(""), 3000);
            return;
        }
        localStorage.setItem("alamat_pengiriman", JSON.stringify(alamat));
        setAlamatSukses("✅ Alamat berhasil disimpan!");
        setTimeout(() => setAlamatSukses(""), 3000);
    };

    const handleLogout = () => { logout(); navigate("/"); };

    const handleKonfirmasi = async (id) => {
        await konfirmasiTerima(id, token);
        fetchRiwayat();
    };

    const formatRupiah = (num) => "Rp " + Number(num).toLocaleString("id-ID");

    const warnaBadge = (status) => {
        if (status === "Diproses") return "bg-yellow-500 text-white";
        if (status === "Dikirim") return "bg-blue-500 text-white";
        if (status === "Selesai") return "bg-green-600 text-white";
        if (status === "Dibatalkan") return "bg-red-600 text-white";
        return "bg-gray-500 text-white";
    };

    return (
        <div className={`min-h-screen ${bg}`}>
            <Navbar />

            {sukses && (
                <div className={`fixed top-20 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-full shadow-lg text-sm font-semibold text-white ${sukses.startsWith("⚠️") ? "bg-red-600" : "bg-green-600"}`}>
                    {sukses}
                </div>
            )}
            {alamatSukses && (
                <div className={`fixed top-20 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-full shadow-lg text-sm font-semibold text-white ${alamatSukses.startsWith("⚠️") ? "bg-red-600" : "bg-green-600"}`}>
                    {alamatSukses}
                </div>
            )}

            <section className={`px-6 py-12 text-center ${isDark ? "bg-gradient-to-b from-blue-950 to-gray-950" : "bg-gradient-to-b from-blue-100 to-gray-50"}`}>
                <div className="w-24 h-24 rounded-full bg-blue-500 flex items-center justify-center text-4xl mx-auto mb-4">👤</div>
                <h1 className="text-2xl font-bold">{user.nama}</h1>
                <p className={textMuted}>{user.email}</p>
            </section>

            <section className="px-6 py-10 max-w-3xl mx-auto space-y-6">

                {/* Statistik */}
                <div className="grid grid-cols-3 gap-4">
                    {[
                        { label: "Item di Keranjang", value: keranjang.length, icon: "🛒" },
                        { label: "Total Qty", value: keranjang.reduce((acc, p) => acc + p.qty, 0), icon: "📦" },
                        { label: "Total Pesanan", value: riwayat.length, icon: "📋" },
                    ].map((stat, i) => (
                        <div key={i} className={`${bgCard} rounded-xl p-4 text-center`}>
                            <p className="text-3xl mb-1">{stat.icon}</p>
                            <p className="font-bold text-blue-500 text-lg">{stat.value}</p>
                            <p className={`text-xs ${textMuted}`}>{stat.label}</p>
                        </div>
                    ))}
                </div>

                {/* Info Profil */}
                <div className={`${bgCard} rounded-xl p-6`}>
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold">Informasi Akun</h2>
                        <button onClick={() => setEditMode(!editMode)}
                            className={`text-sm px-4 py-2 rounded-full font-semibold transition ${isDark ? "bg-gray-800 hover:bg-gray-700 text-gray-300" : "bg-gray-200 hover:bg-gray-300 text-gray-600"}`}>
                            {editMode ? "Batal" : "✏️ Edit"}
                        </button>
                    </div>
                    {editMode ? (
                        <div className="space-y-4">
                            <div>
                                <label className={`text-sm ${textMuted} mb-1 block`}>Nama Lengkap</label>
                                <input type="text" value={form.nama}
                                    onChange={(e) => setForm({ ...form, nama: e.target.value })}
                                    className={`w-full px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 ${bgInput}`} />
                            </div>
                            <div>
                                <label className={`text-sm ${textMuted} mb-1 block`}>Email</label>
                                <input type="email" value={form.email}
                                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                                    className={`w-full px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 ${bgInput}`} />
                            </div>
                            <button onClick={handleSimpan} className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-full font-semibold transition">
                                Simpan Perubahan
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {[
                                { label: "Nama Lengkap", value: user.nama, icon: "👤" },
                                { label: "Email", value: user.email, icon: "📧" },
                                { label: "Status Akun", value: "Aktif", icon: "✅" },
                            ].map((item, i) => (
                                <div key={i} className={`flex items-center gap-4 p-4 rounded-lg ${bgSection}`}>
                                    <span className="text-2xl">{item.icon}</span>
                                    <div>
                                        <p className={`text-xs ${textMuted}`}>{item.label}</p>
                                        <p className="font-semibold">{item.value}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Riwayat Pesanan */}
                <div className={`${bgCard} rounded-xl p-6`}>
                    <h2 className="text-xl font-bold mb-2">📦 Riwayat Pesanan</h2>
                    <p className={`text-sm ${textMuted} mb-6`}>Daftar pesanan yang sudah kamu checkout</p>
                    {loadingRiwayat ? (
                        <div className="text-center py-8">
                            <p className="text-4xl animate-bounce mb-2">⏳</p>
                            <p className={textMuted}>Memuat riwayat...</p>
                        </div>
                    ) : riwayat.length === 0 ? (
                        <div className="text-center py-8">
                            <p className="text-4xl mb-2">📭</p>
                            <p className={textMuted}>Belum ada pesanan</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {riwayat.map((pesanan) => (
                                <div key={pesanan.id} className={`rounded-xl border ${isDark ? "border-gray-700" : "border-gray-200"} overflow-hidden`}>
                                    <div className={`flex items-center justify-between px-4 py-3 ${bgSection}`}>
                                        <div>
                                            <p className="font-bold text-sm">Pesanan #{String(pesanan.id).slice(-6)}</p>
                                            <p className={`text-xs ${textMuted}`}>{pesanan.created_at?.slice(0, 10)}</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className={`text-xs px-3 py-1 rounded-full font-semibold ${warnaBadge(pesanan.status)}`}>
                                                {pesanan.status}
                                            </span>
                                            <button onClick={() => setBukaRiwayat(bukaRiwayat === pesanan.id ? null : pesanan.id)}
                                                className={`text-xs px-3 py-1 rounded-full transition ${isDark ? "bg-gray-700 hover:bg-gray-600 text-gray-300" : "bg-gray-200 hover:bg-gray-300 text-gray-600"}`}>
                                                {bukaRiwayat === pesanan.id ? "Tutup" : "Detail"}
                                            </button>
                                        </div>
                                    </div>
                                    <div className="px-4 py-3 flex justify-between items-center">
                                        <p className={`text-sm ${textMuted}`}>{pesanan.items?.length} produk</p>
                                        <p className="font-bold text-blue-500">{formatRupiah(pesanan.total)}</p>
                                    </div>
                                    {bukaRiwayat === pesanan.id && (
                                        <div className={`px-4 pb-4 space-y-3 border-t ${isDark ? "border-gray-700" : "border-gray-200"}`}>
                                            <div className="mt-3 space-y-2">
                                                {pesanan.items?.map((item, i) => (
                                                    <div key={i} className={`flex items-center gap-3 p-3 rounded-lg ${bgSection}`}>
                                                        <span className="text-2xl">{item.icon}</span>
                                                        <div className="flex-1">
                                                            <p className="text-sm font-semibold">{item.nama}</p>
                                                            <p className={`text-xs ${textMuted}`}>{item.kategori}</p>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="text-sm font-bold text-blue-500">{formatRupiah(item.harga * item.qty)}</p>
                                                            <p className={`text-xs ${textMuted}`}>x{item.qty}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                            {pesanan.nama_penerima && (
                                                <div className={`p-3 rounded-lg text-sm ${bgSection}`}>
                                                    <p className="font-bold mb-1">📍 Alamat Pengiriman:</p>
                                                    <p className={textMuted}>{pesanan.nama_penerima} | {pesanan.no_hp}</p>
                                                    <p className={textMuted}>{pesanan.jalan}</p>
                                                    <p className={textMuted}>{pesanan.kelurahan}, {pesanan.kecamatan}, {pesanan.kota}</p>
                                                    <p className={textMuted}>{pesanan.provinsi} {pesanan.kode_pos}</p>
                                                </div>
                                            )}
                                            {pesanan.status !== "Selesai" && pesanan.status !== "Dibatalkan" ? (
                                                <button onClick={() => handleKonfirmasi(pesanan.id)}
                                                    className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-full font-semibold transition">
                                                    ✅ Konfirmasi Barang Sudah Sampai
                                                </button>
                                            ) : pesanan.status === "Selesai" ? (
                                                <div className="w-full bg-green-900 border border-green-600 text-green-400 py-3 rounded-full font-semibold text-center text-sm">
                                                    ✅ Pesanan Selesai - Barang Sudah Diterima
                                                </div>
                                            ) : null}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Riwayat Booking Service */}
                <RiwayatBooking
                    token={token}
                    isDark={isDark}
                    bgCard={bgCard}
                    bgSection={bgSection}
                    textMuted={textMuted}
                />

                {/* Alamat Pengiriman */}
                <div className={`${bgCard} rounded-xl p-6`}>
                    <h2 className="text-xl font-bold mb-2">📍 Alamat Pengiriman</h2>
                    <p className={`text-sm ${textMuted} mb-6`}>Alamat ini akan otomatis muncul saat checkout</p>
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[
                                { label: "Nama Penerima", key: "namaPenerima", placeholder: "Nama lengkap penerima", col: "md:col-span-2" },
                                { label: "Nomor HP Penerima", key: "noHp", placeholder: "Contoh: 0812-3456-7890", col: "md:col-span-2" },
                                { label: "Nama Jalan / Alamat Lengkap", key: "jalan", placeholder: "Contoh: Jl. Mawar No. 10", col: "md:col-span-2" },
                                { label: "Kelurahan", key: "kelurahan", placeholder: "Contoh: Mojoroto" },
                                { label: "Kecamatan", key: "kecamatan", placeholder: "Contoh: Mojoroto" },
                                { label: "Kota / Kabupaten", key: "kota", placeholder: "Contoh: Kediri" },
                                { label: "Provinsi", key: "provinsi", placeholder: "Contoh: Jawa Timur" },
                                { label: "Kode Pos", key: "kodePos", placeholder: "Contoh: 64112" },
                                { label: "Pesan untuk Kurir (opsional)", key: "pesanKurir", placeholder: "Contoh: Di rumah dengan genteng hijau", col: "md:col-span-2" },
                            ].map((field, i) => (
                                <div key={i} className={field.col || ""}>
                                    <label className={`text-sm ${textMuted} mb-1 block`}>
                                        {field.label} {field.key !== "pesanKurir" && <span className="text-red-400">*</span>}
                                    </label>
                                    <input type="text" placeholder={field.placeholder} value={alamat[field.key]}
                                        onChange={(e) => setAlamat({ ...alamat, [field.key]: e.target.value })}
                                        className={`w-full px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 ${bgInput}`} />
                                </div>
                            ))}
                        </div>
                        <button onClick={handleSimpanAlamat} className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-full font-semibold transition">
                            Simpan Alamat 📍
                        </button>
                    </div>
                </div>

                {/* Aksi Cepat */}
                <div className={`${bgCard} rounded-xl p-6`}>
                    <h2 className="text-xl font-bold mb-4">Aksi Cepat</h2>
                    <div className="grid grid-cols-2 gap-3">
                        <button onClick={() => navigate("/produk")} className="bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-xl font-semibold transition">
                            🛒 Belanja
                        </button>
                        <button onClick={() => navigate("/keranjang")} className="bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-xl font-semibold transition">
                            🧺 Keranjang
                        </button>
                        <button onClick={() => navigate("/service")} className={`${isDark ? "bg-gray-800 hover:bg-gray-700 text-gray-300" : "bg-gray-200 hover:bg-gray-300 text-gray-700"} py-3 rounded-xl font-semibold transition`}>
                            🔧 Service
                        </button>
                        <button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-semibold transition">
                            🚪 Keluar
                        </button>
                    </div>
                </div>

            </section>
            <Footer />
        </div>
    );
}

export default Profil;