import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useThemeColor } from "@/hooks/useThemeColor";
import React from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";

const { width } = Dimensions.get("window");
const cardWidth = (width - 48) / 2; // 24px margin on each side, 16px gap between cards

interface FurniCardProps {
  title: string;
  imageSource?: any;
  onPress: () => void;
  icon?: string;
}

export const FurniCard: React.FC<FurniCardProps> = ({
  title,
  imageSource,
  onPress,
  icon = "🪑",
}) => {
  const cardBackground = useThemeColor(
    { light: "#ffffff", dark: "#2a2a2a" },
    "background"
  );
  const shadowColor = useThemeColor({ light: "#000", dark: "#fff" }, "text");

  return (
    <TouchableOpacity
      style={[
        styles.card,
        {
          backgroundColor: cardBackground,
          shadowColor: shadowColor,
        },
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <ThemedView style={styles.imageContainer}>
        {imageSource ? (
          <Image source={imageSource} style={styles.image} resizeMode="cover" />
        ) : (
          <Text style={styles.iconPlaceholder}>{icon}</Text>
        )}
      </ThemedView>

      <ThemedView style={styles.contentContainer}>
        <ThemedText style={styles.title} numberOfLines={2}>
          {title}
        </ThemedText>
      </ThemedView>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: cardWidth,
    height: 180,
    borderRadius: 16,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 16,
  },
  imageContainer: {
    height: 120,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.05)",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  iconPlaceholder: {
    fontSize: 48,
  },
  contentContainer: {
    flex: 1,
    padding: 12,
    justifyContent: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
});
