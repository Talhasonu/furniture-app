import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { FurniButton } from "@/components/ui/FurniButton";
import { useAuth } from "@/contexts/AuthContext";
import { useThemeColor } from "@/hooks/useThemeColor";
import { addToCart } from "@/utils/cart";
import {
  isFavorite as checkIsFavorite,
  FavoriteProduct,
  toggleFavorite,
} from "@/utils/favorites";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  Dimensions,
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

// Related products data
const relatedProducts = [
  {
    id: 11,
    name: "Modern Coffee Table",
    price: 299,
    originalPrice: 399,
    image:
      "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=400&h=400&fit=crop",
    rating: 4.5,
    reviews: 78,
    discount: 25,
  },
  {
    id: 12,
    name: "Accent Chair",
    price: 199,
    originalPrice: 299,
    image:
      "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=400&h=400&fit=crop",
    rating: 4.3,
    reviews: 45,
    discount: 33,
  },
  {
    id: 13,
    name: "Floor Lamp",
    price: 89,
    originalPrice: 129,
    image:
      "https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?w=400&h=400&fit=crop",
    rating: 4.6,
    reviews: 92,
    discount: 31,
  },
];

export default function ProductDetailScreen() {
  const { user } = useAuth();
  const params = useLocalSearchParams();
  const [product, setProduct] = useState<any>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

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
      Alert.alert("Login Required", "Please log in to view product details", [
        {
          text: "Go to Login",
          onPress: () => router.replace("/(auth)/signin"),
        },
      ]);
      return;
    }

    // Parse product data from params
    if (params.productData) {
      try {
        const productData = JSON.parse(params.productData as string);
        setProduct({
          ...productData,
          images: [
            productData.image,
            productData.image, // Duplicate for demo
            productData.image,
          ],
          specifications: {
            dimensions: "180cm × 90cm × 85cm",
            material: "Premium Oak Wood",
            weight: "45kg",
            color: "Natural Oak",
            warranty: "2 Years",
            assembly: "Required",
          },
          features: [
            "Premium quality construction",
            "Ergonomic design",
            "Easy to clean",
            "Sustainable materials",
            "Modern finish",
          ],
        });

        // Check if product is in favorites
        checkIsFavorite(productData.id).then(setIsFavorite);
      } catch (error) {
        console.error("Error parsing product data:", error);
        router.back();
      }
    }
  }, [user, params]);

  const handleFavoritePress = async () => {
    if (!product) return;

    try {
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

      const newFavoriteStatus = await toggleFavorite(favoriteProduct);
      setIsFavorite(newFavoriteStatus);
    } catch (error) {
      console.error("Error toggling favorite:", error);
      Alert.alert("Error", "Failed to update favorites");
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;

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

      await addToCart(cartItem, quantity);

      Alert.alert(
        "Added to Cart",
        `${product.name} (Qty: ${quantity}) has been added to your cart!`,
        [
          { text: "Continue Shopping" },
          { text: "View Cart", onPress: () => router.push("/cart") },
        ]
      );
    } catch (error) {
      console.error("Error adding to cart:", error);
      Alert.alert("Error", "Failed to add item to cart");
    }
  };

  const handleBuyNow = () => {
    Alert.alert("Buy Now", `Proceed to checkout for ${product.name}?`, [
      { text: "Cancel", style: "cancel" },
      { text: "Proceed", onPress: () => console.log("Checkout") },
    ]);
  };

  const handleQuantityChange = (increment: boolean) => {
    if (increment) {
      setQuantity((prev) => Math.min(prev + 1, product.stockCount || 10));
    } else {
      setQuantity((prev) => Math.max(prev - 1, 1));
    }
  };

  const handleRelatedProductPress = (relatedProduct: any) => {
    router.push({
      pathname: "/product-detail",
      params: {
        productId: relatedProduct.id,
        productData: JSON.stringify(relatedProduct),
      },
    });
  };

  if (!user) {
    return null; // Will show alert and redirect
  }

  if (!product) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor }]}>
        <ThemedView style={styles.loadingContainer}>
          <ThemedText>Loading product details...</ThemedText>
        </ThemedView>
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

        <ThemedText style={styles.headerTitle}>Product Details</ThemedText>

        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={handleFavoritePress}
        >
          <Ionicons
            name={isFavorite ? "heart" : "heart-outline"}
            size={24}
            color={isFavorite ? "#ff4757" : textColor}
          />
        </TouchableOpacity>
      </ThemedView>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Product Images */}
        <View style={styles.imageSection}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={(event) => {
              const index = Math.round(
                event.nativeEvent.contentOffset.x / width
              );
              setSelectedImageIndex(index);
            }}
          >
            {product.images?.map((image: string, index: number) => (
              <Image
                key={index}
                source={{ uri: image }}
                style={styles.productImage}
                resizeMode="cover"
              />
            ))}
          </ScrollView>

          {/* Image Indicators */}
          <View style={styles.imageIndicators}>
            {product.images?.map((_: any, index: number) => (
              <View
                key={index}
                style={[
                  styles.indicator,
                  {
                    backgroundColor:
                      index === selectedImageIndex
                        ? tintColor
                        : "rgba(0,0,0,0.2)",
                  },
                ]}
              />
            ))}
          </View>

          {/* Discount Badge */}
          {product.discount > 0 && (
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>{product.discount}% OFF</Text>
            </View>
          )}
        </View>

        {/* Product Info */}
        <ThemedView style={styles.productInfoSection}>
          <View style={styles.productHeader}>
            <View style={styles.productTitleSection}>
              <ThemedText type="title" style={styles.productName}>
                {product.name}
              </ThemedText>
              <ThemedText style={styles.productCategory}>
                {product.category}
              </ThemedText>
            </View>

            <View style={styles.stockInfo}>
              {product.inStock ? (
                <View style={styles.inStockBadge}>
                  <Text style={styles.inStockText}>In Stock</Text>
                </View>
              ) : (
                <View style={styles.outOfStockBadge}>
                  <Text style={styles.outOfStockText}>Out of Stock</Text>
                </View>
              )}
            </View>
          </View>

          {/* Rating */}
          <View style={styles.ratingSection}>
            <View style={styles.ratingStars}>
              {[1, 2, 3, 4, 5].map((star) => (
                <Ionicons
                  key={star}
                  name="star"
                  size={16}
                  color={
                    star <= Math.floor(product.rating) ? "#FFD700" : "#E0E0E0"
                  }
                />
              ))}
            </View>
            <Text style={styles.ratingText}>
              {product.rating} ({product.reviews} reviews)
            </Text>
          </View>

          {/* Price */}
          <View style={styles.priceSection}>
            <Text style={[styles.currentPrice, { color: tintColor }]}>
              ${product.price}
            </Text>
            {product.originalPrice && (
              <Text style={styles.originalPrice}>${product.originalPrice}</Text>
            )}
            {product.discount > 0 && (
              <Text style={styles.savings}>
                Save ${product.originalPrice - product.price}
              </Text>
            )}
          </View>

          {/* Description */}
          <View style={styles.descriptionSection}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              Description
            </ThemedText>
            <ThemedText style={styles.description}>
              {product.description}
            </ThemedText>
          </View>

          {/* Features */}
          <View style={styles.featuresSection}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              Key Features
            </ThemedText>
            {product.features?.map((feature: string, index: number) => (
              <View key={index} style={styles.featureItem}>
                <Ionicons name="checkmark-circle" size={16} color={tintColor} />
                <ThemedText style={styles.featureText}>{feature}</ThemedText>
              </View>
            ))}
          </View>

          {/* Specifications */}
          <View style={styles.specificationsSection}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              Specifications
            </ThemedText>
            <View style={[styles.specTable, { backgroundColor: cardColor }]}>
              {Object.entries(product.specifications || {}).map(
                ([key, value]) => (
                  <View key={key} style={styles.specRow}>
                    <ThemedText style={styles.specKey}>
                      {key.charAt(0).toUpperCase() + key.slice(1)}
                    </ThemedText>
                    <ThemedText style={styles.specValue}>
                      {value as string}
                    </ThemedText>
                  </View>
                )
              )}
            </View>
          </View>

          {/* Quantity and Add to Cart */}
          {product.inStock && (
            <View style={styles.actionSection}>
              <View style={styles.quantitySection}>
                <ThemedText style={styles.quantityLabel}>Quantity</ThemedText>
                <View style={styles.quantityControls}>
                  <TouchableOpacity
                    style={[styles.quantityButton, { borderColor: tintColor }]}
                    onPress={() => handleQuantityChange(false)}
                    disabled={quantity <= 1}
                  >
                    <Ionicons
                      name="remove"
                      size={20}
                      color={quantity <= 1 ? "#ccc" : tintColor}
                    />
                  </TouchableOpacity>

                  <Text style={[styles.quantityText, { color: textColor }]}>
                    {quantity}
                  </Text>

                  <TouchableOpacity
                    style={[styles.quantityButton, { borderColor: tintColor }]}
                    onPress={() => handleQuantityChange(true)}
                    disabled={quantity >= (product.stockCount || 10)}
                  >
                    <Ionicons
                      name="add"
                      size={20}
                      color={
                        quantity >= (product.stockCount || 10)
                          ? "#ccc"
                          : tintColor
                      }
                    />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.actionButtons}>
                <FurniButton
                  title="Add to Cart"
                  onPress={handleAddToCart}
                  variant="outline"
                  style={styles.addToCartButton}
                />
                <FurniButton
                  title="Buy Now"
                  onPress={handleBuyNow}
                  variant="primary"
                  style={styles.buyNowButton}
                />
              </View>
            </View>
          )}

          {/* Related Products */}
          <View style={styles.relatedSection}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              Related Products
            </ThemedText>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.relatedProductsList}
            >
              {relatedProducts.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.relatedProductCard}
                  onPress={() => handleRelatedProductPress(item)}
                >
                  <Image
                    source={{ uri: item.image }}
                    style={styles.relatedProductImage}
                    resizeMode="cover"
                  />
                  <ThemedText
                    style={styles.relatedProductName}
                    numberOfLines={2}
                  >
                    {item.name}
                  </ThemedText>
                  <View style={styles.relatedProductPrice}>
                    <Text style={[styles.relatedPrice, { color: tintColor }]}>
                      ${item.price}
                    </Text>
                    {item.originalPrice && (
                      <Text style={styles.relatedOriginalPrice}>
                        ${item.originalPrice}
                      </Text>
                    )}
                  </View>
                  <View style={styles.relatedRating}>
                    <Ionicons name="star" size={12} color="#FFD700" />
                    <Text style={styles.relatedRatingText}>{item.rating}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
  favoriteButton: {
    padding: 8,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },

  // Image Section
  imageSection: {
    position: "relative",
  },
  productImage: {
    width: width,
    height: 300,
    backgroundColor: "rgba(0, 0, 0, 0.03)",
  },
  imageIndicators: {
    position: "absolute",
    bottom: 20,
    alignSelf: "center",
    flexDirection: "row",
    gap: 8,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  discountBadge: {
    position: "absolute",
    top: 20,
    right: 20,
    backgroundColor: "#ff4757",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    elevation: 3,
  },
  discountText: {
    color: "white",
    fontSize: 12,
    fontWeight: "700",
  },

  // Product Info
  productInfoSection: {
    padding: 20,
  },
  productHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  productTitleSection: {
    flex: 1,
  },
  productName: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 4,
    lineHeight: 30,
  },
  productCategory: {
    fontSize: 14,
    opacity: 0.6,
  },
  stockInfo: {
    marginLeft: 16,
  },
  inStockBadge: {
    backgroundColor: "#2ed573",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  inStockText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },
  outOfStockBadge: {
    backgroundColor: "#ff4757",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  outOfStockText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },
  ratingSection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  ratingStars: {
    flexDirection: "row",
    marginRight: 8,
  },
  ratingText: {
    fontSize: 14,
    opacity: 0.7,
  },
  priceSection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  currentPrice: {
    fontSize: 28,
    fontWeight: "800",
    marginRight: 12,
  },
  originalPrice: {
    fontSize: 18,
    textDecorationLine: "line-through",
    opacity: 0.5,
    marginRight: 12,
  },
  savings: {
    fontSize: 14,
    color: "#2ed573",
    fontWeight: "600",
  },

  // Sections
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
  },
  descriptionSection: {
    marginBottom: 24,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    opacity: 0.8,
  },
  featuresSection: {
    marginBottom: 24,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  featureText: {
    fontSize: 14,
    marginLeft: 8,
    lineHeight: 20,
  },
  specificationsSection: {
    marginBottom: 24,
  },
  specTable: {
    borderRadius: 12,
    overflow: "hidden",
    elevation: 1,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  specRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 0, 0, 0.05)",
  },
  specKey: {
    fontSize: 14,
    fontWeight: "500",
    flex: 1,
  },
  specValue: {
    fontSize: 14,
    opacity: 0.7,
    flex: 1,
    textAlign: "right",
  },

  // Action Section
  actionSection: {
    marginBottom: 32,
  },
  quantitySection: {
    marginBottom: 20,
  },
  quantityLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  quantityControls: {
    flexDirection: "row",
    alignItems: "center",
  },
  quantityButton: {
    width: 40,
    height: 40,
    borderWidth: 2,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  quantityText: {
    fontSize: 18,
    fontWeight: "600",
    marginHorizontal: 20,
    minWidth: 30,
    textAlign: "center",
  },
  actionButtons: {
    flexDirection: "row",
    gap: 12,
  },
  addToCartButton: {
    flex: 1,
  },
  buyNowButton: {
    flex: 1,
  },

  // Related Products
  relatedSection: {
    marginTop: 8,
  },
  relatedProductsList: {
    paddingRight: 20,
  },
  relatedProductCard: {
    width: 140,
    marginRight: 16,
    backgroundColor: "white",
    borderRadius: 12,
    overflow: "hidden",
    elevation: 2,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  relatedProductImage: {
    width: "100%",
    height: 100,
    backgroundColor: "rgba(0, 0, 0, 0.03)",
  },
  relatedProductName: {
    fontSize: 12,
    fontWeight: "500",
    padding: 8,
    paddingBottom: 4,
    lineHeight: 16,
  },
  relatedProductPrice: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingBottom: 4,
  },
  relatedPrice: {
    fontSize: 14,
    fontWeight: "600",
    marginRight: 4,
  },
  relatedOriginalPrice: {
    fontSize: 10,
    textDecorationLine: "line-through",
    opacity: 0.5,
  },
  relatedRating: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingBottom: 8,
  },
  relatedRatingText: {
    fontSize: 12,
    marginLeft: 4,
    opacity: 0.7,
  },
});
