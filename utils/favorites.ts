import AsyncStorage from '@react-native-async-storage/async-storage';

const FAVORITES_KEY = '@favorites';

export interface FavoriteProduct {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  reviews: number;
  discount?: number;
  category: string;
  description: string;
  inStock: boolean;
  stockCount?: number;
  dateAdded: string;
}

// Get all favorite products
export const getFavoriteProducts = async (): Promise<FavoriteProduct[]> => {
  try {
    const favorites = await AsyncStorage.getItem(FAVORITES_KEY);
    return favorites ? JSON.parse(favorites) : [];
  } catch (error) {
    console.error('Error getting favorites:', error);
    return [];
  }
};

// Get favorite product IDs only
export const getFavoriteIds = async (): Promise<number[]> => {
  try {
    const favorites = await getFavoriteProducts();
    return favorites.map(product => product.id);
  } catch (error) {
    console.error('Error getting favorite IDs:', error);
    return [];
  }
};

// Add product to favorites
export const addToFavorites = async (product: FavoriteProduct): Promise<boolean> => {
  try {
    const favorites = await getFavoriteProducts();
    const isAlreadyFavorite = favorites.some(fav => fav.id === product.id);
    
    if (!isAlreadyFavorite) {
      const updatedProduct = {
        ...product,
        dateAdded: new Date().toISOString(),
      };
      const updatedFavorites = [...favorites, updatedProduct];
      await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updatedFavorites));
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error adding to favorites:', error);
    return false;
  }
};

// Remove product from favorites
export const removeFromFavorites = async (productId: number): Promise<boolean> => {
  try {
    const favorites = await getFavoriteProducts();
    const updatedFavorites = favorites.filter(product => product.id !== productId);
    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updatedFavorites));
    return true;
  } catch (error) {
    console.error('Error removing from favorites:', error);
    return false;
  }
};

// Toggle favorite status
export const toggleFavorite = async (product: FavoriteProduct): Promise<boolean> => {
  try {
    const favoriteIds = await getFavoriteIds();
    const isFavorite = favoriteIds.includes(product.id);
    
    if (isFavorite) {
      await removeFromFavorites(product.id);
      return false;
    } else {
      await addToFavorites(product);
      return true;
    }
  } catch (error) {
    console.error('Error toggling favorite:', error);
    return false;
  }
};

// Check if product is favorite
export const isFavorite = async (productId: number): Promise<boolean> => {
  try {
    const favoriteIds = await getFavoriteIds();
    return favoriteIds.includes(productId);
  } catch (error) {
    console.error('Error checking favorite status:', error);
    return false;
  }
};

// Clear all favorites
export const clearFavorites = async (): Promise<boolean> => {
  try {
    await AsyncStorage.removeItem(FAVORITES_KEY);
    return true;
  } catch (error) {
    console.error('Error clearing favorites:', error);
    return false;
  }
};
