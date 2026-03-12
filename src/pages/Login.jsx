import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

function Login() {
    const [form, setForm] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();
    const { isDark } = useTheme();

    const bg = isDark ? "bg-gray-950 text-white" : "bg-gray-50 text-gray-800";
    const bgCard = isDark ? "bg-gray-900" : "bg-white border border-gray-200";
    const bgInput = isDark ? "bg-gray-800 text-white placeholder-gray-500" : "bg-gray-100 text-gray-800 placeholder-gray-400";
    const textMuted = isDark ? "text-gray-400" : "text-gray-500";

    const handleLogin = () => {
        setError("");
        if (!form.email || !form.password) {
            setError("Harap isi semua field!");
            return;
        }

        setLoading(true);

        // Simulasi login (nanti diganti API)
        setTimeout(() => {
            // Cek akun dari localStorage (register sebelumnya)
            const akun = JSON.parse(localStorage.getItem("akun_register") || "[]");
            const cocok = akun.find((a) => a.email === form.email && a.password === form.password);

            // Akun demo bawaan
            const demo = { email: "demo@techstore.com", password: "demo123", nama: "Demo User" };

            if (cocok) {
                login({ nama: cocok.nama, email: cocok.email });
                navigate("/");
            } else if (form.email === demo.email && form.password === demo.password) {
                login({ nama: demo.nama, email: demo.email });
                navigate("/");
            } else {
                setError("Email atau password salah!");
            }
            setLoading(false);
        }, 800);
    };

    return (
        <div className={`min-h-screen ${bg} flex items-center justify-center px-4`}>
            <div className={`${bgCard} rounded-2xl p-8 w-full max-w-md shadow-xl`}>

                {/* Logo */}
                <div className="text-center mb-8">
                    <h1 onClick={() => navigate("/")} className="text-3xl font-bold text-blue-500 cursor-pointer mb-1">💻 TechStore</h1>
                    <p className={textMuted}>Masuk ke akun kamu</p>
                </div>

                {/* Error */}
                {error && (
                    <div className="bg-red-900 border border-red-500 text-red-300 px-4 py-3 rounded-lg text-sm mb-4">
                        ⚠️ {error}
                    </div>
                )}

                {/* Form */}
                <div className="space-y-4">
                    <div>
                        <label className={`text-sm ${textMuted} mb-1 block`}>Email</label>
                        <input
                            type="email"
                            placeholder="contoh@email.com"
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                            className={`w-full px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 ${bgInput}`}
                        />
                    </div>
                    <div>
                        <label className={`text-sm ${textMuted} mb-1 block`}>Password</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={form.password}
                            onChange={(e) => setForm({ ...form, password: e.target.value })}
                            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                            className={`w-full px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 ${bgInput}`}
                        />
                    </div>

                    <button
                        onClick={handleLogin}
                        disabled={loading}
                        className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-blue-800 text-white py-3 rounded-full font-semibold transition"
                    >
                        {loading ? "Memuat..." : "Masuk 🚀"}
                    </button>
                </div>

                {/* Demo account */}
                <div className={`mt-4 p-3 rounded-lg text-xs ${isDark ? "bg-gray-800" : "bg-gray-100"} ${textMuted}`}>
                    <p className="font-semibold mb-1">🧪 Akun Demo:</p>
                    <p>Email: demo@techstore.com</p>
                    <p>Password: demo123</p>
                </div>

                {/* Register link */}
                <p className={`text-center text-sm mt-6 ${textMuted}`}>
                    Belum punya akun?{" "}
                    <button onClick={() => navigate("/register")} className="text-blue-500 underline hover:underline font-semibold">
                        Daftar sekarang
                    </button>
                    {" "}atau{" "} 
                    <button onClick={() => navigate("/")} className="text-blue-500 underline hover:underline font-semibold">
                        tetap logout
                    </button>
                </p>

            </div>
        </div>
    );
}

export default Login;