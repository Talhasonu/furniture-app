import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useAuth } from "@/contexts/AuthContext";
import { useThemeColor } from "@/hooks/useThemeColor";
import { router, useLocalSearchParams } from "expo-router";
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
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

const allProducts = [
  // Chairs
  {
    id: 1,
    name: "Modern Dining Chair",
    price: "$199",
    originalPrice: "$299",
    rating: 4.8,
    discount: "33% OFF",
    category: "Chairs",
    isFavorite: false,
    image:
      "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=400&h=400&fit=crop",
  },
  {
    id: 2,
    name: "Executive Office Chair",
    price: "$349",
    originalPrice: "$499",
    rating: 4.9,
    discount: "30% OFF",
    category: "Chairs",
    isFavorite: false,
    image:
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop",
  },
  {
    id: 3,
    name: "Velvet Accent Chair",
    price: "$289",
    originalPrice: "$399",
    rating: 4.7,
    discount: "28% OFF",
    category: "Chairs",
    isFavorite: false,
    image:
      "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=400&h=400&fit=crop",
  },
  {
    id: 4,
    name: "Scandinavian Dining Chair",
    price: "$159",
    originalPrice: "$219",
    rating: 4.6,
    discount: "27% OFF",
    category: "Chairs",
    isFavorite: false,
    image:
      "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=400&h=400&fit=crop&crop=faces",
  },
  {
    id: 5,
    name: "Leather Lounge Chair",
    price: "$699",
    originalPrice: "$899",
    rating: 4.9,
    discount: "22% OFF",
    category: "Chairs",
    isFavorite: false,
    image:
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop&crop=faces",
  },

  // Tables
  {
    id: 6,
    name: "Oak Dining Table",
    price: "$799",
    originalPrice: "$1,099",
    rating: 4.8,
    discount: "27% OFF",
    category: "Tables",
    isFavorite: false,
    image:
      "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=400&fit=crop",
  },
  {
    id: 7,
    name: "Glass Coffee Table",
    price: "$399",
    originalPrice: "$549",
    rating: 4.7,
    discount: "27% OFF",
    category: "Tables",
    isFavorite: false,
    image:
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop&crop=entropy",
  },
  {
    id: 8,
    name: "Wooden Side Table",
    price: "$199",
    originalPrice: "$279",
    rating: 4.6,
    discount: "29% OFF",
    category: "Tables",
    isFavorite: false,
    image:
      "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=400&fit=crop&crop=faces",
  },
  {
    id: 9,
    name: "Modern Console Table",
    price: "$459",
    originalPrice: "$629",
    rating: 4.8,
    discount: "27% OFF",
    category: "Tables",
    isFavorite: false,
    image:
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop&crop=left",
  },

  // Cupboards
  {
    id: 10,
    name: "Modern Wardrobe",
    price: "$899",
    originalPrice: "$1,199",
    rating: 4.8,
    discount: "25% OFF",
    category: "Cupboards",
    isFavorite: false,
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop",
  },
  {
    id: 11,
    name: "Kitchen Cabinet Set",
    price: "$1,299",
    originalPrice: "$1,699",
    rating: 4.9,
    discount: "24% OFF",
    category: "Cupboards",
    isFavorite: false,
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop&crop=faces",
  },
  {
    id: 12,
    name: "Bathroom Vanity",
    price: "$549",
    originalPrice: "$729",
    rating: 4.7,
    discount: "25% OFF",
    category: "Cupboards",
    isFavorite: false,
    image:
      "https://images.unsplash.com/photo-1620626011761-996317b8d101?w=400&h=400&fit=crop",
  },

  // Lamps
  {
    id: 13,
    name: "Modern Floor Lamp",
    price: "$199",
    originalPrice: "$279",
    rating: 4.6,
    discount: "29% OFF",
    category: "Lamps",
    isFavorite: false,
    image:
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&h=400&fit=crop",
  },
  {
    id: 14,
    name: "Table Lamp Set",
    price: "$129",
    originalPrice: "$179",
    rating: 4.5,
    discount: "28% OFF",
    category: "Lamps",
    isFavorite: false,
    image:
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&h=400&fit=crop&crop=faces",
  },
  {
    id: 15,
    name: "Pendant Light",
    price: "$89",
    originalPrice: "$129",
    rating: 4.4,
    discount: "31% OFF",
    category: "Lamps",
    isFavorite: false,
    image:
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&h=400&fit=crop&crop=left",
  },

  // Kitchen
  {
    id: 16,
    name: "Kitchen Island",
    price: "$899",
    originalPrice: "$1,199",
    rating: 4.8,
    discount: "25% OFF",
    category: "Kitchen",
    isFavorite: false,
    image:
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop",
  },
  {
    id: 17,
    name: "Kitchen Bar Stools",
    price: "$299",
    originalPrice: "$399",
    rating: 4.7,
    discount: "25% OFF",
    category: "Kitchen",
    isFavorite: false,
    image:
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop&crop=faces",
  },
  {
    id: 18,
    name: "Kitchen Cart",
    price: "$199",
    originalPrice: "$279",
    rating: 4.6,
    discount: "29% OFF",
    category: "Kitchen",
    isFavorite: false,
    image:
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop&crop=left",
  },

  // Bathroom
  {
    id: 19,
    name: "Bathroom Mirror Cabinet",
    price: "$349",
    originalPrice: "$459",
    rating: 4.7,
    discount: "24% OFF",
    category: "Bathroom",
    isFavorite: false,
    image:
      "https://images.unsplash.com/photo-1620626011761-996317b8d101?w=400&h=400&fit=crop",
  },
  {
    id: 20,
    name: "Bathroom Storage Unit",
    price: "$199",
    originalPrice: "$279",
    rating: 4.5,
    discount: "29% OFF",
    category: "Bathroom",
    isFavorite: false,
    image:
      "https://images.unsplash.com/photo-1620626011761-996317b8d101?w=400&h=400&fit=crop&crop=faces",
  },

  // Outdoor
  {
    id: 21,
    name: "Outdoor Patio Set",
    price: "$599",
    originalPrice: "$799",
    rating: 4.5,
    discount: "25% OFF",
    category: "Outdoor",
    isFavorite: false,
    image:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop",
  },
  {
    id: 22,
    name: "Garden Bench",
    price: "$299",
    originalPrice: "$399",
    rating: 4.6,
    discount: "25% OFF",
    category: "Outdoor",
    isFavorite: false,
    image:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop&crop=faces",
  },

  // Decor
  {
    id: 23,
    name: "Wall Art Set",
    price: "$149",
    originalPrice: "$199",
    rating: 4.4,
    discount: "25% OFF",
    category: "Decor",
    isFavorite: false,
    image:
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop&crop=entropy",
  },
  {
    id: 24,
    name: "Decorative Vase",
    price: "$79",
    originalPrice: "$109",
    rating: 4.3,
    discount: "28% OFF",
    category: "Decor",
    isFavorite: false,
    image:
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop&crop=right",
  },
];

export default function ProductsScreen() {
  const { user } = useAuth();
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

  const [products, setProducts] = useState(allProducts);
  const [filteredProducts, setFilteredProducts] = useState(allProducts);
  const [searchQuery, setSearchQuery] = useState("");

  const params = useLocalSearchParams();
  const selectedCategory = params.category as string;

  useEffect(() => {
    // Check if user is authenticated
    if (!user) {
      Alert.alert("Login Required", "Please log in to view products", [
        {
          text: "Go to Login",
          onPress: () => router.replace("/(auth)/signin"),
        },
      ]);
      return;
    }
  }, [user]);

  useEffect(() => {
    let filtered = products;

    // Filter by category if specified
    if (selectedCategory) {
      filtered = filtered.filter(
        (product) =>
          product.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
  }, [products, selectedCategory, searchQuery]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleFavoritePress = (productId: number) => {
    if (!user) {
      Alert.alert("Login Required", "Please log in to manage your favorites", [
        {
          text: "Go to Login",
          onPress: () => router.replace("/(auth)/signin"),
        },
      ]);
      return;
    }

    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === productId
          ? { ...product, isFavorite: !product.isFavorite }
          : product
      )
    );
  };

  const handleProductPress = (product: any) => {
    if (!user) {
      Alert.alert("Login Required", "Please log in to view product details", [
        {
          text: "Go to Login",
          onPress: () => router.replace("/(auth)/signin"),
        },
      ]);
      return;
    }

    router.push({
      pathname: "/product-detail",
      params: { productData: JSON.stringify(product) },
    });
  };

  const renderProduct = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={[styles.productCard, { backgroundColor: cardColor }]}
      onPress={() => handleProductPress(item)}
    >
      <View style={styles.productImageContainer}>
        <Image
          source={{ uri: item.image }}
          style={styles.productImage}
          defaultSource={{
            uri: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==",
          }}
        />

        {/* Heart Icon */}
        <TouchableOpacity
          style={[styles.heartButton, { backgroundColor: cardColor }]}
          onPress={() => handleFavoritePress(item.id)}
        >
          <Text
            style={[
              styles.heartIcon,
              { color: item.isFavorite ? "#ff4757" : "#ddd" },
            ]}
          >
            {item.isFavorite ? "♥" : "♡"}
          </Text>
        </TouchableOpacity>

        {/* Discount Badge */}
        {item.discount && (
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>{item.discount}</Text>
          </View>
        )}
      </View>

      <View style={styles.productInfo}>
        <ThemedText style={styles.categoryLabel}>{item.category}</ThemedText>
        <ThemedText style={[styles.productName, { color: textColor }]}>
          {item.name}
        </ThemedText>

        <View style={styles.ratingRow}>
          <Text style={styles.rating}>⭐ {item.rating}</Text>
        </View>

        <View style={styles.priceRow}>
          <Text style={[styles.price, { color: tintColor }]}>{item.price}</Text>
          {item.originalPrice && (
            <Text style={styles.originalPrice}>{item.originalPrice}</Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      <StatusBar barStyle="dark-content" backgroundColor={backgroundColor} />

      {/* Header */}
      <ThemedView style={[styles.header, { backgroundColor: cardColor }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={[styles.backButton, { color: tintColor }]}>‹</Text>
        </TouchableOpacity>
        <ThemedText
          type="title"
          style={[styles.headerTitle, { color: textColor }]}
        >
          {selectedCategory || "All Products"}
        </ThemedText>
        <TouchableOpacity>
          <Text style={styles.filterButton}>⚙️</Text>
        </TouchableOpacity>
      </ThemedView>

      {/* Search Bar */}
      <ThemedView style={styles.searchContainer}>
        <View style={[styles.searchBar, { backgroundColor: cardColor }]}>
          <Text style={styles.searchIcon}>⌕</Text>
          <TextInput
            style={[styles.searchInput, { color: textColor }]}
            placeholder="Search products..."
            placeholderTextColor={textColor + "60"}
            value={searchQuery}
            onChangeText={handleSearch}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => handleSearch("")}>
              <Text style={styles.clearIcon}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </ThemedView>

      {/* Products Grid */}
      <FlatList
        data={filteredProducts}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        contentContainerStyle={styles.listContainer}
        columnWrapperStyle={styles.row}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>⊠</Text>
            <ThemedText style={styles.emptyText}>No products found</ThemedText>
            <ThemedText style={styles.emptySubtext}>
              {selectedCategory
                ? `No products in ${selectedCategory} category`
                : "Try a different search term"}
            </ThemedText>
          </View>
        }
      />
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
    paddingTop: 16,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 0, 0, 0.05)",
    elevation: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  backButton: {
    fontSize: 32,
    fontWeight: "300",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  filterButton: {
    fontSize: 20,
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 16,
    elevation: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  searchIcon: {
    fontSize: 18,
    marginRight: 12,
    opacity: 0.6,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: "System",
  },
  clearIcon: {
    fontSize: 16,
    opacity: 0.5,
    paddingLeft: 8,
  },
  listContainer: {
    padding: 16,
  },
  row: {
    justifyContent: "space-between",
  },
  productCard: {
    width: (width - 48) / 2,
    marginBottom: 20,
    borderRadius: 20,
    overflow: "hidden",
    elevation: 4,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
  },
  productImageContainer: {
    position: "relative",
  },
  productImage: {
    width: "100%",
    height: 140,
    resizeMode: "cover",
  },
  heartButton: {
    position: "absolute",
    top: 8,
    left: 8,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  heartIcon: {
    fontSize: 16,
  },
  discountBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "#ff4757",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    elevation: 2,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  discountText: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
  },
  productInfo: {
    padding: 16,
  },
  categoryLabel: {
    fontSize: 10,
    opacity: 0.6,
    textTransform: "uppercase",
    fontWeight: "600",
    marginBottom: 4,
  },
  productName: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
    lineHeight: 18,
  },
  ratingRow: {
    marginBottom: 8,
  },
  rating: {
    fontSize: 12,
    fontWeight: "500",
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  price: {
    fontSize: 18,
    fontWeight: "bold",
    marginRight: 8,
  },
  originalPrice: {
    fontSize: 12,
    textDecorationLine: "line-through",
    opacity: 0.5,
  },
  emptyContainer: {
    alignItems: "center",
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  emptyIcon: {
    fontSize: 48,
    opacity: 0.3,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
    opacity: 0.8,
    textAlign: "center",
  },
  emptySubtext: {
    fontSize: 14,
    opacity: 0.6,
    textAlign: "center",
  },
});
