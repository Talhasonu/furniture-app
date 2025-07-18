import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { useColorScheme } from "@/hooks/useColorScheme";

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const { user, loading } = useAuth();

  if (loading) {
    return null; // You could add a loading screen here
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        {user ? (
          // User is signed in
          <>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="product-detail" />
            <Stack.Screen name="products" />
            <Stack.Screen name="categories" />
            <Stack.Screen name="favorites" />
            <Stack.Screen name="orders" />
            <Stack.Screen name="+not-found" />
          </>
        ) : (
          // User is not signed in
          <>
            <Stack.Screen name="welcome" />
            <Stack.Screen name="(auth)" />
          </>
        )}
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  if (!loaded) {
    return null;
  }

  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}
