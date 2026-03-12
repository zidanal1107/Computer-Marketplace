import { useEffect, useState } from "react";
import { animate } from "animejs";

function LoadingScreen({ onFinish }) {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        // Animasi masuk
        animate(".loading-logo", {
            opacity: { from: 0, to: 1 },
            scale: { from: 0.5, to: 1 },
            duration: 600,
            easing: "easeOutExpo",
        });

        animate(".loading-bar", {
            width: ["0%", "100%"],
            duration: 1400,
            easing: "easeInOutQuad",
        });

        animate(".loading-text", {
            opacity: { from: 0, to: 1 },
            translateY: { from: 10, to: 0 },
            duration: 600,
            delay: 300,
            easing: "easeOutExpo",
        });

        // Animasi keluar setelah 2 detik
        const timer = setTimeout(() => {
            animate(".loading-screen", {
                opacity: { from: 1, to: 0 },
                duration: 500,
                easing: "easeOutExpo",
                complete: () => {
                    setVisible(false);
                    onFinish();
                },
            });
        }, 2000);

        return () => clearTimeout(timer);
    }, [onFinish]);

    if (!visible) return null;

    return (
        <div className="loading-screen fixed inset-0 bg-gray-950 flex flex-col items-center justify-center z-[9999]">

            {/* Logo */}
            <div className="loading-logo opacity-0 text-center mb-8">
                <div className="text-7xl mb-4">💻</div>
                <h1 className="text-4xl font-bold text-blue-400">TechStore</h1>
                <p className="text-gray-400 text-sm mt-2">Solusi Teknologi Terpercaya</p>
            </div>

            {/* Loading Bar */}
            <div className="w-64 bg-gray-800 rounded-full h-1.5 overflow-hidden">
                <div className="loading-bar h-full bg-blue-500 rounded-full" style={{ width: "0%" }}></div>
            </div>

            {/* Loading Text */}
            <p className="loading-text opacity-0 text-gray-500 text-sm mt-4">Memuat...</p>

        </div>
    );
}

export default LoadingScreen;