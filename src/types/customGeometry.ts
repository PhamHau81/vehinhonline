export interface CustomVertex {
  id: string;
  name: string;
  x: number;
  y: number;
  z: number;
  color?: string;
  isSpecial?: boolean;
}

export interface CustomEdge {
  from: string;
  to: string;
  isDashed: boolean;
  type?: 'base' | 'lateral' | 'height' | 'section' | 'auxiliary';
  color?: string;
  label?: string;
}

export interface CustomFace {
  name: string;
  vertices: string[]; // Vertex IDs in perimeter order
  color: string;
  opacity: number;
}

export interface CustomRightAngle {
  vertex: string; // The 90-degree corner vertex ID
  arm1: string;   // Vertex ID on first arm
  arm2: string;   // Vertex ID on second arm
  size?: number;  // Mark length, default 0.2
}

export interface CustomGeometryScene {
  title: string;
  problemPrompt: string;
  summary: string;
  vertices: CustomVertex[];
  edges: CustomEdge[];
  faces: CustomFace[];
  rightAngles?: CustomRightAngle[];
  steps?: string[];
  keyProperties?: string[];
  calculatedFormulas?: {
    label: string;
    value: string;
  }[];
}

export type GeminiModelId = 'gemini-3-flash-preview' | 'gemini-3-pro-preview' | 'gemini-2.5-flash';

export interface ModelOption {
  id: GeminiModelId;
  name: string;
  tag: string;
  description: string;
}

export const AVAILABLE_MODELS: ModelOption[] = [
  {
    id: 'gemini-3-flash-preview',
    name: 'Gemini 3 Flash Preview',
    tag: 'Mặc định (Khuyên dùng)',
    description: 'Tốc độ phản hồi cực nhanh, xử lý hình học và trích xuất toạ độ 3D thông minh.'
  },
  {
    id: 'gemini-3-pro-preview',
    name: 'Gemini 3 Pro Preview',
    tag: 'Độ chính xác cao',
    description: 'Tư duy logic chuyên sâu, tính toán thiết diện phức tạp và bài toán hình học nâng cao.'
  },
  {
    id: 'gemini-2.5-flash',
    name: 'Gemini 2.5 Flash',
    tag: 'Dự phòng ổn định',
    description: 'Mô hình dự phòng tốc độ cao, hỗ trợ khi các mô hình xem trước gặp giới hạn lưu lượng.'
  }
];

export const FALLBACK_MODEL_CHAIN: GeminiModelId[] = [
  'gemini-3-flash-preview',
  'gemini-3-pro-preview',
  'gemini-2.5-flash'
];
