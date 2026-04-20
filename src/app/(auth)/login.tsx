import React, { useState } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  Text,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Button, Title, TextInput, Checkbox } from "@/components/ui";
import {
  GoogleAuthResponse,
  SocialButton,
  useAuthStore,
} from "@/features/auth";
import colors from "@/constants/colors";
import Toast from "react-native-toast-message";

import {
  GoogleSignin,
  GoogleSigninButton,
  isErrorWithCode,
  isSuccessResponse,
  statusCodes,
} from "@react-native-google-signin/google-signin";
export default function LoginScreen() {
  const { loginWithGoogle, login, user, isLoading } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Toast.show({ type: "error", text1: "Vui lòng nhập email và mật khẩu" });
      return;
    }
    try {
      await login(email, password);
      router.replace("/(tabs)");
    } catch (error: any) {
      const msg =
        error?.response?.data?.message || error?.message || "Đăng nhập thất bại";
      Toast.show({ type: "error", text1: "Đăng nhập thất bại", text2: msg });
    }
  };

  const handleForgotPassword = () => {
    // Handle forgot password logic here
    console.log("Forgot password");
  };

  const handleSignUp = () => {
    router.push("/(auth)/register");
  };
  // GoogleSignin.configure({
  //   webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
  // });
  // Somewhere in your code
  const signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();
      console.log("response:", response?.data?.user?.name);
      if (isSuccessResponse(response)) {
        await loginWithGoogle({
          google_id: response.data.user.id,
          email: response.data.user.email,
          name: response.data.user.name || "",
          picture: response.data.user.photo || "",
        });
        router.replace("/(tabs)");
      } else {
        console.log("sign in was cancelled by user");
      }
    } catch (error) {
      console.log(error);
      if (isErrorWithCode(error)) {
        switch (error.code) {
          case statusCodes.IN_PROGRESS:
            // operation (eg. sign in) already in progress
            break;
          case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
            // Android only, play services not available or outdated
            break;
          default:
          // some other error happened
        }
      } else {
        // an error that's not related to google sign in occurred
      }
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Main Content */}
        <View style={styles.content}>
          {/* Title and Subtitle */}
          <Title variant="h1" weight="bold">
            Let's get social.
          </Title>
          <Title
            variant="subtitle"
            color={colors.text.secondary}
            style={styles.subtitle}
          >
            Log in to connect with your campus.
          </Title>

          {/* Input Fields */}
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Student Email or Username"
              value={email}
              onChangeText={setEmail}
              type="email"
              containerStyle={styles.input}
            />
            <TextInput
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              type="password"
              containerStyle={styles.input}
            />
          </View>

          {/* Remember Me and Forgot Password */}
          <View style={styles.optionsRow}>
            <View style={styles.rememberMeContainer}>
              <Checkbox
                checked={rememberMe}
                onPress={() => setRememberMe(!rememberMe)}
              />
              <Text style={styles.rememberMeText}>Remember Me</Text>
            </View>
            <TouchableOpacity
              onPress={handleForgotPassword}
              activeOpacity={0.7}
            >
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>
          </View>

          {/* Login Button */}
          <Button
            label={isLoading ? "Đang đăng nhập..." : "Log In"}
            onPress={handleLogin}
            variant="primary"
            size="large"
            fullWidth
            disabled={isLoading}
            style={styles.loginButton}
            textStyle={styles.loginButtonText}
          />

          {/* Divider */}
          <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>Or continue with</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Social Login Buttons */}
          <View style={styles.socialButtonsContainer}>
            <SocialButton provider="google" onPress={signIn} />
            <SocialButton
              provider="ios"
              onPress={() => console.log("iOS login")}
            />
            <SocialButton
              provider="university"
              onPress={() => console.log("University login")}
            />
          </View>

          {/* Sign Up Link */}
          <View style={styles.signUpContainer}>
            <Text style={styles.signUpText}>Don't have an account? </Text>
            <TouchableOpacity onPress={handleSignUp} activeOpacity={0.7}>
              <Text style={styles.signUpLink}>Sign up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    justifyContent: "center",
    gap: 24,
  },

  backButton: {
    padding: 4,
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
  },

  content: {
    paddingTop: 24,
    paddingBottom: 32,
  },
  mainTitle: {
    marginBottom: 8,
  },
  subtitle: {
    marginBottom: 32,
  },
  inputContainer: {
    marginBottom: 20,
    gap: 16,
  },
  input: {
    marginBottom: 0,
  },
  optionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  rememberMeContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  rememberMeText: {
    fontSize: 14,
    color: colors.text.primary,
    fontWeight: "400",
  },
  forgotPasswordText: {
    fontSize: 14,
    color: colors.link.primary,
    fontWeight: "500",
  },
  loginButton: {
    marginBottom: 32,
  },
  loginButtonText: {
    color: colors.text.primary,
    fontWeight: "600",
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border.light,
  },
  dividerText: {
    fontSize: 14,
    color: colors.text.secondary,
    paddingHorizontal: 16,
  },
  socialButtonsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 16,
    marginBottom: 32,
  },
  signUpContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  signUpText: {
    fontSize: 14,
    color: colors.text.primary,
  },
  signUpLink: {
    fontSize: 14,
    color: colors.link.primary,
    fontWeight: "600",
  },
});
