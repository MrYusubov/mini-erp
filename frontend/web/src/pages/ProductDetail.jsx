import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import api from '../api'


export default function ProductDetail() {
    const { slug } = useParams()
    const [product, setProduct] = useState(null)
    useEffect(() => {
        api.get(`/p/${slug}`).then(r => setProduct(r.data)).catch(() => { })
    }, [slug])
    if (!product) return <div>Loading...</div>
    return (
        <div className="bg-white p-6 rounded shadow">
            <h2 className="text-2xl font-semibold">{product.name}</h2>
            <p className="mt-2">SKU: {product.sku}</p>
            <p className="mt-2">Price: ${product.price}</p>
            <p className="mt-2">Stock: {product.qty_in_stock}</p>
        </div>
    )
}