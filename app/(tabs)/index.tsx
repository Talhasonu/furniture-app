import { useAuth } from "@/contexts/AuthContext";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Feather, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import {
  Alert,
  Animated,
  Dimensions,
  FlatList,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width, height } = Dimensions.get("window");

const CATEGORIES = [
  { id: "1", name: "Living Room", icon: "sofa", color: "#E8F4F8" },
  { id: "2", name: "Bedroom", icon: "bed", color: "#FFF4E6" },
  { id: "3", name: "Kitchen", icon: "restaurant", color: "#F0F8E6" },
  { id: "4", name: "Office", icon: "business", color: "#F8E6F4" },
  { id: "5", name: "Outdoor", icon: "nature", color: "#E6F4F8" },
  { id: "6", name: "Storage", icon: "archive", color: "#F4E6E6" },
];

const FEATURED_PRODUCTS = [
  {
    id: "1",
    name: "Modern Sectional Sofa",
    price: "$1,299",
    originalPrice: "$1,599",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400",
    rating: 4.8,
    reviews: 124,
    tag: "Best Seller",
  },
  {
    id: "2",
    name: "Scandinavian Dining Table",
    price: "$899",
    originalPrice: "$1,199",
    image: "https://images.unsplash.com/photo-1449247709967-d4461a6a6103?w=400",
    rating: 4.9,
    reviews: 89,
    tag: "New Arrival",
  },
  {
    id: "3",
    name: "Luxury King Bed Frame",
    price: "$1,899",
    originalPrice: "$2,299",
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400",
    rating: 4.7,
    reviews: 203,
    tag: "Limited",
  },
  {
    id: "4",
    name: "Ergonomic Office Chair",
    price: "$599",
    originalPrice: "$799",
    image: "https://images.unsplash.com/photo-1541558869434-2840d308329a?w=400",
    rating: 4.6,
    reviews: 156,
    tag: "Sale",
  },
];

export default function HomeScreen() {
  const { user, signOut } = useAuth();
  const [scrollY] = useState(new Animated.Value(0));
  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");
  const tintColor = useThemeColor({}, "tint");

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      Alert.alert("Error", "Failed to sign out");
    }
  };

  const renderCategory = ({ item }: { item: (typeof CATEGORIES)[0] }) => (
    <TouchableOpacity
      style={[styles.categoryItem, { backgroundColor: item.color }]}
    >
      <MaterialIcons name={item.icon as any} size={32} color="#2A2A2A" />
      <Text style={styles.categoryText}>{item.name}</Text>
    </TouchableOpacity>
  );

  const renderProduct = ({ item }: { item: (typeof FEATURED_PRODUCTS)[0] }) => (
    <TouchableOpacity style={styles.productCard}>
      <View style={styles.productImageContainer}>
        <Image source={{ uri: item.image }} style={styles.productImage} />
        <View
          style={[
            styles.productTag,
            {
              backgroundColor:
                item.tag === "Sale"
                  ? "#FF6B6B"
                  : item.tag === "New Arrival"
                  ? "#4ECDC4"
                  : "#FFD93D",
            },
          ]}
        >
          <Text style={styles.productTagText}>{item.tag}</Text>
        </View>
        <TouchableOpacity style={styles.favoriteButton}>
          <Ionicons name="heart-outline" size={20} color="#666" />
        </TouchableOpacity>
      </View>
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{item.name}</Text>
        <View style={styles.ratingContainer}>
          <Ionicons name="star" size={14} color="#FFD700" />
          <Text style={styles.ratingText}>{item.rating}</Text>
          <Text style={styles.reviewText}>({item.reviews})</Text>
        </View>
        <View style={styles.priceContainer}>
          <Text style={styles.price}>{item.price}</Text>
          <Text style={styles.originalPrice}>{item.originalPrice}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent
      />

      {/* Animated Header */}
      <Animated.View style={[styles.header, { opacity: headerOpacity }]}>
        <View style={styles.headerBlur}>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>FurniLux</Text>
            <View style={styles.headerRight}>
              <TouchableOpacity style={styles.headerButton}>
                <Ionicons name="search-outline" size={24} color="#2A2A2A" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.headerButton}>
                <Ionicons name="bag-outline" size={24} color="#2A2A2A" />
                <View style={styles.cartBadge}>
                  <Text style={styles.cartBadgeText}>2</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Animated.View>

      <Animated.ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        {/* Hero Section */}
        <LinearGradient
          colors={["#667eea", "#764ba2"]}
          style={styles.heroSection}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.heroContent}>
            <View style={styles.topBar}>
              <View>
                <Text style={styles.greeting}>
                  Hello, {user?.email?.split("@")[0] || "Guest"}!
                </Text>
                <Text style={styles.subGreeting}>
                  Find your dream furniture
                </Text>
              </View>
              <TouchableOpacity
                onPress={handleSignOut}
                style={styles.profileButton}
              >
                <Ionicons
                  name="person-circle-outline"
                  size={32}
                  color="white"
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.searchBar}>
              <Ionicons name="search-outline" size={20} color="#666" />
              <Text style={styles.searchPlaceholder}>
                Search furniture, brands...
              </Text>
              <Feather name="filter" size={20} color="#666" />
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* Categories */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: textColor }]}>
              Categories
            </Text>
            <TouchableOpacity>
              <Text style={[styles.seeAll, { color: tintColor }]}>See All</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={CATEGORIES}
            renderItem={renderCategory}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesList}
          />
        </View>

        {/* Banner */}
        <View style={styles.section}>
          <LinearGradient
            colors={["#FF9A8B", "#A8E6CF"]}
            style={styles.banner}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <View style={styles.bannerContent}>
              <View style={styles.bannerText}>
                <Text style={styles.bannerTitle}>Special Offer</Text>
                <Text style={styles.bannerSubtitle}>
                  Up to 50% off on selected items
                </Text>
                <TouchableOpacity style={styles.bannerButton}>
                  <Text style={styles.bannerButtonText}>Shop Now</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.bannerImageContainer}>
                <Image
                  source={{
                    uri: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=200",
                  }}
                  style={styles.bannerImage}
                />
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Featured Products */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: textColor }]}>
              Featured Products
            </Text>
            <TouchableOpacity>
              <Text style={[styles.seeAll, { color: tintColor }]}>
                View All
              </Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={FEATURED_PRODUCTS}
            renderItem={renderProduct}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.productsList}
          />
        </View>

        {/* Bottom Spacing */}
        <View style={{ height: 100 }} />
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    paddingTop: StatusBar.currentHeight || 44,
  },
  headerBlur: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: "rgba(255,255,255,0.9)",
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2A2A2A",
  },
  headerRight: {
    flexDirection: "row",
    gap: 12,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  cartBadge: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: "#FF6B6B",
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  cartBadgeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  scrollView: {
    flex: 1,
  },
  heroSection: {
    paddingTop: 80,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  heroContent: {
    gap: 20,
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  greeting: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
    marginBottom: 4,
  },
  subGreeting: {
    fontSize: 16,
    color: "rgba(255,255,255,0.8)",
  },
  profileButton: {
    padding: 4,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 15,
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  searchPlaceholder: {
    flex: 1,
    fontSize: 16,
    color: "#666",
  },
  section: {
    paddingVertical: 24,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
  },
  seeAll: {
    fontSize: 16,
    fontWeight: "600",
  },
  categoriesList: {
    gap: 16,
  },
  categoryItem: {
    width: 90,
    height: 90,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#2A2A2A",
    textAlign: "center",
  },
  banner: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 8,
  },
  bannerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  bannerText: {
    flex: 1,
  },
  bannerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    marginBottom: 4,
  },
  bannerSubtitle: {
    fontSize: 14,
    color: "rgba(255,255,255,0.9)",
    marginBottom: 12,
  },
  bannerButton: {
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    alignSelf: "flex-start",
  },
  bannerButtonText: {
    color: "#667eea",
    fontWeight: "bold",
    fontSize: 14,
  },
  bannerImageContainer: {
    width: 80,
    height: 80,
  },
  bannerImage: {
    width: "100%",
    height: "100%",
    borderRadius: 40,
  },
  productsList: {
    gap: 16,
  },
  productCard: {
    width: 220,
    backgroundColor: "white",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  productImageContainer: {
    position: "relative",
  },
  productImage: {
    width: "100%",
    height: 160,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  productTag: {
    position: "absolute",
    top: 12,
    left: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  productTagText: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
  },
  favoriteButton: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  productInfo: {
    padding: 16,
  },
  productName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2A2A2A",
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 8,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#2A2A2A",
  },
  reviewText: {
    fontSize: 12,
    color: "#666",
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  price: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#667eea",
  },
  originalPrice: {
    fontSize: 14,
    color: "#999",
    textDecorationLine: "line-through",
  },
});
