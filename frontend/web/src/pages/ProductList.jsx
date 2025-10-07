import React, { useState, useEffect } from 'react';
import api from '../api';
import { Link, useNavigate } from 'react-router-dom';
import Pagination from '../components/Pagination';
import { Search, ShoppingBag, LogOut, Package, DollarSign, TrendingUp, Sparkles } from 'lucide-react';

export default function ProductList() {
    const [products, setProducts] = useState([]);
    const [q, setQ] = useState('');
    const [page, setPage] = useState(1);
    const [pageSize] = useState(10);
    const navigate = useNavigate();

    useEffect(() => {
        let cancelled = false;
        api.get(`/api/products/?search=${encodeURIComponent(q)}&page=${page}&page_size=${pageSize}`)
            .then(r => { if (!cancelled) setProducts(r.data); })
            .catch(() => { });
        return () => cancelled = true;
    }, [q, page]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem('admin_token');
        localStorage.removeItem('user');
        api.defaults.headers["Authorization"] = "";
        navigate("/login");
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-500 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
            <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse" style={{ animationDelay: '2s' }}></div>

            <header className="relative z-10 bg-white/10 backdrop-blur-xl border-b border-white/20 shadow-lg">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-cyan-400 rounded-xl flex items-center justify-center shadow-lg">
                                <ShoppingBag className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-white">My Shop</h1>
                                <p className="text-white/70 text-xs">Enjoy Your Shopping</p>
                            </div>
                        </div>

                        <button
                            onClick={handleLogout}
                            className="bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-white px-4 py-2 rounded-xl transition-all duration-200 flex items-center gap-2 font-medium"
                        >
                            <LogOut className="w-4 h-4" />
                            Çıkış
                        </button>
                    </div>
                </div>
            </header>

            <main className="relative z-10 max-w-7xl mx-auto px-6 py-8">
                <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 mb-8">
                    <div className="flex items-center gap-3 mb-4">
                        <Sparkles className="w-8 h-8 text-yellow-300" />
                        <h2 className="text-3xl font-bold text-white">Deals</h2>
                    </div>
                    <p className="text-white/80 mb-6">
                        Buy best deals with us
                    </p>

                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Search className="w-5 h-5 text-white/50" />
                        </div>
                        <input
                            className="w-full bg-white/10 border border-white/20 rounded-xl py-3 pl-12 pr-4 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all backdrop-blur-sm"
                            placeholder="Search by name or sku..."
                            value={q}
                            onChange={e => setQ(e.target.value)}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-5">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-purple-500/30 rounded-xl flex items-center justify-center">
                                <Package className="w-6 h-6 text-purple-200" />
                            </div>
                            <div>
                                <p className="text-white/70 text-sm">Total Product</p>
                                <p className="text-white text-2xl font-bold">{products.length}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-5">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-cyan-500/30 rounded-xl flex items-center justify-center">
                                <DollarSign className="w-6 h-6 text-cyan-200" />
                            </div>
                            <div>
                                <p className="text-white/70 text-sm">In Stock</p>
                                <p className="text-white text-2xl font-bold">
                                    {products.filter(p => p.qty_in_stock > 0).length}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-5">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-pink-500/30 rounded-xl flex items-center justify-center">
                                <TrendingUp className="w-6 h-6 text-pink-200" />
                            </div>
                            <div>
                                <p className="text-white/70 text-sm">New Products</p>
                                <p className="text-white text-2xl font-bold">{Math.min(products.length, 5)}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {products.length === 0 ? (
                    <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-12 text-center">
                        <Package className="w-16 h-16 text-white/30 mx-auto mb-4" />
                        <p className="text-white/70 text-lg">We don't found product</p>
                        <p className="text-white/50 text-sm mt-2">Please try another search type</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {products.map(p => (
                            <div
                                key={p.id}
                                className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6 hover:bg-white/20 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl group"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-cyan-400 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                        <Package className="w-6 h-6 text-white" />
                                    </div>
                                    {p.qty_in_stock > 0 ? (
                                        <span className="bg-green-500/20 border border-green-400/30 text-green-300 text-xs font-semibold px-3 py-1 rounded-full">
                                            In Stock
                                        </span>
                                    ) : (
                                        <span className="bg-red-500/20 border border-red-400/30 text-red-300 text-xs font-semibold px-3 py-1 rounded-full">
                                            Out Of Stock
                                        </span>
                                    )}
                                </div>

                                <Link
                                    to={`/p/${p.slug}`}
                                    className="block mb-3"
                                >
                                    <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-2 mb-2">
                                        {p.name}
                                    </h3>
                                </Link>

                                <p className="text-white/60 text-sm mb-4">
                                    SKU: <span className="text-white/80 font-mono">{p.sku}</span>
                                </p>

                                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                                    <div>
                                        <p className="text-white/60 text-xs mb-1">Fiyat</p>
                                        <p className="text-2xl font-bold text-white">
                                            ${p.price}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-white/60 text-xs mb-1">Stok</p>
                                        <p className={`text-xl font-bold ${p.qty_in_stock > 10 ? 'text-green-400' : p.qty_in_stock > 0 ? 'text-yellow-400' : 'text-red-400'}`}>
                                            {p.qty_in_stock}
                                        </p>
                                    </div>
                                </div>

                                <Link
                                    to={`/p/${p.slug}`}
                                    className="mt-4 w-full bg-gradient-to-r from-purple-500 to-cyan-500 text-white font-semibold py-2 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2"
                                >
                                    See Details
                                    <ShoppingBag className="w-4 h-4" />
                                </Link>
                            </div>
                        ))}
                    </div>
                )}

                <div className="mt-8 flex justify-center">
                    <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-4">
                        <Pagination page={page} setPage={setPage} />
                    </div>
                </div>
            </main>
        </div>
    );
}