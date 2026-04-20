import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system/legacy";
import colors from "@/constants/colors";

const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5MB
const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "application/msword", // .doc
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
];
const MAX_NAME_LENGTH = 32;

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)}KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
}

function truncateFileName(name: string, maxLen: number = MAX_NAME_LENGTH): string {
  if (name.length <= maxLen) return name;
  return name.slice(0, maxLen - 3).trim() + "...";
}

export interface PickedCVFile {
  uri: string;
  name: string;
  size?: number;
  mimeType?: string;
}

interface CVUploadAreaProps {
  onFilePicked?: (file: PickedCVFile) => void;
  onClear?: () => void;
  pickedFile?: PickedCVFile | null;
}

const CVUploadArea: React.FC<CVUploadAreaProps> = ({
  onFilePicked,
  onClear,
  pickedFile,
}) => {
  const pickFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        copyToCacheDirectory: true,
        type: ALLOWED_MIME_TYPES,
      });

      if (result.canceled) return;

      const asset = result.assets[0];
      const fileUri = asset.uri;

      const fileInfo = await FileSystem.getInfoAsync(fileUri);

      const size =
        (fileInfo.exists && "size" in fileInfo ? fileInfo.size : undefined) ??
        asset.size;
      if (size != null && size > MAX_SIZE_BYTES) {
        Alert.alert(
          "File quá lớn",
          "Vui lòng chọn file có kích thước dưới 5MB."
        );
        return;
      }

      const name = asset.name ?? "document";
      onFilePicked?.({
        uri: fileUri,
        name,
        size: size ?? undefined,
        mimeType: asset.mimeType ?? undefined,
      });
    } catch (err) {
      console.warn("CVUploadArea pickFile error", err);
      Alert.alert("Lỗi", "Không thể mở file. Vui lòng thử lại.");
    }
  };

  if (pickedFile) {
    const sizeLabel =
      pickedFile.size != null
        ? formatFileSize(pickedFile.size)
        : null;
    return (
      <View style={styles.fileCard}>
        <TouchableOpacity
          style={styles.fileCardContent}
          onPress={pickFile}
          activeOpacity={0.8}
        >
          <Ionicons
            name="document-text-outline"
            size={36}
            color={colors.teal.primary}
            style={styles.fileCardIcon}
          />
          <View style={styles.fileCardText}>
            <Text style={styles.fileName} numberOfLines={1}>
              {truncateFileName(pickedFile.name)}
            </Text>
            {sizeLabel != null && (
              <Text style={styles.fileSize}>{sizeLabel}</Text>
            )}
          </View>
        </TouchableOpacity>
        <Pressable
          onPress={onClear}
          style={({ pressed }) => [
            styles.clearButton,
            pressed && styles.clearButtonPressed,
          ]}
          hitSlop={8}
        >
          <Ionicons
            name="close"
            size={22}
            color={colors.text.primary}
          />
        </Pressable>
      </View>
    );
  }

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={pickFile}
      activeOpacity={0.7}
    >
      <Ionicons
        name="cloud-upload-outline"
        size={40}
        color={colors.teal.primary}
        style={styles.icon}
      />
      <Text style={styles.title}>Nhấn để tải lên</Text>
      <Text style={styles.hint}>
        Hỗ trợ định dạng .doc, .docx, pdf có kích thước dưới 5MB
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: colors.teal.primary,
    borderRadius: 12,
    paddingVertical: 24,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background.light,
    marginTop: 8,
  },
  icon: {
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text.primary,
    marginBottom: 6,
  },
  hint: {
    fontSize: 13,
    color: colors.text.muted,
    textAlign: "center",
  },
  fileCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.background.light,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginTop: 8,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  fileCardContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    minWidth: 0,
  },
  fileCardIcon: {
    marginRight: 12,
  },
  fileCardText: {
    flex: 1,
    minWidth: 0,
  },
  fileName: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.text.primary,
    marginBottom: 2,
  },
  fileSize: {
    fontSize: 13,
    color: colors.text.muted,
  },
  clearButton: {
    padding: 6,
    marginLeft: 4,
  },
  clearButtonPressed: {
    opacity: 0.6,
  },
});

export default CVUploadArea;
