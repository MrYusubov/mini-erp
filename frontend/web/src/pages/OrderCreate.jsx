import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../api';
import {
    CreditCard,
    Lock,
    ShoppingBag,
    ArrowLeft,
    CheckCircle,
    Calendar,
    User,
    Mail,
    MapPin,
    Phone
} from 'lucide-react';

export default function OrderCreate() {
    const location = useLocation();
    const navigate = useNavigate();
    const { cart = [], totalAmount = '0.00' } = location.state || {};

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [form, setForm] = useState({
        fullName: '',
        email: '',
        phone: '',
        address: '',
        cardNumber: '',
        cardName: '',
        expiry: '',
        cvv: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

            setTimeout(() => {
                navigate('/');
            }, 2000);
            const user = JSON.parse(localStorage.getItem('user') || '{}');

            const items = cart.map(item => ({
                product_id: item.id,
                quantity: item.quantity,
                unit_price: item.price
            }));

            await api.post('/api/orders/', {
                customer_id: user.id,
                status: 'pending',
                items: items
            });

            setSuccess(true);
            setTimeout(() => {
                navigate('/');
            }, 2000);
        
    };

    if (cart.length === 0 && !success) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-500 flex items-center justify-center p-4">
                <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-8 text-center max-w-md">
                    <ShoppingBag className="w-16 h-16 text-white/50 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-white mb-2">Your cart is empty</h2>
                    <p className="text-white/70 mb-6">Add some products before checkout</p>
                    <button
                        onClick={() => navigate('/')}
                        className="bg-gradient-to-r from-purple-500 to-cyan-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-xl transition-all inline-flex items-center gap-2"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Back to Shop
                    </button>
                </div>
            </div>
        );
    }

    if (success) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-500 flex items-center justify-center p-4">
                <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-8 text-center max-w-md">
                    <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="w-12 h-12 text-green-400" />
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-2">Payment Successful!</h2>
                    <p className="text-white/70 mb-2">Your order has been placed successfully</p>
                    <p className="text-white/50 text-sm mb-6">Redirecting to home page...</p>
                    <div className="bg-white/5 rounded-xl p-4">
                        <p className="text-white/70 text-sm mb-1">Total Paid</p>
                        <p className="text-4xl font-bold text-white">${totalAmount}</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-500 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>

            <header className="relative z-10 bg-white/10 backdrop-blur-xl border-b border-white/20 shadow-lg">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex justify-between items-center">
                        <button
                            onClick={() => navigate(-1)}
                            className="flex items-center gap-2 text-white hover:text-cyan-300 transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            <span className="font-medium">Back to Shop</span>
                        </button>
                        <div className="flex items-center gap-3">
                            <Lock className="w-5 h-5 text-green-400" />
                            <span className="text-white text-sm font-medium">Secure Checkout</span>
                        </div>
                    </div>
                </div>
            </header>

            <main className="relative z-10 max-w-6xl mx-auto px-6 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-8">
                            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                                <User className="w-6 h-6" />
                                Customer Information
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-white/80 text-sm font-medium mb-2">
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="John Doe"
                                        value={form.fullName}
                                        onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                                        className="w-full bg-white/10 border border-white/20 rounded-xl py-3 px-4 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-white/80 text-sm font-medium mb-2">
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        placeholder="john@example.com"
                                        value={form.email}
                                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                                        className="w-full bg-white/10 border border-white/20 rounded-xl py-3 px-4 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-white/80 text-sm font-medium mb-2">
                                        Phone Number
                                    </label>
                                    <input
                                        type="tel"
                                        placeholder="+1 234 567 8900"
                                        value={form.phone}
                                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                                        className="w-full bg-white/10 border border-white/20 rounded-xl py-3 px-4 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-white/80 text-sm font-medium mb-2">
                                        Address
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="123 Main St, City"
                                        value={form.address}
                                        onChange={(e) => setForm({ ...form, address: e.target.value })}
                                        className="w-full bg-white/10 border border-white/20 rounded-xl py-3 px-4 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-8">
                            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                                <CreditCard className="w-6 h-6" />
                                Payment Information
                            </h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-white/80 text-sm font-medium mb-2">
                                        Card Number
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="1234 5678 9012 3456"
                                        value={form.cardNumber}
                                        onChange={(e) => setForm({ ...form, cardNumber: e.target.value })}
                                        maxLength="19"
                                        className="w-full bg-white/10 border border-white/20 rounded-xl py-3 px-4 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-white/80 text-sm font-medium mb-2">
                                        Cardholder Name
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="JOHN DOE"
                                        value={form.cardName}
                                        onChange={(e) => setForm({ ...form, cardName: e.target.value })}
                                        className="w-full bg-white/10 border border-white/20 rounded-xl py-3 px-4 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all"
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-white/80 text-sm font-medium mb-2">
                                            Expiry Date
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="MM/YY"
                                            value={form.expiry}
                                            onChange={(e) => setForm({ ...form, expiry: e.target.value })}
                                            maxLength="5"
                                            className="w-full bg-white/10 border border-white/20 rounded-xl py-3 px-4 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-white/80 text-sm font-medium mb-2">
                                            CVV
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="123"
                                            value={form.cvv}
                                            onChange={(e) => setForm({ ...form, cvv: e.target.value })}
                                            maxLength="3"
                                            className="w-full bg-white/10 border border-white/20 rounded-xl py-3 px-4 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all"
                                            required
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-6"
                                >
                                    {loading ? (
                                        <>
                                            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            <Lock className="w-5 h-5" />
                                            Pay ${totalAmount}
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>

                    <div className="lg:col-span-1">
                        <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-8 sticky top-8">
                            <h2 className="text-2xl font-bold text-white mb-6">Order Summary</h2>

                            <div className="space-y-4 mb-6">
                                {cart.map((item, idx) => (
                                    <div key={idx} className="flex justify-between items-start pb-4 border-b border-white/10">
                                        <div className="flex-1">
                                            <p className="text-white font-medium">{item.name}</p>
                                            <p className="text-white/60 text-sm">Qty: {item.quantity}</p>
                                        </div>
                                        <p className="text-white font-bold">
                                            ${(item.price * item.quantity).toFixed(2)}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between text-white/70">
                                    <span>Subtotal</span>
                                    <span>${totalAmount}</span>
                                </div>
                                <div className="flex justify-between text-white/70">
                                    <span>Shipping</span>
                                    <span className="text-green-400">FREE</span>
                                </div>
                                <div className="flex justify-between text-white/70">
                                    <span>Tax</span>
                                    <span>$0.00</span>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-white/20">
                                <div className="flex justify-between items-center">
                                    <span className="text-xl font-bold text-white">Total</span>
                                    <span className="text-3xl font-bold text-white">${totalAmount}</span>
                                </div>
                            </div>

                            <div className="mt-6 bg-white/5 rounded-xl p-4">
                                <div className="flex items-start gap-2">
                                    <Lock className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                                    <p className="text-white/70 text-xs">
                                        Your payment information is secure and encrypted
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}