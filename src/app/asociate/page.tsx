'use client';

import { useState } from 'react';
import MembershipCard from '@/components/asociate/MembershipCard';
import Button from '@/components/ui/Button';
import styles from './asociate.module.css';

export default function AsociatePage() {
    const [formData, setFormData] = useState({
        name: '',
    });
    const [photoUrl, setPhotoUrl] = useState<string | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPhotoUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleDownload = () => {
        // Basic placeholder for download logic
        // In a real app, you might use html2canvas or similar
        alert('Función de descarga próximamente disponible. Por ahora podés hacer una captura de pantalla!');
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1 className={styles.title}>Hacete Socio</h1>
                <p className={styles.subtitle}>
                    Sumate a la pasión. Sé parte de la historia.
                </p>
            </header>

            <div className={styles.contentGrid}>

                {/* FORM SIDE */}
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <h2 style={{ fontFamily: 'var(--font-title)', marginBottom: '1.5rem', fontSize: '1.5rem', textAlign: 'center' }}>Tus Datos</h2>
                    <div className={styles.formSection}>

                        <div className={styles.formGroup}>
                            <label className={styles.label} htmlFor="name">Nombre Completo</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                className={styles.input}
                                placeholder="Ej: Juan Pérez"
                                value={formData.name}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>Foto de Perfil</label>
                            <div className={styles.fileInputWrapper}>
                                <input
                                    type="file"
                                    accept="image/*"
                                    className={styles.fileInput}
                                    onChange={handlePhotoUpload}
                                />
                                <p style={{ fontSize: '0.8rem', color: '#666', marginTop: '0.5rem' }}>
                                    Subí una foto tipo carnet (cuadrada o vertical preferentemente).
                                </p>
                            </div>
                        </div>

                        <div style={{ marginTop: '2rem' }}>
                            <Button size="lg" variant="primary" onClick={handleDownload}>
                                DESCARGAR CARNET
                            </Button>
                        </div>
                    </div>
                </div>

                {/* PREVIEW SIDE */}
                <div>
                    <h2 style={{ fontFamily: 'var(--font-title)', marginBottom: '1.5rem', fontSize: '1.5rem', textAlign: 'center' }}>Tu Carnet Virtual</h2>
                    <MembershipCard
                        name={formData.name}
                        photoUrl={photoUrl}
                    />
                </div>

            </div>
        </div>
    );
}
