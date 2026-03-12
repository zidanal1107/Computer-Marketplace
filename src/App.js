import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Produk from "./pages/Produk.jsx";
import DetailProduk from "./pages/DetailProduk.jsx";
import Service from "./pages/Service.jsx";
import Tentang from "./pages/Tentang.jsx";
import Keranjang from "./pages/Keranjang.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Profil from "./pages/Profil.jsx";
import Admin from "./pages/Admin.jsx";
import NotFound from "./pages/NotFound.jsx";
import LoadingScreen from "./components/LoadingScreen.jsx";
import ScrollToTop from "./components/ScrollToTop.jsx";
import Wishlist from "./pages/Wishlist.jsx";

function App() {
  const [loading, setLoading] = useState(true);

  return (
    <>
      {loading && <LoadingScreen onFinish={() => setLoading(false)} />}
      {!loading && (
        // ← tambah basename agar routing benar di GitHub Pages
        <Router basename="/Computer-Marketplace">
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/produk" element={<Produk />} />
            <Route path="/produk/:id" element={<DetailProduk />} />
            <Route path="/service" element={<Service />} />
            <Route path="/tentang" element={<Tentang />} />
            <Route path="/keranjang" element={<Keranjang />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profil" element={<Profil />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      )}
    </>
  );
}

export default App;