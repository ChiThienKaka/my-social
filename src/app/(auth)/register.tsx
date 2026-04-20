import React, { useState } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  Text,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
  Button,
  Title,
  TextInput,
  Checkbox,
} from "@/components/ui";
import { RoleButton, type RoleType, useAuthStore } from "@/features/auth";
import colors from "@/constants/colors";
import Toast from "react-native-toast-message";

export default function RegisterScreen() {
  const { register, isLoading } = useAuthStore();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<RoleType>("student");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  const handleRegister = async () => {
    if (!fullName.trim()) {
      Toast.show({ type: "error", text1: "Vui lòng nhập họ tên" });
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      Toast.show({ type: "error", text1: "Email không hợp lệ" });
      return;
    }
    if (password.length < 6) {
      Toast.show({ type: "error", text1: "Mật khẩu phải có ít nhất 6 ký tự" });
      return;
    }
    if (password !== confirmPassword) {
      Toast.show({ type: "error", text1: "Mật khẩu xác nhận không khớp" });
      return;
    }
    if (!agreeToTerms) {
      Toast.show({ type: "error", text1: "Vui lòng đồng ý điều khoản sử dụng" });
      return;
    }
    try {
      await register(fullName, email, password);
      Toast.show({ type: "success", text1: "Đăng ký thành công!" });
      router.replace("/(tabs)");
    } catch (error: any) {
      const msg =
        error?.response?.data?.message || error?.message || "Đăng ký thất bại";
      Toast.show({ type: "error", text1: "Đăng ký thất bại", text2: msg });
    }
  };

  const handleLogin = () => {
    router.push("/(auth)/login");
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Main Content */}
          <View style={styles.content}>
            {/* Title and Subtitle */}
            <Title variant="h1" weight="bold">
              Let's get started
            </Title>
            <Title variant="subtitle" color={colors.text.tealGrey}>
              Connect with your campus community.
            </Title>

            {/* Form Fields */}
            <View style={styles.formFields}>
              <TextInput
                label="Full Name"
                placeholder="What should we call you?"
                value={fullName}
                onChangeText={setFullName}
                type="text"
                icon="person-outline"
                iconPosition="right"
              />
              <TextInput
                label="University Email"
                placeholder="student@university.edu"
                value={email}
                onChangeText={setEmail}
                type="email"
                icon="mail-outline"
                iconPosition="right"
              />

              <TextInput
                label="Password"
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                type="password"
              />
              <TextInput
                label="Confirm Password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                type="password"
              />
            </View>
          </View>

          {/* Terms and Privacy Checkbox */}
          <View style={styles.termsContainer}>
            <Checkbox
              checked={agreeToTerms}
              onPress={() => setAgreeToTerms(!agreeToTerms)}
            />
            <View style={styles.termsTextContainer}>
              <Text style={styles.termsText}>I agree to the </Text>
              <TouchableOpacity activeOpacity={0.7}>
                <Text style={styles.termsLink}>Terms of Service</Text>
              </TouchableOpacity>
              <Text style={styles.termsText}> and </Text>
              <TouchableOpacity activeOpacity={0.7}>
                <Text style={styles.termsLink}>Privacy Policy</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Create Account Button */}
          <Button
            label={isLoading ? "Đang tạo tài khoản..." : "Create Account"}
            onPress={handleRegister}
            variant="primary"
            size="large"
            fullWidth
            disabled={isLoading}
            icon="arrow-forward"
            iconPosition="right"
            style={styles.registerButton}
            textStyle={styles.registerButtonText}
          />

          {/* Login Link */}
          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Already have an account? </Text>
            <TouchableOpacity onPress={handleLogin} activeOpacity={0.7}>
              <Text style={styles.loginLink}>Log In</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
  content: {
    paddingTop: 24,
    gap: 16,
  },
  formFields: {
    gap: 16,
  },
  termsContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 24,
    gap: 12,
  },
  termsTextContainer: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
  },
  termsText: {
    fontSize: 14,
    color: colors.text.primary,
    lineHeight: 20,
  },
  termsLink: {
    fontSize: 14,
    color: colors.link.primary,
    fontWeight: "600",
    textDecorationLine: "underline",
  },
  registerButton: {
    marginBottom: 24,
  },
  registerButtonText: {
    color: colors.text.primary,
    fontWeight: "600",
  },
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  loginText: {
    fontSize: 14,
    color: colors.text.primary,
  },
  loginLink: {
    fontSize: 14,
    color: colors.link.primary,
    fontWeight: "600",
  },
});
