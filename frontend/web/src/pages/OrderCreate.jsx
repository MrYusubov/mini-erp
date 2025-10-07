import React, { useState } from 'react'
import api from '../api'


export default function OrderCreate() {
    const [customerId, setCustomerId] = useState('')
    const [items, setItems] = useState([{ product_id: '', qty: 1, unit_price: 0 }])


    function addItem() { setItems(prev => [...prev, { product_id: '', qty: 1, unit_price: 0 }]) }
    function updateItem(i, key, val) { const c = [...items]; c[i][key] = val; setItems(c) }


    async function submit(e) {
        e.preventDefault()
        try {
            const payload = { customer_id: Number(customerId), status: 'NEW', items }
            await api.post('/api/orders/', payload)
            alert('Order created')
            setCustomerId('')
            setItems([{ product_id: '', qty: 1, unit_price: 0 }])
        } catch (err) { alert('Create failed: ' + (err.response?.data?.detail || err.message)) }
    }


    return (
        <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow">
            <h3 className="text-lg mb-4">Create Order</h3>
            <form onSubmit={submit} className="space-y-3">
                <input placeholder="Customer ID" value={customerId} onChange={e => setCustomerId(e.target.value)} className="border p-2 rounded w-full" />
                {items.map((it, idx) => (
                    <div key={idx} className="grid grid-cols-3 gap-2">
                        <input placeholder="Product ID" value={it.product_id} onChange={e => updateItem(idx, 'product_id', e.target.value)} className="border p-2 rounded" />
                        <input type="number" value={it.qty} onChange={e => updateItem(idx, 'qty', Number(e.target.value))} className="border p-2 rounded" />
                        <input type="number" value={it.unit_price} onChange={e => updateItem(idx, 'unit_price', Number(e.target.value))} className="border p-2 rounded" />
                    </div>
                ))}
                <div className="flex space-x-2">
                    <button type="button" onClick={addItem} className="px-3 py-1 border rounded">Add Item</button>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded">Create Order</button>
                </div>
            </form>
        </div>
    )
}