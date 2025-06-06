import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './index.css'
import App from './App.tsx'
import { AuthProvider } from '@context/AuthContext.tsx';
import { CartProvider } from '@context/CartContext.tsx';


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <CartProvider>
        <App />
      </CartProvider>
    </AuthProvider>
  </StrictMode>,
)
