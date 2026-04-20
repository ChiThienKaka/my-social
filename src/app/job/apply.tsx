import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import Toast from "react-native-toast-message";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Button, TextInput, Checkbox } from "@/components/ui";
import ApplyCVOption from "@/features/job/components/ApplyCVOption";
import CVUploadArea, {
  type PickedCVFile,
} from "@/features/job/components/CVUploadArea";
import useAuthStore from "@/features/auth/store/useAuthStore";
import { jobApplicationService } from "@/features/job/services/job-application.service";
import colors from "@/constants/colors";

type CVSource = "latest" | "library" | "upload";

export default function JobApplyScreen() {
  const { id: jobId } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [cvSource, setCvSource] = useState<CVSource>("upload");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [introLetter, setIntroLetter] = useState(
    "Em chào anh/chị, em vừa tốt nghiệp ngành công nghệ thông tin..."
  );
  const [agreed, setAgreed] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<PickedCVFile | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const scrollRef = useRef<ScrollView>(null);
  const sectionCVRef = useRef<View>(null);
  const sectionContactRef = useRef<View>(null);
  const sectionTermsRef = useRef<View>(null);
  const sectionLayoutY = useRef<{ cv: number; contact: number; terms: number }>({
    cv: 0,
    contact: 0,
    terms: 0,
  });

  useEffect(() => {
    if (user?.phone) setPhone(user.phone);
  }, [user?.phone]);

  const scrollToSection = (key: "cv" | "contact" | "terms") => {
    const y = sectionLayoutY.current[key];
    scrollRef.current?.scrollTo({ y: Math.max(0, y - 24), animated: true });
  };

  const handleFilePicked = (file: PickedCVFile) => {
    setUploadedFile(file);
  };

  const handleSubmit = async () => {
    if (!isAuthenticated || !user) {
      Toast.show({
        type: "error",
        text1: "Đăng nhập",
        text2: "Vui lòng đăng nhập để ứng tuyển.",
      });
      router.back();
      return;
    }
    if (!jobId) {
      Toast.show({
        type: "error",
        text1: "Lỗi",
        text2: "Không tìm thấy thông tin công việc.",
      });
      return;
    }
    if (!agreed) {
      Toast.show({
        type: "error",
        text1: "Đồng ý điều khoản",
        text2: "Vui lòng đọc và đồng ý với Thoả thuận sử dụng dữ liệu cá nhân.",
      });
      scrollToSection("terms");
      return;
    }
    if (cvSource === "upload" && !uploadedFile) {
      Toast.show({
        type: "error",
        text1: "CV ứng tuyển",
        text2: "Vui lòng chọn hoặc tải CV lên.",
      });
      scrollToSection("cv");
      return;
    }
    const phoneTrim = phone.trim();
    if (!phoneTrim) {
      Toast.show({
        type: "error",
        text1: "Số điện thoại",
        text2: "Vui lòng nhập số điện thoại.",
      });
      scrollToSection("contact");
      return;
    }

    setIsSubmitting(true);
    try {
      await jobApplicationService.submitCV({
        job_id: jobId,
        email: user.email,
        phone: phoneTrim,
        media_cv: {
          uri: uploadedFile!.uri,
          name: uploadedFile!.name,
          type: uploadedFile!.mimeType ?? "application/pdf",
        },
      });
      Toast.show({
        type: "success",
        text1: "Thành công",
        text2: "Đơn ứng tuyển đã được gửi.",
      });
      router.back();
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Gửi đơn thất bại. Vui lòng thử lại.";
      Toast.show({
        type: "error",
        text1: "Lỗi",
        text2: message,
      });
      scrollToSection("cv");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={0}
      >
        <ScrollView
          ref={scrollRef}
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* CV Section */}
          <View
            ref={sectionCVRef}
            style={styles.section}
            onLayout={(e) => {
              sectionLayoutY.current.cv = e.nativeEvent.layout.y;
            }}
          >
            <Text style={styles.sectionTitle}>CV ứng tuyển</Text>
            <ApplyCVOption
              label="CV ứng tuyển gần nhất"
              selected={cvSource === "latest"}
              onPress={() => setCvSource("latest")}
            />
            <ApplyCVOption
              label="CV từ thư viện của tôi"
              selected={cvSource === "library"}
              onPress={() => setCvSource("library")}
            />
            <ApplyCVOption
              label="Tải CV lên từ điện thoại"
              selected={cvSource === "upload"}
              onPress={() => setCvSource("upload")}
            />
            {cvSource === "upload" && (
              <CVUploadArea
                onFilePicked={handleFilePicked}
                onClear={() => setUploadedFile(null)}
                pickedFile={uploadedFile}
              />
            )}
          </View>

          {/* Contact info (from auth store) */}
          <View
            ref={sectionContactRef}
            style={styles.section}
            onLayout={(e) => {
              sectionLayoutY.current.contact = e.nativeEvent.layout.y;
            }}
          >
            <Text style={styles.sectionTitle}>Thông tin liên hệ</Text>
            <TextInput
              label="Email"
              placeholder="Email"
              value={user?.email ?? ""}
              disabled
              containerStyle={styles.emailInput}
            />
            <TextInput
              label="Số điện thoại"
              placeholder="Nhập số điện thoại"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              required
            />
          </View>

          {/* Desired location */}
          <View style={styles.section}>
            <TextInput
              label="Địa điểm làm việc mong muốn"
              placeholder="Chọn địa điểm làm việc"
              value={location}
              onChangeText={setLocation}
              required
            />
          </View>

          {/* Introductory letter */}
          <View style={styles.section}>
            <Text style={styles.label}>Thư giới thiệu</Text>
            <TextInput
              placeholder="Viết thư giới thiệu ngắn gọn..."
              value={introLetter}
              onChangeText={setIntroLetter}
              multiline
              numberOfLines={5}
              containerStyle={styles.textAreaContainer}
              inputStyle={styles.textArea}
            />
          </View>

          {/* Terms checkbox */}
          <View
            ref={sectionTermsRef}
            style={styles.section}
            onLayout={(e) => {
              sectionLayoutY.current.terms = e.nativeEvent.layout.y;
            }}
          >
            <TouchableOpacity
              style={styles.checkboxRow}
              onPress={() => setAgreed(!agreed)}
              activeOpacity={0.7}
            >
              <Checkbox checked={agreed} onPress={() => setAgreed(!agreed)} />
              <Text style={styles.termsText}>
                Tôi đã đọc và đồng ý với{" "}
                <Text style={styles.termsLink}>
                  Thoả thuận sử dụng dữ liệu cá nhân giữa tôi và Nhà tuyển dụng.
                </Text>
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <Button
              label={isSubmitting ? "Đang gửi..." : "Ứng tuyển"}
              onPress={handleSubmit}
              variant="primary"
              fullWidth
              disabled={isSubmitting}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.white,
  },
  keyboardView: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text.primary,
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text.primary,
    marginBottom: 8,
  },
  textAreaContainer: {
    marginTop: 0,
  },
  textArea: {
    minHeight: 120,
    textAlignVertical: "top",
    paddingTop: 12,
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  termsText: {
    flex: 1,
    fontSize: 14,
    color: colors.text.primary,
    lineHeight: 20,
    marginLeft: 10,
  },
  termsLink: {
    color: colors.teal.primary,
    fontWeight: "500",
  },
  emailInput: {
    opacity: 0.9,
  },
});
