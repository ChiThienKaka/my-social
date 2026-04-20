import React from "react";
import { StyleSheet, View, Text, ScrollView, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import colors from "@/constants/colors";
import type { JobCompanyDetail } from "../types/job";
import { resolveImageUrl } from "@/utils/resolveImageUrl";

interface CompanyTabProps {
  company: JobCompanyDetail;
}

const CompanyTab: React.FC<CompanyTabProps> = ({ company }) => {
  const logoUrl = resolveImageUrl(company.logo_url);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Company Logo & Name */}
      <View style={styles.header}>
        {logoUrl ? (
          <Image source={{ uri: logoUrl }} style={styles.logo} resizeMode="contain" />
        ) : (
          <View style={styles.logoPlaceholder}>
            <Ionicons name="business-outline" size={40} color={colors.text.muted} />
          </View>
        )}
        <Text style={styles.companyName}>{company.name}</Text>
        {company.industry && (
          <Text style={styles.industry}>{company.industry}</Text>
        )}
      </View>

      {/* Company Description */}
      {company.description && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Giới thiệu công ty</Text>
          <Text style={styles.text}>{company.description}</Text>
        </View>
      )}

      {/* Company Info */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Thông tin công ty</Text>

        {company.size && (
          <View style={styles.infoRow}>
            <Ionicons name="people-outline" size={18} color={colors.text.secondary} />
            <Text style={styles.infoLabel}>Quy mô:</Text>
            <Text style={styles.infoValue}>{company.size}</Text>
          </View>
        )}

        {company.address && (
          <View style={styles.infoRow}>
            <Ionicons name="location-outline" size={18} color={colors.text.secondary} />
            <Text style={styles.infoLabel}>Địa chỉ:</Text>
            <Text style={styles.infoValue}>{company.address}</Text>
          </View>
        )}

        {company.phone && (
          <View style={styles.infoRow}>
            <Ionicons name="call-outline" size={18} color={colors.text.secondary} />
            <Text style={styles.infoLabel}>Điện thoại:</Text>
            <Text style={styles.infoValue}>{company.phone}</Text>
          </View>
        )}

        {company.email && (
          <View style={styles.infoRow}>
            <Ionicons name="mail-outline" size={18} color={colors.text.secondary} />
            <Text style={styles.infoLabel}>Email:</Text>
            <Text style={styles.infoValue}>{company.email}</Text>
          </View>
        )}

        {company.website && (
          <View style={styles.infoRow}>
            <Ionicons name="globe-outline" size={18} color={colors.text.secondary} />
            <Text style={styles.infoLabel}>Website:</Text>
            <Text style={styles.infoValue}>{company.website}</Text>
          </View>
        )}

        {company.tax_code && (
          <View style={styles.infoRow}>
            <Ionicons name="document-text-outline" size={18} color={colors.text.secondary} />
            <Text style={styles.infoLabel}>Mã số thuế:</Text>
            <Text style={styles.infoValue}>{company.tax_code}</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.white,
  },
  header: {
    alignItems: "center",
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: colors.background.grey,
    marginBottom: 12,
  },
  logoPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: colors.background.grey,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  companyName: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.text.primary,
    marginBottom: 4,
    textAlign: "center",
  },
  industry: {
    fontSize: 14,
    color: colors.text.secondary,
    textAlign: "center",
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.text.primary,
    marginBottom: 12,
  },
  text: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.text.primary,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
    gap: 8,
  },
  infoLabel: {
    fontSize: 15,
    fontWeight: "500",
    color: colors.text.secondary,
    minWidth: 100,
  },
  infoValue: {
    flex: 1,
    fontSize: 15,
    color: colors.text.primary,
  },
});

export default CompanyTab;
