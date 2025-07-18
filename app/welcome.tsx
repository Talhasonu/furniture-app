import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { FurniButton } from "@/components/ui/FurniButton";
import { FurniCard } from "@/components/ui/FurniCard";
import { useThemeColor } from "@/hooks/useThemeColor";
import { router } from "expo-router";
import {
  Dimensions,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

const furnitureCategories = [
  { id: 1, title: "Chairs", icon: "🪑" },
  { id: 2, title: "Tables", icon: "🪟" },
  { id: 3, title: "Sofas", icon: "🛋️" },
  { id: 4, title: "Beds", icon: "🛏️" },
  { id: 5, title: "Storage", icon: "🗄️" },
  { id: 6, title: "Lighting", icon: "💡" },
];

export default function WelcomeScreen() {
  const backgroundColor = useThemeColor(
    { light: "#f8f9fa", dark: "#121212" },
    "background"
  );
  const tintColor = useThemeColor({}, "tint");

  const handleSignUp = () => {
    router.push("/(auth)/signup");
  };

  const handleSignIn = () => {
    router.push("/(auth)/signin");
  };

  const handleCategoryPress = (category: string) => {
    // Navigate to category or show alert for now
    console.log("Selected category:", category);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      <StatusBar barStyle="dark-content" backgroundColor={backgroundColor} />

      {/* Header with Logo and Auth Buttons */}
      <ThemedView style={styles.header}>
        <View style={styles.logoContainer}>
          <Text style={[styles.logo, { color: tintColor }]}>FurniStore</Text>
          <ThemedText style={styles.tagline}>
            Beautiful Furniture for Your Home
          </ThemedText>
        </View>

        <View style={styles.authButtons}>
          <FurniButton
            title="Sign Up"
            onPress={handleSignUp}
            variant="outline"
            style={styles.authButton}
          />
          <FurniButton
            title="Sign In"
            onPress={handleSignIn}
            variant="primary"
            style={styles.authButton}
          />
        </View>
      </ThemedView>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Welcome Section */}
        <ThemedView style={styles.welcomeSection}>
          <ThemedText type="title" style={styles.welcomeTitle}>
            Discover Amazing Furniture
          </ThemedText>
          <ThemedText style={styles.welcomeSubtitle}>
            Transform your space with our curated collection of modern and
            classic furniture pieces.
          </ThemedText>
        </ThemedView>

        {/* Categories Section */}
        <ThemedView style={styles.categoriesSection}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Shop by Category
          </ThemedText>

          <View style={styles.categoriesGrid}>
            {furnitureCategories.map((category) => (
              <FurniCard
                key={category.id}
                title={category.title}
                icon={category.icon}
                onPress={() => handleCategoryPress(category.title)}
              />
            ))}
          </View>
        </ThemedView>

        {/* Features Section */}
        <ThemedView style={styles.featuresSection}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Why Choose FurniStore?
          </ThemedText>

          <View style={styles.featuresList}>
            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>🚚</Text>
              <ThemedText style={styles.featureText}>Free Delivery</ThemedText>
            </View>
            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>💯</Text>
              <ThemedText style={styles.featureText}>
                Quality Guarantee
              </ThemedText>
            </View>
            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>🎨</Text>
              <ThemedText style={styles.featureText}>Custom Designs</ThemedText>
            </View>
            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>📞</Text>
              <ThemedText style={styles.featureText}>24/7 Support</ThemedText>
            </View>
          </View>
        </ThemedView>

        {/* CTA Section */}
        <ThemedView style={styles.ctaSection}>
          <ThemedText type="subtitle" style={styles.ctaTitle}>
            Ready to Start Shopping?
          </ThemedText>
          <ThemedText style={styles.ctaSubtitle}>
            Join thousands of happy customers who have transformed their homes
            with FurniStore.
          </ThemedText>

          <View style={styles.ctaButtons}>
            <FurniButton
              title="Create Account"
              onPress={handleSignUp}
              variant="primary"
              style={styles.ctaButton}
            />
            <FurniButton
              title="Browse Catalog"
              onPress={() => console.log("Browse catalog")}
              variant="outline"
              style={styles.ctaButton}
            />
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
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 0, 0, 0.1)",
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  logo: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 4,
  },
  tagline: {
    fontSize: 14,
    opacity: 0.7,
    textAlign: "center",
  },
  authButtons: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
  },
  authButton: {
    flex: 1,
    maxWidth: 120,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
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
  categoriesSection: {
    padding: 24,
  },
  sectionTitle: {
    marginBottom: 20,
    textAlign: "center",
  },
  categoriesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  featuresSection: {
    padding: 24,
    backgroundColor: "rgba(0, 0, 0, 0.02)",
  },
  featuresList: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  featureItem: {
    width: "48%",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 12,
  },
  featureIcon: {
    fontSize: 24,
  },
  featureText: {
    fontSize: 16,
    fontWeight: "500",
  },
  ctaSection: {
    padding: 24,
    alignItems: "center",
  },
  ctaTitle: {
    textAlign: "center",
    marginBottom: 12,
  },
  ctaSubtitle: {
    fontSize: 16,
    textAlign: "center",
    opacity: 0.7,
    lineHeight: 24,
    marginBottom: 32,
  },
  ctaButtons: {
    width: "100%",
    gap: 12,
  },
  ctaButton: {
    width: "100%",
  },
});
