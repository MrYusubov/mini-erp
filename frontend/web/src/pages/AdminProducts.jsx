import React, { useEffect, useState, useCallback, useRef } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';
import { AgGridReact } from 'ag-grid-react';
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { Shield, Plus, LogOut, Download, Package, Edit, Trash2, X } from 'lucide-react';

ModuleRegistry.registerModules([AllCommunityModule]);

export default function AdminProducts() {
    const [products, setProducts] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [form, setForm] = useState({ name: '', sku: '', price: 0, qty_in_stock: 0 });
    const gridRef = useRef(null);
    const nav = useNavigate();

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = useCallback(() => {
        api
            .get('/api/products/')
            .then((r) => setProducts(r.data))
            .catch((e) => {
                if (e.response && e.response.status === 401) nav('/admin/login');
            });
    }, [nav]);

    function logout() {
        localStorage.removeItem('admin_token');
        nav('/admin');
    }

    async function submit(e) {
        e.preventDefault();
        try {
            if (editingProduct) {
                const r = await api.put(`/api/products/${editingProduct.id}`, form);
                setProducts((prev) =>
                    prev.map((p) => (p.id === editingProduct.id ? r.data : p))
                );
            } else {
                const r = await api.post('/api/products/', form);
                setProducts((prev) => [r.data, ...prev]);
            }
            resetForm();
        } catch (err) {
            console.error('Save failed:', err);
        }
    }

    async function remove(id) {
        if (!window.confirm('Delete this product?')) return;
        try {
            await api.delete(`/api/products/${id}`);
            setProducts((prev) => prev.filter((p) => p.id !== id));
        } catch (err) {
            console.error('Delete failed:', err);
        }
    }

    function editProduct(p) {
        setEditingProduct(p);
        setForm({ name: p.name, sku: p.sku, price: p.price, qty_in_stock: p.qty_in_stock });
        setShowForm(true);
    }

    function resetForm() {
        setForm({ name: '', sku: '', price: 0, qty_in_stock: 0 });
        setEditingProduct(null);
        setShowForm(false);
    }

    async function exportToExcel() {
        try {
            const response = await api.get('/api/products/');
            const data = response.data;

            if (!data || !data.length) {
                return;
            }

            const worksheet = XLSX.utils.json_to_sheet(
                data.map((item) => ({
                    ID: item.id,
                    Name: item.name,
                    SKU: item.sku,
                    Price: item.price,
                    Stock: item.qty_in_stock,
                }))
            );

            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Products');

            const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
            const blob = new Blob([excelBuffer], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            });

            saveAs(blob, `products_${new Date().toISOString().split('T')[0]}.xlsx`);
        } catch (error) {
            console.error('Failed to export Excel:', error);
        }
    }

    const columns = [
        { 
            headerName: 'ID', 
            field: 'id', 
            flex: 0.5,
            cellStyle: { color: '#94a3b8' }
        },
        { 
            headerName: 'Name', 
            field: 'name', 
            flex: 1.5,
            cellStyle: { fontWeight: '500' }
        },
        { 
            headerName: 'SKU', 
            field: 'sku', 
            flex: 1,
            cellStyle: { color: '#64748b' }
        },
        { 
            headerName: 'Price', 
            field: 'price', 
            flex: 1, 
            valueFormatter: (params) => `$${params.value.toFixed(2)}`,
            cellStyle: { color: '#22c55e', fontWeight: '600' }
        },
        { 
            headerName: 'Stock', 
            field: 'qty_in_stock', 
            flex: 1,
            cellStyle: (params) => ({
                color: params.value < 10 ? '#ef4444' : '#22c55e',
                fontWeight: '600'
            })
        },
        {
            headerName: 'Actions',
            field: 'id',
            suppressSizeToFit: true,
            width: 200,
            cellRenderer: (params) => {
                const handleEdit = () => editProduct(params.data);
                const handleDelete = () => remove(params.data.id);

                return (
                    <div className="flex items-center gap-2 h-full">
                        <button
                            onClick={handleEdit}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg transition-all duration-200 flex items-center gap-1 text-sm font-medium"
                        >
                            <Edit className="w-3.5 h-3.5" />
                            Edit
                        </button>
                        <button
                            onClick={handleDelete}
                            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg transition-all duration-200 flex items-center gap-1 text-sm font-medium"
                        >
                            <Trash2 className="w-3.5 h-3.5" />
                            Delete
                        </button>
                    </div>
                );
            },
            suppressColumnsToolPanel: true,
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px]"></div>
            <div className="absolute top-0 right-0 w-96 h-96 bg-red-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse" style={{ animationDelay: '2s' }}></div>

            <div className="relative z-10 p-6">
                <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-700/50 p-6 mb-6">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                                <Shield className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-white">Admin Panel</h2>
                                <p className="text-slate-400 text-sm">Product Management</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setShowForm(true)}
                                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-4 py-2.5 rounded-xl transition-all duration-200 flex items-center gap-2 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                            >
                                <Plus className="w-5 h-5" />
                                New Product
                            </button>
                            <button
                                onClick={exportToExcel}
                                className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2.5 rounded-xl transition-all duration-200 flex items-center gap-2 font-medium"
                            >
                                <Download className="w-5 h-5" />
                                Excel
                            </button>
                            <button
                                onClick={logout}
                                className="bg-red-600/20 hover:bg-red-600/30 border border-red-500/30 text-red-400 px-4 py-2.5 rounded-xl transition-all duration-200 flex items-center gap-2 font-medium"
                            >
                                <LogOut className="w-5 h-5" />
                                Logout
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mt-6">
                        <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700/50">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-blue-600/20 rounded-lg flex items-center justify-center">
                                    <Package className="w-5 h-5 text-blue-400" />
                                </div>
                                <div>
                                    <p className="text-slate-400 text-sm">Total Products</p>
                                    <p className="text-white text-2xl font-bold">{products.length}</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700/50">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-green-600/20 rounded-lg flex items-center justify-center">
                                    <Package className="w-5 h-5 text-green-400" />
                                </div>
                                <div>
                                    <p className="text-slate-400 text-sm">In Stock</p>
                                    <p className="text-white text-2xl font-bold">
                                        {products.filter(p => p.qty_in_stock > 0).length}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700/50">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-red-600/20 rounded-lg flex items-center justify-center">
                                    <Package className="w-5 h-5 text-red-400" />
                                </div>
                                <div>
                                    <p className="text-slate-400 text-sm">Low Stock</p>
                                    <p className="text-white text-2xl font-bold">
                                        {products.filter(p => p.qty_in_stock < 10).length}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-700/50 p-6">
                    <div className="ag-theme-alpine-dark" style={{ height: 500, width: '100%' }}>
                        <AgGridReact
                            ref={gridRef}
                            rowData={products}
                            columnDefs={columns}
                            pagination={true}
                            paginationPageSize={10}
                            domLayout="normal"
                            rowHeight={50}
                            headerHeight={50}
                        />
                    </div>
                </div>
            </div>

            {showForm && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
                    <div className="bg-slate-800 rounded-2xl shadow-2xl w-full max-w-lg border border-slate-700 relative">
                        <div className="bg-gradient-to-r from-red-600 to-orange-600 rounded-t-2xl p-6 flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                                    <Package className="w-5 h-5 text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-white">
                                    {editingProduct ? 'Update Product' : 'Add New Product'}
                                </h3>
                            </div>
                            <button
                                onClick={resetForm}
                                className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center transition-colors"
                            >
                                <X className="w-5 h-5 text-white" />
                            </button>
                        </div>

                        <form onSubmit={submit} className="p-6 space-y-5">
                            <div>
                                <label className="block text-slate-300 text-sm font-medium mb-2">
                                    Product Name
                                </label>
                                <input
                                    placeholder="Enter product name"
                                    value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-3 px-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-slate-300 text-sm font-medium mb-2">
                                    SKU
                                </label>
                                <input
                                    placeholder="Enter SKU code"
                                    value={form.sku}
                                    onChange={(e) => setForm({ ...form, sku: e.target.value })}
                                    className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-3 px-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-slate-300 text-sm font-medium mb-2">
                                        Price ($)
                                    </label>
                                    <input
                                        placeholder="0.00"
                                        type="number"
                                        step="0.01"
                                        value={form.price}
                                        onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                                        className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-3 px-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-slate-300 text-sm font-medium mb-2">
                                        Stock Quantity
                                    </label>
                                    <input
                                        placeholder="0"
                                        type="number"
                                        value={form.qty_in_stock}
                                        onChange={(e) => setForm({ ...form, qty_in_stock: Number(e.target.value) })}
                                        className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-3 px-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="px-6 py-2.5 bg-slate-700 hover:bg-slate-600 text-white rounded-xl transition-all duration-200 font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2.5 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white rounded-xl transition-all duration-200 font-medium shadow-lg"
                                >
                                    {editingProduct ? 'Update' : 'Save'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}