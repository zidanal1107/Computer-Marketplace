import { useEffect, useState } from "react";
import { animate, stagger } from "animejs";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import API_URL from "../config/api";

function Service() {
    const [form, setForm] = useState({ nama: "", hp: "", perangkat: "", keluhan: "", paket: "", tanggal_pengerjaan: "" });
    const [terkirim, setTerkirim] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const { isDark } = useTheme();
    const { user, token } = useAuth();

    const bg = isDark ? "bg-gray-950 text-white" : "bg-gray-50 text-gray-800";
    const bgCard = isDark ? "bg-gray-900" : "bg-white border border-gray-200";
    const bgInput = isDark ? "bg-gray-800 text-white placeholder-gray-500" : "bg-gray-100 text-gray-800 placeholder-gray-400";
    const textMuted = isDark ? "text-gray-400" : "text-gray-500";

    useEffect(() => {
        animate(".fade-up", {
            opacity: { from: 0, to: 1 },
            translateY: { from: 40, to: 0 },
            duration: 700,
            delay: stagger(100),
            easing: "easeOutExpo",
        });
        if (user) {
            setForm((prev) => ({ ...prev, nama: user.nama }));
        }
    }, []);

    const handleSubmit = async () => {
        if (!form.nama || !form.hp || !form.perangkat || !form.keluhan || !form.paket || !form.tanggal_pengerjaan) {
            setError("Harap isi semua field!");
            setTimeout(() => setError(""), 3000);
            return;
        }
        setLoading(true);
        setError("");
        try {
            const headers = { "Content-Type": "application/json" };
            if (token) headers["Authorization"] = `Bearer ${token}`;
            const res = await fetch(`${API_URL}/booking`, {
                method: "POST",
                headers,
                body: JSON.stringify(form),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);
            setTerkirim(true);
        } catch (err) {
            setError(err.message);
            setTimeout(() => setError(""), 3000);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`min-h-screen ${bg}`}>
            <Navbar />

            {error && (
                <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-red-600 text-white px-6 py-3 rounded-full shadow-lg text-sm font-semibold">
                    ⚠️ {error}
                </div>
            )}

            <section className={`px-6 py-12 text-center ${isDark ? "bg-gradient-to-b from-blue-950 to-gray-950" : "bg-gradient-to-b from-blue-100 to-gray-50"}`}>
                <h1 className="fade-up opacity-0 text-3xl md:text-4xl font-bold mb-3">
                    Layanan <span className="text-blue-500">Service</span>
                </h1>
                <p className={`fade-up opacity-0 ${textMuted}`}>Teknisi berpengalaman siap membantu masalah perangkat kamu</p>
            </section>

            {/* Paket Service */}
            <section className="px-6 py-12 max-w-6xl mx-auto">
                <h2 className="text-2xl font-bold text-center mb-8">Pilih Paket Service</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        { paket: "Service Ringan", harga: "Rp 50.000", icon: "🔍", warna: "border-green-500", list: ["Bersihkan debu & kipas", "Install ulang OS", "Optimasi & update driver", "Scan virus & malware"] },
                        { paket: "Service Sedang", harga: "Rp 150.000", icon: "🔧", warna: "border-blue-500", list: ["Ganti thermal paste", "Perbaikan software", "Upgrade RAM / SSD", "Perbaikan sistem error"] },
                        { paket: "Service Berat", harga: "Rp 300.000", icon: "⚙️", warna: "border-red-500", list: ["Perbaikan motherboard", "Ganti LCD / layar", "Perbaikan charging port", "Reballing chip GPU/CPU"] },
                    ].map((item, i) => (
                        <div key={i} onClick={() => setForm({ ...form, paket: item.paket })}
                            className={`fade-up opacity-0 ${bgCard} rounded-xl p-8 border-t-4 ${item.warna} cursor-pointer transition hover:shadow-lg ${form.paket === item.paket ? "ring-2 ring-blue-500" : ""}`}>
                            <div className="text-5xl mb-4">{item.icon}</div>
                            <h3 className="text-xl font-bold mb-1">{item.paket}</h3>
                            <p className="text-blue-500 text-2xl font-bold mb-4">{item.harga}</p>
                            <ul className={`${textMuted} text-sm space-y-2`}>
                                {item.list.map((l, j) => <li key={j}>✔️ {l}</li>)}
                            </ul>
                            {form.paket === item.paket && <p className="mt-4 text-blue-500 font-semibold text-sm">✅ Dipilih</p>}
                        </div>
                    ))}
                </div>
            </section>

            {/* Form Booking */}
            <section className="px-6 py-12 max-w-2xl mx-auto">
                <h2 className="text-2xl font-bold text-center mb-8">📋 Form Booking Service</h2>
                {terkirim ? (
                    <div className="bg-green-900 border border-green-500 rounded-xl p-8 text-center">
                        <p className="text-4xl mb-4">✅</p>
                        <h3 className="text-xl font-bold mb-2">Booking Berhasil!</h3>
                        <p className={textMuted}>Terima kasih <span className="text-white font-semibold">{form.nama}</span>! Kami akan menghubungi kamu di <span className="text-white font-semibold">{form.hp}</span> segera.</p>
                        <button onClick={() => { setTerkirim(false); setForm({ nama: user?.nama || "", hp: "", perangkat: "", keluhan: "", paket: "", tanggal_pengerjaan: "" }); }}
                            className="mt-6 bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-full font-semibold transition">
                            Booking Lagi
                        </button>
                    </div>
                ) : (
                    <div className={`${bgCard} rounded-xl p-8 space-y-4`}>
                        {[
                            { label: "Nama Lengkap", key: "nama", placeholder: "Contoh: Budi Santoso", type: "input" },
                            { label: "Nomor HP / WhatsApp", key: "hp", placeholder: "Contoh: 0812-3456-7890", type: "input" },
                            { label: "Jenis Perangkat", key: "perangkat", placeholder: "Contoh: Laptop ASUS VivoBook", type: "input" },
                            { label: "Keluhan", key: "keluhan", placeholder: "Contoh: Laptop sering mati sendiri", type: "textarea" },
                            { label: "Tanggal Pengerjaan", key: "tanggal_pengerjaan", placeholder: "", type: "date" },
                        ].map((field, i) => (
                            <div key={i}>
                                <label className={`text-sm ${textMuted} mb-1 block`}>{field.label}</label>
                                {field.type === "input" ? (
                                    <input type="text" placeholder={field.placeholder} value={form[field.key]}
                                        onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                                        className={`w-full px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 ${bgInput}`} />
                                ) : field.type === "textarea" ? (
                                    <textarea placeholder={field.placeholder} value={form[field.key]}
                                        onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                                        rows={3} className={`w-full px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 resize-none ${bgInput}`} />
                                ) : field.type === "date" ? (
                                    <input type="date" value={form[field.key]}
                                        min={new Date().toISOString().split("T")[0]}
                                        onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                                        className={`w-full px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 ${bgInput}`} />
                                ) : null}
                            </div>
                        ))}

                        {/* Paket Service */}
                        <div>
                            <label className={`text-sm ${textMuted} mb-1 block`}>Paket Service</label>
                            <select value={form.paket} onChange={(e) => setForm({ ...form, paket: e.target.value })}
                                className={`w-full px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 ${bgInput}`}>
                                <option value="">-- Pilih Paket --</option>
                                <option value="Service Ringan">Service Ringan - Rp 50.000</option>
                                <option value="Service Sedang">Service Sedang - Rp 150.000</option>
                                <option value="Service Berat">Service Berat - Rp 300.000</option>
                            </select>
                        </div>

                        <button onClick={handleSubmit} disabled={loading}
                            className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-blue-800 text-white py-3 rounded-full font-semibold transition">
                            {loading ? "Mengirim..." : "Kirim Booking 🚀"}
                        </button>
                    </div>
                )}
            </section>

            <Footer />
        </div>
    );
}

export default Service;