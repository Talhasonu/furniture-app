import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useAuth } from "@/contexts/AuthContext";
import { useThemeColor } from "@/hooks/useThemeColor";
import { showLoginRequired } from "@/utils/toast";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  Image,
  Modal,
  Pressable,
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
    title: "Chairs",
    icon: "🪑",
    image:
      "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=300&h=200&fit=crop",
    color: "#9B9B9B", // Gray active color
  },
  {
    id: 2,
    title: "Cupboards",
    icon: "🗄️",
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=200&fit=crop",
    color: "#9B9B9B", // Gray active color
  },
  {
    id: 3,
    title: "Tables",
    icon: "🪑",
    image:
      "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=300&h=200&fit=crop",
    color: "#9B9B9B", // Gray active color
  },
  {
    id: 4,
    title: "Lamps",
    icon: "💡",
    image:
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=300&h=200&fit=crop",
    color: "#9B9B9B", // Gray active color
  },
];

const allProducts = [
  // Chairs
  {
    id: 1,
    name: "Modern Chair",
    price: "$185",
    originalPrice: "$250",
    image:
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=300&fit=crop",
    rating: 4.8,
    discount: "26% OFF",
    isFavorite: false,
    category: "Chairs",
  },
  {
    id: 2,
    name: "Minimalist Chair",
    price: "$258",
    originalPrice: "$320",
    image:
      "https://images.unsplash.com/photo-1549497538-303791108f95?w=300&h=300&fit=crop",
    rating: 4.9,
    discount: "19% OFF",
    isFavorite: false,
    category: "Chairs",
  },
  {
    id: 3,
    name: "Executive Chair",
    price: "$399",
    originalPrice: "$500",
    image:
      "https://images.unsplash.com/photo-1517705008128-361805f42e86?w=300&h=300&fit=crop",
    rating: 4.7,
    discount: "20% OFF",
    isFavorite: false,
    category: "Chairs",
  },
  {
    id: 4,
    name: "Comfort Chair",
    price: "$299",
    originalPrice: "$380",
    image:
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=300&fit=crop",
    rating: 4.6,
    discount: "21% OFF",
    isFavorite: false,
    category: "Chairs",
  },
  {
    id: 5,
    name: "Designer Chair",
    price: "$450",
    originalPrice: "$550",
    image:
      "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=300&h=300&fit=crop",
    rating: 4.8,
    discount: "18% OFF",
    isFavorite: false,
    category: "Chairs",
  },
  {
    id: 6,
    name: "Ergonomic Chair",
    price: "$320",
    originalPrice: "$400",
    image:
      "https://images.unsplash.com/photo-1581539250439-c96689b516dd?w=300&h=300&fit=crop",
    rating: 4.9,
    discount: "20% OFF",
    isFavorite: false,
    category: "Chairs",
  },
  {
    id: 7,
    name: "Vintage Chair",
    price: "$275",
    originalPrice: "$350",
    image:
      "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=300&h=300&fit=crop",
    rating: 4.5,
    discount: "21% OFF",
    isFavorite: false,
    category: "Chairs",
  },
  {
    id: 8,
    name: "Swivel Chair",
    price: "$199",
    originalPrice: "$250",
    image:
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=300&fit=crop",
    rating: 4.7,
    discount: "20% OFF",
    isFavorite: false,
    category: "Chairs",
  },
  {
    id: 9,
    name: "Lounge Chair",
    price: "$520",
    originalPrice: "$650",
    image:
      "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=300&h=300&fit=crop",
    rating: 4.8,
    discount: "20% OFF",
    isFavorite: false,
    category: "Chairs",
  },
  {
    id: 10,
    name: "Office Chair",
    price: "$340",
    originalPrice: "$425",
    image:
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=300&fit=crop",
    rating: 4.6,
    discount: "20% OFF",
    isFavorite: false,
    category: "Chairs",
  },

  // Tables
  {
    id: 11,
    name: "Modern Dining Table",
    price: "$599",
    originalPrice: "$799",
    image:
      "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=300&h=300&fit=crop",
    rating: 4.9,
    discount: "25% OFF",
    isFavorite: false,
    category: "Tables",
  },
  {
    id: 12,
    name: "Glass Coffee Table",
    price: "$299",
    originalPrice: "$400",
    image:
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=300&fit=crop",
    rating: 4.7,
    discount: "25% OFF",
    isFavorite: false,
    category: "Tables",
  },
  {
    id: 13,
    name: "Wooden Side Table",
    price: "$149",
    originalPrice: "$200",
    image:
      "https://images.unsplash.com/photo-1503602642458-232111445657?w=300&h=300&fit=crop",
    rating: 4.6,
    discount: "25% OFF",
    isFavorite: false,
    category: "Tables",
  },
  {
    id: 14,
    name: "Executive Desk",
    price: "$899",
    originalPrice: "$1200",
    image:
      "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=300&h=300&fit=crop",
    rating: 4.8,
    discount: "25% OFF",
    isFavorite: false,
    category: "Tables",
  },
  {
    id: 15,
    name: "Round Table",
    price: "$450",
    originalPrice: "$600",
    image:
      "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=300&h=300&fit=crop",
    rating: 4.7,
    discount: "25% OFF",
    isFavorite: false,
    category: "Tables",
  },
  {
    id: 16,
    name: "Bar Table",
    price: "$320",
    originalPrice: "$430",
    image:
      "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=300&h=300&fit=crop",
    rating: 4.5,
    discount: "25% OFF",
    isFavorite: false,
    category: "Tables",
  },
  {
    id: 17,
    name: "Study Table",
    price: "$199",
    originalPrice: "$260",
    image:
      "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=300&h=300&fit=crop",
    rating: 4.6,
    discount: "23% OFF",
    isFavorite: false,
    category: "Tables",
  },
  {
    id: 18,
    name: "Console Table",
    price: "$380",
    originalPrice: "$500",
    image:
      "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=300&h=300&fit=crop",
    rating: 4.8,
    discount: "24% OFF",
    isFavorite: false,
    category: "Tables",
  },
  {
    id: 19,
    name: "Folding Table",
    price: "$120",
    originalPrice: "$160",
    image:
      "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=300&h=300&fit=crop",
    rating: 4.4,
    discount: "25% OFF",
    isFavorite: false,
    category: "Tables",
  },
  {
    id: 20,
    name: "Marble Top Table",
    price: "$750",
    originalPrice: "$1000",
    image:
      "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=300&h=300&fit=crop",
    rating: 4.9,
    discount: "25% OFF",
    isFavorite: false,
    category: "Tables",
  },

  // Cupboards
  {
    id: 21,
    name: "Modern Wardrobe",
    price: "$899",
    originalPrice: "$1200",
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=300&fit=crop",
    rating: 4.8,
    discount: "25% OFF",
    isFavorite: false,
    category: "Cupboards",
  },
  {
    id: 22,
    name: "Kitchen Cabinet",
    price: "$650",
    originalPrice: "$850",
    image:
      "https://images.unsplash.com/photo-1584622781564-1d987fe9c04e?w=300&h=300&fit=crop",
    rating: 4.7,
    discount: "23% OFF",
    isFavorite: false,
    category: "Cupboards",
  },
  {
    id: 23,
    name: "Storage Cabinet",
    price: "$299",
    originalPrice: "$400",
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=300&h=300&fit=crop",
    rating: 4.6,
    discount: "25% OFF",
    isFavorite: false,
    category: "Cupboards",
  },
  {
    id: 24,
    name: "Bookshelf",
    price: "$199",
    originalPrice: "$260",
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=300&h=300&fit=crop",
    rating: 4.5,
    discount: "23% OFF",
    isFavorite: false,
    category: "Cupboards",
  },
  {
    id: 25,
    name: "Display Cabinet",
    price: "$450",
    originalPrice: "$600",
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=300&h=300&fit=crop",
    rating: 4.8,
    discount: "25% OFF",
    isFavorite: false,
    category: "Cupboards",
  },
  {
    id: 26,
    name: "Filing Cabinet",
    price: "$180",
    originalPrice: "$240",
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=300&h=300&fit=crop",
    rating: 4.4,
    discount: "25% OFF",
    isFavorite: false,
    category: "Cupboards",
  },
  {
    id: 27,
    name: "Shoe Cabinet",
    price: "$120",
    originalPrice: "$160",
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=300&h=300&fit=crop",
    rating: 4.6,
    discount: "25% OFF",
    isFavorite: false,
    category: "Cupboards",
  },
  {
    id: 28,
    name: "Medicine Cabinet",
    price: "$89",
    originalPrice: "$120",
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=300&h=300&fit=crop",
    rating: 4.3,
    discount: "25% OFF",
    isFavorite: false,
    category: "Cupboards",
  },
  {
    id: 29,
    name: "Pantry Cabinet",
    price: "$380",
    originalPrice: "$500",
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=300&h=300&fit=crop",
    rating: 4.7,
    discount: "24% OFF",
    isFavorite: false,
    category: "Cupboards",
  },
  {
    id: 30,
    name: "Glass Cabinet",
    price: "$520",
    originalPrice: "$700",
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=300&h=300&fit=crop",
    rating: 4.8,
    discount: "25% OFF",
    isFavorite: false,
    category: "Cupboards",
  },

  // Lamps
  {
    id: 31,
    name: "Modern Table Lamp",
    price: "$89",
    originalPrice: "$120",
    image:
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=300&h=300&fit=crop",
    rating: 4.6,
    discount: "25% OFF",
    isFavorite: false,
    category: "Lamps",
  },
  {
    id: 32,
    name: "Floor Lamp",
    price: "$159",
    originalPrice: "$210",
    image:
      "https://images.unsplash.com/photo-1551966775-a4ddc8df052b?w=300&h=300&fit=crop",
    rating: 4.7,
    discount: "24% OFF",
    isFavorite: false,
    category: "Lamps",
  },
  {
    id: 33,
    name: "Pendant Light",
    price: "$120",
    originalPrice: "$160",
    image:
      "https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?w=300&h=300&fit=crop",
    rating: 4.5,
    discount: "25% OFF",
    isFavorite: false,
    category: "Lamps",
  },
  {
    id: 34,
    name: "Desk Lamp",
    price: "$65",
    originalPrice: "$85",
    image:
      "https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?w=300&h=300&fit=crop",
    rating: 4.4,
    discount: "23% OFF",
    isFavorite: false,
    category: "Lamps",
  },
  {
    id: 35,
    name: "Wall Sconce",
    price: "$99",
    originalPrice: "$130",
    image:
      "https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?w=300&h=300&fit=crop",
    rating: 4.6,
    discount: "23% OFF",
    isFavorite: false,
    category: "Lamps",
  },
  {
    id: 36,
    name: "Chandelier",
    price: "$450",
    originalPrice: "$600",
    image:
      "https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?w=300&h=300&fit=crop",
    rating: 4.8,
    discount: "25% OFF",
    isFavorite: false,
    category: "Lamps",
  },
  {
    id: 37,
    name: "LED Strip Light",
    price: "$35",
    originalPrice: "$50",
    image:
      "https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?w=300&h=300&fit=crop",
    rating: 4.3,
    discount: "30% OFF",
    isFavorite: false,
    category: "Lamps",
  },
  {
    id: 38,
    name: "Reading Lamp",
    price: "$75",
    originalPrice: "$100",
    image:
      "https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?w=300&h=300&fit=crop",
    rating: 4.5,
    discount: "25% OFF",
    isFavorite: false,
    category: "Lamps",
  },
  {
    id: 39,
    name: "Night Light",
    price: "$25",
    originalPrice: "$35",
    image:
      "https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?w=300&h=300&fit=crop",
    rating: 4.2,
    discount: "28% OFF",
    isFavorite: false,
    category: "Lamps",
  },
  {
    id: 40,
    name: "Smart Bulb",
    price: "$45",
    originalPrice: "$60",
    image:
      "https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?w=300&h=300&fit=crop",
    rating: 4.7,
    discount: "25% OFF",
    isFavorite: false,
    category: "Lamps",
  },
];

const featuredProducts = allProducts.slice(0, 6);

export default function WelcomeScreen() {
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

  const [showProfileModal, setShowProfileModal] = useState(false);
  const [products, setProducts] = useState(featuredProducts);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [filteredProducts, setFilteredProducts] = useState(allProducts);
  const [currentSlide, setCurrentSlide] = useState(0);
  const saleSliderRef = useRef<ScrollView>(null);

  const saleSlides = [
    {
      id: 1,
      tag: "LIMITED TIME",
      title: "Summer Collection",
      subtitle: "Up to 40% OFF on premium furniture",
      buttonText: "Shop Now",
      image:
        "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=200&h=150&fit=crop",
      gradient: ["#4F46E5", "#7C3AED"],
    },
    {
      id: 2,
      tag: "NEW ARRIVALS",
      title: "Modern Designs",
      subtitle: "Fresh styles for contemporary living",
      buttonText: "Explore",
      image:
        "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=200&h=150&fit=crop",
      gradient: ["#059669", "#0D9488"],
    },
    {
      id: 3,
      tag: "BESTSELLERS",
      title: "Customer Favorites",
      subtitle: "Most loved furniture pieces",
      buttonText: "View All",
      image:
        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=150&fit=crop",
      gradient: ["#DC2626", "#EA580C"],
    },
  ];

  useEffect(() => {
    // If user is already logged in, redirect to dashboard
    if (user) {
      router.replace("/(tabs)/dashboard");
    }
  }, [user]);

  // Auto-scroll effect for sale slider
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => {
        const nextSlide = (prev + 1) % saleSlides.length;
        saleSliderRef.current?.scrollTo({
          x: nextSlide * (width - 48 + 16), // card width + margin
          animated: true,
        });
        return nextSlide;
      });
    }, 2000); // 2 seconds

    return () => clearInterval(timer);
  }, []);

  const handleSlideChange = (event: any) => {
    const slideIndex = Math.round(
      event.nativeEvent.contentOffset.x / (width - 48 + 16)
    );
    setCurrentSlide(slideIndex);
  };

  const handleSignUp = () => {
    router.push("/(auth)/signup");
  };

  const handleSignIn = () => {
    router.push("/(auth)/signin");
  };

  const handleCategoryPress = (category: string) => {
    setSelectedCategory(category);
    setSearchQuery(""); // Clear search when selecting a category

    if (category === "All") {
      setFilteredProducts(allProducts);
    } else {
      const filtered = allProducts.filter(
        (product) => product.category === category
      );
      setFilteredProducts(filtered);
    }
  };

  const handleProductPress = (product: any) => {
    // Navigate to product details without requiring login
    router.push({
      pathname: "/product-detail",
      params: {
        id: product.id.toString(),
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice || "",
        image: product.image,
        rating: product.rating.toString(),
        discount: product.discount || "",
        category: product.category,
      },
    });
  };

  const handleSeeAllCategories = () => {
    // Navigate to categories without requiring login
    router.push("/categories");
  };

  const handleViewAllProducts = () => {
    // Navigate to products without requiring login
    router.push("/products");
  };

  const handleSearchPress = () => {
    // Navigate to products page with search query without requiring login
    // Only navigate if there's a search query
    if (searchQuery.trim().length > 0) {
      router.push({
        pathname: "/products",
        params: { search: searchQuery.trim() },
      });
    }
  };

  const handleInstantSearch = (query: string) => {
    // Filter products in real-time as user types (optional feature)
    if (query.trim().length > 0) {
      const filtered = allProducts.filter(
        (product) =>
          product.name.toLowerCase().includes(query.toLowerCase()) ||
          product.category.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredProducts(filtered);
      setSelectedCategory("Search Results");
    } else {
      // Reset to all products when search is cleared
      setFilteredProducts(allProducts);
      setSelectedCategory("All");
    }
  };

  const handleFavoritePress = (productId: number) => {
    // Only require login for adding to favorites
    if (!user) {
      showLoginRequired();
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

  const handleAddToCart = (productId: number) => {
    // Only require login for adding to cart
    if (!user) {
      showLoginRequired();
      return;
    }

    // Add to cart logic here
    console.log("Product added to cart:", productId);
    // You can implement cart logic here
    // For example, you could show a success toast:
    // showToast("Product added to cart!");
  };

  const ProfileModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={showProfileModal}
      onRequestClose={() => setShowProfileModal(false)}
    >
      <Pressable
        style={styles.modalOverlay}
        onPress={() => setShowProfileModal(false)}
      >
        <View style={[styles.modalContent, { backgroundColor }]}>
          <View style={styles.modalHandle} />
          <ThemedText type="subtitle" style={styles.modalTitle}>
            Account Options
          </ThemedText>

          <TouchableOpacity
            style={[styles.modalOption, { backgroundColor: tintColor + "10" }]}
            onPress={() => {
              setShowProfileModal(false);
              handleSignIn();
            }}
          >
            <View
              style={[
                styles.modalOptionIconContainer,
                { backgroundColor: tintColor + "20" },
              ]}
            >
              <Text style={styles.modalOptionIcon}>›</Text>
            </View>
            <View style={styles.modalOptionTextContainer}>
              <ThemedText style={styles.modalOptionText}>Sign In</ThemedText>
              <ThemedText style={styles.modalOptionSubtext}>
                Access your account
              </ThemedText>
            </View>
            <Text style={[styles.modalArrow, { color: tintColor }]}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.modalOption, { backgroundColor: tintColor + "10" }]}
            onPress={() => {
              setShowProfileModal(false);
              handleSignUp();
            }}
          >
            <View
              style={[
                styles.modalOptionIconContainer,
                { backgroundColor: tintColor + "20" },
              ]}
            >
              <Text style={styles.modalOptionIcon}>+</Text>
            </View>
            <View style={styles.modalOptionTextContainer}>
              <ThemedText style={styles.modalOptionText}>
                Create Account
              </ThemedText>
              <ThemedText style={styles.modalOptionSubtext}>
                Join FurniStore today
              </ThemedText>
            </View>
            <Text style={[styles.modalArrow, { color: tintColor }]}>›</Text>
          </TouchableOpacity>
        </View>
      </Pressable>
    </Modal>
  );

  const ProductCard = ({ item }: { item: any }) => (
    <View style={styles.productCard}>
      <TouchableOpacity
        style={styles.productImageContainer}
        // onPress={() => handleProductPress(item)}
      >
        <Image
          source={{ uri: item.image }}
          style={styles.productImage}
          resizeMode="cover"
        />

        {/* Badges Container */}
        <View style={styles.badgesContainer}>
          {/* New Badge */}
          {item.isNew && (
            <View style={styles.newBadge}>
              <Text style={styles.badgeText}>NEW</Text>
            </View>
          )}
        </View>

        {/* Heart Icon */}
        <TouchableOpacity
          style={styles.heartButton}
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
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.productInfo}
        // onPress={() => handleProductPress(item)}
      >
        <ThemedText style={styles.productName} numberOfLines={2}>
          {item.name}
        </ThemedText>
        <View style={styles.ratingRow}>
          <Text style={styles.rating}>⭐ {item.rating}</Text>
        </View>
        <View style={styles.priceRow}>
          <Text style={[styles.price, { color: "#2C5530" }]}>{item.price}</Text>
          {item.originalPrice && (
            <Text style={styles.originalPrice}>{item.originalPrice}</Text>
          )}
        </View>

        {/* Add to Cart Button */}
        <TouchableOpacity
          style={styles.addToCartButton}
          onPress={() => handleAddToCart(item.id)}
        >
          <Text style={styles.addToCartIcon}>🛒</Text>
          <ThemedText style={styles.addToCartText}>Add to Cart</ThemedText>
        </TouchableOpacity>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: "#ffffff" }]}>
      <StatusBar barStyle="dark-content" backgroundColor={backgroundColor} />

      {/* Header with Logo and Profile Icon */}
      <ThemedView style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.logoContainer}>
            <Text style={styles.logo}>FurniStore</Text>
            <ThemedText style={styles.tagline}>
              Premium Furniture Collection
            </ThemedText>
          </View>

          <TouchableOpacity
            style={styles.profileButton}
            onPress={() => setShowProfileModal(true)}
          >
            <View
              style={[
                styles.profileIcon,
                { backgroundColor: tintColor + "20" },
              ]}
            >
              <Text style={[styles.profileIconText, { color: tintColor }]}>
                👤
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </ThemedView>
      <ThemedView style={styles.heroSection}>
        {/* <View style={styles.heroContent}>
            <ThemedText type="title" style={styles.heroTitle}>
              Transform Your Space
            </ThemedText>
            <ThemedText style={styles.heroSubtitle}>
              Discover premium furniture that combines style, comfort, and
              quality craftsmanship.
            </ThemedText>
          </View> */}

        <View style={[styles.searchBar, { backgroundColor: cardColor }]}>
          <Text style={[styles.searchIcon, { color: "#9B9B9B" }]}>🔍</Text>
          <TextInput
            style={[styles.searchInput]}
            placeholder="Search furniture..."
            placeholderTextColor="#9B9B9B"
            value={searchQuery}
            onChangeText={(text) => {
              setSearchQuery(text);
              handleInstantSearch(text);
            }}
            onSubmitEditing={handleSearchPress}
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              style={styles.clearButton}
              onPress={() => {
                setSearchQuery("");
                handleInstantSearch("");
              }}
            >
              <Text style={[styles.clearButtonText, { color: "#9B9B9B" }]}>
                ×
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </ThemedView>
      <ProfileModal />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section with Search */}

        {/* Categories Section */}
        <ThemedView style={styles.categoriesSection}>
          <View style={styles.sectionHeader}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              Categories
            </ThemedText>
            <TouchableOpacity
              style={styles.viewAllButton}
              onPress={handleSeeAllCategories}
            >
              <ThemedText style={styles.viewAllText}>View All</ThemedText>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesList}
          >
            {[
              { id: 0, title: "All", color: "#9B9B9B" },
              ...furnitureCategories,
            ].map((item) => (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.categoryChip,
                  selectedCategory === item.title && styles.categoryChipActive,
                ]}
                onPress={() => handleCategoryPress(item.title)}
              >
                <ThemedText
                  style={[
                    styles.categoryChipText,
                    selectedCategory === item.title &&
                      styles.categoryChipTextActive,
                  ]}
                >
                  {item.title}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </ThemedView>

        {/* Featured Products Slider */}
        <ThemedView style={styles.featuredSection}>
          <View style={styles.sectionHeader}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              {searchQuery.length > 0
                ? `Search Results for "${searchQuery}"`
                : selectedCategory === "All"
                ? "Featured Products"
                : selectedCategory}
            </ThemedText>
            <TouchableOpacity
              style={styles.viewAllButton}
              onPress={handleViewAllProducts}
            >
              <ThemedText style={styles.viewAllText}>View All</ThemedText>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.productsList}
          >
            {(selectedCategory === "All" ? products : filteredProducts).length >
            0 ? (
              (selectedCategory === "All" ? products : filteredProducts).map(
                (item) => <ProductCard key={item.id} item={item} />
              )
            ) : (
              <View style={styles.noResultsContainer}>
                <ThemedText style={styles.noResultsText}>
                  {searchQuery.length > 0
                    ? `No results found for "${searchQuery}"`
                    : "No products found in this category"}
                </ThemedText>
                <ThemedText style={styles.noResultsSubtext}>
                  Try adjusting your search or browse other categories
                </ThemedText>
              </View>
            )}
          </ScrollView>
        </ThemedView>
        {/* Enhanced Professional Sale Slider */}
        <ThemedView style={styles.offersSection}>
          <View style={styles.sectionHeader}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              Special Offers
            </ThemedText>
          </View>

          <ScrollView
            ref={saleSliderRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.saleSliderContainer}
            pagingEnabled
            onMomentumScrollEnd={handleSlideChange}
            decelerationRate="fast"
            snapToInterval={width - 48 + 16}
            snapToAlignment="start"
          >
            {saleSlides.map((slide, index) => (
              <View
                key={slide.id}
                style={[styles.saleCard, { width: width - 48 }]}
              >
                <View style={styles.saleCardContent}>
                  <View style={styles.saleTextSection}>
                    <View style={styles.saleTagContainer}>
                      <Text
                        style={[
                          styles.saleTag,
                          { backgroundColor: slide.gradient[0] },
                        ]}
                      >
                        {slide.tag}
                      </Text>
                    </View>
                    <Text style={styles.saleTitle}>{slide.title}</Text>
                    <Text style={styles.saleSubtitle}>{slide.subtitle}</Text>
                    <TouchableOpacity
                      style={[
                        styles.saleButton,
                        { backgroundColor: slide.gradient[1] },
                      ]}
                      onPress={() => handleViewAllProducts()}
                    >
                      <Text style={styles.saleButtonText}>
                        {slide.buttonText}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.saleImageSection}>
                    <Image
                      source={{ uri: slide.image }}
                      style={styles.saleImage}
                      resizeMode="cover"
                    />
                    <View
                      style={[
                        styles.imageGradientOverlay,
                        {
                          backgroundColor: slide.gradient[0] + "20",
                        },
                      ]}
                    />
                  </View>
                </View>
              </View>
            ))}
          </ScrollView>

          {/* Enhanced Slider Indicators */}
          <View style={styles.sliderIndicators}>
            {saleSlides.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.indicator,
                  currentSlide === index && styles.activeIndicator,
                ]}
              />
            ))}
          </View>
        </ThemedView>
        {/* Why Choose Us */}
        <ThemedView style={styles.featuresSection}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Why Choose FurniStore?
          </ThemedText>

          <View style={styles.featuresList}>
            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>🚚</Text>
              <View style={styles.featureTextContainer}>
                <ThemedText style={styles.featureTitle}>
                  Free Delivery
                </ThemedText>
                <ThemedText style={styles.featureDescription}>
                  On orders over $500
                </ThemedText>
              </View>
            </View>
            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>💯</Text>
              <View style={styles.featureTextContainer}>
                <ThemedText style={styles.featureTitle}>
                  Quality Guarantee
                </ThemedText>
                <ThemedText style={styles.featureDescription}>
                  30-day return policy
                </ThemedText>
              </View>
            </View>
            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>🎨</Text>
              <View style={styles.featureTextContainer}>
                <ThemedText style={styles.featureTitle}>
                  Custom Designs
                </ThemedText>
                <ThemedText style={styles.featureDescription}>
                  Tailored to your space
                </ThemedText>
              </View>
            </View>
            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>📞</Text>
              <View style={styles.featureTextContainer}>
                <ThemedText style={styles.featureTitle}>
                  24/7 Support
                </ThemedText>
                <ThemedText style={styles.featureDescription}>
                  Expert assistance
                </ThemedText>
              </View>
            </View>
          </View>
        </ThemedView>
        {/* CTA Section */}
        <ThemedView style={styles.ctaSection}>
          <ThemedText type="subtitle" style={styles.ctaTitle}>
            Start Your Journey Today
          </ThemedText>
          <ThemedText style={styles.ctaSubtitle}>
            Join thousands of satisfied customers who have transformed their
            homes with our premium furniture collection.
          </ThemedText>

          <View style={styles.ctaButtons}>
            <TouchableOpacity
              style={styles.ctaButtonWhite}
              onPress={handleSignUp}
            >
              <Text style={styles.ctaButtonWhiteText}>
                Create Account & Save 10%
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.ctaButtonWhite1}
              onPress={() => console.log("Browse catalog")}
            >
              <Text style={styles.ctaButtonWhiteText1}>Browse Collection</Text>
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
    backgroundColor: "#f1d39eff",
  },
  header: {
    paddingHorizontal: width < 400 ? 16 : 20,
    paddingTop: 16,
    paddingBottom: 10,

    backgroundColor: "#f1d39eff", // Light gray-100 to match sections
  },
  headerContent: {
    margin: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logoContainer: {
    flex: 1,
  },
  logo: {
    fontSize: width < 400 ? 22 : 26,
    fontWeight: "bold",
    marginBottom: 2,
    color: "#1F2937", // Enhanced dark color for better contrast
  },
  tagline: {
    fontSize: width < 400 ? 11 : 13,
    opacity: 0.7,
    color: "#6B7280", // Enhanced gray color for better readability
  },
  profileButton: {
    padding: 8,
  },
  profileIcon: {
    width: width < 400 ? 42 : 48,
    height: width < 400 ? 42 : 48,
    borderRadius: width < 400 ? 21 : 24,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.1)",
  },
  profileIconText: {
    fontSize: 18,
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  modalContent: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 20,
    width: "100%",
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
  modalTitle: {
    textAlign: "center",
    marginBottom: 28,
    fontSize: 22,
    fontWeight: "700",
  },
  modalOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: 18,
    borderRadius: 20,
    marginBottom: 16,

    minHeight: 76,
  },
  modalOptionIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 18,
  },
  modalOptionIcon: {
    fontSize: 20,
    fontWeight: "600",
  },
  modalOptionTextContainer: {
    flex: 1,
  },
  modalOptionText: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
  },
  modalOptionSubtext: {
    fontSize: 15,
    opacity: 0.6,
    lineHeight: 20,
  },
  modalArrow: {
    fontSize: 24,
    fontWeight: "300",
  },

  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },

  // Hero Section
  heroSection: {
    paddingLeft: 14,
    paddingRight: 14,
    paddingBottom: 10,
    alignItems: "center",
    backgroundColor: "#f1d39eff",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 0, 0, 0.05)", // Light gray-100
  },
  heroContent: {
    alignItems: "center",
    // marginBottom: 24,
  },
  heroTitle: {
    // textAlign: "center",
    // marginBottom: 0,
    fontSize: 30,
    fontWeight: "800",
    color: "#1F2937", // Dark gray text on light background
    // letterSpacing: -0.5,
  },
  heroSubtitle: {
    fontSize: 16,
    // textAlign: "center",
    opacity: 0.9,
    lineHeight: 24,
    color: "#6B7280", // Gray text on light background
    // paddingHorizontal: 20,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 25,
    paddingHorizontal: 10,
    paddingVertical: 10,
    width: "100%",
    elevation: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },
  searchIcon: {
    fontSize: 18,
    marginRight: 12,
  },
  searchInput: {
    fontSize: 16,
    flex: 1,
    paddingVertical: 0,
    height: 20,
    color: "#374151", // Dark gray text color for better visibility
  },
  clearButton: {
    marginLeft: 8,
    padding: 4,
  },
  clearButtonText: {
    fontSize: 20,
    fontWeight: "300",
  },
  searchPlaceholder: {
    fontSize: 16,
    flex: 1,
  },

  // Section Headers
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    // marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 36,
    color: "#1F2937", // Dark gray text on light background
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#F3F4F6", // Light gray text on gray background
  },

  // View All Button Styles
  viewAllButton: {
    // backgroundColor: "#FFFFFF",
    // paddingHorizontal: 16,
    // paddingVertical: 8,
    // borderRadius: 12,
    // elevation: 2,
    // shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    
    // shadowRadius: 3,
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6B7280",
    textDecorationLine: "underline", // Gray text on light background
  },

  // Categories
  categoriesSection: {
    padding:  14,
    backgroundColor: "#f1d39eff", // Light gray-100
  },
  categoriesList: {
    paddingRight: 24,
  },

  // Featured Products
  featuredSection: {
    padding: 14,
    backgroundColor: "#f1d39eff", // Light gray-100
  },
  productsList: {
    paddingRight: 14,
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
    paddingVertical: 60,
    minWidth: width - 48,
  },
  noResultsText: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 8,
    color: "#6B7280",
  },
  noResultsSubtext: {
    fontSize: 14,
    textAlign: "center",
    opacity: 0.7,
    lineHeight: 20,
    color: "#9CA3AF",
  },
  productCard: {
    width: 200,
    marginRight: 16,
    backgroundColor: "white",
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#5C4033",
  },
  productImageContainer: {
    position: "relative",
    width: "100%",
    height: 140,
  },
  productImage: {
    width: "100%",
    height: "100%",
    backgroundColor: "#F8F8F8",
  },
  badgesContainer: {
    position: "absolute",
    top: 8,
    left: 8,
    flexDirection: "row",
    gap: 4,
  },
  heartButton: {
    position: "absolute",
    top: 12,
    left: 12,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  heartIcon: {
    fontSize: 16,
  },
  discountBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "#ff4757",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 15,
  },
  discountText: {
    color: "white",
    fontSize: 12,
    fontWeight: "800",
  },
  productInfo: {
    padding: 16,
    
  },
  productName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    lineHeight: 20,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  price: {
    fontSize: 20,
    fontWeight: "800",
    marginRight: 8,
  },
  originalPrice: {
    fontSize: 14,
    textDecorationLine: "line-through",
    opacity: 0.5,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  rating: {
    fontSize: 14,
    fontWeight: "500",
  },
  addToCartButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white", // Light gray-100
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    marginTop: 12,
    borderWidth: 1,
    borderColor: "#5C4033", // Dark brown border
  },
  addToCartIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  addToCartText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#5C4033", // Dark brown text
  },

  // Enhanced Professional Sale Slider
  offersSection: {
    padding: 24,
    backgroundColor: "#f1d39eff", // Light gray-100
    borderRadius: 0,
  },
  saleSliderContainer: {
    paddingRight: 24,
  },
  saleCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    marginRight: 16,
    padding: 0,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    overflow: "hidden",
  },
  saleCardContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: width < 400 ? 24 : 28,
    minHeight: width < 400 ? 160 : 180,
  },
  saleTextSection: {
    flex: 1,
    paddingRight: 20,
  },
  saleTagContainer: {
    alignSelf: "flex-start",
    marginBottom: 14,
  },
  saleTag: {
    color: "#FFFFFF",
    fontSize: width < 400 ? 10 : 11,
    fontWeight: "800",
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 16,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  saleTitle: {
    fontSize: width < 400 ? 22 : 26,
    fontWeight: "900",
    color: "#1A202C",
    marginBottom: 10,
    letterSpacing: -0.5,
    lineHeight: width < 400 ? 26 : 30,
  },
  saleSubtitle: {
    fontSize: width < 400 ? 14 : 16,
    color: "#4A5568",
    marginBottom: 24,
    lineHeight: 22,
    fontWeight: "500",
  },
  saleButton: {
    paddingHorizontal: width < 400 ? 20 : 24,
    paddingVertical: width < 400 ? 12 : 14,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    minWidth: width < 400 ? 120 : 140,
    justifyContent: "center",
  },
  saleButtonText: {
    color: "#FFFFFF",
    fontSize: width < 400 ? 14 : 16,
    fontWeight: "700",
    marginRight: 8,
  },
  saleButtonIcon: {
    color: "#FFFFFF",
    fontSize: width < 400 ? 14 : 16,
    fontWeight: "400",
  },
  saleImageSection: {
    width: width < 400 ? 100 : 120,
    height: width < 400 ? 100 : 120,
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "#F7FAFC",
    position: "relative",
  },
  saleImage: {
    width: "100%",
    height: "100%",
  },
  imageGradientOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 20,
  },
  sliderIndicators: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 24,
    gap: 10,
  },
  indicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "rgba(107, 114, 128, 0.3)",
  },
  activeIndicator: {
    backgroundColor: "#6B7280",
    width: 28,
    height: 10,
    borderRadius: 5,
  },

  // Features Section
  featuresSection: {
    padding: 24,
    backgroundColor: "#f1d39eff", // Light gray-100
  },
  featuresList: {
    gap: 16,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 24,
    borderRadius: 20,
    elevation: 2,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    marginBottom: 4,
  },
  featureIcon: {
    fontSize: 32,
    marginRight: 20,
  },
  featureTextContainer: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    opacity: 0.6,
    lineHeight: 18,
  },

  // CTA Section
  ctaSection: {
    padding: 24,
    alignItems: "center",
    backgroundColor: "#f1d39eff", // Light gray-100
  },
  ctaTitle: {
    textAlign: "center",
    marginBottom: 12,
    fontSize: 26,
    fontWeight: "800",
    color: "#1F2937", // Dark gray text on light background
  },
  ctaSubtitle: {
    fontSize: 16,
    textAlign: "center",
    opacity: 0.9,
    lineHeight: 24,
    marginBottom: 32,
    color: "#6B7280", // Gray text on light background
  },
  ctaButtons: {
    width: "100%",
    gap: 14,
  },
  ctaButton: {
    width: "100%",
    paddingVertical: 16,
  },

  // White CTA Button Styles
  ctaButtonWhite: {
    backgroundColor: "#5C4033",
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 16,

    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    // elevation: 3,
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.1,
    // shadowRadius: 6,
    marginBottom: 14,
  },
  ctaButtonWhite1: {
    backgroundColor: "white",
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 16,
    borderColor: "#5C4033",
    borderWidth: 2,
    color: "#5C4033",

    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    // elevation: 3,
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.1,
    // shadowRadius: 6,
    marginBottom: 14,
  },
  ctaButtonWhiteText: {
    fontSize: 16,
    fontWeight: "700",
    color: "white", // Dark gray text on white background
    textAlign: "center",
  },
  ctaButtonWhiteText1: {
    fontSize: 16,
    fontWeight: "700",
    color: "#5C4033", // Dark gray text on white background
    textAlign: "center",
  },
  // Legacy styles (keeping for compatibility)
  authButtons: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
  },
  authButton: {
    flex: 1,
    maxWidth: 120,
  },
  welcomeSection: {
    padding: 24,
    alignItems: "center",
  },
  welcomeTitle: {
    textAlign: "center",
    marginBottom: 12,
  },
  welcomeSubtitle: {
    fontSize: 16,
    textAlign: "center",
    opacity: 0.7,
    lineHeight: 24,
  },
  categoriesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  featureText: {
    fontSize: 16,
    fontWeight: "500",
  },

  // New Category Chip Styles
  categoryChip: {
    paddingHorizontal: 20,
    paddingVertical: 5,
    marginRight: 12,
    borderRadius: 15,
    minWidth: 80,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#5C4033",
  },
  categoryChipActive: {
    backgroundColor: "#5C4033",
  },
  categoryChipText: {
    fontSize: 14,
    fontWeight: "600",
    letterSpacing: 0.2,
    color: "#5C4033",
  },
  categoryChipTextActive: {
    color: "white",
  },

  // Enhanced Badge Styles
  hotBadge: {
    backgroundColor: "#ff4757",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    elevation: 2,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  newBadge: {
    backgroundColor: "#2ecc71",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    elevation: 2,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  badgeText: {
    color: "white",
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
});
