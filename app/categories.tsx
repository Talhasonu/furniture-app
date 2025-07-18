import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useAuth } from "@/contexts/AuthContext";
import { useThemeColor } from "@/hooks/useThemeColor";
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
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

const allCategories = [
  {
    id: 1,
    title: "Chairs",
    icon: "🪑",
    count: 45,
    image:
      "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=400&h=400&fit=crop&crop=center",
    color: "#9B9B9B",
  },
  {
    id: 2,
    title: "Cupboards",
    icon: "🗄️",
    count: 32,
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop&crop=center",
    color: "#9B9B9B",
  },
  {
    id: 3,
    title: "Tables",
    icon: "🪑",
    count: 28,
    image:
      "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=400&fit=crop&crop=center",
    color: "#9B9B9B",
  },
  {
    id: 4,
    title: "Lamps",
    icon: "💡",
    count: 36,
    image:
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&h=400&fit=crop&crop=center",
    color: "#9B9B9B",
  },
  {
    id: 5,
    title: "Kitchen",
    icon: "🍳",
    count: 22,
    image:
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop&crop=center",
    color: "#9B9B9B",
  },
  {
    id: 6,
    title: "Bathroom",
    icon: "🚿",
    count: 15,
    image:
      "https://images.unsplash.com/photo-1620626011761-996317b8d101?w=400&h=400&fit=crop&crop=center",
    color: "#9B9B9B",
  },
  {
    id: 7,
    title: "Outdoor",
    icon: "🌳",
    count: 18,
    image:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop&crop=center",
    color: "#9B9B9B",
  },
  {
    id: 8,
    title: "Decor",
    icon: "🎨",
    count: 25,
    image:
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop&crop=center",
    color: "#9B9B9B",
  },
];

export default function CategoriesScreen() {
  const backgroundColor = useThemeColor(
    { light: "#FAFAFA", dark: "#0f0f23" },
    "background"
  );
  const tintColor = useThemeColor(
    { light: "#2C5530", dark: "#ABC2AB" },
    "tint"
  );
  const textColor = useThemeColor(
    { light: "#1B1B1B", dark: "#f9fafb" },
    "text"
  );
  const cardColor = useThemeColor(
    { light: "#ffffff", dark: "#1e1e2e" },
    "background"
  );

  const { user } = useAuth();

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredCategories, setFilteredCategories] = useState(allCategories);

  useEffect(() => {
    if (!user) {
      Alert.alert(
        "Authentication required",
        "You need to be logged in to access this feature.",
        [
          {
            text: "Cancel",
            onPress: () => router.back(),
            style: "cancel",
          },
          {
            text: "Login",
            onPress: () => router.push("/(auth)/signin"),
            style: "default",
          },
        ]
      );
    }
  }, [user]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const filtered = allCategories.filter((category) =>
      category.title.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredCategories(filtered);
  };

  const handleCategoryPress = (category: any) => {
    router.push({
      pathname: "/products",
      params: { category: category.title },
    });
  };

  const renderCategory = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={[styles.categoryCard, { backgroundColor: cardColor }]}
      onPress={() => handleCategoryPress(item)}
      activeOpacity={0.8}
    >
      <View style={styles.categoryImageContainer}>
        <Image
          source={{ uri: item.image }}
          style={styles.categoryImage}
          defaultSource={{
            uri: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==",
          }}
        />
        <View
          style={[
            styles.categoryOverlay,
            { backgroundColor: item.color + "80" },
          ]}
        >
          <Text style={styles.categoryEmoji}>{item.icon}</Text>
        </View>
      </View>
      <View style={styles.categoryInfo}>
        <ThemedText style={[styles.categoryTitle, { color: textColor }]}>
          {item.title}
        </ThemedText>
        <View style={styles.categoryMeta}>
          <ThemedText style={[styles.categoryCount, { color: "#666666" }]}>
            {item.count} items
          </ThemedText>
        </View>
      </View>
      <View
        style={[styles.arrowContainer, { backgroundColor: item.color + "10" }]}
      >
        <Text style={[styles.arrowIcon, { color: item.color }]}>›</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      <StatusBar barStyle="dark-content" backgroundColor={backgroundColor} />

      {/* Header */}
      <ThemedView style={[styles.header, { backgroundColor: cardColor }]}>
        <TouchableOpacity
          style={styles.backButtonContainer}
          onPress={() => router.back()}
        >
          <Text style={[styles.backButton, { color: tintColor }]}>‹</Text>
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <ThemedText
            type="title"
            style={[styles.headerTitle, { color: textColor }]}
          >
            All Categories
          </ThemedText>
          <ThemedText style={[styles.headerSubtitle, { color: "#666666" }]}>
            Browse furniture by category
          </ThemedText>
        </View>
        <View style={styles.placeholder} />
      </ThemedView>

      {/* Search Bar */}
      <ThemedView
        style={[styles.searchContainer, { backgroundColor: backgroundColor }]}
      >
        <View style={[styles.searchBar, { backgroundColor: cardColor }]}>
          <Text style={[styles.searchIcon, { color: "#9B9B9B" }]}>🔍</Text>
          <TextInput
            style={[styles.searchInput, { color: textColor }]}
            placeholder="Search categories..."
            placeholderTextColor="#9B9B9B"
            value={searchQuery}
            onChangeText={handleSearch}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              style={styles.clearButton}
              onPress={() => handleSearch("")}
            >
              <Text style={[styles.clearIcon, { color: "#9B9B9B" }]}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </ThemedView>

      {/* Categories List */}
      <FlatList
        data={filteredCategories}
        renderItem={renderCategory}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <View
              style={[
                styles.emptyIconContainer,
                { backgroundColor: "#F5F5F5" },
              ]}
            >
              <Text style={styles.emptyIcon}>🔍</Text>
            </View>
            <ThemedText style={[styles.emptyText, { color: textColor }]}>
              No categories found
            </ThemedText>
            <ThemedText style={[styles.emptySubtext, { color: "#666666" }]}>
              Try a different search term or browse all categories
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
    elevation: 4,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  backButtonContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
  },
  backButton: {
    fontSize: 28,
    fontWeight: "300",
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "800",
    letterSpacing: 0.2,
  },
  headerSubtitle: {
    fontSize: 14,
    marginTop: 2,
    fontWeight: "500",
  },
  placeholder: {
    width: 40,
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 16,
    elevation: 3,
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
    flex: 1,
    fontSize: 16,
    fontFamily: "System",
  },
  clearButton: {
    padding: 4,
  },
  clearIcon: {
    fontSize: 16,
    paddingLeft: 8,
  },
  listContainer: {
    padding: 20,
    paddingTop: 0,
  },
  categoryCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    marginBottom: 16,
    borderRadius: 20,
    elevation: 4,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },
  categoryImageContainer: {
    position: "relative",
    marginRight: 16,
  },
  categoryImage: {
    width: 80,
    height: 80,
    borderRadius: 20,
  },
  categoryOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  categoryEmoji: {
    fontSize: 28,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 8,
    letterSpacing: 0.2,
  },
  categoryMeta: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  categoryCount: {
    fontSize: 14,
    fontWeight: "500",
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryBadgeText: {
    fontSize: 12,
    fontWeight: "600",
  },
  arrowContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 12,
  },
  arrowIcon: {
    fontSize: 20,
    fontWeight: "600",
  },
  emptyContainer: {
    alignItems: "center",
    paddingVertical: 80,
  },
  emptyIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  emptyIcon: {
    fontSize: 32,
    opacity: 0.6,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
    paddingHorizontal: 20,
  },
});
