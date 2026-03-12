import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { animate } from "animejs";

function NotFound() {
    const navigate = useNavigate();

    useEffect(() => {
        animate(".not-found-content", {
            opacity: { from: 0, to: 1 },
            translateY: { from: -30, to: 0 },
            duration: 800,
            easing: "easeOutExpo",
        });
    }, []);

    return (
        <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center px-6">
            <div className="not-found-content opacity-0 text-center max-w-lg">

                {/* Angka 404 */}
                <h1 className="text-9xl font-bold text-blue-500 mb-4">404</h1>

                {/* Icon */}
                <div className="text-7xl mb-6">💻</div>

                {/* Pesan */}
                <h2 className="text-3xl font-bold mb-3">Halaman Tidak Ditemukan</h2>
                <p className="text-gray-400 mb-8">
                    Sepertinya halaman yang kamu cari tidak ada atau sudah dipindahkan. Coba kembali ke halaman utama.
                </p>

                {/* Tombol */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                        onClick={() => navigate("/")}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-full font-semibold transition"
                    >
                        🏠 Kembali ke Home
                    </button>
                    <button
                        onClick={() => navigate("/produk")}
                        className="border border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white px-8 py-3 rounded-full font-semibold transition"
                    >
                        🛒 Lihat Produk
                    </button>
                </div>

            </div>
        </div>
    );
}

export default NotFound;