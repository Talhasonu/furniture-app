import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useAuth } from "@/contexts/AuthContext";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useRouter } from "expo-router";
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
} from "react-native";

interface ForgotPasswordFormData {
  email: string;
}

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const { resetPassword } = useAuth();
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");
  const tintColor = useThemeColor({}, "tint");
  const iconColor = useThemeColor({}, "icon");

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>();

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setLoading(true);
    try {
      await resetPassword(data.email);
      setEmailSent(true);
      Alert.alert(
        "Email Sent",
        "Password reset email has been sent to your email address. Please check your inbox.",
        [{ text: "OK", onPress: () => router.back() }]
      );
    } catch (error: any) {
      Alert.alert("Error", error.message);
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
              Forgot Password
            </ThemedText>
            <ThemedText style={[styles.subtitle, { color: "#6B7280" }]}>
              Enter your email address and we'll send you a link to reset your
              password
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

            {/* Reset Password Button */}
            <TouchableOpacity
              style={[styles.submitButton, { backgroundColor: "#5C4033" }]}
              onPress={handleSubmit(onSubmit)}
              disabled={loading || emailSent}
              activeOpacity={0.8}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.submitButtonText}>
                  {emailSent ? "Email Sent" : "Send Reset Email"}
                </Text>
              )}
            </TouchableOpacity>

            {/* Back to Sign In */}
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.backContainer}
            >
              <ThemedText style={[styles.backText, { color: "black" }]}>
                Back to Sign In
              </ThemedText>
            </TouchableOpacity>
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
    paddingHorizontal: 20,
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
  errorText: { color: "#EF4444", fontSize: 14, marginTop: 4 },
  submitButton: {
    height: 52,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  submitButtonText: { color: "#fff", fontSize: 18, fontWeight: "700" },
  backContainer: {
    alignItems: "center",
  },
  backText: { fontSize: 16, fontWeight: "600", color: "#1E1E1E" },
});
