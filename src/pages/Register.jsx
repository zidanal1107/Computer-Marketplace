import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

function Register() {
    const [form, setForm] = useState({ nama: "", email: "", password: "", konfirmasi: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();
    const { isDark } = useTheme();

    const bg = isDark ? "bg-gray-950 text-white" : "bg-gray-50 text-gray-800";
    const bgCard = isDark ? "bg-gray-900" : "bg-white border border-gray-200";
    const bgInput = isDark ? "bg-gray-800 text-white placeholder-gray-500" : "bg-gray-100 text-gray-800 placeholder-gray-400";
    const textMuted = isDark ? "text-gray-400" : "text-gray-500";

    const handleRegister = () => {
        setError("");
        if (!form.nama || !form.email || !form.password || !form.konfirmasi) {
            setError("Harap isi semua field!");
            return;
        }
        if (form.password.length < 6) {
            setError("Password minimal 6 karakter!");
            return;
        }
        if (form.password !== form.konfirmasi) {
            setError("Password dan konfirmasi tidak cocok!");
            return;
        }

        setLoading(true);

        setTimeout(() => {
            // Simpan akun ke localStorage
            const akun = JSON.parse(localStorage.getItem("akun_register") || "[]");
            const sudahAda = akun.find((a) => a.email === form.email);
            if (sudahAda) {
                setError("Email sudah terdaftar!");
                setLoading(false);
                return;
            }
            akun.push({ nama: form.nama, email: form.email, password: form.password });
            localStorage.setItem("akun_register", JSON.stringify(akun));

            // Langsung login
            login({ nama: form.nama, email: form.email });
            navigate("/");
            setLoading(false);
        }, 800);
    };

    return (
        <div className={`min-h-screen ${bg} flex items-center justify-center px-4`}>
            <div className={`${bgCard} rounded-2xl p-8 w-full max-w-md shadow-xl`}>

                {/* Logo */}
                <div className="text-center mb-8">
                    <h1 onClick={() => navigate("/")} className="text-3xl font-bold text-blue-500 cursor-pointer mb-1">💻 TechStore</h1>
                    <p className={textMuted}>Buat akun baru</p>
                </div>

                {/* Error */}
                {error && (
                    <div className="bg-red-900 border border-red-500 text-red-300 px-4 py-3 rounded-lg text-sm mb-4">
                        ⚠️ {error}
                    </div>
                )}

                {/* Form */}
                <div className="space-y-4">
                    {[
                        { label: "Nama Lengkap", key: "nama", type: "text", placeholder: "Contoh: Budi Santoso" },
                        { label: "Email", key: "email", type: "email", placeholder: "contoh@email.com" },
                        { label: "Password", key: "password", type: "password", placeholder: "Minimal 6 karakter" },
                        { label: "Konfirmasi Password", key: "konfirmasi", type: "password", placeholder: "Ulangi password" },
                    ].map((field, i) => (
                        <div key={i}>
                            <label className={`text-sm ${textMuted} mb-1 block`}>{field.label}</label>
                            <input
                                type={field.type}
                                placeholder={field.placeholder}
                                value={form[field.key]}
                                onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                                onKeyDown={(e) => e.key === "Enter" && handleRegister()}
                                className={`w-full px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 ${bgInput}`}
                            />
                        </div>
                    ))}

                    <button
                        onClick={handleRegister}
                        disabled={loading}
                        className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-blue-800 text-white py-3 rounded-full font-semibold transition"
                    >
                        {loading ? "Memuat..." : "Daftar Sekarang 🚀"}
                    </button>
                </div>

                {/* Login link */}
                <p className={`text-center text-sm mt-6 ${textMuted}`}>
                    Sudah punya akun?{" "}
                    <button onClick={() => navigate("/login")} className="text-blue-500 hover:underline font-semibold">
                        Masuk di sini
                    </button>
                </p>

            </div>
        </div>
    );
}

export default Register;