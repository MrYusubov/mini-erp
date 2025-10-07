import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api';
import { 
    ArrowLeft, 
    Package, 
    DollarSign, 
    Tag, 
    Box, 
    ShoppingCart, 
    Heart, 
    Share2, 
    TrendingUp,
    CheckCircle,
    XCircle,
    AlertCircle,
    ShoppingBag,
    Star
} from 'lucide-react';

export default function ProductDetail() {
    const { slug } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        api.get(`api/products/p/${slug}`)
            .then(r => {
                setProduct(r.data);
                setLoading(false);
            })
            .catch(() => {
                setLoading(false);
            });
    }, [slug]);

    const handleAddToCart = () => {
        const cart = [{
            ...product,
            quantity: quantity
        }];
        const totalAmount = (product.price * quantity).toFixed(2);
        navigate('/orders/new', { state: { cart, totalAmount } });
    };

    const handleQuantityChange = (change) => {
        const newQty = quantity + change;
        if (newQty >= 1 && newQty <= product.qty_in_stock) {
            setQuantity(newQty);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-500 flex items-center justify-center">
                <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-8">
                    <div className="flex items-center gap-3">
                        <svg className="animate-spin h-8 w-8 text-white" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span className="text-white text-xl font-medium">Loading product...</span>
                    </div>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-500 flex items-center justify-center p-4">
                <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-8 text-center">
                    <XCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-white mb-2">Product Not Found</h2>
                    <p className="text-white/70 mb-6">The product you're looking for doesn't exist.</p>
                    <Link
                        to="/"
                        className="bg-gradient-to-r from-purple-500 to-cyan-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-xl transition-all inline-flex items-center gap-2"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Back to Products
                    </Link>
                </div>
            </div>
        );
    }

    const stockStatus = product.qty_in_stock > 10 ? 'in-stock' : product.qty_in_stock > 0 ? 'low-stock' : 'out-of-stock';

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-500 relative overflow-hidden">
            {/* Animated Background */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>

            {/* Header */}
            <header className="relative z-10 bg-white/10 backdrop-blur-xl border-b border-white/20 shadow-lg">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex justify-between items-center">
                        <button
                            onClick={() => navigate(-1)}
                            className="flex items-center gap-2 text-white hover:text-cyan-300 transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            <span className="font-medium">Back to Products</span>
                        </button>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-cyan-400 rounded-xl flex items-center justify-center shadow-lg">
                                <ShoppingBag className="w-6 h-6 text-white" />
                            </div>
                            <h1 className="text-xl font-bold text-white">My Shop</h1>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="relative z-10 max-w-7xl mx-auto px-6 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Product Image Section */}
                    <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-8">
                        <div className="aspect-square bg-gradient-to-br from-purple-500/20 to-cyan-500/20 rounded-2xl flex items-center justify-center mb-6 relative overflow-hidden">
                            <Package className="w-32 h-32 text-white/50" />
                            {stockStatus === 'out-of-stock' && (
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                    <span className="bg-red-500 text-white px-6 py-3 rounded-xl font-bold text-xl transform -rotate-12">
                                        OUT OF STOCK
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Quick Actions */}
                        <div className="grid grid-cols-3 gap-3">
                            <button className="bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-white p-3 rounded-xl transition-all flex items-center justify-center gap-2">
                                <Heart className="w-5 h-5" />
                                <span className="text-sm font-medium">Save</span>
                            </button>
                            <button className="bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-white p-3 rounded-xl transition-all flex items-center justify-center gap-2">
                                <Share2 className="w-5 h-5" />
                                <span className="text-sm font-medium">Share</span>
                            </button>
                            <button className="bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-white p-3 rounded-xl transition-all flex items-center justify-center gap-2">
                                <TrendingUp className="w-5 h-5" />
                                <span className="text-sm font-medium">Compare</span>
                            </button>
                        </div>
                    </div>

                    {/* Product Info Section */}
                    <div className="space-y-6">
                        {/* Product Header */}
                        <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-8">
                            {/* Stock Badge */}
                            {stockStatus === 'in-stock' && (
                                <div className="inline-flex items-center gap-2 bg-green-500/20 border border-green-400/30 text-green-300 px-4 py-2 rounded-full mb-4">
                                    <CheckCircle className="w-4 h-4" />
                                    <span className="text-sm font-semibold">In Stock</span>
                                </div>
                            )}
                            {stockStatus === 'low-stock' && (
                                <div className="inline-flex items-center gap-2 bg-yellow-500/20 border border-yellow-400/30 text-yellow-300 px-4 py-2 rounded-full mb-4">
                                    <AlertCircle className="w-4 h-4" />
                                    <span className="text-sm font-semibold">Low Stock - Only {product.qty_in_stock} left!</span>
                                </div>
                            )}
                            {stockStatus === 'out-of-stock' && (
                                <div className="inline-flex items-center gap-2 bg-red-500/20 border border-red-400/30 text-red-300 px-4 py-2 rounded-full mb-4">
                                    <XCircle className="w-4 h-4" />
                                    <span className="text-sm font-semibold">Out of Stock</span>
                                </div>
                            )}

                            <h1 className="text-4xl font-bold text-white mb-4 leading-tight">
                                {product.name}
                            </h1>

                            {/* Rating */}
                            <div className="flex items-center gap-2 mb-6">
                                <div className="flex">
                                    {[1, 2, 3, 4, 5].map(star => (
                                        <Star key={star} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                                    ))}
                                </div>
                                <span className="text-white/70 text-sm">(4.8 - 124 reviews)</span>
                            </div>

                            {/* Price */}
                            <div className="bg-white/5 rounded-2xl p-6 mb-6">
                                <div className="flex items-baseline gap-2">
                                    <span className="text-5xl font-bold text-white">
                                        ${product.price}
                                    </span>
                                    <span className="text-white/50 text-lg line-through">
                                        ${(product.price * 1.3).toFixed(2)}
                                    </span>
                                    <span className="bg-green-500/20 border border-green-400/30 text-green-300 px-3 py-1 rounded-full text-sm font-semibold">
                                        30% OFF
                                    </span>
                                </div>
                            </div>

                            {/* SKU Info */}
                            <div className="flex items-center gap-2 text-white/70 mb-6">
                                <Tag className="w-4 h-4" />
                                <span className="text-sm">SKU: <span className="font-mono text-white">{product.sku}</span></span>
                            </div>

                            {/* Quantity Selector */}
                            {product.qty_in_stock > 0 && (
                                <div className="mb-6">
                                    <label className="block text-white font-medium mb-3">Quantity</label>
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center bg-white/10 border border-white/20 rounded-xl overflow-hidden">
                                            <button
                                                onClick={() => handleQuantityChange(-1)}
                                                disabled={quantity <= 1}
                                                className="px-5 py-3 text-white hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-bold text-xl"
                                            >
                                                −
                                            </button>
                                            <span className="px-8 py-3 text-white font-bold text-xl">
                                                {quantity}
                                            </span>
                                            <button
                                                onClick={() => handleQuantityChange(1)}
                                                disabled={quantity >= product.qty_in_stock}
                                                className="px-5 py-3 text-white hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-bold text-xl"
                                            >
                                                +
                                            </button>
                                        </div>
                                        <span className="text-white/70 text-sm">
                                            {product.qty_in_stock} available
                                        </span>
                                    </div>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex gap-3">
                                <button
                                    onClick={handleAddToCart}
                                    disabled={product.qty_in_stock === 0}
                                    className="flex-1 bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    <ShoppingCart className="w-5 h-5" />
                                    {product.qty_in_stock > 0 ? 'Buy Now' : 'Out of Stock'}
                                </button>
                                <button className="bg-white/10 hover:bg-white/20 border border-white/20 text-white p-4 rounded-xl transition-all">
                                    <Heart className="w-6 h-6" />
                                </button>
                            </div>
                        </div>

                        {/* Additional Info */}
                        <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-8">
                            <h3 className="text-xl font-bold text-white mb-4">Product Details</h3>
                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <Box className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-white/70 text-sm">Stock Status</p>
                                        <p className="text-white font-semibold">
                                            {product.qty_in_stock} units available
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <DollarSign className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-white/70 text-sm">Price Range</p>
                                        <p className="text-white font-semibold">Premium Quality Product</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Package className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-white/70 text-sm">Shipping</p>
                                        <p className="text-white font-semibold">Free shipping on orders over $50</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}