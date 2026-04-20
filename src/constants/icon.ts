export type IconState = "active" | "inactive" | "default";

// Semantic icon definitions
export const icons = {
  // Navigation icons
  home: {
    active: { set: "ion", name: "home" },
    inactive: { set: "ion", name: "home-outline" },
  },
  search: {
    active: { set: "ion", name: "search" },
    inactive: { set: "ion", name: "search-outline" },
  },
  notification: {
    active: { set: "ion", name: "notifications" },
    inactive: { set: "ion", name: "notifications-outline" },
  },
  chat: {
    active: { set: "ion", name: "chatbubbles" },
    inactive: { set: "ion", name: "chatbubbles-outline" },
  },
  profile: {
    active: { set: "ion", name: "person" },
    inactive: { set: "ion", name: "person-outline" },
  },
  courses: {
    active: { set: "ion", name: "school" },
    inactive: { set: "ion", name: "school-outline" },
  },

  // Action icons
  settings: {
    default: { set: "material", name: "settings" },
  },
  edit: {
    default: { set: "ion", name: "create-outline" },
  },
  delete: {
    default: { set: "ion", name: "trash-outline" },
  },
  add: {
    default: { set: "ion", name: "add" },
  },
  close: {
    default: { set: "ion", name: "close" },
  },
  check: {
    default: { set: "ion", name: "checkmark" },
  },
  cancel: {
    default: { set: "ion", name: "close-circle-outline" },
  },
  save: {
    default: { set: "ion", name: "save-outline" },
  },
  share: {
    default: { set: "ion", name: "share-outline" },
  },
  more: {
    default: { set: "ion", name: "ellipsis-horizontal" },
  },
  menu: {
    default: { set: "ion", name: "menu" },
  },
  back: {
    default: { set: "ion", name: "arrow-back" },
  },
  forward: {
    default: { set: "ion", name: "arrow-forward" },
  },
  chevronRight: {
    default: { set: "ion", name: "chevron-forward" },
  },
  chevronLeft: {
    default: { set: "ion", name: "chevron-back" },
  },
  chevronDown: {
    default: { set: "ion", name: "chevron-down" },
  },
  chevronUp: {
    default: { set: "ion", name: "chevron-up" },
  },

  // Social icons
  like: {
    active: { set: "ion", name: "heart" },
    inactive: { set: "ion", name: "heart-outline" },
  },
  comment: {
    default: { set: "ion", name: "chatbubble-outline" },
  },
  bookmark: {
    active: { set: "ion", name: "bookmark" },
    inactive: { set: "ion", name: "bookmark-outline" },
  },
  follow: {
    default: { set: "ion", name: "person-add-outline" },
  },
  unfollow: {
    default: { set: "ion", name: "person-remove-outline" },
  },

  // Media icons
  camera: {
    default: { set: "ion", name: "camera-outline" },
  },
  image: {
    default: { set: "ion", name: "image-outline" },
  },
  video: {
    default: { set: "ion", name: "videocam-outline" },
  },
  mic: {
    default: { set: "ion", name: "mic-outline" },
  },
  play: {
    default: { set: "ion", name: "play" },
  },
  pause: {
    default: { set: "ion", name: "pause" },
  },

  // Communication icons
  send: {
    default: { set: "ion", name: "send" },
  },
  call: {
    default: { set: "ion", name: "call-outline" },
  },
  videoCall: {
    default: { set: "ion", name: "videocam-outline" },
  },
  info: {
    default: { set: "ion", name: "information-circle-outline" },
  },

  // Status icons
  online: {
    default: { set: "ion", name: "radio-button-on" },
  },
  offline: {
    default: { set: "ion", name: "radio-button-off" },
  },
  read: {
    default: { set: "ion", name: "checkmark-done" },
  },
  unread: {
    default: { set: "ion", name: "ellipse" },
  },

  // Academic icons
  document: {
    default: { set: "ion", name: "document-text-outline" },
  },
  transcript: {
    default: { set: "ion", name: "document-text-outline" },
  },
  financial: {
    default: { set: "ion", name: "cash-outline" },
  },
  logout: {
    default: { set: "ion", name: "log-out-outline" },
  },
  pin: {
    default: { set: "ion", name: "pin-outline" },
  },
  filter: {
    default: { set: "ion", name: "filter-outline" },
  },
  sort: {
    default: { set: "ion", name: "swap-vertical-outline" },
  },
} as const;

export type AppIconName = keyof typeof icons;
