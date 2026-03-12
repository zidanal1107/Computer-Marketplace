import { createContext, useContext, useState, useEffect } from "react";
import dataProduk from "../data/produk";

const AdminContext = createContext();

export function AdminProvider({ children }) {

    // Data produk yang bisa diedit admin
    const [produk, setProduk] = useState(() => {
        const saved = localStorage.getItem("admin_produk");
        return saved ? JSON.parse(saved) : dataProduk;
    });

    // Semua pesanan dari semua user
    const [semuaPesanan, setSemuaPesanan] = useState(() => {
        const saved = localStorage.getItem("riwayat_pesanan");
        return saved ? JSON.parse(saved) : [];
    });

    // Data pengguna terdaftar
    const [pengguna, setPengguna] = useState(() => {
        const saved = localStorage.getItem("akun_register");
        return saved ? JSON.parse(saved) : [];
    });

    // Biaya operasional / pengeluaran
    const [pengeluaran, setPengeluaran] = useState(() => {
        const saved = localStorage.getItem("admin_pengeluaran");
        return saved ? JSON.parse(saved) : [
            { id: 1, nama: "Sewa Toko", jumlah: 2000000, tanggal: "1 Maret 2026", kategori: "Operasional" },
            { id: 2, nama: "Gaji Karyawan", jumlah: 5000000, tanggal: "1 Maret 2026", kategori: "SDM" },
            { id: 3, nama: "Listrik & Internet", jumlah: 800000, tanggal: "5 Maret 2026", kategori: "Operasional" },
        ];
    });

    useEffect(() => { localStorage.setItem("admin_produk", JSON.stringify(produk)); }, [produk]);
    useEffect(() => { localStorage.setItem("admin_pengeluaran", JSON.stringify(pengeluaran)); }, [pengeluaran]);

    // Sinkron pesanan dari localStorage setiap kali dibuka
    const refreshPesanan = () => {
        const saved = localStorage.getItem("riwayat_pesanan");
        setSemuaPesanan(saved ? JSON.parse(saved) : []);
    };

    // Sinkron pengguna dari localStorage
    const refreshPengguna = () => {
        const saved = localStorage.getItem("akun_register");
        setPengguna(saved ? JSON.parse(saved) : []);
    };

    // CRUD Produk
    const tambahProduk = (p) => {
        const baru = { ...p, id: Date.now() };
        setProduk((prev) => [...prev, baru]);
    };

    const editProduk = (id, data) => {
        setProduk((prev) => prev.map((p) => p.id === id ? { ...p, ...data } : p));
    };

    const hapusProduk = (id) => {
        setProduk((prev) => prev.filter((p) => p.id !== id));
    };

    // Update status pesanan
    const updateStatusPesanan = (id, status) => {
        setSemuaPesanan((prev) => prev.map((p) => p.id === id ? { ...p, status } : p));
        const updated = semuaPesanan.map((p) => p.id === id ? { ...p, status } : p);
        localStorage.setItem("riwayat_pesanan", JSON.stringify(updated));
    };

    // CRUD Pengeluaran
    const tambahPengeluaran = (data) => {
        setPengeluaran((prev) => [...prev, { ...data, id: Date.now() }]);
    };

    const hapusPengeluaran = (id) => {
        setPengeluaran((prev) => prev.filter((p) => p.id !== id));
    };

    // Hapus pengguna
    const hapusPengguna = (email) => {
        const updated = pengguna.filter((p) => p.email !== email);
        setPengguna(updated);
        localStorage.setItem("akun_register", JSON.stringify(updated));
    };

    // Hitung statistik keuangan
    const totalPemasukan = semuaPesanan
        .filter((p) => p.status !== "Dibatalkan")
        .reduce((acc, p) => acc + p.total, 0);

    const totalPengeluaran = pengeluaran.reduce((acc, p) => acc + p.jumlah, 0);

    // HPP = estimasi 60% dari pemasukan (modal barang)
    const hpp = totalPemasukan * 0.6;
    const labaKotor = totalPemasukan - hpp;
    const labaBersih = labaKotor - totalPengeluaran;

    return (
        <AdminContext.Provider value={{
            produk, tambahProduk, editProduk, hapusProduk,
            semuaPesanan, updateStatusPesanan, refreshPesanan,
            pengguna, hapusPengguna, refreshPengguna,
            pengeluaran, tambahPengeluaran, hapusPengeluaran,
            totalPemasukan, totalPengeluaran, hpp, labaKotor, labaBersih,
        }}>
            {children}
        </AdminContext.Provider>
    );
}

export function useAdmin() {
    return useContext(AdminContext);
}