export const formatPostTime = (timestamp: string | Date): string => {
  const createdAt =
    typeof timestamp === "string" ? new Date(timestamp) : timestamp;
  const now = new Date();

  // Nếu đồng hồ máy / timezone lệch làm thời gian trong tương lai,
  // luôn clamp về 0 để tránh ra số âm (vd: "-1 giờ" → "1 giờ")
  const diffMsRaw = now.getTime() - createdAt.getTime();
  const diffMs = Math.max(diffMsRaw, 0);
  const diffSeconds = Math.floor(diffMs / 1000);

  // < 1 phút -> hiển thị giây
  if (diffSeconds < 60) {
    const seconds = Math.max(diffSeconds, 1);
    return `${seconds} giây`;
  }

  const diffMinutes = Math.floor(diffSeconds / 60);

  // < 1 giờ -> hiển thị phút
  if (diffMinutes < 60) {
    const minutes = Math.max(diffMinutes, 1);
    return `${minutes} phút`;
  }

  const diffHours = Math.floor(diffMinutes / 60);

  // < 1 ngày -> hiển thị giờ
  if (diffHours < 24) {
    const hours = Math.max(diffHours, 1);
    return `${hours} giờ`;
  }

  // >= 1 ngày -> hiển thị ngày
  const diffDays = Math.floor(diffHours / 24);
  const days = Math.max(diffDays, 1);
  return `${days} ngày`;
};
