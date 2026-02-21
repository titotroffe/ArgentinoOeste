'use client';

import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Beer } from 'lucide-react';
import styles from './ChatBot.module.css';

type Message = {
    role: 'user' | 'bot';
    content: string;
};

export default function ChatBot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { role: 'bot', content: '¡Bienvenido a la cantina! Pedite algo y charlamos. Preguntame lo que quieras sobre la historia del club.' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage = input.trim();
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
        setIsLoading(true);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: userMessage }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessages(prev => [...prev, { role: 'bot', content: data.reply }]);
            } else {
                setMessages(prev => [...prev, { role: 'bot', content: 'Uy, se me cortó el hilo. ¿Me repetís la pregunta?' }]);
            }
        } catch (error) {
            console.error('Error:', error);
            setMessages(prev => [...prev, { role: 'bot', content: 'Se me fue la luz de la cantina. Probá en un ratito.' }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.chatContainer}>
            {isOpen && (
                <div className={styles.chatWindow}>
                    <div className={styles.header}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Beer size={20} />
                            <h3>La Cantina del Club</h3>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <div className={styles.messages}>
                        {messages.map((msg, idx) => (
                            <div
                                key={idx}
                                className={`${styles.message} ${msg.role === 'user' ? styles.userMessage : styles.botMessage}`}
                            >
                                {msg.content}
                            </div>
                        ))}
                        {isLoading && (
                            <div className={styles.typing}>El cantinero está pensando...</div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <form onSubmit={handleSubmit} className={styles.inputArea}>
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ej: ¿Cómo salió el clásico del 58?"
                            className={styles.input}
                            disabled={isLoading}
                        />
                        <button type="submit" className={styles.sendButton} disabled={isLoading || !input.trim()}>
                            <Send size={18} />
                        </button>
                    </form>
                </div>
            )}

            <button className={styles.chatButton} onClick={() => setIsOpen(!isOpen)}>
                {isOpen ? <X size={28} /> : <MessageCircle size={28} />}
            </button>
        </div>
    );
}
