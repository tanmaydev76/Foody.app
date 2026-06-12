import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/context/ThemeContext';
import { CartProvider } from '@/context/CartContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Foody | Food Delivery, Faster & Fresh',
  description: 'Order delicious food from your favourite restaurants, delivered fast with Foody.',
  openGraph: {
    title: 'Foody | Food Delivery, Faster & Fresh',
    description: 'Order delicious food from your favourite restaurants, delivered fast with Foody.',
    type: 'website',
    locale: 'en_IN',
  },
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' rx='22' fill='%23FF5A1F'/><text y='72' x='50' text-anchor='middle' font-size='60' fill='white'>🍽</text></svg>",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Blocking script — prevents dark-mode flash before React hydrates */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('foody-theme');var d=t==='dark'||((!t)&&window.matchMedia('(prefers-color-scheme: dark)').matches);if(d)document.documentElement.classList.add('dark')}catch(e){}})()`,
          }}
        />
      </head>
      <body className="bg-base text-fg min-h-screen flex flex-col">
        <ThemeProvider>
          <CartProvider>
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
