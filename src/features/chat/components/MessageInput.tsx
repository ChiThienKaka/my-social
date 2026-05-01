import React, { useState } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import colors from "@/constants/colors";

interface MessageInputProps {
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  onSend?: () => void;
  onAttach?: () => void;
  onCamera?: () => void;
  onEmoji?: () => void;
  /** Khi có nội dung, màu nền nút gửi (mặc định teal app) */
  sendActiveBackgroundColor?: string;
}

const MessageInput: React.FC<MessageInputProps> = ({
  placeholder = "Type a message...",
  value,
  onChangeText,
  onSend,
  onAttach,
  onCamera,
  onEmoji,
  sendActiveBackgroundColor = colors.teal.primary,
}) => {
  const [message, setMessage] = useState(value || "");

  const handleSend = () => {
    if (message.trim() && onSend) {
      onSend();
      setMessage("");
      onChangeText?.("");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      <View style={styles.container}>
        <TouchableOpacity
          onPress={onAttach}
          style={styles.iconButton}
          activeOpacity={0.7}
        >
          <Ionicons
            name="add-circle-outline"
            size={28}
            color={colors.text.secondary}
          />
        </TouchableOpacity>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder={placeholder}
            placeholderTextColor={colors.text.muted}
            value={value || message}
            onChangeText={(text) => {
              setMessage(text);
              onChangeText?.(text);
            }}
            multiline
            maxLength={1000}
          />
          <TouchableOpacity
            onPress={onEmoji}
            style={styles.emojiButton}
            activeOpacity={0.7}
          >
            <Ionicons
              name="happy-outline"
              size={24}
              color={colors.text.secondary}
            />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          onPress={onCamera}
          style={styles.iconButton}
          activeOpacity={0.7}
        >
          <Ionicons
            name="camera-outline"
            size={24}
            color={colors.text.secondary}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleSend}
          style={[
            styles.sendButton,
            (value || message).trim() && {
              backgroundColor: sendActiveBackgroundColor,
            },
          ]}
          activeOpacity={0.7}
          disabled={!(value || message).trim()}
        >
          <Ionicons
            name="send"
            size={20}
            color={colors.text.white}
          />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.background.white,
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
  },
  iconButton: {
    padding: 8,
    marginRight: 8,
  },
  inputContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.background.grey,
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
    minHeight: 44,
    maxHeight: 100,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: colors.text.primary,
    paddingVertical: 4,
  },
  emojiButton: {
    padding: 4,
    marginLeft: 8,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.text.muted,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },
});

export default MessageInput;









