import React, { useState, useEffect } from "react";
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
import { router, Stack } from "expo-router";
import { Avatar, Button, TextInput } from "@/components/ui";
import colors from "@/constants/colors";
import { useAuthStore } from "@/features/auth";
import useProfileStore from "@/features/profile/store/useProfileStore";
import { resolveImageUrl } from "@/utils/resolveImageUrl";
import * as ImagePicker from "expo-image-picker";
import Toast from "react-native-toast-message";

export default function EditProfileScreen() {
  const { user } = useAuthStore();
  const { profile, updateProfile, isLoading, fetchProfile } = useProfileStore();

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [bio, setBio] = useState("");
  const [address, setAddress] = useState("");
  const [avatarFile, setAvatarFile] = useState<{
    uri: string;
    type: string;
    name: string;
  } | null>(null);

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || "");
      setPhone(profile.phone || "");
      setBio(profile.bio || "");
      setAddress(profile.address || "");
    } else if (user) {
      setFullName(user.name || "");
      setPhone(user.phone || "");
    }
  }, [profile, user]);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      const asset = result.assets[0];
      const ext = asset.uri.split(".").pop() || "jpg";
      setAvatarFile({
        uri: asset.uri,
        type: asset.mimeType || `image/${ext}`,
        name: `avatar.${ext}`,
      });
    }
  };

  const handleSave = async () => {
    if (!fullName.trim()) {
      Toast.show({ type: "error", text1: "Vui lòng nhập họ tên" });
      return;
    }
    try {
      await updateProfile({
        full_name: fullName.trim(),
        phone: phone.trim() || undefined,
        bio: bio.trim() || undefined,
        address: address.trim() || undefined,
        avatar: avatarFile || undefined,
      });
      await fetchProfile();
      Toast.show({ type: "success", text1: "Cập nhật hồ sơ thành công!" });
      router.back();
    } catch (error: any) {
      const msg =
        error?.response?.data?.message || error?.message || "Lỗi cập nhật";
      Toast.show({ type: "error", text1: "Cập nhật thất bại", text2: msg });
    }
  };

  const currentAvatarUri =
    avatarFile?.uri ||
    (profile?.avatar_url ? resolveImageUrl(profile.avatar_url) : undefined) ||
    (user?.avatar_url ? resolveImageUrl(user.avatar_url) : undefined);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.flex}
    >
      <SafeAreaView style={styles.container} edges={["top"]}>
        <Stack.Screen options={{ headerShown: false }} />

        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
            <Ionicons name="arrow-back" size={24} color={colors.icon.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Chỉnh sửa hồ sơ</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.avatarSection}>
            <TouchableOpacity onPress={pickImage} activeOpacity={0.7}>
              <Avatar
                source={currentAvatarUri ? { uri: currentAvatarUri } : undefined}
                name={fullName || "User"}
                size={100}
              />
              <View style={styles.cameraOverlay}>
                <Ionicons name="camera" size={18} color={colors.text.white} />
              </View>
            </TouchableOpacity>
            <Text style={styles.changePhotoText}>Thay đổi ảnh đại diện</Text>
          </View>

          <View style={styles.form}>
            <TextInput
              label="Họ và tên"
              placeholder="Nhập họ tên"
              value={fullName}
              onChangeText={setFullName}
              type="text"
              icon="person-outline"
              iconPosition="right"
            />
            <TextInput
              label="Số điện thoại"
              placeholder="Nhập số điện thoại"
              value={phone}
              onChangeText={setPhone}
              type="text"
              icon="call-outline"
              iconPosition="right"
            />
            <TextInput
              label="Giới thiệu bản thân"
              placeholder="Viết vài dòng về bạn..."
              value={bio}
              onChangeText={setBio}
              type="text"
              multiline
            />
            <TextInput
              label="Địa chỉ"
              placeholder="Nhập địa chỉ"
              value={address}
              onChangeText={setAddress}
              type="text"
              icon="location-outline"
              iconPosition="right"
            />
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>Thông tin không thể thay đổi</Text>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Email</Text>
              <Text style={styles.infoValue}>
                {profile?.email || user?.email || "—"}
              </Text>
            </View>
            {(profile?.student_code || user?.student_code) && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>MSSV</Text>
                <Text style={styles.infoValue}>
                  {profile?.student_code || user?.student_code}
                </Text>
              </View>
            )}
            {profile?.faculty && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Khoa</Text>
                <Text style={styles.infoValue}>{profile.faculty}</Text>
              </View>
            )}
          </View>

          <Button
            label={isLoading ? "Đang lưu..." : "Lưu thay đổi"}
            onPress={handleSave}
            variant="primary"
            size="large"
            fullWidth
            disabled={isLoading}
            style={styles.saveButton}
          />
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: { flex: 1, backgroundColor: colors.background.primary },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: colors.background.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  headerTitle: { fontSize: 18, fontWeight: "600", color: colors.text.primary },
  scrollContent: { padding: 20, paddingBottom: 40 },
  avatarSection: { alignItems: "center", marginBottom: 28 },
  cameraOverlay: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.teal.primary,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: colors.background.white,
  },
  changePhotoText: {
    marginTop: 10,
    fontSize: 14,
    color: colors.teal.primary,
    fontWeight: "500",
  },
  form: { gap: 4, marginBottom: 24 },
  infoCard: {
    backgroundColor: colors.background.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text.secondary,
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  infoLabel: { fontSize: 14, color: colors.text.secondary },
  infoValue: { fontSize: 14, color: colors.text.primary, fontWeight: "500" },
  saveButton: { marginTop: 8 },
});
