export const colors = {
  // Primary Teal Colors
  teal: {
    primary: "#14B8A6", // Vibrant teal - used for primary buttons and selected states
    light: "#E0F2F1", // Light teal - used for secondary backgrounds
    border: "#14B8A6", // Light teal border - used for input borders
    dark: "#0D9488", // Darker teal - used for secondary button text
    muted: "#5EEAD4", // Muted teal for subtle accents
  },

  // Background Colors
  background: {
    primary: "#F5F5F5", // Light grey background - main screen background
    white: "#FFFFFF", // White - input fields, cards
    light: "#FAFAFA", // Very light grey
    grey: "#E5E7EB", // Light grey for dividers
    dark: "#1F2937", // Dark grey for dividers
  },

  // Text Colors
  text: {
    primary: "#1F2937", // Dark grey - main text, labels
    secondary: "#6B7280", // Medium grey - secondary text
    muted: "#9CA3AF", // Light grey - placeholder text, muted text
    teal: "#14B8A6", // Teal text - links, accents
    tealGrey: "#6B7280", // Teal-grey - subtitle text
    white: "#FFFFFF", // White text
    black: "#000000", // Black text on teal buttons
  },

  // Icon Colors
  icon: {
    primary: "#1F2937", // Dark grey - main icons
    secondary: "#6B7280", // Medium grey - secondary icons
    teal: "#14B8A6", // Teal icons
    white: "#FFFFFF", // White icons
  },

  // Border Colors
  border: {
    primary: "#14B8A6", // Teal border - input fields
    light: "#E5E7EB", // Light grey border
    error: "#EF4444", // Red border for errors
    muted: "#D1D5DB", // Muted border
  },

  // State Colors
  state: {
    error: "#EF4444", // Red for errors
    success: "#10B981", // Green for success
    warning: "#F59E0B", // Orange for warnings
    info: "#3B82F6", // Blue for info
    disabled: "#F3F4F6", // Grey for disabled states
  },

  // Role Selection Colors (for Student/Lecturer/Admin buttons)
  role: {
    selected: "#14B8A6", // Teal background when selected
    unselected: "#FFFFFF", // White background when not selected
    border: "#14B8A6", // Teal border for unselected
  },

  // Checkbox Colors
  checkbox: {
    checked: "#14B8A6", // Teal background when checked
    unchecked: "#FFFFFF", // White background when unchecked
    border: "#14B8A6", // Teal border
    checkmark: "#FFFFFF", // White checkmark
  },

  // Link Colors
  link: {
    primary: "#14B8A6", // Teal for links (Terms of Service, Privacy Policy, Log In)
    hover: "#0D9488", // Darker teal on hover
  },
} as const;

// Type exports for TypeScript
export type ColorPalette = typeof colors;

export const getColor = (path: string): string => {
  const keys = path.split(".");
  let value: any = colors;
  for (const key of keys) {
    value = value[key];
    if (value === undefined) {
      console.warn(`Color path "${path}" not found`);
      return "#000000"; // Mặc định trả về màu đen nếu không tìm thấy path
    }
  }
  return value;
};

// Common color shortcuts for easier access
export const commonColors = {
  // Most used colors
  primary: colors.teal.primary,
  background: colors.background.primary,
  text: colors.text.primary,
  border: colors.border.primary,
  error: colors.state.error,
  white: colors.background.white,
  black: colors.text.black,
} as const;

export default colors;
