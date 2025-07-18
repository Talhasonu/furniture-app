import AsyncStorage from '@react-native-async-storage/async-storage';

const CART_KEY = '@cart';

export interface CartItem {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  description: string;
  inStock: boolean;
  quantity: number;
  dateAdded: string;
}

// Get all cart items
export const getCartItems = async (): Promise<CartItem[]> => {
  try {
    const cart = await AsyncStorage.getItem(CART_KEY);
    return cart ? JSON.parse(cart) : [];
  } catch (error) {
    console.error('Error getting cart items:', error);
    return [];
  }
};

// Get cart item count
export const getCartItemCount = async (): Promise<number> => {
  try {
    const cartItems = await getCartItems();
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  } catch (error) {
    console.error('Error getting cart item count:', error);
    return 0;
  }
};

// Add item to cart
export const addToCart = async (product: Omit<CartItem, 'quantity' | 'dateAdded'>, quantity: number = 1): Promise<boolean> => {
  try {
    const cartItems = await getCartItems();
    const existingItemIndex = cartItems.findIndex(item => item.id === product.id);
    
    if (existingItemIndex >= 0) {
      // Update quantity if item already exists
      cartItems[existingItemIndex].quantity += quantity;
    } else {
      // Add new item to cart
      const newItem: CartItem = {
        ...product,
        quantity,
        dateAdded: new Date().toISOString(),
      };
      cartItems.push(newItem);
    }
    
    await AsyncStorage.setItem(CART_KEY, JSON.stringify(cartItems));
    return true;
  } catch (error) {
    console.error('Error adding to cart:', error);
    return false;
  }
};

// Remove item from cart
export const removeFromCart = async (productId: number): Promise<boolean> => {
  try {
    const cartItems = await getCartItems();
    const updatedCart = cartItems.filter(item => item.id !== productId);
    await AsyncStorage.setItem(CART_KEY, JSON.stringify(updatedCart));
    return true;
  } catch (error) {
    console.error('Error removing from cart:', error);
    return false;
  }
};

// Update item quantity in cart
export const updateCartItemQuantity = async (productId: number, quantity: number): Promise<boolean> => {
  try {
    const cartItems = await getCartItems();
    const itemIndex = cartItems.findIndex(item => item.id === productId);
    
    if (itemIndex >= 0) {
      if (quantity <= 0) {
        // Remove item if quantity is 0 or less
        return await removeFromCart(productId);
      } else {
        cartItems[itemIndex].quantity = quantity;
        await AsyncStorage.setItem(CART_KEY, JSON.stringify(cartItems));
        return true;
      }
    }
    return false;
  } catch (error) {
    console.error('Error updating cart item quantity:', error);
    return false;
  }
};

// Get cart total
export const getCartTotal = async (): Promise<number> => {
  try {
    const cartItems = await getCartItems();
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  } catch (error) {
    console.error('Error calculating cart total:', error);
    return 0;
  }
};

// Clear cart
export const clearCart = async (): Promise<boolean> => {
  try {
    await AsyncStorage.removeItem(CART_KEY);
    return true;
  } catch (error) {
    console.error('Error clearing cart:', error);
    return false;
  }
};

// Check if item is in cart
export const isInCart = async (productId: number): Promise<boolean> => {
  try {
    const cartItems = await getCartItems();
    return cartItems.some(item => item.id === productId);
  } catch (error) {
    console.error('Error checking if item is in cart:', error);
    return false;
  }
};
