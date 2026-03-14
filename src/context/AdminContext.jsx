import { createContext, useContext, useState, useEffect } from "react";
import API_URL from "../config/api";

const AdminContext = createContext();

export function AdminProvider({ children }) {
    const [produk, setProduk] = useState([]);
    const [semuaPesanan, setSemuaPesanan] = useState([]);
    const [semuaBooking, setSemuaBooking] = useState([]);
    const [pengguna, setPengguna] = useState([]);
    const [pengeluaran, setPengeluaran] = useState([]);
    const [loading, setLoading] = useState(false);
    const [laporan, setLaporan] = useState({
        totalPemasukan: 0,
        totalPemasuklanProduk: 0,
        totalPemasuklanService: 0,
        totalPengeluaran: 0,
        hpp: 0,
        labaKotor: 0,
        labaBersih: 0,
    });
    const [adminToken, setAdminToken] = useState(() => localStorage.getItem("admin_token") || null);

    const authHeader = { Authorization: `Bearer ${adminToken}` };

    // ── PRODUK ──
    const fetchProduk = async () => {
        try {
            const res = await fetch(`${API_URL}/produk`);
            const data = await res.json();
            setProduk(data);
        } catch (err) { console.error(err); }
    };

    const tambahProduk = async (p) => {
        try {
            await fetch(`${API_URL}/produk`, {
                method: "POST",
                headers: { "Content-Type": "application/json", ...authHeader },
                body: JSON.stringify(p),
            });
            fetchProduk();
        } catch (err) { console.error(err); }
    };

    const editProduk = async (id, data) => {
        try {
            await fetch(`${API_URL}/produk/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json", ...authHeader },
                body: JSON.stringify(data),
            });
            fetchProduk();
        } catch (err) { console.error(err); }
    };

    const hapusProduk = async (id) => {
        try {
            await fetch(`${API_URL}/produk/${id}`, {
                method: "DELETE",
                headers: authHeader,
            });
            fetchProduk();
        } catch (err) { console.error(err); }
    };

    // ── PESANAN ──
    const fetchPesanan = async () => {
        if (!adminToken) return;
        try {
            const res = await fetch(`${API_URL}/pesanan/semua`, { headers: authHeader });
            const data = await res.json();
            setSemuaPesanan(Array.isArray(data) ? data : []);
        } catch (err) { console.error(err); }
    };

    const updateStatusPesanan = async (id, status) => {
        try {
            await fetch(`${API_URL}/pesanan/${id}/status`, {
                method: "PUT",
                headers: { "Content-Type": "application/json", ...authHeader },
                body: JSON.stringify({ status }),
            });
            fetchPesanan();
            fetchLaporan();
        } catch (err) { console.error(err); }
    };

    // ── BOOKING ──
    const fetchBooking = async () => {
        if (!adminToken) return;
        try {
            const res = await fetch(`${API_URL}/booking/semua`, { headers: authHeader });
            const data = await res.json();
            setSemuaBooking(Array.isArray(data) ? data : []);
        } catch (err) { console.error(err); }
    };

    const updateStatusBooking = async (id, status) => {
        try {
            await fetch(`${API_URL}/booking/${id}/status`, {
                method: "PUT",
                headers: { "Content-Type": "application/json", ...authHeader },
                body: JSON.stringify({ status }),
            });
            fetchBooking();
            fetchLaporan(); // ← refresh keuangan otomatis
        } catch (err) { console.error(err); }
    };

    const hapusBooking = async (id) => {
        try {
            await fetch(`${API_URL}/booking/${id}`, {
                method: "DELETE",
                headers: authHeader,
            });
            fetchBooking();
            fetchLaporan();
        } catch (err) { console.error(err); }
    };

    // ── PENGGUNA ──
    const fetchPengguna = async () => {
        if (!adminToken) return;
        try {
            const res = await fetch(`${API_URL}/auth/users`, { headers: authHeader });
            const data = await res.json();
            setPengguna(Array.isArray(data) ? data : []);
        } catch (err) { console.error(err); }
    };

    const hapusPengguna = async (id) => {
        try {
            await fetch(`${API_URL}/auth/users/${id}`, {
                method: "DELETE",
                headers: authHeader,
            });
            fetchPengguna();
        } catch (err) { console.error(err); }
    };

    // ── PENGELUARAN ──
    const fetchPengeluaran = async () => {
        if (!adminToken) return;
        try {
            const res = await fetch(`${API_URL}/keuangan/pengeluaran`, { headers: authHeader });
            const data = await res.json();
            setPengeluaran(Array.isArray(data) ? data : []);
        } catch (err) { console.error(err); }
    };

    const tambahPengeluaran = async (data) => {
        try {
            await fetch(`${API_URL}/keuangan/pengeluaran`, {
                method: "POST",
                headers: { "Content-Type": "application/json", ...authHeader },
                body: JSON.stringify(data),
            });
            fetchPengeluaran();
            fetchLaporan();
        } catch (err) { console.error(err); }
    };

    const hapusPengeluaran = async (id) => {
        try {
            await fetch(`${API_URL}/keuangan/pengeluaran/${id}`, {
                method: "DELETE",
                headers: authHeader,
            });
            fetchPengeluaran();
            fetchLaporan();
        } catch (err) { console.error(err); }
    };

    // ── KEUANGAN ──
    const fetchLaporan = async () => {
        if (!adminToken) return;
        try {
            const res = await fetch(`${API_URL}/keuangan/laporan`, { headers: authHeader });
            const data = await res.json();
            setLaporan({
                totalPemasukan: data.totalPemasukan || 0,
                totalPemasuklanProduk: data.totalPemasuklanProduk || 0,
                totalPemasuklanService: data.totalPemasuklanService || 0,
                totalPengeluaran: data.totalPengeluaran || 0,
                hpp: data.hpp || 0,
                labaKotor: data.labaKotor || 0,
                labaBersih: data.labaBersih || 0,
            });
        } catch (err) { console.error(err); }
    };

    // ── LOGIN ADMIN ──
    const loginAdmin = async (email, password) => {
        const res = await fetch(`${API_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        if (data.user.role !== "admin") throw new Error("Akun ini bukan admin!");
        setAdminToken(data.token);
        localStorage.setItem("admin_token", data.token);
        return data;
    };

    const logoutAdmin = () => {
        setAdminToken(null);
        localStorage.removeItem("admin_token");
        setProduk([]);
        setSemuaPesanan([]);
        setSemuaBooking([]);
        setPengguna([]);
        setPengeluaran([]);
        setLaporan({
            totalPemasukan: 0,
            totalPemasuklanProduk: 0,
            totalPemasuklanService: 0,
            totalPengeluaran: 0,
            hpp: 0,
            labaKotor: 0,
            labaBersih: 0,
        });
    };

    // Fetch semua data saat adminToken tersedia
    useEffect(() => {
        if (adminToken) {
            fetchProduk();
            fetchPesanan();
            fetchBooking();
            fetchPengguna();
            fetchPengeluaran();
            fetchLaporan();
        }
    }, [adminToken]);

    return (
        <AdminContext.Provider value={{
            adminToken, loginAdmin, logoutAdmin, loading,
            produk, tambahProduk, editProduk, hapusProduk, fetchProduk,
            semuaPesanan, updateStatusPesanan, fetchPesanan,
            semuaBooking, updateStatusBooking, hapusBooking, fetchBooking,
            pengguna, hapusPengguna, fetchPengguna,
            pengeluaran, tambahPengeluaran, hapusPengeluaran,
            totalPemasukan: laporan.totalPemasukan,
            totalPemasuklanProduk: laporan.totalPemasuklanProduk,
            totalPemasuklanService: laporan.totalPemasuklanService,
            totalPengeluaran: laporan.totalPengeluaran,
            hpp: laporan.hpp,
            labaKotor: laporan.labaKotor,
            labaBersih: laporan.labaBersih,
            fetchLaporan,
        }}>
            {children}
        </AdminContext.Provider>
    );
}

export function useAdmin() {
    return useContext(AdminContext);
}