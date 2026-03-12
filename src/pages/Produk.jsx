import { useEffect, useState } from "react";
import { animate, stagger } from "animejs";
import { useNavigate } from "react-router-dom"; // ← tambah useNavigate
import { useKeranjang } from "../context/KeranjangContext";
import { useTheme } from "../context/ThemeContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import dataProduk from "../data/produk";

const kategoriList = ["Semua", "Laptop", "Komputer", "Hardware", "Aksesoris"];

function Produk() {
    const [kategoriAktif, setKategoriAktif] = useState("Semua");
    const [search, setSearch] = useState("");
    const [notif, setNotif] = useState("");
    const navigate = useNavigate(); // ← tambah navigate
    const { keranjang, tambahKeranjang } = useKeranjang();
    const { isDark } = useTheme();

    const bg = isDark ? "bg-gray-950 text-white" : "bg-gray-50 text-gray-800";
    const bgCard = isDark ? "bg-gray-800" : "bg-white border border-gray-200";
    const bgInput = isDark ? "bg-gray-800 text-white placeholder-gray-500" : "bg-white text-gray-800 placeholder-gray-400 border border-gray-300";
    const bgFilter = (aktif) => aktif ? "bg-blue-500 text-white" : isDark ? "bg-gray-800 text-gray-400 hover:bg-gray-700" : "bg-gray-200 text-gray-600 hover:bg-gray-300";
    const textMuted = isDark ? "text-gray-500" : "text-gray-400";

    const produkFilter = dataProduk.filter((p) => {
        const cocokKategori = kategoriAktif === "Semua" || p.kategori === kategoriAktif;
        const cocokSearch = p.nama.toLowerCase().includes(search.toLowerCase());
        return cocokKategori && cocokSearch;
    });

    useEffect(() => {
        animate(".product-card", {
            opacity: { from: 0, to: 1 },
            translateY: { from: 30, to: 0 },
            duration: 600,
            delay: stagger(80),
            easing: "easeOutExpo",
        });
    }, [kategoriAktif, search]);

    // Tambah ke keranjang + tampilkan notif
    const handleTambah = (e, produk) => {
        e.stopPropagation(); // ← penting! agar klik tombol tidak trigger navigasi ke detail
        tambahKeranjang(produk);
        setNotif(`✅ ${produk.nama} ditambahkan ke keranjang!`);
        setTimeout(() => setNotif(""), 2500);
    };

    const formatRupiah = (num) => "Rp " + num.toLocaleString("id-ID");

    return (
        <div className={`min-h-screen ${bg}`}>

            {/* Notif toast tambah keranjang */}
            {notif && (
                <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-green-600 text-white px-6 py-3 rounded-full shadow-lg text-sm font-semibold">
                    {notif}
                </div>
            )}

            <Navbar />

            {/* Header + Search */}
            <section className={`px-6 py-12 text-center ${isDark ? "bg-gradient-to-b from-blue-950 to-gray-950" : "bg-gradient-to-b from-blue-100 to-gray-50"}`}>
                <h1 className="text-3xl md:text-4xl font-bold mb-3">Semua <span className="text-blue-500">Produk</span></h1>
                <p className={`${textMuted} mb-6`}>Temukan laptop, komputer, dan hardware terbaik</p>
                <input
                    type="text"
                    placeholder="🔍 Cari produk..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className={`w-full max-w-md px-5 py-3 rounded-full outline-none focus:ring-2 focus:ring-blue-500 ${bgInput}`}
                />
            </section>

            {/* Filter Kategori */}
            <section className="px-6 py-6 max-w-6xl mx-auto">
                <div className="flex gap-3 flex-wrap justify-center">
                    {kategoriList.map((kat, i) => (
                        <button key={i} onClick={() => setKategoriAktif(kat)} className={`px-5 py-2 rounded-full text-sm font-semibold transition ${bgFilter(kategoriAktif === kat)}`}>
                            {kat}
                        </button>
                    ))}
                </div>
            </section>

            {/* Grid Produk */}
            <section className="px-6 pb-16 max-w-6xl mx-auto">
                {produkFilter.length === 0 ? (
                    <p className={`text-center ${textMuted} py-20`}>Produk tidak ditemukan 😕</p>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {produkFilter.map((produk, i) => {
                            const sudahAda = keranjang.find((p) => p.id === produk.id);
                            return (
                                // ← klik card → navigasi ke halaman detail produk
                                <div
                                    key={i}
                                    onClick={() => navigate(`/produk/${produk.id}`)}
                                    className={`product-card opacity-0 ${bgCard} rounded-xl p-4 hover:shadow-lg transition flex flex-col cursor-pointer`}
                                >
                                    {/* Icon produk */}
                                    <div className="text-4xl md:text-5xl text-center mb-3">{produk.icon}</div>

                                    {/* Badge kategori */}
                                    <span className="text-xs bg-blue-900 text-blue-300 px-2 py-1 rounded-full w-fit">{produk.kategori}</span>

                                    {/* Nama & spek */}
                                    <h3 className="text-sm md:text-base font-bold mt-2 mb-1">{produk.nama}</h3>
                                    <p className={`${textMuted} text-xs mb-2`}>{produk.spek}</p>
                                    <p className="text-green-500 text-xs mb-3">✅ {produk.stok}</p>

                                    {/* Harga + tombol beli */}
                                    <div className="flex justify-between items-center mt-auto">
                                        <span className="text-blue-500 font-bold text-xs md:text-sm">{formatRupiah(produk.harga)}</span>

                                        {/* ← e.stopPropagation() agar tombol tidak trigger navigasi */}
                                        <button
                                            onClick={(e) => handleTambah(e, produk)}
                                            className={`px-2 py-1 rounded-full text-xs font-semibold transition ${sudahAda ? "bg-green-600 hover:bg-green-700" : "bg-blue-500 hover:bg-blue-600"} text-white`}
                                        >
                                            {sudahAda ? `✓ ${sudahAda.qty}` : "+ Beli"}
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </section>

            <Footer />
        </div>
    );
}

export default Produk;