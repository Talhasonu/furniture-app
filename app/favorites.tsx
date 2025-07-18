import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useAuth } from "@/contexts/AuthContext";
import { useThemeColor } from "@/hooks/useThemeColor";
import { addToCart } from "@/utils/cart";
import {
  FavoriteProduct,
  getFavoriteProducts,
  removeFromFavorites,
} from "@/utils/favorites";
import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Dimensions,
  FlatList,
  Image,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

export default function FavoritesScreen() {
  const { user } = useAuth();
  const [favoriteProducts, setFavoriteProducts] = useState<FavoriteProduct[]>(
    []
  );
  const [loading, setLoading] = useState(false);

  const backgroundColor = useThemeColor(
    { light: "#fafbfc", dark: "#0f0f23" },
    "background"
  );
  const tintColor = useThemeColor(
    { light: "#6366f1", dark: "#818cf8" },
    "tint"
  );
  const textColor = useThemeColor(
    { light: "#1f2937", dark: "#f9fafb" },
    "text"
  );
  const cardColor = useThemeColor(
    { light: "#ffffff", dark: "#1e1e2e" },
    "background"
  );

  useEffect(() => {
    // Check if user is authenticated
    if (!user) {
      Alert.alert("Login Required", "Please log in to view your favorites", [
        {
          text: "Go to Login",
          onPress: () => router.replace("/(auth)/signin"),
        },
      ]);
      return;
    }

    // Load favorites from storage
    loadFavorites();
  }, [user]);

  // Add focus listener to reload favorites when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      if (user) {
        loadFavorites();
      }
    }, [user])
  );

  const loadFavorites = async () => {
    setLoading(true);
    try {
      const favorites = await getFavoriteProducts();
      setFavoriteProducts(favorites);
    } catch (error) {
      console.error("Error loading favorites:", error);
      Alert.alert("Error", "Failed to load favorites");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromFavorites = async (productId: number) => {
    Alert.alert(
      "Remove from Favorites",
      "Are you sure you want to remove this item from your favorites?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: async () => {
            try {
              await removeFromFavorites(productId);
              setFavoriteProducts((prev) =>
                prev.filter((item) => item.id !== productId)
              );
            } catch (error) {
              console.error("Error removing from favorites:", error);
              Alert.alert("Error", "Failed to remove from favorites");
            }
          },
        },
      ]
    );
  };

  const handleProductPress = (product: any) => {
    router.push({
      pathname: "/product-detail",
      params: {
        productId: product.id,
        productData: JSON.stringify(product),
      },
    });
  };

  const handleAddToCart = async (product: FavoriteProduct) => {
    try {
      const cartItem = {
        id: product.id,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.image,
        category: product.category,
        description: product.description,
        inStock: product.inStock,
      };

      await addToCart(cartItem, 1);

      Alert.alert(
        "Added to Cart",
        `${product.name} has been added to your cart!`,
        [
          {
            text: "Continue Shopping",
            onPress: () =>
              router.push({
                pathname: "/product-detail",
                params: {
                  productId: product.id,
                  productData: JSON.stringify(product),
                },
              }),
          },
          {
            text: "View Cart",
            onPress: () => router.push("/cart"),
          },
        ]
      );
    } catch (error) {
      console.error("Error adding to cart:", error);
      Alert.alert("Error", "Failed to add item to cart");
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const FavoriteProductCard = ({ item }: { item: FavoriteProduct }) => (
    <TouchableOpacity
      style={[styles.productCard, { backgroundColor: cardColor }]}
      onPress={() => handleProductPress(item)}
    >
      <View style={styles.productImageContainer}>
        <Image
          source={{ uri: item.image }}
          style={styles.productImage}
          resizeMode="cover"
        />

        {/* Remove from favorites button */}
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => handleRemoveFromFavorites(item.id)}
        >
          <Ionicons name="heart" size={20} color="#ff4757" />
        </TouchableOpacity>

        {/* Discount Badge */}
        {item.discount && item.discount > 0 && (
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>{item.discount}% OFF</Text>
          </View>
        )}

        {/* Stock Status */}
        {!item.inStock && (
          <View style={styles.outOfStockOverlay}>
            <Text style={styles.outOfStockText}>Out of Stock</Text>
          </View>
        )}
      </View>

      <View style={styles.productInfo}>
        <View style={styles.productHeader}>
          <View style={styles.productTitleSection}>
            <ThemedText style={styles.productName} numberOfLines={2}>
              {item.name}
            </ThemedText>
            <ThemedText style={styles.productCategory}>
              {item.category}
            </ThemedText>
          </View>
        </View>

        <View style={styles.ratingRow}>
          <Ionicons name="star" size={14} color="#FFD700" />
          <Text style={styles.rating}>{item.rating}</Text>
          <Text style={styles.reviews}>({item.reviews})</Text>
        </View>

        <View style={styles.priceRow}>
          <Text style={[styles.price, { color: tintColor }]}>
            ${item.price}
          </Text>
          {item.originalPrice && (
            <Text style={styles.originalPrice}>${item.originalPrice}</Text>
          )}
        </View>

        <View style={styles.metaRow}>
          <Text style={styles.dateAdded}>
            Added {formatDate(item.dateAdded)}
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.addToCartButton, { backgroundColor: tintColor }]}
          onPress={() => handleAddToCart(item)}
          disabled={!item.inStock}
        >
          <Ionicons name="bag-add" size={16} color="white" />
          <Text style={styles.addToCartText}>
            {item.inStock ? "Add to Cart" : "Out of Stock"}
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  if (!user) {
    return null; // Will show alert and redirect
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      <StatusBar barStyle="dark-content" backgroundColor={backgroundColor} />

      {/* Header */}
      <ThemedView style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={textColor} />
        </TouchableOpacity>

        <ThemedText style={styles.headerTitle}>My Favorites</ThemedText>

        <View style={styles.headerRight}>
          <View style={styles.favoriteCount}>
            <Text style={[styles.favoriteCountText, { color: tintColor }]}>
              {favoriteProducts.length}
            </Text>
          </View>
        </View>
      </ThemedView>

      {favoriteProducts.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="heart-outline" size={80} color={textColor + "30"} />
          <ThemedText type="subtitle" style={styles.emptyTitle}>
            No Favorites Yet
          </ThemedText>
          <ThemedText style={styles.emptySubtitle}>
            Start adding items to your favorites to see them here
          </ThemedText>
          <TouchableOpacity
            style={[styles.browseButton, { backgroundColor: tintColor }]}
            onPress={() => router.push("/products")}
          >
            <Text style={styles.browseButtonText}>Browse Products</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={favoriteProducts}
          renderItem={({ item }) => <FavoriteProductCard item={item} />}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          refreshing={loading}
          onRefresh={loadFavorites}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 0, 0, 0.05)",
    elevation: 3,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  headerRight: {
    padding: 8,
  },
  favoriteCount: {
    backgroundColor: "#ff4757",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    minWidth: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  favoriteCountText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },
  listContainer: {
    padding: 16,
  },
  productCard: {
    flexDirection: "row",
    marginBottom: 16,
    borderRadius: 16,
    overflow: "hidden",
    elevation: 3,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  productImageContainer: {
    position: "relative",
    width: 120,
    height: 120,
  },
  productImage: {
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.03)",
  },
  removeButton: {
    position: "absolute",
    top: 8,
    left: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  discountBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "#ff4757",
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 8,
    elevation: 2,
  },
  discountText: {
    color: "white",
    fontSize: 9,
    fontWeight: "700",
  },
  outOfStockOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    paddingVertical: 4,
    alignItems: "center",
  },
  outOfStockText: {
    color: "white",
    fontSize: 10,
    fontWeight: "600",
  },
  productInfo: {
    flex: 1,
    padding: 12,
    justifyContent: "space-between",
  },
  productHeader: {
    marginBottom: 8,
  },
  productTitleSection: {
    flex: 1,
  },
  productName: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 2,
    lineHeight: 18,
  },
  productCategory: {
    fontSize: 11,
    opacity: 0.6,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  rating: {
    fontSize: 12,
    fontWeight: "500",
    marginLeft: 4,
    marginRight: 4,
  },
  reviews: {
    fontSize: 12,
    opacity: 0.6,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  price: {
    fontSize: 16,
    fontWeight: "700",
    marginRight: 8,
  },
  originalPrice: {
    fontSize: 12,
    textDecorationLine: "line-through",
    opacity: 0.5,
  },
  metaRow: {
    marginBottom: 8,
  },
  dateAdded: {
    fontSize: 11,
    opacity: 0.5,
  },
  addToCartButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  addToCartText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
    marginLeft: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginTop: 20,
    marginBottom: 8,
    textAlign: "center",
  },
  emptySubtitle: {
    fontSize: 14,
    opacity: 0.6,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 30,
  },
  browseButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 20,
  },
  browseButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
});
