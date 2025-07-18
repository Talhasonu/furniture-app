import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useAuth } from "@/contexts/AuthContext";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Ionicons } from "@expo/vector-icons";
import { Link, router } from "expo-router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface SignUpFormData {
  email: string;
  password: string;
  confirmPassword: string;
}

export default function SignUpScreen() {
  const { signUp } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");
  const tintColor = useThemeColor({}, "tint");
  const iconColor = useThemeColor({}, "icon");

  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<SignUpFormData>();

  const watchPassword = watch("password");

  const onSubmit = async (data: SignUpFormData) => {
    setLoading(true);
    try {
      const result = await signUp(data.email, data.password);
      if (result.success) {
        Alert.alert("Welcome to FurniStore!", "Account created successfully!", [
          {
            text: "Continue",
            onPress: () => {
              reset(); // Reset form fields
              router.replace("/(tabs)/dashboard"); // Navigate to dashboard
            },
          },
        ]);
      } else {
        Alert.alert("Sign Up Failed", result.message);
      }
    } catch (error: any) {
      Alert.alert(
        "Sign Up Failed",
        "An unexpected error occurred. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.flex}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <ThemedView style={styles.header}>
            <ThemedText type="title" style={styles.titleText}>
              Create Account
            </ThemedText>
            <ThemedText style={[styles.subtitle, { color: "#7A7A7A" }]}>
              Join us and start your journey
            </ThemedText>
          </ThemedView>

          <ThemedView style={styles.formContainer}>
            {/* Email */}
            <ThemedView style={styles.inputContainer}>
              <ThemedText style={styles.label}>Email Address</ThemedText>
              <Controller
                control={control}
                name="email"
                rules={{
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Invalid email address",
                  },
                }}
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    style={[
                      styles.input,
                      {
                        borderColor: errors.email ? "#EF4444" : "#A3C4BC",
                        color: "#1E1E1E",
                        backgroundColor: "white",
                      },
                    ]}
                    placeholder="Enter your email"
                    placeholderTextColor="#9CA3AF"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoComplete="email"
                    onChangeText={onChange}
                    value={value}
                  />
                )}
              />
              {errors.email && (
                <ThemedText style={styles.errorText}>
                  {errors.email.message}
                </ThemedText>
              )}
            </ThemedView>

            {/* Password */}
            <ThemedView style={styles.inputContainer}>
              <ThemedText style={styles.label}>Password</ThemedText>
              <View style={styles.passwordContainer}>
                <Controller
                  control={control}
                  name="password"
                  rules={{
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Minimum 6 characters required",
                    },
                    pattern: {
                      value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                      message:
                        "Password must contain uppercase, lowercase, and number",
                    },
                  }}
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      style={[
                        styles.passwordInput,
                        {
                          borderColor: errors.password ? "#EF4444" : "#A3C4BC",
                          color: "#1E1E1E",
                          backgroundColor: "white",
                        },
                      ]}
                      placeholder="Create a strong password"
                      placeholderTextColor="#9CA3AF"
                      secureTextEntry={!showPassword}
                      autoComplete="new-password"
                      onChangeText={onChange}
                      value={value}
                    />
                  )}
                />
                <TouchableOpacity
                  style={styles.eyeIcon}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Ionicons
                    name={showPassword ? "eye-off-outline" : "eye-outline"}
                    size={24}
                    color="#6B7280"
                  />
                </TouchableOpacity>
              </View>
              {errors.password && (
                <ThemedText style={styles.errorText}>
                  {errors.password.message}
                </ThemedText>
              )}
            </ThemedView>

            {/* Confirm Password */}
            <ThemedView style={styles.inputContainer}>
              <ThemedText style={styles.label}>Confirm Password</ThemedText>
              <View style={styles.passwordContainer}>
                <Controller
                  control={control}
                  name="confirmPassword"
                  rules={{
                    required: "Please confirm your password",
                    validate: (value) =>
                      value === watchPassword || "Passwords do not match",
                  }}
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      style={[
                        styles.passwordInput,
                        {
                          borderColor: errors.confirmPassword
                            ? "#EF4444"
                            : "#A3C4BC",
                          color: "#1E1E1E",
                          backgroundColor: "white",
                        },
                      ]}
                      placeholder="Confirm your password"
                      placeholderTextColor="#9CA3AF"
                      secureTextEntry={!showConfirmPassword}
                      autoComplete="new-password"
                      onChangeText={onChange}
                      value={value}
                    />
                  )}
                />
                <TouchableOpacity
                  style={styles.eyeIcon}
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <Ionicons
                    name={
                      showConfirmPassword ? "eye-off-outline" : "eye-outline"
                    }
                    size={24}
                    color="#6B7280"
                  />
                </TouchableOpacity>
              </View>
              {errors.confirmPassword && (
                <ThemedText style={styles.errorText}>
                  {errors.confirmPassword.message}
                </ThemedText>
              )}
            </ThemedView>

            {/* Password Requirements */}
            <ThemedView style={styles.passwordRequirements}>
              <ThemedText
                style={[styles.requirementText, { color: "#374151" }]}
              >
                Password must contain:
              </ThemedText>
              <ThemedText
                style={[styles.requirementItem, { color: "#6B7280" }]}
              >
                • At least 6 characters
              </ThemedText>
              <ThemedText
                style={[styles.requirementItem, { color: "#6B7280" }]}
              >
                • One uppercase letter
              </ThemedText>
              <ThemedText
                style={[styles.requirementItem, { color: "#6B7280" }]}
              >
                • One lowercase letter
              </ThemedText>
              <ThemedText
                style={[styles.requirementItem, { color: "#6B7280" }]}
              >
                • One number
              </ThemedText>
            </ThemedView>

            {/* Sign Up Button */}
            <TouchableOpacity
              style={[styles.submitButton, { backgroundColor: "#5C4033" }]}
              onPress={handleSubmit(onSubmit)}
              disabled={loading}
              activeOpacity={0.8}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.submitButtonText}>Create Account</Text>
              )}
            </TouchableOpacity>

            {/* Sign In Link */}
            <ThemedView style={styles.signInContainer}>
              <ThemedText style={{ color: "#7A7A7A" }}>
                Already have an account?{" "}
              </ThemedText>
              <Link href="/signin" asChild>
                <TouchableOpacity>
                  <ThemedText style={[styles.signInText, { color: "black" }]}>
                    Sign In
                  </ThemedText>
                </TouchableOpacity>
              </Link>
            </ThemedView>
          </ThemedView>
        </ScrollView>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f1d39eff" },
  flex: { flex: 1 },
  scrollContainer: { padding: 24, paddingTop: 60 },
  header: {
    alignItems: "center",
    marginBottom: 32,
    backgroundColor: "transparent",
  },
  titleText: { fontSize: 28, fontWeight: "bold", color: "#f1d39eff" },
  subtitle: {
    fontSize: 16,
    marginTop: 8,
    textAlign: "center",
    color: "#7A7A7A",
  },
  formContainer: { flex: 1, backgroundColor: "transparent" },
  inputContainer: { marginBottom: 20, backgroundColor: "transparent" },
  label: { fontSize: 16, fontWeight: "600", marginBottom: 8, color: "#7A7A7A" },
  input: {
    height: 52,
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: "white",
    borderColor: "white",
    color: "#1E1E1E",
  },
  passwordContainer: {
    position: "relative",
    flexDirection: "row",
    alignItems: "center",
  },
  passwordInput: {
    flex: 1,
    height: 52,
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingRight: 50,
    fontSize: 16,
    backgroundColor: "white",
    borderColor: "white",
    color: "#1E1E1E",
  },
  eyeIcon: {
    position: "absolute",
    right: 16,
    padding: 4,
    color: "#7A7A7A",
  },
  errorText: { color: "#EF4444", fontSize: 14, marginTop: 4 },
  passwordRequirements: {
    marginBottom: 24,
    backgroundColor: "#F3F4F6",
    padding: 16,
    borderRadius: 12,
  },
  requirementText: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
    color: "#7A7A7A",
  },
  requirementItem: {
    fontSize: 12,
    marginLeft: 8,
    marginBottom: 2,
    color: "#7A7A7A",
  },
  submitButton: {
    height: 52,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
    backgroundColor: "#5C4033",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  submitButtonText: { color: "#fff", fontSize: 18, fontWeight: "700" },
  signInContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  signInText: { fontSize: 16, fontWeight: "600", color: "#1E1E1E" },
});
