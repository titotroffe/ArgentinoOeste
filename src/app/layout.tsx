import type { Metadata } from 'next';
import { Playfair_Display, Courier_Prime, Pinyon_Script } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-title",
  display: 'swap',
});

const courier = Courier_Prime({
  weight: ['400', '700'],
  subsets: ["latin"],
  variable: "--font-body",
  display: 'swap',
});

const pinyonScript = Pinyon_Script({
  weight: ['400'],
  subsets: ["latin"],
  variable: "--font-script",
  display: 'swap',
});

export const metadata: Metadata = {
  title: "El Cronista de Argentino Oeste",
  description: "Archivo histórico y estadísticas del club Argentino Oeste.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${playfair.variable} ${courier.variable} ${pinyonScript.variable}`}>
        {/* El div paper-texture ahora es redundante si usamos body::before en globals, pero lo dejamos por si acaso */}
        {/* <div className="paper-texture"></div> */}
        <div style={{ position: 'relative', zIndex: 1 }}> {/* Contenedor para elevar contenido sobre texturas de fondo pero debajo de vignette */}
          <Header />
          <main style={{ minHeight: '80vh' }}>
            {children}
          </main>
          <Footer />
        </div>
        {/* Overlay Vintage Explícito: Siempre al final para estar encima */}
        <div className="vintage-overlay"></div>
      </body>
    </html>
  );
}
