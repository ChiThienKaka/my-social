import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  TextInput,
  Alert,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { router } from "expo-router";
import { Avatar, Button, Chip, Icon } from "@/components/ui";
import colors from "@/constants/colors";
import { useAuthStore } from "@/features/auth";
import { usePostStore } from "@/features/post";
import * as ImagePicker from "expo-image-picker";

export default function CreatePostScreen() {
  const { user } = useAuthStore();
  const insets = useSafeAreaInsets();
  const [content, setContent] = useState("");
  const [attachments, setAttachments] = useState<any[]>([]);
  const [privacy, setPrivacy] = useState("Public");
  const { createPost, isCreating, createError } = usePostStore();

  console.log("user1", user);
  const handlePickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert(
        "Permission required",
        "Permission to access the media library is required.",
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      // allowsEditing: true,
      allowsMultipleSelection: true,
      aspect: [4, 3],
      quality: 1,
    });
    console.log("result", result);

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const asset = result.assets[0];

      setAttachments((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          type: "image",
          uri: asset.uri,
          mimeType: asset.mimeType ?? "image/jpeg",
          fileName: asset.fileName ?? `image-${Date.now()}.jpg`,
          fileSize: asset.fileSize,
        },
      ]);
    }
  };

  const handleRemoveAttachment = (id: string) => {
    setAttachments(attachments.filter((item) => item.id !== id));
  };

  const handlePost = async () => {
    try {
      const mediaData = attachments.map((item) => ({
        uri: item.uri,
        type: item.mimeType ?? "image/jpeg",
        name: item.fileName ?? `image-${item.id}.jpg`,
      }));
      
      console.log("📤 [create.tsx] Sending to createPost:");
      console.log("  - content:", content);
      console.log("  - attachments count:", attachments.length);
      console.log("  - media data:", mediaData);
      
      await createPost({
        content,
        media: mediaData,
        author: {
          id: user?.id ?? 0,
          email: user?.email ?? "",
          name: user?.name ?? "",
          avatar_url: user?.avatar_url ?? null,
        },
      });

      // Reset local state và quay lại feed
      setContent("");
      setAttachments([]);
      router.back();
    } catch (error) {
      Alert.alert(
        "Đăng bài thất bại",
        createError || "Đã xảy ra lỗi khi tạo bài viết.",
      );
      console.log("error", error);
    }
  };

  const displayName = user?.name;
  console.log(displayName);
  const displayAvatar = user?.avatar_url;
  console.log(displayAvatar);

  return (
    <SafeAreaView
      style={[styles.container, { paddingBottom: insets.bottom }]}
      edges={["top"]}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.closeButton}
          activeOpacity={0.7}
        >
          <Icon set="ion" name="close" size={24} color={colors.text.primary} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Create Post</Text>

        <Button
          label="Post"
          onPress={handlePost}
          variant="primary"
          disabled={!content.trim() || isCreating}
          size="small"
          style={styles.postButton}
        />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* User Info Section */}
        <View style={styles.userSection}>
          <Avatar
            source={displayAvatar ? { uri: displayAvatar } : undefined}
            size={48}
            badge={{
              icon: "checkmark-circle",
              backgroundColor: colors.teal.primary,
              iconColor: colors.text.white,
            }}
          />
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{displayName}</Text>
            <TouchableOpacity
              style={styles.privacyButton}
              activeOpacity={0.7}
              onPress={() => {
                // TODO: Show privacy dropdown
                console.log("Change privacy");
              }}
            >
              <Icon
                set="ion"
                name="globe-outline"
                size={16}
                color={colors.teal.primary}
              />
              <Text style={styles.privacyText}>{privacy}</Text>
              <Icon
                set="ion"
                name="chevron-down"
                size={16}
                color={colors.teal.primary}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Text Input Area */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            placeholder={`Viết gì đó đi ${displayName?.split(" ")[0]}?...`}
            placeholderTextColor={colors.text.muted}
            value={content}
            onChangeText={(text: string) => {
              setContent(text);
              console.log("text", text);
            }}
            multiline
            textAlignVertical="top"
          />
        </View>

        {/* Attached Media */}
        {attachments.length > 0 && (
          <View style={styles.attachmentsContainer}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.attachmentsRow}
            >
              {attachments.map((item) => (
                <View key={item.id} style={styles.attachmentItem}>
                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => handleRemoveAttachment(item.id)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.removeButtonCircle}>
                      <Icon
                        set="ion"
                        name="close"
                        size={12}
                        color={colors.text.white}
                      />
                    </View>
                  </TouchableOpacity>

                  {item.type === "image" ? (
                    <Image
                      source={{ uri: item.uri }}
                      style={styles.attachmentImage}
                    />
                  ) : (
                    <View style={styles.pdfContainer}>
                      <View style={styles.pdfIcon}>
                        <Text style={styles.pdfText}>PDF</Text>
                      </View>
                      <Text style={styles.pdfName} numberOfLines={1}>
                        {item.name}
                      </Text>
                      <Text style={styles.pdfSize}>{item.size}</Text>
                    </View>
                  )}
                </View>
              ))}
            </ScrollView>
          </View>
        )}
      </ScrollView>

      {/* Bottom Toolbar */}
      <View style={styles.toolbar}>
        <View style={styles.toolbarDivider} />
        <View style={styles.toolbarContent}>
          <TouchableOpacity
            style={styles.toolbarButton}
            activeOpacity={0.7}
            onPress={handlePickImage}
          >
            <Icon
              set="ion"
              name="images-outline"
              size={24}
              color={colors.teal.primary}
            />
          </TouchableOpacity>

          <View style={styles.toolbarDivider} />

          <TouchableOpacity
            style={styles.toolbarButton}
            activeOpacity={0.7}
            onPress={() => {
              // TODO: Attach file
              console.log("Attach file");
            }}
          >
            <Icon
              set="ion"
              name="attach-outline"
              size={24}
              color={colors.icon.secondary}
            />
          </TouchableOpacity>

          <View style={styles.toolbarDivider} />

          <TouchableOpacity
            style={styles.toolbarButton}
            activeOpacity={0.7}
            onPress={() => {
              // TODO: Share
              console.log("Share");
            }}
          >
            <Icon
              set="ion"
              name="arrow-forward-outline"
              size={24}
              color={colors.icon.secondary}
            />
          </TouchableOpacity>

          <View style={styles.toolbarDivider} />

          <TouchableOpacity
            style={styles.toolbarButton}
            activeOpacity={0.7}
            onPress={() => {
              // TODO: Mention user
              console.log("Mention user");
            }}
          >
            <Icon
              set="ion"
              name="at-outline"
              size={24}
              color={colors.icon.secondary}
            />
          </TouchableOpacity>

          <View style={styles.toolbarDivider} />

          <TouchableOpacity
            style={styles.toolbarButton}
            activeOpacity={0.7}
            onPress={() => {
              // TODO: More options
              console.log("More options");
            }}
          >
            <Icon
              set="ion"
              name="ellipsis-horizontal"
              size={24}
              color={colors.icon.secondary}
            />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.white,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  closeButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text.primary,
  },
  postButton: {
    minWidth: 70,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  userSection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  userInfo: {
    marginLeft: 12,
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text.primary,
    marginBottom: 4,
  },
  privacyButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  privacyText: {
    fontSize: 14,
    color: colors.teal.primary,
    fontWeight: "500",
  },
  inputContainer: {
    marginBottom: 16,
    minHeight: 120,
  },
  textInput: {
    fontSize: 16,
    color: colors.text.primary,
    lineHeight: 24,
  },
  attachmentsContainer: {
    marginBottom: 16,
  },
  attachmentsRow: {
    gap: 12,
  },
  attachmentItem: {
    width: 80,
    height: 80,
    borderRadius: 40,
    position: "relative",
  },
  removeButton: {
    position: "absolute",
    top: 0,
    right: 0,
    zIndex: 1,
  },
  removeButtonCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.text.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  attachmentImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.background.grey,
  },
  pdfContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.state.error,
    alignItems: "center",
    justifyContent: "center",
    padding: 8,
  },
  pdfIcon: {
    width: 40,
    height: 40,
    backgroundColor: colors.background.white,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  pdfText: {
    fontSize: 10,
    fontWeight: "700",
    color: colors.state.error,
  },
  pdfName: {
    fontSize: 10,
    color: colors.text.white,
    fontWeight: "500",
    textAlign: "center",
  },
  pdfSize: {
    fontSize: 8,
    color: colors.text.white,
    marginTop: 2,
  },
  hashtagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 16,
  },
  toolbar: {
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
    paddingTop: 8,
    paddingBottom: 8,
  },
  toolbarDivider: {
    width: 1,
    height: 24,
    backgroundColor: colors.border.light,
  },
  toolbarContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingHorizontal: 16,
  },
  toolbarButton: {
    padding: 8,
  },
});
