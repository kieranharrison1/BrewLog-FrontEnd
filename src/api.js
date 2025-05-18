export const API_BASE = 'https://brewlog-c3c352ffaada.herokuapp.com';
import { getUserIdFromToken, getAuthHeader } from './auth.js';

export async function loginUser(email, password) {
    const res = await fetch(`${API_BASE}/auth/signin`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    });

    if (!res.ok) throw new Error('Login failed');
    return await res.json();
}

export async function signupUser(user) {
    const res = await fetch(`${API_BASE}/auth/signup`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    });

    if (!res.ok) throw new Error('Signup failed');
    return await res.json();
}

export async function validateToken(token) {
    const res = await fetch(`${API_BASE}/auth/validate`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if (!res.ok) throw new Error('Token invalid');
    return await res.json(); // Optional: could return user info or role
}

export async function logOrder(quantity) {
    const userId = getUserIdFromToken();
    const res = await fetch(`${API_BASE}/orders`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeader()
        },
        body: JSON.stringify({
            userId,
            quantity,
            date: new Date()
        })
    });

    if (!res.ok) throw new Error('Order failed');
    return await res.json();
}

export async function recordPayment(amount, date) {
    const userId = getUserIdFromToken();
    const res = await fetch(`${API_BASE}/payments`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeader()
        },
        body: JSON.stringify({
            userId,
            amount,
            date: new Date(date)
        })
    });

    if (!res.ok) throw new Error('Payment failed');
    return await res.json();
}

export async function fetchOrderHistory() {
    const userId = getUserIdFromToken();
    const res = await fetch(`${API_BASE}/orders/user/${userId}`, {
        method: 'GET',
        headers: getAuthHeader()
    });

    if (!res.ok) throw new Error('Failed to fetch order history');
    return await res.json();
}
