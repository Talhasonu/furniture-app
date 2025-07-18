import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useAuth } from "@/contexts/AuthContext";
import { useThemeColor } from "@/hooks/useThemeColor";
import {
  FavoriteProduct,
  getFavoriteIds,
  toggleFavorite,
} from "@/utils/favorites";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  ImageBackground,
  Modal,
  Pressable,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

const furnitureCategories = [
  {
    id: 1,
    title: "Living Room",
    icon: "🛋️",
    image:
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=200&fit=crop",
    count: 245,
  },
  {
    id: 2,
    title: "Bedroom",
    icon: "🛏️",
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=300&h=200&fit=crop",
    count: 189,
  },
  {
    id: 3,
    title: "Dining",
    icon: "🪑",
    image:
      "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=300&h=200&fit=crop",
    count: 156,
  },
  {
    id: 4,
    title: "Office",
    icon: "🪟",
    image:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=300&h=200&fit=crop",
    count: 98,
  },
  {
    id: 5,
    title: "Storage",
    icon: "🗄️",
    image:
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=200&fit=crop",
    count: 67,
  },
  {
    id: 6,
    title: "Lighting",
    icon: "💡",
    image:
      "https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?w=300&h=200&fit=crop",
    count: 134,
  },
];

const featuredProducts = [
  {
    id: 1,
    name: "Modern Luxury Sofa Set",
    price: 899,
    originalPrice: 1299,
    image:
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop",
    rating: 4.8,
    reviews: 124,
    discount: 30,
    isFavorite: false,
    category: "Living Room",
    description: "Premium quality modern sofa with memory foam cushioning",
    inStock: true,
    stockCount: 12,
  },
  {
    id: 2,
    name: "Elegant Oak Dining Table",
    price: 599,
    originalPrice: 799,
    image:
      "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=400&fit=crop",
    rating: 4.9,
    reviews: 89,
    discount: 25,
    isFavorite: false,
    category: "Dining",
    description: "Solid oak dining table with modern finish",
    inStock: true,
    stockCount: 8,
  },
  {
    id: 3,
    name: "Luxury King Bed Frame",
    price: 1299,
    originalPrice: 1599,
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400&h=400&fit=crop",
    rating: 4.7,
    reviews: 67,
    discount: 20,
    isFavorite: false,
    category: "Bedroom",
    description: "King size bed frame with upholstered headboard",
    inStock: true,
    stockCount: 5,
  },
  {
    id: 4,
    name: "Executive Office Chair",
    price: 399,
    originalPrice: 549,
    image:
      "https://images.unsplash.com/photo-1541558869434-2840d308329a?w=400&h=400&fit=crop",
    rating: 4.6,
    reviews: 156,
    discount: 27,
    isFavorite: false,
    category: "Office",
    description: "Ergonomic office chair with lumbar support",
    inStock: true,
    stockCount: 15,
  },
];

const trendingProducts = [
  {
    id: 5,
    name: "Scandinavian Coffee Table",
    price: 299,
    originalPrice: 399,
    image:
      "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=400&h=400&fit=crop",
    rating: 4.5,
    reviews: 78,
    discount: 25,
    isFavorite: false,
    category: "Living Room",
    description: "Minimalist Scandinavian design coffee table",
    inStock: true,
    stockCount: 20,
  },
  {
    id: 6,
    name: "Modern Bookshelf",
    price: 199,
    originalPrice: 299,
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    rating: 4.4,
    reviews: 45,
    discount: 33,
    isFavorite: false,
    category: "Storage",
    description: "5-tier modern bookshelf with clean lines",
    inStock: false,
    stockCount: 0,
  },
];

export default function DashboardScreen() {
  const { user, signOut } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [favoriteProducts, setFavoriteProducts] = useState<number[]>([]);
  const [products, setProducts] = useState([
    ...featuredProducts,
    ...trendingProducts,
  ]);

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
      router.replace("/(auth)");
    }
    // Load favorite IDs
    loadFavoriteIds();
  }, [user]);

  const loadFavoriteIds = async () => {
    try {
      const favoriteIds = await getFavoriteIds();
      setFavoriteProducts(favoriteIds);

      // Update products with favorite status
      setProducts((prevProducts) =>
        prevProducts.map((product) => ({
          ...product,
          isFavorite: favoriteIds.includes(product.id),
        }))
      );
    } catch (error) {
      console.error("Error loading favorite IDs:", error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const handleLogout = async () => {
    try {
      await signOut();
      router.replace("/(auth)");
    } catch (error) {
      console.error("Logout error:", error);
    }
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

  const handleCategoryPress = (category: any) => {
    router.push({
      pathname: "/products",
      params: { category: category.title },
    });
  };

  const handleFavoritePress = async (productId: number) => {
    // Find the product from the current products list
    const product = products.find((p) => p.id === productId);
    if (!product) return;

    try {
      // Create a FavoriteProduct object
      const favoriteProduct: FavoriteProduct = {
        id: product.id,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.image,
        rating: product.rating,
        reviews: product.reviews,
        discount: product.discount,
        category: product.category,
        description: product.description,
        inStock: product.inStock,
        stockCount: product.stockCount,
        dateAdded: new Date().toISOString(),
      };

      // Toggle favorite status
      const isFavorite = await toggleFavorite(favoriteProduct);

      // Update local state
      setFavoriteProducts((prev) =>
        isFavorite
          ? [...prev, productId]
          : prev.filter((id) => id !== productId)
      );

      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.id === productId ? { ...product, isFavorite } : product
        )
      );
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  const handleSearchPress = () => {
    if (searchQuery.trim()) {
      router.push({
        pathname: "/products",
        params: { search: searchQuery },
      });
    }
  };

  const getUserDisplayName = () => {
    if (user?.displayName) return user.displayName;
    if (user?.email) return user.email.split("@")[0];
    return "User";
  };

  const UserProfileModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={showUserModal}
      onRequestClose={() => setShowUserModal(false)}
    >
      <Pressable
        style={styles.modalOverlay}
        onPress={() => setShowUserModal(false)}
      >
        <View style={[styles.modalContent, { backgroundColor }]}>
          <View style={styles.modalHandle} />

          {/* User Info Section */}
          <View style={styles.userInfoSection}>
            <View
              style={[styles.userAvatar, { backgroundColor: tintColor + "20" }]}
            >
              <Text style={[styles.userAvatarText, { color: tintColor }]}>
                {getUserDisplayName().charAt(0).toUpperCase()}
              </Text>
            </View>
            <ThemedText type="subtitle" style={styles.userName}>
              {getUserDisplayName()}
            </ThemedText>
            <ThemedText style={styles.userEmail}>{user?.email}</ThemedText>
          </View>

          {/* Menu Options */}
          <View style={styles.menuOptions}>
            <TouchableOpacity
              style={[styles.menuOption, { backgroundColor: cardColor }]}
              onPress={() => {
                setShowUserModal(false);
                // Navigate to profile (placeholder)
                console.log("Navigate to profile");
              }}
            >
              <Ionicons name="person-outline" size={24} color={tintColor} />
              <ThemedText style={styles.menuOptionText}>
                Profile Settings
              </ThemedText>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={textColor + "60"}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.menuOption, { backgroundColor: cardColor }]}
              onPress={() => {
                setShowUserModal(false);
                router.push("/favorites");
              }}
            >
              <Ionicons name="heart-outline" size={24} color={tintColor} />
              <ThemedText style={styles.menuOptionText}>
                My Favorites
              </ThemedText>
              <View style={styles.favoriteCount}>
                <Text style={styles.favoriteCountText}>
                  {favoriteProducts.length}
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.menuOption, { backgroundColor: cardColor }]}
              onPress={() => {
                setShowUserModal(false);
                router.push("/orders");
              }}
            >
              <Ionicons name="bag-outline" size={24} color={tintColor} />
              <ThemedText style={styles.menuOptionText}>My Orders</ThemedText>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={textColor + "60"}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.menuOption, { backgroundColor: cardColor }]}
              onPress={() => {
                setShowUserModal(false);
                // Settings logic
              }}
            >
              <Ionicons name="settings-outline" size={24} color={tintColor} />
              <ThemedText style={styles.menuOptionText}>Settings</ThemedText>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={textColor + "60"}
              />
            </TouchableOpacity>
          </View>

          {/* Logout Button */}
          <TouchableOpacity
            style={[styles.logoutButton, { borderColor: "#ff4757" }]}
            onPress={() => {
              setShowUserModal(false);
              handleLogout();
            }}
          >
            <Ionicons name="log-out-outline" size={24} color="#ff4757" />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </Pressable>
    </Modal>
  );

  const ProductCard = ({
    item,
    horizontal = false,
  }: {
    item: any;
    horizontal?: boolean;
  }) => (
    <TouchableOpacity
      style={[styles.productCard, horizontal && styles.horizontalProductCard]}
      onPress={() => handleProductPress(item)}
    >
      <View style={styles.productImageContainer}>
        <Image
          source={{ uri: item.image }}
          style={styles.productImage}
          resizeMode="cover"
        />

        {/* Favorite Button */}
        <TouchableOpacity
          style={styles.heartButton}
          onPress={() => handleFavoritePress(item.id)}
        >
          <Ionicons
            name={
              favoriteProducts.includes(item.id) ? "heart" : "heart-outline"
            }
            size={20}
            color={favoriteProducts.includes(item.id) ? "#ff4757" : "#ddd"}
          />
        </TouchableOpacity>

        {/* Discount Badge */}
        {item.discount > 0 && (
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
        <ThemedText style={styles.productName} numberOfLines={2}>
          {item.name}
        </ThemedText>
        <ThemedText style={styles.productCategory}>{item.category}</ThemedText>

        <View style={styles.priceRow}>
          <Text style={[styles.price, { color: tintColor }]}>
            ${item.price}
          </Text>
          {item.originalPrice && (
            <Text style={styles.originalPrice}>${item.originalPrice}</Text>
          )}
        </View>

        <View style={styles.ratingRow}>
          <Ionicons name="star" size={14} color="#FFD700" />
          <Text style={styles.rating}>{item.rating}</Text>
          <Text style={styles.reviews}>({item.reviews})</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const CategoryCard = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.categoryCard}
      onPress={() => handleCategoryPress(item)}
    >
      <ImageBackground
        source={{ uri: item.image }}
        style={styles.categoryImageContainer}
        imageStyle={styles.categoryImageStyle}
      >
        <View style={styles.categoryOverlay}>
          <Text style={styles.categoryIcon}>{item.icon}</Text>
          <ThemedText style={styles.categoryTitle}>{item.title}</ThemedText>
          <ThemedText style={styles.categoryCount}>
            {item.count} items
          </ThemedText>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );

  if (!user) {
    return null; // Will redirect to auth
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      <StatusBar barStyle="dark-content" backgroundColor={backgroundColor} />

      {/* Header */}
      <ThemedView style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <ThemedText style={styles.greeting}>Welcome back,</ThemedText>
            <ThemedText type="subtitle" style={styles.userName}>
              {getUserDisplayName()}! 👋
            </ThemedText>
          </View>

          <TouchableOpacity
            style={styles.profileButton}
            onPress={() => setShowUserModal(true)}
          >
            <View
              style={[
                styles.profileIcon,
                { backgroundColor: tintColor + "20" },
              ]}
            >
              <Text style={[styles.profileIconText, { color: tintColor }]}>
                {getUserDisplayName().charAt(0).toUpperCase()}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </ThemedView>

      <UserProfileModal />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Search Bar */}
        <ThemedView style={styles.searchSection}>
          <View style={[styles.searchBar, { backgroundColor: cardColor }]}>
            <Ionicons name="search" size={20} color={textColor + "60"} />
            <TextInput
              style={[styles.searchInput, { color: textColor }]}
              placeholder="Search furniture..."
              placeholderTextColor={textColor + "60"}
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={handleSearchPress}
              returnKeyType="search"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery("")}>
                <Ionicons
                  name="close-circle"
                  size={20}
                  color={textColor + "60"}
                />
              </TouchableOpacity>
            )}
          </View>
        </ThemedView>

        {/* Categories Section */}
        <ThemedView style={styles.categoriesSection}>
          <View style={styles.sectionHeader}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              Categories
            </ThemedText>
            <TouchableOpacity onPress={() => router.push("/categories")}>
              <ThemedText style={[styles.seeAllText, { color: tintColor }]}>
                See All
              </ThemedText>
            </TouchableOpacity>
          </View>

          <FlatList
            data={furnitureCategories}
            renderItem={({ item }) => <CategoryCard item={item} />}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesList}
          />
        </ThemedView>

        {/* Featured Products */}
        <ThemedView style={styles.featuredSection}>
          <View style={styles.sectionHeader}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              Featured Products
            </ThemedText>
            <TouchableOpacity onPress={() => router.push("/products")}>
              <ThemedText style={[styles.seeAllText, { color: tintColor }]}>
                View All
              </ThemedText>
            </TouchableOpacity>
          </View>

          <FlatList
            data={featuredProducts}
            renderItem={({ item }) => <ProductCard item={item} />}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.productsList}
          />
        </ThemedView>

        {/* Trending Now */}
        <ThemedView style={styles.trendingSection}>
          <View style={styles.sectionHeader}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              Trending Now 🔥
            </ThemedText>
          </View>

          <View style={styles.trendingGrid}>
            {trendingProducts.map((item) => (
              <ProductCard key={item.id} item={item} horizontal />
            ))}
          </View>
        </ThemedView>

        {/* Quick Actions */}
        <ThemedView style={styles.quickActionsSection}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Quick Actions
          </ThemedText>

          <View style={styles.quickActionsGrid}>
            <TouchableOpacity
              style={[styles.quickActionCard, { backgroundColor: cardColor }]}
              onPress={() => router.push("/favorites")}
            >
              <Ionicons name="heart" size={24} color="#ff4757" />
              <ThemedText style={styles.quickActionText}>Favorites</ThemedText>
              <ThemedText style={styles.quickActionCount}>
                {favoriteProducts.length} items
              </ThemedText>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.quickActionCard, { backgroundColor: cardColor }]}
              onPress={() => router.push("/orders")}
            >
              <Ionicons name="bag" size={24} color={tintColor} />
              <ThemedText style={styles.quickActionText}>Orders</ThemedText>
              <ThemedText style={styles.quickActionCount}>
                View history
              </ThemedText>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.quickActionCard, { backgroundColor: cardColor }]}
              onPress={() => console.log("Navigate to support")}
            >
              <Ionicons name="headset" size={24} color="#2ed573" />
              <ThemedText style={styles.quickActionText}>Support</ThemedText>
              <ThemedText style={styles.quickActionCount}>Get help</ThemedText>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.quickActionCard, { backgroundColor: cardColor }]}
              onPress={() => console.log("Navigate to offers")}
            >
              <Ionicons name="gift" size={24} color="#ffa502" />
              <ThemedText style={styles.quickActionText}>Offers</ThemedText>
              <ThemedText style={styles.quickActionCount}>Save more</ThemedText>
            </TouchableOpacity>
          </View>
        </ThemedView>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 0, 0, 0.05)",
    elevation: 3,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  headerContent: {
    
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerLeft: {
    flex: 1,
  },
  greeting: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 2,
  },
  userName: {
    fontSize: 18,
    fontWeight: "700",
  },
  profileButton: {
    padding: 4,
  },
  profileIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  profileIconText: {
    fontSize: 18,
    fontWeight: "600",
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 20,
    paddingBottom: 40,
    elevation: 10,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    maxHeight: "80%",
  },
  modalHandle: {
    width: 50,
    height: 5,
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    borderRadius: 3,
    alignSelf: "center",
    marginBottom: 20,
  },
  userInfoSection: {
    alignItems: "center",
    marginBottom: 30,
  },
  userAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  userAvatarText: {
    fontSize: 32,
    fontWeight: "700",
  },
  userEmail: {
    fontSize: 14,
    opacity: 0.6,
    marginTop: 4,
  },
  menuOptions: {
    gap: 12,
  },
  menuOption: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 16,
    elevation: 1,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  menuOptionText: {
    flex: 1,
    marginLeft: 16,
    fontSize: 16,
    fontWeight: "500",
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
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 16,
    borderWidth: 2,
    marginTop: 20,
  },
  logoutText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: "600",
    color: "#ff4757",
  },

  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },

  // Search Section
  searchSection: {
    padding: 20,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    elevation: 2,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    paddingVertical: 0,
  },

  // Categories
  categoriesSection: {
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: "600",
  },
  categoriesList: {
    paddingRight: 20,
  },
  categoryCard: {
    marginRight: 16,
    width: 120,
    height: 140,
  },
  categoryImageContainer: {
    width: "100%",
    height: "100%",
    borderRadius: 20,
    overflow: "hidden",
  },
  categoryImageStyle: {
    borderRadius: 20,
  },
  categoryOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "center",
    alignItems: "center",
    padding: 12,
  },
  categoryIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  categoryTitle: {
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
    color: "white",
    marginBottom: 4,
  },
  categoryCount: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.8)",
    textAlign: "center",
  },

  // Products
  featuredSection: {
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  productsList: {
    paddingRight: 20,
  },
  productCard: {
    width: 200,
    marginRight: 16,
    backgroundColor: "white",
    borderRadius: 20,
    overflow: "hidden",
    elevation: 4,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
  },
  horizontalProductCard: {
    width: (width - 52) / 2,
    margin: 6,
  },
  productImageContainer: {
    position: "relative",
  },
  productImage: {
    width: "100%",
    height: 140,
    backgroundColor: "rgba(0, 0, 0, 0.03)",
  },
  heartButton: {
    position: "absolute",
    top: 12,
    left: 12,
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
    top: 12,
    right: 12,
    backgroundColor: "#ff4757",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    elevation: 2,
  },
  discountText: {
    color: "white",
    fontSize: 10,
    fontWeight: "700",
  },
  outOfStockOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    paddingVertical: 6,
    alignItems: "center",
  },
  outOfStockText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },
  productInfo: {
    padding: 16,
  },
  productName: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
    lineHeight: 18,
  },
  productCategory: {
    fontSize: 12,
    opacity: 0.6,
    marginBottom: 8,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  price: {
    fontSize: 18,
    fontWeight: "700",
    marginRight: 8,
  },
  originalPrice: {
    fontSize: 12,
    textDecorationLine: "line-through",
    opacity: 0.5,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
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

  // Trending Section
  trendingSection: {
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  trendingGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  // Quick Actions
  quickActionsSection: {
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  quickActionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  quickActionCard: {
    width: (width - 52) / 2,
    padding: 20,
    borderRadius: 16,
    alignItems: "center",
    marginBottom: 12,
    elevation: 2,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: 8,
    marginBottom: 4,
  },
  quickActionCount: {
    fontSize: 12,
    opacity: 0.6,
  },
});
