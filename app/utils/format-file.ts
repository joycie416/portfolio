// 바이트 수를 사람이 읽기 좋은 문자열로 변환한다. (예: 1536 -> "1.5 KB")
export const formatFileSize = (bytes: number | null | undefined): string => {
  if (bytes === null || bytes === undefined || Number.isNaN(bytes)) return "";
  if (bytes < 1024) return `${bytes} B`;

  const units = ["KB", "MB", "GB", "TB"];
  let size = bytes / 1024;
  let unitIndex = 0;
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex += 1;
  }
  return `${size.toFixed(1)} ${units[unitIndex]}`;
};

export interface FileTypeInfo {
  /** 확장자(소문자). 대표 확장자가 아니면 "etc" */
  type: string;
  /** 확장자별 대표 색상 (CSS color 값) */
  color: string;
}

// 대표 확장자별 색상 매핑
const FILE_TYPE_COLORS: Record<string, string> = {
  png: "#2D9CDB",
  jpg: "#2D9CDB",
  jpeg: "#2D9CDB",
  pdf: "#E5252A",
  txt: "#6B7280",
  csv: "#1D6F42",
  xls: "#1D6F42",
  xlsx: "#1D6F42",
  ppt: "#D24726",
  pptx: "#D24726",
  ppsx: "#D24726",
  hwp: "#3B82F6",
  hwpx: "#3B82F6",
};

// 파일 이름/경로에서 확장자만 추출한다. (예: "photo.PNG" -> "png")
export const getFileExtension = (fileName: string): string => {
  const dotIndex = fileName.lastIndexOf(".");
  if (dotIndex === -1 || dotIndex === fileName.length - 1) return "";
  return fileName.slice(dotIndex + 1).toLowerCase();
};

// 파일 확장자를 구분하고 대표 색상과 함께 반환한다.
// 대표 확장자가 아니면 { type: "etc", color: "var(--color-gray-01)" }
export const getFileType = (fileName: string): FileTypeInfo => {
  const extension = getFileExtension(fileName);
  const color = FILE_TYPE_COLORS[extension];

  if (!color) {
    return { type: "etc", color: "var(--color-gray-02)" };
  }

  return { type: extension, color };
};
