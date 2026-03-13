import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useAdmin } from "../context/AdminContext";

// Akun admin hardcode (nanti bisa diganti API)
const ADMIN_EMAIL = "admin@techstore.com";
const ADMIN_PASSWORD = "admin123";

function Admin() {
    const navigate = useNavigate();
    const { isDark } = useTheme();
    const {
        produk, tambahProduk, editProduk, hapusProduk,
        semuaPesanan, updateStatusPesanan,
        pengguna, hapusPengguna,
        pengeluaran, tambahPengeluaran, hapusPengeluaran,
        totalPemasukan, totalPengeluaran, hpp, labaKotor, labaBersih,
    } = useAdmin();

    const [tab, setTab] = useState("dashboard");
    const [loginForm, setLoginForm] = useState({ email: "", password: "" });
    const [isAdmin, setIsAdmin] = useState(() => localStorage.getItem("is_admin") === "true");
    const [loginError, setLoginError] = useState("");

    // Form produk
    const [formProduk, setFormProduk] = useState({ nama: "", harga: "", kategori: "Laptop", icon: "💻", stok: "Tersedia", spek: "", deskripsi: "", garansi: "", berat: "" });
    const [editId, setEditId] = useState(null);
    const [showFormProduk, setShowFormProduk] = useState(false);

    // Form pengeluaran
    const [formPengeluaran, setFormPengeluaran] = useState({ nama: "", jumlah: "", kategori: "Operasional", tanggal: new Date().toLocaleDateString("id-ID") });
    const [showFormPengeluaran, setShowFormPengeluaran] = useState(false);

    const bg = isDark ? "bg-gray-950 text-white" : "bg-gray-50 text-gray-800";
    const bgCard = isDark ? "bg-gray-900" : "bg-white border border-gray-200";
    const bgInput = isDark ? "bg-gray-800 text-white placeholder-gray-500" : "bg-gray-100 text-gray-800 placeholder-gray-400";
    const bgSection = isDark ? "bg-gray-800" : "bg-gray-100";
    const bgSidebar = isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200";
    const textMuted = isDark ? "text-gray-400" : "text-gray-500";

    const formatRupiah = (num) => "Rp " + Number(num).toLocaleString("id-ID");

    const warnaBadge = (status) => {
        if (status === "Diproses") return "bg-yellow-500 text-white";
        if (status === "Dikirim") return "bg-blue-500 text-white";
        if (status === "Selesai") return "bg-green-600 text-white";
        if (status === "Dibatalkan") return "bg-red-600 text-white";
        return "bg-gray-500 text-white";
    };

    // Login admin
    const handleLoginAdmin = () => {
        if (loginForm.email === ADMIN_EMAIL && loginForm.password === ADMIN_PASSWORD) {
            localStorage.setItem("is_admin", "true");
            setIsAdmin(true);
            setLoginError("");
        } else {
            setLoginError("Email atau password admin salah!");
        }
    };

    const handleLogoutAdmin = () => {
        localStorage.removeItem("is_admin");
        setIsAdmin(false);
        navigate("/");
    };

    // Simpan produk (tambah atau edit)
    const handleSimpanProduk = () => {
        if (!formProduk.nama || !formProduk.harga || !formProduk.spek) {
            alert("Harap isi nama, harga, dan spek!");
            return;
        }
        if (editId) {
            editProduk(editId, { ...formProduk, harga: parseInt(formProduk.harga) });
            setEditId(null);
        } else {
            tambahProduk({ ...formProduk, harga: parseInt(formProduk.harga) });
        }
        setFormProduk({ nama: "", harga: "", kategori: "Laptop", icon: "💻", stok: "Tersedia", spek: "", deskripsi: "", garansi: "", berat: "" });
        setShowFormProduk(false);
    };

    const handleEditProduk = (p) => {
        setFormProduk({ ...p, harga: String(p.harga) });
        setEditId(p.id);
        setShowFormProduk(true);
        window.scrollTo(0, 0);
    };

    const handleSimpanPengeluaran = () => {
        if (!formPengeluaran.nama || !formPengeluaran.jumlah) return;
        tambahPengeluaran({ ...formPengeluaran, jumlah: parseInt(formPengeluaran.jumlah) });
        setFormPengeluaran({ nama: "", jumlah: "", kategori: "Operasional", tanggal: new Date().toLocaleDateString("id-ID") });
        setShowFormPengeluaran(false);
    };

    // Halaman login admin
    if (!isAdmin) {
        return (
            <div className={`min-h-screen ${bg} flex items-center justify-center px-4`}>
                <div className={`${bgCard} rounded-2xl p-8 w-full max-w-md shadow-xl`}>
                    <div className="text-center mb-8">
                        <p className="text-5xl mb-3">🔐</p>
                        <h1 className="text-2xl font-bold text-blue-500">Admin TechStore</h1>
                        <p className={textMuted}>Masuk sebagai administrator</p>
                    </div>

                    {loginError && (
                        <div className="bg-red-900 border border-red-500 text-red-300 px-4 py-3 rounded-lg text-sm mb-4">
                            ⚠️ {loginError}
                        </div>
                    )}

                    <div className="space-y-4">
                        <div>
                            <label className={`text-sm ${textMuted} mb-1 block`}>Email Admin</label>
                            <input type="email" placeholder="admin@techstore.com" value={loginForm.email}
                                onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                                onKeyDown={(e) => e.key === "Enter" && handleLoginAdmin()}
                                className={`w-full px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 ${bgInput}`} />
                        </div>
                        <div>
                            <label className={`text-sm ${textMuted} mb-1 block`}>Password</label>
                            <input type="password" placeholder="••••••••" value={loginForm.password}
                                onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                                onKeyDown={(e) => e.key === "Enter" && handleLoginAdmin()}
                                className={`w-full px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 ${bgInput}`} />
                        </div>
                        <button onClick={handleLoginAdmin} className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-full font-semibold transition">
                            Masuk sebagai Admin 🔐
                        </button>
                        <button onClick={() => navigate("/")} className={`w-full py-3 rounded-full font-semibold transition border ${isDark ? "border-gray-600 text-gray-400" : "border-gray-300 text-gray-500"}`}>
                            ← Kembali ke Toko
                        </button>
                    </div>

                    <div className={`mt-4 p-3 rounded-lg text-xs ${bgSection} ${textMuted}`}>
                        <p className="font-semibold mb-1">🧪 Akun Demo Admin:</p>
                        <p>Email: admin@techstore.com</p>
                        <p>Password: admin123</p>
                    </div>
                </div>
            </div>
        );
    }

    const tabs = [
        { id: "dashboard", label: "Dashboard", icon: "📊" },
        { id: "produk", label: "Produk", icon: "📦" },
        { id: "pesanan", label: "Pesanan", icon: "🛒" },
        { id: "keuangan", label: "Keuangan", icon: "💰" },
        { id: "pengguna", label: "Pengguna", icon: "👥" },
    ];

    return (
        <div className={`min-h-screen ${bg} flex`}>

            {/* Sidebar */}
            <aside className={`w-64 min-h-screen border-r ${bgSidebar} flex flex-col hidden md:flex`}>
                <div className="p-6 border-b border-gray-800">
                    <h1 className="text-xl font-bold text-blue-500">💻 TechStore</h1>
                    <p className={`text-xs ${textMuted} mt-1`}>Admin Panel</p>
                </div>
                <nav className="flex-1 p-4 space-y-1">
                    {tabs.map((t) => (
                        <button key={t.id} onClick={() => setTab(t.id)}
                            className={`w-full text-left px-4 py-3 rounded-xl font-semibold text-sm transition flex items-center gap-3 ${tab === t.id ? "bg-blue-500 text-white" : `${isDark ? "text-gray-400 hover:bg-gray-800" : "text-gray-600 hover:bg-gray-100"}`}`}>
                            <span>{t.icon}</span> {t.label}
                        </button>
                    ))}
                </nav>
                <div className="p-4 border-t border-gray-800 space-y-2">
                    <button onClick={() => navigate("/")} className={`w-full text-left px-4 py-2 rounded-xl text-sm transition ${isDark ? "text-gray-400 hover:bg-gray-800" : "text-gray-600 hover:bg-gray-100"}`}>
                        🏠 Lihat Toko
                    </button>
                    <button onClick={handleLogoutAdmin} className="w-full text-left px-4 py-2 rounded-xl text-sm text-red-400 hover:bg-red-900 transition">
                        🚪 Keluar Admin
                    </button>
                </div>
            </aside>

            {/* Mobile Tab Bar */}
            <div className={`md:hidden fixed bottom-0 left-0 right-0 z-50 border-t ${bgSidebar} flex justify-around py-2 px-1`}>
                {tabs.map((t) => (
                    <button key={t.id} onClick={() => setTab(t.id)}
                        className={`flex flex-col items-center text-xs px-2 py-1 rounded-lg transition ${tab === t.id ? "text-blue-500" : textMuted}`}>
                        <span className="text-xl">{t.icon}</span>
                        <span>{t.label}</span>
                    </button>
                ))}
            </div>

            {/* Konten Utama */}
            <main className="flex-1 p-6 overflow-auto pb-24 md:pb-6">

                {/* ═══════════════ DASHBOARD ═══════════════ */}
                {tab === "dashboard" && (
                    <div>
                        <h2 className="text-2xl font-bold mb-6">📊 Dashboard</h2>

                        {/* Kartu Statistik */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                            {[
                                { label: "Total Produk", value: produk.length, icon: "📦", warna: "text-blue-500" },
                                { label: "Total Pesanan", value: semuaPesanan.length, icon: "🛒", warna: "text-green-500" },
                                { label: "Total Pengguna", value: pengguna.length, icon: "👥", warna: "text-purple-500" },
                                { label: "Laba Bersih", value: formatRupiah(labaBersih), icon: "💰", warna: labaBersih >= 0 ? "text-green-500" : "text-red-500" },
                            ].map((stat, i) => (
                                <div key={i} className={`${bgCard} rounded-xl p-5 text-center`}>
                                    <p className="text-3xl mb-2">{stat.icon}</p>
                                    <p className={`text-xl font-bold ${stat.warna}`}>{stat.value}</p>
                                    <p className={`text-xs ${textMuted} mt-1`}>{stat.label}</p>
                                </div>
                            ))}
                        </div>

                        {/* Pesanan Terbaru */}
                        <div className={`${bgCard} rounded-xl p-6 mb-6`}>
                            <h3 className="text-lg font-bold mb-4">🛒 Pesanan Terbaru</h3>
                            {semuaPesanan.length === 0 ? (
                                <p className={textMuted}>Belum ada pesanan masuk</p>
                            ) : (
                                <div className="space-y-3">
                                    {semuaPesanan.slice(0, 5).map((p) => (
                                        <div key={p.id} className={`flex justify-between items-center p-3 rounded-lg ${bgSection}`}>
                                            <div>
                                                <p className="font-semibold text-sm">#{String(p.id).slice(-6)}</p>
                                                <p className={`text-xs ${textMuted}`}>{p.tanggal} · {p.items?.length} produk</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-blue-500 font-bold text-sm">{formatRupiah(p.total)}</p>
                                                <span className={`text-xs px-2 py-0.5 rounded-full ${warnaBadge(p.status)}`}>{p.status}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Ringkasan Keuangan */}
                        <div className={`${bgCard} rounded-xl p-6`}>
                            <h3 className="text-lg font-bold mb-4">💰 Ringkasan Keuangan</h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {[
                                    { label: "Total Pemasukan", value: formatRupiah(totalPemasukan), warna: "text-green-500" },
                                    { label: "HPP (60%)", value: formatRupiah(hpp), warna: "text-yellow-500" },
                                    { label: "Laba Kotor", value: formatRupiah(labaKotor), warna: "text-blue-500" },
                                    { label: "Total Pengeluaran", value: formatRupiah(totalPengeluaran), warna: "text-red-500" },
                                    { label: "Laba Bersih", value: formatRupiah(labaBersih), warna: labaBersih >= 0 ? "text-green-500" : "text-red-500" },
                                ].map((item, i) => (
                                    <div key={i} className={`${bgSection} rounded-xl p-4`}>
                                        <p className={`text-xs ${textMuted} mb-1`}>{item.label}</p>
                                        <p className={`font-bold ${item.warna}`}>{item.value}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* ═══════════════ PRODUK ═══════════════ */}
                {tab === "produk" && (
                    <div>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold">📦 Kelola Produk</h2>
                            <button onClick={() => { setShowFormProduk(!showFormProduk); setEditId(null); setFormProduk({ nama: "", harga: "", kategori: "Laptop", icon: "💻", stok: "Tersedia", spek: "", deskripsi: "", garansi: "", berat: "" }); }}
                                className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-full text-sm font-semibold transition">
                                {showFormProduk ? "Batal" : "+ Tambah Produk"}
                            </button>
                        </div>

                        {/* Form Tambah/Edit Produk */}
                        {showFormProduk && (
                            <div className={`${bgCard} rounded-xl p-6 mb-6`}>
                                <h3 className="font-bold mb-4">{editId ? "✏️ Edit Produk" : "➕ Tambah Produk Baru"}</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {[
                                        { label: "Nama Produk", key: "nama", placeholder: "Contoh: Laptop ASUS" },
                                        { label: "Harga (angka)", key: "harga", placeholder: "Contoh: 7500000" },
                                        { label: "Spesifikasi", key: "spek", placeholder: "Contoh: Intel i5, 8GB RAM" },
                                        { label: "Garansi", key: "garansi", placeholder: "Contoh: 1 Tahun Resmi" },
                                        { label: "Berat", key: "berat", placeholder: "Contoh: 1.8 kg" },
                                        { label: "Icon (emoji)", key: "icon", placeholder: "Contoh: 💻" },
                                    ].map((field, i) => (
                                        <div key={i}>
                                            <label className={`text-sm ${textMuted} mb-1 block`}>{field.label}</label>
                                            <input type="text" placeholder={field.placeholder} value={formProduk[field.key]}
                                                onChange={(e) => setFormProduk({ ...formProduk, [field.key]: e.target.value })}
                                                className={`w-full px-4 py-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-sm ${bgInput}`} />
                                        </div>
                                    ))}
                                    <div>
                                        <label className={`text-sm ${textMuted} mb-1 block`}>Kategori</label>
                                        <select value={formProduk.kategori} onChange={(e) => setFormProduk({ ...formProduk, kategori: e.target.value })}
                                            className={`w-full px-4 py-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-sm ${bgInput}`}>
                                            {["Laptop", "Komputer", "Hardware", "Aksesoris"].map((k) => <option key={k}>{k}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className={`text-sm ${textMuted} mb-1 block`}>Stok</label>
                                        <select value={formProduk.stok} onChange={(e) => setFormProduk({ ...formProduk, stok: e.target.value })}
                                            className={`w-full px-4 py-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-sm ${bgInput}`}>
                                            <option>Tersedia</option>
                                            <option>Habis</option>
                                            <option>Pre-order</option>
                                        </select>
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className={`text-sm ${textMuted} mb-1 block`}>Deskripsi</label>
                                        <textarea placeholder="Deskripsi produk..." value={formProduk.deskripsi}
                                            onChange={(e) => setFormProduk({ ...formProduk, deskripsi: e.target.value })}
                                            rows={3} className={`w-full px-4 py-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none ${bgInput}`} />
                                    </div>
                                </div>
                                <button onClick={handleSimpanProduk} className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-8 py-2 rounded-full font-semibold transition">
                                    {editId ? "Simpan Perubahan" : "Tambah Produk"}
                                </button>
                            </div>
                        )}

                        {/* Tabel Produk */}
                        <div className={`${bgCard} rounded-xl overflow-hidden`}>
                            <table className="w-full text-sm">
                                <thead className={bgSection}>
                                    <tr>
                                        {["Icon", "Nama", "Kategori", "Harga", "Stok", "Aksi"].map((h) => (
                                            <th key={h} className={`px-4 py-3 text-left font-semibold ${textMuted}`}>{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {produk.map((p, i) => (
                                        <tr key={p.id} className={`border-t ${isDark ? "border-gray-800" : "border-gray-100"} hover:${bgSection} transition`}>
                                            <td className="px-4 py-3 text-2xl">{p.icon}</td>
                                            <td className="px-4 py-3 font-semibold">{p.nama}</td>
                                            <td className="px-4 py-3"><span className="bg-blue-900 text-blue-300 px-2 py-0.5 rounded-full text-xs">{p.kategori}</span></td>
                                            <td className="px-4 py-3 text-blue-500 font-bold">{formatRupiah(p.harga)}</td>
                                            <td className="px-4 py-3"><span className={`text-xs px-2 py-0.5 rounded-full ${p.stok === "Tersedia" ? "bg-green-900 text-green-300" : "bg-red-900 text-red-300"}`}>{p.stok}</span></td>
                                            <td className="px-4 py-3">
                                                <div className="flex gap-2">
                                                    <button onClick={() => handleEditProduk(p)} className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded-full text-xs transition">✏️ Edit</button>
                                                    <button onClick={() => hapusProduk(p.id)} className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-full text-xs transition">🗑️ Hapus</button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* ═══════════════ PESANAN ═══════════════ */}
                {tab === "pesanan" && (
                    <div>
                        <h2 className="text-2xl font-bold mb-6">🛒 Semua Pesanan</h2>
                        {semuaPesanan.length === 0 ? (
                            <div className={`${bgCard} rounded-xl p-10 text-center`}>
                                <p className="text-4xl mb-2">📭</p>
                                <p className={textMuted}>Belum ada pesanan masuk</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {semuaPesanan.map((pesanan) => (
                                    <div key={pesanan.id} className={`${bgCard} rounded-xl overflow-hidden`}>
                                        <div className={`flex flex-wrap justify-between items-center px-5 py-4 gap-3 ${bgSection}`}>
                                            <div>
                                                <p className="font-bold">Pesanan #{String(pesanan.id).slice(-6)}</p>
                                                <p className={`text-xs ${textMuted}`}>{pesanan.tanggal} · {pesanan.jam} · {pesanan.items?.length} produk</p>
                                            </div>
                                            <div className="flex items-center gap-3 flex-wrap">
                                                <p className="font-bold text-blue-500">{formatRupiah(pesanan.total)}</p>
                                                <select value={pesanan.status}
                                                    onChange={(e) => updateStatusPesanan(pesanan.id, e.target.value)}
                                                    className={`text-xs px-3 py-1 rounded-full font-semibold outline-none ${warnaBadge(pesanan.status)} cursor-pointer`}>
                                                    <option>Diproses</option>
                                                    <option>Dikirim</option>
                                                    <option>Selesai</option>
                                                    <option>Dibatalkan</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="px-5 py-4 space-y-2">
                                            {pesanan.items?.map((item, i) => (
                                                <div key={i} className={`flex items-center gap-3 p-2 rounded-lg ${bgSection}`}>
                                                    <span className="text-2xl">{item.icon}</span>
                                                    <div className="flex-1">
                                                        <p className="text-sm font-semibold">{item.nama}</p>
                                                        <p className={`text-xs ${textMuted}`}>x{item.qty}</p>
                                                    </div>
                                                    <p className="text-blue-500 text-sm font-bold">{formatRupiah(item.harga * item.qty)}</p>
                                                </div>
                                            ))}
                                            {pesanan.alamat?.namaPenerima && (
                                                <div className={`p-3 rounded-lg text-xs ${bgSection} mt-2`}>
                                                    <p className="font-bold mb-1">📍 Kirim ke:</p>
                                                    <p className={textMuted}>{pesanan.alamat.namaPenerima} | {pesanan.alamat.noHp}</p>
                                                    <p className={textMuted}>{pesanan.alamat.jalan}, {pesanan.alamat.kota}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* ═══════════════ KEUANGAN ═══════════════ */}
                {tab === "keuangan" && (
                    <div>
                        <h2 className="text-2xl font-bold mb-6">💰 Laporan Keuangan</h2>

                        {/* Kartu Keuangan */}
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                            {[
                                { label: "Total Pemasukan", value: formatRupiah(totalPemasukan), icon: "📈", warna: "text-green-500", desc: "Dari semua pesanan" },
                                { label: "HPP (60%)", value: formatRupiah(hpp), icon: "🏷️", warna: "text-yellow-500", desc: "Estimasi modal barang" },
                                { label: "Laba Kotor", value: formatRupiah(labaKotor), icon: "💵", warna: "text-blue-500", desc: "Pemasukan - HPP" },
                                { label: "Total Pengeluaran", value: formatRupiah(totalPengeluaran), icon: "📉", warna: "text-red-500", desc: "Operasional & lainnya" },
                                { label: "Laba Bersih", value: formatRupiah(labaBersih), icon: "🏆", warna: labaBersih >= 0 ? "text-green-500" : "text-red-500", desc: "Laba Kotor - Pengeluaran" },
                            ].map((item, i) => (
                                <div key={i} className={`${bgCard} rounded-xl p-5`}>
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-2xl">{item.icon}</span>
                                        <p className={`text-xs ${textMuted}`}>{item.label}</p>
                                    </div>
                                    <p className={`text-xl font-bold ${item.warna}`}>{item.value}</p>
                                    <p className={`text-xs ${textMuted} mt-1`}>{item.desc}</p>
                                </div>
                            ))}
                        </div>

                        {/* Rumus Perhitungan */}
                        <div className={`${bgCard} rounded-xl p-6 mb-6`}>
                            <h3 className="font-bold mb-4">📐 Rumus Perhitungan</h3>
                            <div className={`${bgSection} rounded-xl p-4 text-sm space-y-2 font-mono`}>
                                <p>HPP = Pemasukan × 60%</p>
                                <p>Laba Kotor = Pemasukan - HPP</p>
                                <p>Laba Bersih = Laba Kotor - Total Pengeluaran</p>
                            </div>
                        </div>

                        {/* Pengeluaran */}
                        <div className={`${bgCard} rounded-xl p-6`}>
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-bold">📋 Daftar Pengeluaran</h3>
                                <button onClick={() => setShowFormPengeluaran(!showFormPengeluaran)}
                                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full text-xs font-semibold transition">
                                    {showFormPengeluaran ? "Batal" : "+ Tambah Pengeluaran"}
                                </button>
                            </div>

                            {/* Form Pengeluaran */}
                            {showFormPengeluaran && (
                                <div className={`${bgSection} rounded-xl p-4 mb-4 grid grid-cols-1 md:grid-cols-2 gap-3`}>
                                    {[
                                        { label: "Nama Pengeluaran", key: "nama", placeholder: "Contoh: Beli Stock RAM" },
                                        { label: "Jumlah (angka)", key: "jumlah", placeholder: "Contoh: 500000" },
                                        { label: "Tanggal", key: "tanggal", placeholder: "Contoh: 12 Maret 2026" },
                                    ].map((field, i) => (
                                        <div key={i}>
                                            <label className={`text-xs ${textMuted} mb-1 block`}>{field.label}</label>
                                            <input type="text" placeholder={field.placeholder} value={formPengeluaran[field.key]}
                                                onChange={(e) => setFormPengeluaran({ ...formPengeluaran, [field.key]: e.target.value })}
                                                className={`w-full px-3 py-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-sm ${bgInput}`} />
                                        </div>
                                    ))}
                                    <div>
                                        <label className={`text-xs ${textMuted} mb-1 block`}>Kategori</label>
                                        <select value={formPengeluaran.kategori}
                                            onChange={(e) => setFormPengeluaran({ ...formPengeluaran, kategori: e.target.value })}
                                            className={`w-full px-3 py-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-sm ${bgInput}`}>
                                            {["Operasional", "SDM", "Stok Barang", "Marketing", "Lainnya"].map((k) => <option key={k}>{k}</option>)}
                                        </select>
                                    </div>
                                    <div className="md:col-span-2">
                                        <button onClick={handleSimpanPengeluaran} className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-full text-sm font-semibold transition">
                                            Simpan Pengeluaran
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Tabel Pengeluaran */}
                            <div className="space-y-2">
                                {pengeluaran.map((p) => (
                                    <div key={p.id} className={`flex justify-between items-center p-3 rounded-lg ${bgSection}`}>
                                        <div>
                                            <p className="font-semibold text-sm">{p.nama}</p>
                                            <p className={`text-xs ${textMuted}`}>{p.tanggal} · {p.kategori}</p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <p className="text-red-500 font-bold text-sm">{formatRupiah(p.jumlah)}</p>
                                            <button onClick={() => hapusPengeluaran(p.id)} className="text-red-400 hover:text-red-300 transition text-sm">🗑️</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* ═══════════════ PENGGUNA ═══════════════ */}
                {tab === "pengguna" && (
                    <div>
                        <h2 className="text-2xl font-bold mb-6">👥 Kelola Pengguna</h2>
                        {pengguna.length === 0 ? (
                            <div className={`${bgCard} rounded-xl p-10 text-center`}>
                                <p className="text-4xl mb-2">👤</p>
                                <p className={textMuted}>Belum ada pengguna terdaftar</p>
                            </div>
                        ) : (
                            <div className={`${bgCard} rounded-xl overflow-hidden`}>
                                <table className="w-full text-sm">
                                    <thead className={bgSection}>
                                        <tr>
                                            {["#", "Nama", "Email", "Aksi"].map((h) => (
                                                <th key={h} className={`px-4 py-3 text-left font-semibold ${textMuted}`}>{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {pengguna.map((p, i) => (
                                            <tr key={i} className={`border-t ${isDark ? "border-gray-800" : "border-gray-100"}`}>
                                                <td className={`px-4 py-3 ${textMuted}`}>{i + 1}</td>
                                                <td className="px-4 py-3 font-semibold">👤 {p.nama}</td>
                                                <td className={`px-4 py-3 ${textMuted}`}>{p.email}</td>
                                                <td className="px-4 py-3">
                                                    <button onClick={() => { if (window.confirm(`Hapus pengguna ${p.nama}?`)) hapusPengguna(p.email); }}
                                                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-full text-xs transition">
                                                        🗑️ Hapus
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}

            </main>
        </div>
    );
}

export default Admin;