import React, { useEffect, useState } from 'react'
import api from '../api'
import { useNavigate } from 'react-router-dom'

export default function AdminProducts() {
    const [products, setProducts] = useState([])
    const [showForm, setShowForm] = useState(false)
    const [form, setForm] = useState({ name: '', sku: '', price: 0, qty_in_stock: 0 })
    const nav = useNavigate()

    useEffect(() => {
        api.get('/api/products/')
            .then(r => setProducts(r.data))
            .catch(e => {
                if (e.response && e.response.status === 401) nav('/admin/login')
            })
    }, [nav])

    async function submit(e) {
        e.preventDefault()
        try {
            const r = await api.post('/api/products/', form)
            setProducts(prev => [r.data, ...prev])
            setForm({ name: '', sku: '', price: 0, qty_in_stock: 0 })
            setShowForm(false)
        } catch (err) {
            alert('Create failed: ' + (err.response?.data?.detail || err.message))
        }
    }

    async function remove(id) {
        try {
            await api.delete(`/api/products/${id}`)
            setProducts(prev => prev.filter(p => p.id !== id))
        } catch (e) {
            alert('Delete failed')
        }
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Admin — Products</h2>
                <button
                    onClick={() => setShowForm(true)}
                    className="bg-green-600 text-white px-4 py-2 rounded"
                >
                    + New Product
                </button>
            </div>

            {showForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded shadow w-full max-w-lg">
                        <h3 className="text-lg mb-4">Create New Product</h3>
                        <form className="space-y-3" onSubmit={submit}>
                            <input
                                placeholder="Name"
                                value={form.name}
                                onChange={e => setForm({ ...form, name: e.target.value })}
                                className="w-full border p-2 rounded"
                            />
                            <input
                                placeholder="SKU"
                                value={form.sku}
                                onChange={e => setForm({ ...form, sku: e.target.value })}
                                className="w-full border p-2 rounded"
                            />
                            <input
                                placeholder="Price"
                                type="number"
                                value={form.price}
                                onChange={e => setForm({ ...form, price: Number(e.target.value) })}
                                className="w-full border p-2 rounded"
                            />
                            <input
                                placeholder="Stock"
                                type="number"
                                value={form.qty_in_stock}
                                onChange={e => setForm({ ...form, qty_in_stock: Number(e.target.value) })}
                                className="w-full border p-2 rounded"
                            />

                            <div className="flex justify-end space-x-2">
                                <button
                                    type="button"
                                    onClick={() => setShowForm(false)}
                                    className="px-4 py-2 border rounded"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="bg-blue-600 text-white px-4 py-2 rounded"
                                >
                                    Save
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {products.map(p => (
                    <div key={p.id} className="bg-white p-4 rounded shadow">
                        <div className="flex justify-between">
                            <div>
                                <div className="font-semibold">{p.name}</div>
                                <div className="text-sm">SKU: {p.sku}</div>
                            </div>
                            <div className="space-x-2">
                                <button
                                    onClick={() => remove(p.id)}
                                    className="text-red-500"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                        <div className="mt-2">
                            Price: ${p.price} — Stock: {p.qty_in_stock}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
