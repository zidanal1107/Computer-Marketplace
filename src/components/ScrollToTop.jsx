import { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import { useLocation } from "react-router-dom";

function ScrollToTop() {
    const [visible, setVisible] = useState(false);
    const { isDark } = useTheme();
    const location = useLocation();

    // Scroll ke atas setiap ganti halaman
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location]);

    useEffect(() => {
        const handleScroll = () => {
            setVisible(window.scrollY > 300);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const scrollUp = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    if (!visible) return null;

    return (
        <button
            onClick={scrollUp}
            className={`fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full shadow-lg flex items-center justify-center text-xl transition-all ${isDark ? "bg-blue-600 hover:bg-blue-500 text-white" : "bg-blue-500 hover:bg-blue-600 text-white"}`}
            title="Kembali ke atas"
        >
            ↑
        </button>
    );
}

export default ScrollToTop;