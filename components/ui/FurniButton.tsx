import { useThemeColor } from "@/hooks/useThemeColor";
import React from "react";
import {
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
} from "react-native";

interface FurniButtonProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "outline";
  style?: ViewStyle;
  textStyle?: TextStyle;
  disabled?: boolean;
}

export const FurniButton: React.FC<FurniButtonProps> = ({
  title,
  onPress,
  variant = "primary",
  style,
  textStyle,
  disabled = false,
}) => {
  const primaryColor = useThemeColor({}, "tint");
  const backgroundColor = useThemeColor(
    { light: "#f5f5f5", dark: "#2a2a2a" },
    "background"
  );
  const textColor = useThemeColor({ light: "#000", dark: "#fff" }, "text");

  const getButtonStyle = () => {
    switch (variant) {
      case "primary":
        return {
          backgroundColor: primaryColor,
          borderWidth: 0,
        };
      case "secondary":
        return {
          backgroundColor: backgroundColor,
          borderWidth: 1,
          borderColor: primaryColor,
        };
      case "outline":
        return {
          backgroundColor: "transparent",
          borderWidth: 2,
          borderColor: primaryColor,
        };
      default:
        return {
          backgroundColor: primaryColor,
          borderWidth: 0,
        };
    }
  };

  const getTextStyle = () => {
    switch (variant) {
      case "primary":
        return { color: "#fff" };
      case "secondary":
      case "outline":
        return { color: primaryColor };
      default:
        return { color: "#fff" };
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        getButtonStyle(),
        disabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
    >
      <Text style={[styles.text, getTextStyle(), textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 50,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  text: {
    fontSize: 16,
    fontWeight: "600",
  },
  disabled: {
    opacity: 0.5,
  },
});
