import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useAuth } from "@/contexts/AuthContext";
import { useThemeColor } from "@/hooks/useThemeColor";
import {
  CartItem,
  clearCart,
  getCartItems,
  getCartTotal,
  removeFromCart,
  updateCartItemQuantity,
} from "@/utils/cart";
import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
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

export default function CartScreen() {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [cartTotal, setCartTotal] = useState(0);

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

  // Load cart when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      if (user) {
        loadCart();
      }
    }, [user])
  );

  const loadCart = async () => {
    setLoading(true);
    try {
      const items = await getCartItems();
      const total = await getCartTotal();
      setCartItems(items);
      setCartTotal(total);
    } catch (error) {
      console.error("Error loading cart:", error);
      Alert.alert("Error", "Failed to load cart");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromCart = async (
    productId: number,
    productName: string
  ) => {
    Alert.alert(
      "Remove from Cart",
      `Are you sure you want to remove ${productName} from your cart?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: async () => {
            try {
              await removeFromCart(productId);
              await loadCart(); // Refresh cart
            } catch (error) {
              console.error("Error removing from cart:", error);
              Alert.alert("Error", "Failed to remove from cart");
            }
          },
        },
      ]
    );
  };

  const handleQuantityChange = async (
    productId: number,
    newQuantity: number
  ) => {
    try {
      await updateCartItemQuantity(productId, newQuantity);
      await loadCart(); // Refresh cart
    } catch (error) {
      console.error("Error updating quantity:", error);
      Alert.alert("Error", "Failed to update quantity");
    }
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      Alert.alert("Empty Cart", "Your cart is empty. Add some items first!");
      return;
    }

    Alert.alert(
      "Checkout",
      `Total: $${cartTotal.toFixed(2)}\n\nProceed to checkout?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Proceed",
          onPress: () => {
            // Here you would navigate to checkout/payment screen
            Alert.alert("Success", "Order placed successfully!", [
              {
                text: "OK",
                onPress: async () => {
                  await clearCart();
                  router.push("/orders");
                },
              },
            ]);
          },
        },
      ]
    );
  };

  const handleProductPress = (item: CartItem) => {
    router.push({
      pathname: "/product-detail",
      params: {
        productId: item.id,
        productData: JSON.stringify(item),
      },
    });
  };

  const CartItemCard = ({ item }: { item: CartItem }) => (
    <TouchableOpacity
      style={[styles.cartCard, { backgroundColor: cardColor }]}
      onPress={() => handleProductPress(item)}
    >
      <View style={styles.cartImageContainer}>
        <Image
          source={{ uri: item.image }}
          style={styles.cartImage}
          resizeMode="cover"
        />
      </View>

      <View style={styles.cartInfo}>
        <View style={styles.cartHeader}>
          <ThemedText style={styles.cartItemName} numberOfLines={2}>
            {item.name}
          </ThemedText>
          <TouchableOpacity
            style={styles.removeButton}
            onPress={() => handleRemoveFromCart(item.id, item.name)}
          >
            <Ionicons name="trash-outline" size={20} color="#ff4757" />
          </TouchableOpacity>
        </View>

        <ThemedText style={styles.cartItemCategory}>{item.category}</ThemedText>

        <View style={styles.priceQuantityRow}>
          <Text style={[styles.cartPrice, { color: tintColor }]}>
            ${item.price}
          </Text>

          <View style={styles.quantityContainer}>
            <TouchableOpacity
              style={[styles.quantityButton, { borderColor: tintColor }]}
              onPress={() => handleQuantityChange(item.id, item.quantity - 1)}
              disabled={item.quantity <= 1}
            >
              <Ionicons
                name="remove"
                size={16}
                color={item.quantity <= 1 ? "#ccc" : tintColor}
              />
            </TouchableOpacity>

            <Text style={[styles.quantityText, { color: textColor }]}>
              {item.quantity}
            </Text>

            <TouchableOpacity
              style={[styles.quantityButton, { borderColor: tintColor }]}
              onPress={() => handleQuantityChange(item.id, item.quantity + 1)}
            >
              <Ionicons name="add" size={16} color={tintColor} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.totalRow}>
          <Text style={styles.itemTotal}>
            Total: ${(item.price * item.quantity).toFixed(2)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (!user) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor }]}>
        <View style={styles.emptyContainer}>
          <Ionicons name="log-in-outline" size={80} color={textColor + "30"} />
          <ThemedText type="subtitle" style={styles.emptyTitle}>
            Login Required
          </ThemedText>
          <ThemedText style={styles.emptySubtitle}>
            Please log in to view your cart
          </ThemedText>
          <TouchableOpacity
            style={[styles.loginButton, { backgroundColor: tintColor }]}
            onPress={() => router.push("/(auth)/signin")}
          >
            <Text style={styles.loginButtonText}>Go to Login</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
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

        <ThemedText style={styles.headerTitle}>My Cart</ThemedText>

        <View style={styles.headerRight}>
          <View style={styles.cartCount}>
            <Text style={[styles.cartCountText, { color: tintColor }]}>
              {cartItems.reduce((total, item) => total + item.quantity, 0)}
            </Text>
          </View>
        </View>
      </ThemedView>

      {cartItems.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="bag-outline" size={80} color={textColor + "30"} />
          <ThemedText type="subtitle" style={styles.emptyTitle}>
            Your Cart is Empty
          </ThemedText>
          <ThemedText style={styles.emptySubtitle}>
            Add some items to your cart to see them here
          </ThemedText>
          <TouchableOpacity
            style={[styles.browseButton, { backgroundColor: tintColor }]}
            onPress={() => router.push("/products")}
          >
            <Text style={styles.browseButtonText}>Browse Products</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <FlatList
            data={cartItems}
            renderItem={({ item }) => <CartItemCard item={item} />}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
            refreshing={loading}
            onRefresh={loadCart}
          />

          {/* Cart Total and Checkout */}
          <View
            style={[styles.checkoutContainer, { backgroundColor: cardColor }]}
          >
            <View style={styles.totalContainer}>
              <ThemedText style={styles.totalLabel}>Total:</ThemedText>
              <Text style={[styles.totalAmount, { color: tintColor }]}>
                ${cartTotal.toFixed(2)}
              </Text>
            </View>

            <TouchableOpacity
              style={[styles.checkoutButton, { backgroundColor: tintColor }]}
              onPress={handleCheckout}
            >
              <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
            </TouchableOpacity>
          </View>
        </>
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
  cartCount: {
    backgroundColor: "#ff4757",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    minWidth: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  cartCountText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },
  listContainer: {
    padding: 16,
  },
  cartCard: {
    flexDirection: "row",
    marginBottom: 16,
    borderRadius: 16,
    overflow: "hidden",
    elevation: 3,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  cartImageContainer: {
    width: 100,
    height: 100,
  },
  cartImage: {
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.03)",
  },
  cartInfo: {
    flex: 1,
    padding: 12,
    justifyContent: "space-between",
  },
  cartHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 4,
  },
  cartItemName: {
    fontSize: 14,
    fontWeight: "600",
    flex: 1,
    marginRight: 8,
  },
  removeButton: {
    padding: 4,
  },
  cartItemCategory: {
    fontSize: 12,
    opacity: 0.6,
    marginBottom: 8,
  },
  priceQuantityRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  cartPrice: {
    fontSize: 16,
    fontWeight: "700",
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  quantityButton: {
    width: 30,
    height: 30,
    borderWidth: 1,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  quantityText: {
    fontSize: 16,
    fontWeight: "600",
    marginHorizontal: 12,
    minWidth: 20,
    textAlign: "center",
  },
  totalRow: {
    alignItems: "flex-end",
  },
  itemTotal: {
    fontSize: 12,
    fontWeight: "600",
    opacity: 0.7,
  },
  checkoutContainer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "rgba(0, 0, 0, 0.05)",
  },
  totalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: "600",
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: "700",
  },
  checkoutButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  checkoutButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
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
  loginButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 20,
  },
  loginButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
});
