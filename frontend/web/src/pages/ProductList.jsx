import React, { useState, useEffect } from 'react'
import api from '../api'
import { Link, useNavigate } from 'react-router-dom'
import Pagination from '../components/Pagination'

export default function ProductList() {
    const [products, setProducts] = useState([])
    const [q, setQ] = useState('')
    const [page, setPage] = useState(1)
    const [pageSize] = useState(10)
    const navigate = useNavigate()

    useEffect(() => {
        let cancelled = false
        api.get(`/api/products/?search=${encodeURIComponent(q)}&page=${page}&page_size=${pageSize}`)
            .then(r => { if (!cancelled) setProducts(r.data) })
            .catch(() => { })
        return () => cancelled = true
    }, [q, page])

    const handleLogout = () => {
        localStorage.removeItem("token")
        api.defaults.headers["Authorization"] = ""
        navigate("/login")
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <header className="bg-white shadow p-4 flex justify-between items-center">
                <h1 className="text-xl font-bold text-blue-600">My Shop</h1>
                <button
                    onClick={handleLogout}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                    Logout
                </button>
            </header>

            <main className="max-w-5xl mx-auto p-6">
                <div className="flex items-center mb-4">
                    <input
                        className="border p-2 rounded w-full md:w-1/2"
                        placeholder="Search by name or sku"
                        value={q}
                        onChange={e => setQ(e.target.value)}
                    />
                </div>

                {products.length === 0 ? (
                    <p className="text-gray-500">No products found.</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {products.map(p => (
                            <div key={p.id} className="bg-white p-4 rounded shadow">
                                <Link to={`/p/${p.slug}`} className="text-lg font-medium text-blue-600 hover:underline">
                                    {p.name}
                                </Link>
                                <p className="text-sm">SKU: {p.sku}</p>
                                <p className="mt-2">Price: ${p.price} — Stock: {p.qty_in_stock}</p>
                            </div>
                        ))}
                    </div>
                )}

                <div className="mt-6">
                    <Pagination page={page} setPage={setPage} />
                </div>
            </main>
        </div>
    )
}
