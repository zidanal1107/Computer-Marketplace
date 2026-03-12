import { createContext, useContext, useState, useEffect } from "react";

const KeranjangContext = createContext();

export function KeranjangProvider({ children }) {
    const [keranjang, setKeranjang] = useState(() => {
        const saved = localStorage.getItem("keranjang");
        return saved ? JSON.parse(saved) : [];
    });

    const [riwayat, setRiwayat] = useState(() => {
        const saved = localStorage.getItem("riwayat_pesanan");
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem("keranjang", JSON.stringify(keranjang));
    }, [keranjang]);

    useEffect(() => {
        localStorage.setItem("riwayat_pesanan", JSON.stringify(riwayat));
    }, [riwayat]);

    const tambahKeranjang = (produk) => {
        setKeranjang((prev) => {
            const ada = prev.find((p) => p.id === produk.id);
            if (ada) return prev.map((p) => p.id === produk.id ? { ...p, qty: p.qty + 1 } : p);
            return [...prev, { ...produk, qty: 1 }];
        });
    };

    const kurangQty = (id) => {
        setKeranjang((prev) =>
            prev.map((p) => p.id === id && p.qty > 1 ? { ...p, qty: p.qty - 1 } : p)
        );
    };

    const hapusProduk = (id) => {
        setKeranjang((prev) => prev.filter((p) => p.id !== id));
    };

    const kosongkanKeranjang = () => {
        setKeranjang([]);
        localStorage.removeItem("keranjang");
    };

    const simpanPesanan = (items, total, alamat) => {
        const pesananBaru = {
            id: Date.now(),
            tanggal: new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }),
            jam: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
            items,
            total,
            alamat,
            status: "Diproses", // Diproses → Dikirim → Selesai
        };
        setRiwayat((prev) => [pesananBaru, ...prev]);
    };

    const konfirmasiTerima = (id) => {
        setRiwayat((prev) =>
            prev.map((p) => p.id === id ? { ...p, status: "Selesai" } : p)
        );
    };

    const totalItem = keranjang.reduce((acc, p) => acc + p.qty, 0);
    const totalHarga = keranjang.reduce((acc, p) => acc + p.harga * p.qty, 0);

    return (
        <KeranjangContext.Provider value={{
            keranjang, tambahKeranjang, kurangQty, hapusProduk,
            kosongkanKeranjang, totalItem, totalHarga,
            riwayat, simpanPesanan, konfirmasiTerima
        }}>
            {children}
        </KeranjangContext.Provider>
    );
}

export function useKeranjang() {
    return useContext(KeranjangContext);
}