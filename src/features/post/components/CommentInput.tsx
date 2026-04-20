import React, { useState } from "react";
import { StyleSheet, View, TextInput, TouchableOpacity } from "react-native";
import { Avatar, Icon } from "@/components/ui";
import colors from "@/constants/colors";
import { useAuthStore } from "@/features/auth";

interface CommentInputProps {
  placeholder?: string;
  onSubmit?: (text: string) => void;
  onFocus?: () => void;
}

const CommentInput: React.FC<CommentInputProps> = ({
  placeholder = "Thêm bình luận...",
  onSubmit,
  onFocus,
}) => {
  const { user } = useAuthStore();
  const [text, setText] = useState("");

  const handleSubmit = () => {
    if (text.trim() && onSubmit) {
      onSubmit(text.trim());
      setText("");
    }
  };

  console.log("user1", user?.avatar_url);
  const displayAvatar = user?.avatar_url
    ? { uri: user.avatar_url }
    : undefined;

  return (
    <View style={styles.container}>
      <Avatar source={displayAvatar} name={user?.name} size={32} />
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={colors.text.muted}
        value={text}
        onChangeText={setText}
        onFocus={onFocus}
        multiline
        maxLength={500}
      />
      <TouchableOpacity
        style={styles.sendButton}
        onPress={handleSubmit}
        activeOpacity={0.7}
        disabled={!text.trim()}
      >
        <Icon
          set="ion"
          name="send"
          size={20}
          color={text.trim() ? colors.teal.primary : colors.text.muted}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
    backgroundColor: colors.background.white,
    gap: 12,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: colors.text.primary,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: colors.background.grey,
    borderRadius: 20,
    maxHeight: 100,
  },
  sendButton: {
    padding: 8,
  },
});

export default CommentInput;
