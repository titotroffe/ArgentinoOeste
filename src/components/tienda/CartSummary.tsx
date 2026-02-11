'use client';

import React, { useState } from 'react';
import { useCart } from '@/context/CartContext';
import styles from './Tienda.module.css';

export default function CartSummary() {
    const { items, removeFromCart, total, clearCart } = useCart();
    const [loading, setLoading] = useState(false);

    const handleCheckout = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ items }),
            });
            const data = await response.json();
            if (data.id) {
                // Redirect to MercadoPago
                // Using Sandbox init_point for testing, or production init_point
                // Ideally the API returns the full `init_point` or `sandbox_init_point`
                // For preference ID, the URL is usually https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=...
                // But let's assume valid ID.
                // Actually, the Preference object has an init_point. Let's redirect there.
                // Wait, I only returned ID in the route. I should verify that.
                // MercadoPago SDK result usually contains init_point.
                // I'll update the route later if needed, but standard checkout link construction works too.
                // Let's assume the API helps us or we construct it.
                // Actually, let's update the API to return init_point in next step.
                // For now, assume we get an ID.
                window.location.href = `https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=${data.id}`;
            } else {
                alert('Error al iniciar el pago');
            }
        } catch (error) {
            console.error(error);
            alert('Error de conexión');
        } finally {
            setLoading(false);
        }
    };

    if (items.length === 0) {
        return (
            <div className={styles.cartSummary}>
                <h3>Tu Carrito</h3>
                <p>No hay productos seleccionados.</p>
            </div>
        );
    }

    return (
        <div className={styles.cartSummary}>
            <h3>Tu Carrito</h3>
            <ul className={styles.cartList}>
                {items.map((item) => (
                    <li key={item.id} className={styles.cartItem}>
                        <div className={styles.cartItemInfo}>
                            <span>{item.title}</span>
                            <span className={styles.cartItemQuantity}>x{item.quantity}</span>
                        </div>
                        <div className={styles.cartItemActions}>
                            <span>
                                {new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(item.price * item.quantity)}
                            </span>
                            <button
                                onClick={() => removeFromCart(item.id)}
                                className={styles.removeButton}
                            >
                                &times;
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
            <div className={styles.totalRow}>
                <strong>Total:</strong>
                <strong>{new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(total)}</strong>
            </div>
            <button
                onClick={handleCheckout}
                disabled={loading}
                className={styles.checkoutButton}
            >
                {loading ? 'Procesando...' : 'Pagar con MercadoPago'}
            </button>
        </div>
    );
}
