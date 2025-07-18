import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useAuth } from "@/contexts/AuthContext";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
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

// Order status types
type OrderStatus = "processing" | "shipped" | "delivered" | "cancelled";

interface Order {
  id: string;
  orderNumber: string;
  items: Array<{
    id: number;
    name: string;
    price: number;
    image: string;
    quantity: number;
  }>;
  totalAmount: number;
  status: OrderStatus;
  orderDate: Date;
  estimatedDelivery?: Date;
  canCancel: boolean;
  trackingNumber?: string;
}

// Mock orders data with time-based progression
const mockOrders: Order[] = [
  {
    id: "1",
    orderNumber: "ORD-2024-001",
    items: [
      {
        id: 1,
        name: "Modern Luxury Sofa Set",
        price: 899,
        image:
          "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop",
        quantity: 1,
      },
    ],
    totalAmount: 899,
    status: "processing",
    orderDate: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
    canCancel: true,
  },
  {
    id: "2",
    orderNumber: "ORD-2024-002",
    items: [
      {
        id: 3,
        name: "Luxury King Bed Frame",
        price: 1299,
        image:
          "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400&h=400&fit=crop",
        quantity: 1,
      },
      {
        id: 5,
        name: "Scandinavian Coffee Table",
        price: 299,
        image:
          "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=400&h=400&fit=crop",
        quantity: 1,
      },
    ],
    totalAmount: 1598,
    status: "shipped",
    orderDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    estimatedDelivery: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
    canCancel: false,
    trackingNumber: "TRK123456789",
  },
  {
    id: "3",
    orderNumber: "ORD-2024-003",
    items: [
      {
        id: 4,
        name: "Executive Office Chair",
        price: 399,
        image:
          "https://images.unsplash.com/photo-1541558869434-2840d308329a?w=400&h=400&fit=crop",
        quantity: 2,
      },
    ],
    totalAmount: 798,
    status: "delivered",
    orderDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
    canCancel: false,
  },
  {
    id: "4",
    orderNumber: "ORD-2024-004",
    items: [
      {
        id: 6,
        name: "Modern Bookshelf",
        price: 199,
        image:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
        quantity: 1,
      },
    ],
    totalAmount: 199,
    status: "cancelled",
    orderDate: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
    canCancel: false,
  },
];

export default function OrdersScreen() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [loading, setLoading] = useState(false);
  const [refreshTimer, setRefreshTimer] = useState<number | null>(null);

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
      Alert.alert("Login Required", "Please log in to view your orders", [
        {
          text: "Go to Login",
          onPress: () => router.replace("/(auth)/signin"),
        },
      ]);
      return;
    }

    loadOrders();

    // Set up timer to update order statuses
    const timer = setInterval(() => {
      updateOrderStatuses();
    }, 60000); // Check every minute

    setRefreshTimer(timer);

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [user]);

  const loadOrders = async () => {
    setLoading(true);
    try {
      // In a real app, you would fetch from your backend
      // const response = await fetch('/api/orders');
      // const ordersData = await response.json();

      // For now, using mock data with status updates
      updateOrderStatuses();
      setTimeout(() => {
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error("Error loading orders:", error);
      setLoading(false);
    }
  };

  const updateOrderStatuses = () => {
    setOrders((prevOrders) =>
      prevOrders.map((order) => {
        const now = new Date();
        const timeSinceOrder = now.getTime() - order.orderDate.getTime();
        const minutesSinceOrder = timeSinceOrder / (1000 * 60);

        // Update status based on time elapsed
        if (order.status === "processing" && minutesSinceOrder >= 10) {
          return {
            ...order,
            status: "shipped" as OrderStatus,
            canCancel: false,
            trackingNumber:
              "TRK" + Math.random().toString(36).substr(2, 9).toUpperCase(),
            estimatedDelivery: new Date(now.getTime() + 24 * 60 * 60 * 1000), // 1 day from now
          };
        }

        if (
          order.status === "shipped" &&
          order.estimatedDelivery &&
          now >= order.estimatedDelivery
        ) {
          return {
            ...order,
            status: "delivered" as OrderStatus,
          };
        }

        // Update cancel ability based on 10-minute window
        if (order.status === "processing" && minutesSinceOrder >= 10) {
          return {
            ...order,
            canCancel: false,
          };
        }

        return order;
      })
    );
  };

  const handleCancelOrder = (orderId: string) => {
    const order = orders.find((o) => o.id === orderId);
    if (!order) return;

    const now = new Date();
    const timeSinceOrder = now.getTime() - order.orderDate.getTime();
    const minutesSinceOrder = timeSinceOrder / (1000 * 60);

    if (minutesSinceOrder > 10) {
      Alert.alert(
        "Cannot Cancel Order",
        "This order can only be cancelled within 10 minutes of placement."
      );
      return;
    }

    Alert.alert(
      "Cancel Order",
      `Are you sure you want to cancel order ${order.orderNumber}?`,
      [
        { text: "No", style: "cancel" },
        {
          text: "Yes, Cancel",
          style: "destructive",
          onPress: () => {
            setOrders((prevOrders) =>
              prevOrders.map((o) =>
                o.id === orderId
                  ? {
                      ...o,
                      status: "cancelled" as OrderStatus,
                      canCancel: false,
                    }
                  : o
              )
            );
            Alert.alert(
              "Order Cancelled",
              "Your order has been successfully cancelled."
            );
          },
        },
      ]
    );
  };

  const handleReorder = (order: Order) => {
    Alert.alert(
      "Reorder Items",
      `Add all items from order ${order.orderNumber} to your cart?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Add to Cart",
          onPress: () => {
            Alert.alert(
              "Added to Cart",
              "All items have been added to your cart!",
              [
                { text: "Continue Shopping" },
                { text: "View Cart", onPress: () => router.push("/cart") },
              ]
            );
          },
        },
      ]
    );
  };

  const handleTrackOrder = (order: Order) => {
    if (order.trackingNumber) {
      Alert.alert(
        "Track Order",
        `Tracking Number: ${order.trackingNumber}\n\nThis would open the tracking page in a real app.`,
        [{ text: "OK" }]
      );
    }
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case "processing":
        return "#ffa502";
      case "shipped":
        return "#3742fa";
      case "delivered":
        return "#2ed573";
      case "cancelled":
        return "#ff4757";
      default:
        return "#8e8e8e";
    }
  };

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case "processing":
        return "time-outline";
      case "shipped":
        return "car-outline";
      case "delivered":
        return "checkmark-circle-outline";
      case "cancelled":
        return "close-circle-outline";
      default:
        return "help-outline";
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getTimeRemaining = (orderDate: Date) => {
    const now = new Date();
    const timeSinceOrder = now.getTime() - orderDate.getTime();
    const minutesSinceOrder = timeSinceOrder / (1000 * 60);
    const timeRemaining = 10 - minutesSinceOrder;

    if (timeRemaining > 0) {
      const minutes = Math.floor(timeRemaining);
      const seconds = Math.floor((timeRemaining - minutes) * 60);
      return `${minutes}m ${seconds}s`;
    }
    return null;
  };

  const OrderCard = ({ item }: { item: Order }) => (
    <View style={[styles.orderCard, { backgroundColor: cardColor }]}>
      {/* Order Header */}
      <View style={styles.orderHeader}>
        <View style={styles.orderInfo}>
          <ThemedText style={styles.orderNumber}>{item.orderNumber}</ThemedText>
          <ThemedText style={styles.orderDate}>
            {formatDate(item.orderDate)}
          </ThemedText>
        </View>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor(item.status) + "20" },
          ]}
        >
          <Ionicons
            name={getStatusIcon(item.status) as any}
            size={16}
            color={getStatusColor(item.status)}
          />
          <Text
            style={[styles.statusText, { color: getStatusColor(item.status) }]}
          >
            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
          </Text>
        </View>
      </View>

      {/* Cancellation Timer */}
      {item.status === "processing" && item.canCancel && (
        <View style={styles.timerContainer}>
          <Ionicons name="time" size={16} color="#ffa502" />
          <Text style={styles.timerText}>
            Cancel within: {getTimeRemaining(item.orderDate)}
          </Text>
        </View>
      )}

      {/* Order Items */}
      <View style={styles.itemsContainer}>
        {item.items.map((orderItem, index) => (
          <View key={index} style={styles.orderItem}>
            <Image
              source={{ uri: orderItem.image }}
              style={styles.itemImage}
              resizeMode="cover"
            />
            <View style={styles.itemInfo}>
              <ThemedText style={styles.itemName} numberOfLines={2}>
                {orderItem.name}
              </ThemedText>
              <ThemedText style={styles.itemDetails}>
                Qty: {orderItem.quantity} • ${orderItem.price}
              </ThemedText>
            </View>
          </View>
        ))}
      </View>

      {/* Order Total */}
      <View style={styles.orderTotal}>
        <ThemedText style={styles.totalLabel}>Total Amount:</ThemedText>
        <ThemedText style={[styles.totalAmount, { color: tintColor }]}>
          ${item.totalAmount}
        </ThemedText>
      </View>

      {/* Tracking Info */}
      {item.trackingNumber && (
        <View style={styles.trackingContainer}>
          <Ionicons name="location-outline" size={16} color={tintColor} />
          <ThemedText style={styles.trackingText}>
            Tracking: {item.trackingNumber}
          </ThemedText>
        </View>
      )}

      {/* Estimated Delivery */}
      {item.estimatedDelivery && item.status === "shipped" && (
        <View style={styles.deliveryContainer}>
          <Ionicons name="calendar-outline" size={16} color="#2ed573" />
          <ThemedText style={styles.deliveryText}>
            Est. Delivery: {formatDate(item.estimatedDelivery)}
          </ThemedText>
        </View>
      )}

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        {item.canCancel && item.status === "processing" && (
          <TouchableOpacity
            style={[styles.actionButton, styles.cancelButton]}
            onPress={() => handleCancelOrder(item.id)}
          >
            <Ionicons name="close" size={16} color="#ff4757" />
            <Text style={[styles.actionButtonText, { color: "#ff4757" }]}>
              Cancel
            </Text>
          </TouchableOpacity>
        )}

        {item.trackingNumber && (
          <TouchableOpacity
            style={[styles.actionButton, { borderColor: tintColor }]}
            onPress={() => handleTrackOrder(item)}
          >
            <Ionicons name="location" size={16} color={tintColor} />
            <Text style={[styles.actionButtonText, { color: tintColor }]}>
              Track
            </Text>
          </TouchableOpacity>
        )}

        {(item.status === "delivered" || item.status === "cancelled") && (
          <TouchableOpacity
            style={[styles.actionButton, { borderColor: tintColor }]}
            onPress={() => handleReorder(item)}
          >
            <Ionicons name="refresh" size={16} color={tintColor} />
            <Text style={[styles.actionButtonText, { color: tintColor }]}>
              Reorder
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
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

        <ThemedText style={styles.headerTitle}>My Orders</ThemedText>

        <View style={styles.headerRight}>
          <View style={styles.orderCount}>
            <Text style={[styles.orderCountText, { color: tintColor }]}>
              {orders.length}
            </Text>
          </View>
        </View>
      </ThemedView>

      {orders.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="bag-outline" size={80} color={textColor + "30"} />
          <ThemedText type="subtitle" style={styles.emptyTitle}>
            No Orders Yet
          </ThemedText>
          <ThemedText style={styles.emptySubtitle}>
            Start shopping to see your orders here
          </ThemedText>
          <TouchableOpacity
            style={[styles.browseButton, { backgroundColor: tintColor }]}
            onPress={() => router.push("/products")}
          >
            <Text style={styles.browseButtonText}>Start Shopping</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={orders}
          renderItem={({ item }) => <OrderCard item={item} />}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          refreshing={loading}
          onRefresh={loadOrders}
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
  orderCount: {
    backgroundColor: "#6366f1",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    minWidth: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  orderCountText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },
  listContainer: {
    padding: 16,
  },
  orderCard: {
    marginBottom: 16,
    borderRadius: 16,
    padding: 16,
    elevation: 3,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  orderInfo: {
    flex: 1,
  },
  orderNumber: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  orderDate: {
    fontSize: 12,
    opacity: 0.6,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },
  timerContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffa502" + "20",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 12,
    gap: 4,
  },
  timerText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#ffa502",
  },
  itemsContainer: {
    marginBottom: 12,
  },
  orderItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
    backgroundColor: "rgba(0, 0, 0, 0.03)",
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 4,
    lineHeight: 18,
  },
  itemDetails: {
    fontSize: 12,
    opacity: 0.6,
  },
  orderTotal: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(0, 0, 0, 0.1)",
    marginBottom: 12,
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: "500",
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: "700",
  },
  trackingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 4,
  },
  trackingText: {
    fontSize: 12,
    opacity: 0.8,
  },
  deliveryContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 4,
  },
  deliveryText: {
    fontSize: 12,
    opacity: 0.8,
  },
  actionButtons: {
    flexDirection: "row",
    gap: 8,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    gap: 4,
  },
  cancelButton: {
    borderColor: "#ff4757",
  },
  actionButtonText: {
    fontSize: 12,
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
});
