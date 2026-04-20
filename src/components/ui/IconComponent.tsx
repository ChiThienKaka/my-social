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
import colors from "@/constants/colors";

export type IconFamily =
  | "Ionicons"
  | "AntDesign"
  | "MaterialIcons"
  | "MaterialCommunityIcons"
  | "FontAwesome"
  | "FontAwesome5"
  | "FontAwesome6"
  | "Feather"
  | "Entypo"
  | "SimpleLineIcons"
  | "Octicons"
  | "Zocial"
  | "Foundation"
  | "EvilIcons";

interface IconComponentProps {
  family?: IconFamily;
  name: string;
  size?: number;
  color?: string;
  style?: any;
}

const IconComponent: React.FC<IconComponentProps> = ({
  family = "Ionicons",
  name,
  size = 24,
  color = colors.icon.primary,
  style,
}) => {
  const iconProps = {
    name: name as any,
    size,
    color,
    style,
  };

  switch (family) {
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

export default IconComponent;
export type { IconComponentProps };
