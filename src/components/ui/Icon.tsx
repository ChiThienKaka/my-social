import React from "react";
import {
  Ionicons,
  AntDesign,
  MaterialIcons,
  MaterialCommunityIcons,
  FontAwesome,
  FontAwesome5,
  FontAwesome6,
  Feather,
  Entypo,
  SimpleLineIcons,
  Octicons,
  Zocial,
  Foundation,
  EvilIcons,
} from "@expo/vector-icons";
import { icons, AppIconName, IconState } from "@/constants/icon";

// Icon set mapping: short names to full IconFamily names
const iconSetMap = {
  ion: "Ionicons",
  ant: "AntDesign",
  material: "MaterialIcons",
  materialCommunity: "MaterialCommunityIcons",
  fa: "FontAwesome",
  fa5: "FontAwesome5",
  fa6: "FontAwesome6",
  feather: "Feather",
  entypo: "Entypo",
  simpleLine: "SimpleLineIcons",
  octicons: "Octicons",
  zocial: "Zocial",
  foundation: "Foundation",
  evil: "EvilIcons",
} as const;

export type IconSet = keyof typeof iconSetMap;

// Helper to get icon family from set
const getIconFamily = (set: IconSet): string => {
  return iconSetMap[set];
};

// Semantic usage: using icon name from constants
interface SemanticIconProps {
  name: AppIconName;
  state?: IconState;
  size?: number;
  color?: string;
  set?: never;
}

// Direct usage: using set and name directly
interface DirectIconProps {
  set: IconSet;
  name: string;
  size?: number;
  color?: string;
  state?: never;
}

type IconProps = SemanticIconProps | DirectIconProps;

const Icon: React.FC<IconProps> = ({
  name,
  state = "default",
  set,
  size = 24,
  color = "#000000",
}) => {
  let iconSet: IconSet;
  let iconName: string;

  // Check if using semantic icon (from constants)
  if (!set) {
    const iconSetData = icons[name as AppIconName];
    const iconSetAny = iconSetData as any;

    // Try to get the requested state, fallback to default
    const icon = iconSetAny[state] ?? iconSetAny.default;

    if (!icon) {
      console.warn(`Icon "${name}" with state "${state}" not found`);
      return null;
    }

    iconSet = icon.set;
    iconName = icon.name;
  } else {
    // Direct usage with set and name
    iconSet = set;
    iconName = name;
  }

  const iconFamily = getIconFamily(iconSet);
  const iconProps = { name: iconName as any, size, color };

  switch (iconFamily) {
    case "Ionicons":
      return <Ionicons {...iconProps} />;
    case "AntDesign":
      return <AntDesign {...iconProps} />;
    case "MaterialIcons":
      return <MaterialIcons {...iconProps} />;
    case "MaterialCommunityIcons":
      return <MaterialCommunityIcons {...iconProps} />;
    case "FontAwesome":
      return <FontAwesome {...iconProps} />;
    case "FontAwesome5":
      return <FontAwesome5 {...iconProps} />;
    case "FontAwesome6":
      return <FontAwesome6 {...iconProps} />;
    case "Feather":
      return <Feather {...iconProps} />;
    case "Entypo":
      return <Entypo {...iconProps} />;
    case "SimpleLineIcons":
      return <SimpleLineIcons {...iconProps} />;
    case "Octicons":
      return <Octicons {...iconProps} />;
    case "Zocial":
      return <Zocial {...iconProps} />;
    case "Foundation":
      return <Foundation {...iconProps} />;
    case "EvilIcons":
      return <EvilIcons {...iconProps} />;
    default:
      return <Ionicons {...iconProps} />;
  }
};

export default Icon;
