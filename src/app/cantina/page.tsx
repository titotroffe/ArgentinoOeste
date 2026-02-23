'use client';

import { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import styles from './cantina.module.css';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

type Message = {
    role: 'user' | 'bot';
    content: string;
};

export default function Cantina() {
    const [messages, setMessages] = useState<Message[]>([
        { role: 'bot', content: '¡Bienvenido a la cantina! Acercate a la barra, pedite algo y charlamos sobre lo que quieras de la historia del club.' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        const container = messagesEndRef.current?.parentElement;
        if (container) {
            container.scrollTo({
                top: container.scrollHeight,
                behavior: 'smooth'
            });
        }
    };

    useEffect(() => {
        // Only scroll if there's more than the initial system message
        if (messages.length > 1) {
            scrollToBottom();
        }
    }, [messages]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage = input.trim();
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
        setIsLoading(true);

        try {
            const historyToSend = messages.slice(-10).map(m => ({
                role: m.role === 'user' ? 'user' : 'model',
                content: m.content
            }));

            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: userMessage, history: historyToSend }),
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
        <div className={styles.cantinaContainer}>
            <div className={styles.overlay}></div>

            <div className={styles.contentWrapper}>
                <div className={styles.header}>
                    <h1 className={styles.title}>La Cantina del Club</h1>
                    <p className={styles.subtitle}>Un lugar para recordar nuestra historia con una copa de por medio.</p>
                </div>

                <div className={styles.chatWindow}>
                    <div className={styles.messages}>
                        {messages.map((msg, idx) => (
                            <div
                                key={idx}
                                className={`${styles.message} ${msg.role === 'user' ? styles.userMessage : styles.botMessage}`}
                            >
                                {msg.role === 'bot' ? (
                                    <ReactMarkdown
                                        remarkPlugins={[remarkGfm]}
                                        components={{
                                            a: ({ node, ...props }) => (
                                                <a {...props} target="_blank" rel="noopener noreferrer" className={styles.messageLink} />
                                            ),
                                            p: ({ node, ...props }) => <p {...props} style={{ margin: 0 }} />
                                        }}
                                    >
                                        {msg.content}
                                    </ReactMarkdown>
                                ) : (
                                    msg.content
                                )}
                            </div>
                        ))}
                        {isLoading && (
                            <div className={styles.typing}>
                                <div className={styles.typingDot}></div>
                                <div className={styles.typingDot}></div>
                                <div className={styles.typingDot}></div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <form onSubmit={handleSubmit} className={styles.inputArea}>
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ej: ¿Te acordás cómo fue la final del 58?"
                            className={styles.input}
                            disabled={isLoading}
                        />
                        <button type="submit" className={styles.sendButton} disabled={isLoading || !input.trim()}>
                            <Send size={20} />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
