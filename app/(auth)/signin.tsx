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

interface SignInFormData {
  email: string;
  password: string;
}

export default function SignInScreen() {
  const { signIn } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");
  const tintColor = useThemeColor({}, "tint");
  const iconColor = useThemeColor({}, "icon");

  // Using the global colors object

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>();

  const onSubmit = async (data: SignInFormData) => {
    setLoading(true);
    try {
      const result = await signIn(data.email, data.password);
      if (result.success) {
        // Navigate to dashboard after successful signin
        router.replace("/(tabs)/dashboard");
        console.log(result.message);
      } else {
        Alert.alert("Sign In Failed", result.message);
      }
    } catch (error: any) {
      Alert.alert(
        "Sign In Failed",
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
              Welcome Back
            </ThemedText>
            <ThemedText style={[styles.subtitle]}>
              Sign in to your account
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
                    minLength: { value: 6, message: "Minimum 6 characters" },
                  }}
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      style={[
                        styles.passwordInput,
                        {
                          borderColor: errors.password ? "#EF4444" : "#A3C4BC",
                        },
                      ]}
                      placeholder="Enter your password"
                      placeholderTextColor="#9CA3AF"
                      secureTextEntry={!showPassword}
                      autoComplete="password"
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
                    color={iconColor}
                  />
                </TouchableOpacity>
              </View>
              {errors.password && (
                <ThemedText style={styles.errorText}>
                  {errors.password.message}
                </ThemedText>
              )}
            </ThemedView>

            {/* Forgot Password */}
            <Link href="/forgot-password" asChild>
              <TouchableOpacity style={styles.forgotPasswordContainer}>
                <ThemedText style={styles.forgotPasswordText}>
                  Forgot your password?
                </ThemedText>
              </TouchableOpacity>
            </Link>

            {/* Sign In Button */}
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmit(onSubmit)}
              disabled={loading}
              activeOpacity={0.8}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.submitButtonText}>Sign In</Text>
              )}
            </TouchableOpacity>

            {/* Sign Up Link */}
            <ThemedView style={styles.signUpContainer}>
              <ThemedText style={{ color: textColor }}>
                Don't have an account?{" "}
              </ThemedText>
              <Link href="/signup" asChild>
                <TouchableOpacity>
                  <ThemedText style={styles.signUpText}>Sign Up</ThemedText>
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
  scrollContainer: { padding: 24, paddingTop: 80 },
  header: {
    alignItems: "center",
    marginBottom: 40,
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
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    color: "#7A7A7A",
  },
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
  forgotPasswordContainer: { alignItems: "flex-end", marginBottom: 24 },
  forgotPasswordText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#7A7A7A",
  },
  submitButton: {
    height: 52,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
    backgroundColor: "#5C4033", // Dark brown background
    // shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  signUpContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  signUpText: { fontSize: 16, fontWeight: "600", color: "#1E1E1E" },
});
