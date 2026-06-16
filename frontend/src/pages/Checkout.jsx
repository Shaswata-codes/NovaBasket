import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {useCart} from '../context/CartContext';
import {authFetch} from '../utils/auth';

function Checkout() {
    const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
    const navigate = useNavigate();
    const {clearCart} = useCart();

    const [form, setForm] = useState({
        name: '',
        address: '',
        phone: '',
        payment_method: 'COD',
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await authFetch(`${BASE_URL}/api/orders/create/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Cart-ID': localStorage.getItem('cart_id') || '',
                },
                body: JSON.stringify(form),
            });

            if (response.ok) {
                const data = await response.json();
                clearCart();
                navigate(`/order/${data.id}`);
            } else {
                const errorData = await response.json();
                setMessage(errorData.message);
            }
        } catch (error) {
            console.error('Checkout error:', error);
            setMessage('An error occurred. Please try again.');
        }
    };

    return(
        <div className="max-w-2xl mx-auto p-4">
            <div className="bg-white shadow-md rounded p-6">
                <h1 className='text-2xl font-bold text-center'>Checkout</h1>
                <form onSubmit={handleSubmit} className='space-y-4 mt-4'>
                    <input type="text" placeholder = "Full Name" value={form.name} name="name" onChange={handleChange} className='w-full border p-2 rounded' required />
                    <textarea name="address" placeholder = "Shipping Address" value={form.address} onChange={handleChange} required className='w-full border p-2 rounded' required />
                    <input type="tel" placeholder = "Phone Number" value={form.phone} name="phone" onChange={handleChange} required className='w-full border p-2 rounded' required />
                    <select name="payment_method" value={form.payment_method} onChange={handleChange} className='w-full border p-2 rounded'>
                        <option value="COD">Cash on Delivery</option>
                        <option value="credit_card">Online Payment</option>
                    </select>
                    <button type="submit" disabled={loading} className='w-full bg-blue-500 text-white p-2 rounded'>
                        {loading ? 'Processing...' : 'Place Order'}
                    </button>
                    {message && <p className='text-center mt-2 text-green-500'>{message}</p>}
                </form>
            </div>
        </div>
    )
}

export default Checkout;