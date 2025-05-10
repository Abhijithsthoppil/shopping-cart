import React, {
    createContext,
    useState,
    ReactNode,
    useContext,
    useEffect,
  } from 'react';
  
  import { 
    getCart, 
    addToCart as saveToDynamo, 
    removeFromCart as removeFromDynamo,
    updateCartItem as updateDynamoItem 
  } from '../services/cartService';
  import { useAuth } from './AuthContext';
  
  export interface Product {
    id: number;
    name: string;
    image_url: string;
    price: number;
    category: string;
    brand: string;
    description: string;
  }

  interface ShippingDetails {
    fullName: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    pincode: string;
    phone: string;
  }
  
  export interface CartItem extends Product {
    quantity: number;
  }
  
  interface CartContextType {
    cartItems: CartItem[];
    addToCart: (product: Product, quantity?: number) => void;
    removeFromCart: (id: number) => void;
    updateItem: (id: number, updates: Partial<CartItem>) => void;
    clearCart: () => void;
    totalPrice: number;
    isCartOpen: boolean;
    toggleCart: () => void;
    shippingDetails: ShippingDetails;
    setShippingDetails: React.Dispatch<React.SetStateAction<ShippingDetails>>;
  }
  
  const CartContext = createContext<CartContextType | undefined>(undefined);
  
  export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
      throw new Error('useCart must be used within a CartProvider');
    }
    return context;
  };
  
  interface CartProviderProps {
    children: ReactNode;
  }
  
  export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const { user } = useAuth();
    const [shippingDetails, setShippingDetails] = useState<ShippingDetails>({
        fullName: "",
        addressLine1: "",
        addressLine2: "",
        city: "",
        state: "",
        pincode: "",
        phone: "",
      });
  
    useEffect(() => {
        const fetchCart = async () => {
          if (user) {
            try {
              const dynamoItems = await getCart();
              const merged: CartItem[] = dynamoItems.map((item) => ({
                ...item.product,
                quantity: item.quantity,
              }));
              setCartItems(merged);
            } catch (error) {
              console.error('Failed to fetch cart:', error);
              setCartItems([]);
            }
          } else {
            setCartItems([]);
          }
        };
      
        fetchCart();
      }, [user]);
  
      const addToCart = (product: Product, quantity: number = 1) => {
        setCartItems((prevItems) => {
          const existingItem = prevItems.find((item) => item.id === product.id);
          if (existingItem) {
            const newQty = existingItem.quantity + quantity;
            updateItem(product.id, { quantity: newQty });
            return prevItems;
          } else {
            const newCart = [...prevItems, { ...product, quantity }];
            if (user) {
              saveToDynamo({ product_id: product.id.toString(), quantity });
            }
            return newCart;
          }
        });
      };
  
    const removeFromCart = (id: number) => {
        setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
      
        if (user) {
          removeFromDynamo(id.toString()).catch((err) =>
            console.error('Failed to remove from DB:', err)
          );
        }
    };
      
  
    const updateItem = (id: number, updates: Partial<CartItem>) => {
        setCartItems((prevItems) =>
          prevItems.map((item) =>
            item.id === id ? { ...item, ...updates } : item
          )
        );
      
        if (user && updates.quantity !== undefined) {
          updateDynamoItem(id.toString(), updates.quantity).catch((err) =>
            console.error('Failed to update DB:', err)
          );
        }
    };
      
  
    const clearCart = () => {
      setCartItems([]);
    };
  
    const totalPrice = cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  
    const toggleCart = () => setIsCartOpen((prev) => !prev);
  
    return (
      <CartContext.Provider
        value={{
          cartItems,
          addToCart,
          removeFromCart,
          updateItem,
          clearCart,
          totalPrice,
          isCartOpen,
          toggleCart,
          shippingDetails, 
          setShippingDetails
        }}
      >
        {children}
      </CartContext.Provider>
    );
  };
  