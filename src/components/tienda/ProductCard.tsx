'use client';

import React from 'react';
import Image from 'next/image';
import { useCart, Product } from '@/context/CartContext';
import styles from './Tienda.module.css'; // We'll create this CSS module

export default function ProductCard({ product }: { product: Product }) {
    const { addToCart } = useCart();

    return (
        <div className={styles.card}>
            <div className={styles.imageContainer}>
                <Image
                    src={product.image}
                    alt={product.title}
                    fill
                    className={styles.image}
                />
            </div>
            <div className={styles.content}>
                <h3 className={styles.title}>{product.title}</h3>
                <p className={styles.price}>
                    {new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(product.price)}
                </p>
                <button
                    onClick={() => addToCart(product)}
                    className={styles.addButton}
                >
                    Agregar al Carrito
                </button>
            </div>
        </div>
    );
}
