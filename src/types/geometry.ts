/**
 * Geometric solid types, configuration, and formula definitions
 */

export type SolidCategory = 'platonic' | 'basic' | 'revolution';

export type VisualStyle = 'pbr' | 'colorful' | 'xray' | 'wireframe';

export type CameraPreset = 'perspective' | 'top' | 'front' | 'side' | 'isometric';

export interface SolidParamConfig {
  key: string;
  label: string;
  symbol: string;
  min: number;
  max: number;
  step: number;
  default: number;
  unit: string;
}

export interface SolidFormula {
  volumeFormula: string;
  volumeStepByStep: (params: Record<string, number>) => string;
  volumeCalc: (params: Record<string, number>) => number;
  totalAreaFormula: string;
  totalAreaStepByStep: (params: Record<string, number>) => string;
  totalAreaCalc: (params: Record<string, number>) => number;
  lateralAreaFormula?: string;
  lateralAreaCalc?: (params: Record<string, number>) => number;
  extraStats?: { label: string; value: string }[];
}

export interface SolidDefinition {
  id: string;
  name: string;
  vietnameseName: string;
  category: SolidCategory;
  symbolNotation?: string; // e.g. {3, 3} for Platonic
  description: string;
  verticesCount: number | string;
  edgesCount: number | string;
  facesCount: number | string;
  symmetryPlanes?: number;
  params: SolidParamConfig[];
  formulas: SolidFormula;
  funFact: string;
}

export const SOLIDS: Record<string, SolidDefinition> = {
  // 5 Khối đa diện đều Platonic
  tetrahedron: {
    id: 'tetrahedron',
    name: 'Tetrahedron',
    vietnameseName: 'Tứ diện đều',
    category: 'platonic',
    symbolNotation: '{3, 3}',
    description: 'Khối đa diện đều có 4 mặt là các tam giác đều bằng nhau, mỗi đỉnh là đỉnh chung của 3 mặt.',
    verticesCount: 4,
    edgesCount: 6,
    facesCount: 4,
    symmetryPlanes: 6,
    params: [
      { key: 'a', label: 'Độ dài cạnh', symbol: 'a', min: 1, max: 4, step: 0.2, default: 2.5, unit: 'đvđd' }
    ],
    formulas: {
      volumeFormula: 'V = (a³ · √2) / 12',
      volumeStepByStep: (p) => `V = (${p.a}³ · √2) / 12 = (${(p.a ** 3).toFixed(2)} · 1.414) / 12 ≈ ${(
        ((p.a ** 3) * Math.SQRT2) / 12
      ).toFixed(3)}`,
      volumeCalc: (p) => ((p.a ** 3) * Math.SQRT2) / 12,
      totalAreaFormula: 'S_{tp} = a² · √3',
      totalAreaStepByStep: (p) => `S_{tp} = ${p.a}² · √3 = ${(p.a ** 2).toFixed(2)} · 1.732 ≈ ${(
        (p.a ** 2) * Math.sqrt(3)
      ).toFixed(3)}`,
      totalAreaCalc: (p) => (p.a ** 2) * Math.sqrt(3),
      extraStats: [
        { label: 'Loại đa diện', value: '{3, 3} (tam giác đều, bậc 3)' },
        { label: 'Bán kính cầu ngoại tiếp', value: 'R = a√6 / 4' },
        { label: 'Bán kính cầu nội tiếp', value: 'r = a√6 / 12' },
        { label: 'Công thức Euler', value: 'Đ - C + M = 4 - 6 + 4 = 2' },
      ]
    },
    funFact: 'Tứ diện đều là khối đa diện tự đối ngẫu (dual): nối tâm các mặt của một tứ diện đều ta lại được một tứ diện đều mới!'
  },

  cube_platonic: {
    id: 'cube_platonic',
    name: 'Cube / Regular Hexahedron',
    vietnameseName: 'Khối lập phương',
    category: 'platonic',
    symbolNotation: '{4, 3}',
    description: 'Khối đa diện đều có 6 mặt là các hình vuông bằng nhau, mỗi đỉnh là đỉnh chung của 3 mặt.',
    verticesCount: 8,
    edgesCount: 12,
    facesCount: 6,
    symmetryPlanes: 9,
    params: [
      { key: 'a', label: 'Cạnh lập phương', symbol: 'a', min: 1, max: 4, step: 0.2, default: 2.4, unit: 'đvđd' }
    ],
    formulas: {
      volumeFormula: 'V = a³',
      volumeStepByStep: (p) => `V = ${p.a}³ = ${(p.a ** 3).toFixed(3)}`,
      volumeCalc: (p) => p.a ** 3,
      totalAreaFormula: 'S_{tp} = 6 · a²',
      totalAreaStepByStep: (p) => `S_{tp} = 6 · ${p.a}² = 6 · ${(p.a ** 2).toFixed(2)} = ${(6 * (p.a ** 2)).toFixed(3)}`,
      totalAreaCalc: (p) => 6 * (p.a ** 2),
      lateralAreaFormula: 'S_{xq} = 4 · a²',
      lateralAreaCalc: (p) => 4 * (p.a ** 2),
      extraStats: [
        { label: 'Loại đa diện', value: '{4, 3} (hình vuông, bậc 3)' },
        { label: 'Đường chéo chính', value: 'd = a√3' },
        { label: 'Bán kính cầu ngoại tiếp', value: 'R = a√3 / 2' },
        { label: 'Khối đối ngẫu', value: 'Bát diện đều' },
      ]
    },
    funFact: 'Khối lập phương có 9 mặt phẳng đối xứng (3 mặt song song các mặt và 6 mặt chéo).'
  },

  octahedron: {
    id: 'octahedron',
    name: 'Regular Octahedron',
    vietnameseName: 'Bát diện đều',
    category: 'platonic',
    symbolNotation: '{3, 4}',
    description: 'Khối đa diện đều có 8 mặt là các tam giác đều bằng nhau, mỗi đỉnh là đỉnh chung của 4 mặt.',
    verticesCount: 6,
    edgesCount: 12,
    facesCount: 8,
    symmetryPlanes: 9,
    params: [
      { key: 'a', label: 'Độ dài cạnh', symbol: 'a', min: 1, max: 4, step: 0.2, default: 2.2, unit: 'đvđd' }
    ],
    formulas: {
      volumeFormula: 'V = (a³ · √2) / 3',
      volumeStepByStep: (p) => `V = (${p.a}³ · √2) / 3 = (${(p.a ** 3).toFixed(2)} · 1.414) / 3 ≈ ${(
        ((p.a ** 3) * Math.SQRT2) / 3
      ).toFixed(3)}`,
      volumeCalc: (p) => ((p.a ** 3) * Math.SQRT2) / 3,
      totalAreaFormula: 'S_{tp} = 2 · a² · √3',
      totalAreaStepByStep: (p) => `S_{tp} = 2 · ${p.a}² · √3 = ${(2 * (p.a ** 2) * Math.sqrt(3)).toFixed(3)}`,
      totalAreaCalc: (p) => 2 * (p.a ** 2) * Math.sqrt(3),
      extraStats: [
        { label: 'Loại đa diện', value: '{3, 4} (tam giác đều, bậc 4)' },
        { label: 'Bán kính cầu ngoại tiếp', value: 'R = a√2 / 2' },
        { label: 'Bán kính cầu nội tiếp', value: 'r = a√6 / 6' },
        { label: 'Khối đối ngẫu', value: 'Khối lập phương' },
      ]
    },
    funFact: 'Bát diện đều có thể xem như hai hình chóp tứ giác đều chung đáy ghép lại với nhau.'
  },

  dodecahedron: {
    id: 'dodecahedron',
    name: 'Regular Dodecahedron',
    vietnameseName: 'Mười hai diện đều',
    category: 'platonic',
    symbolNotation: '{5, 3}',
    description: 'Khối đa diện đều có 12 mặt là các ngũ giác đều bằng nhau, mỗi đỉnh là đỉnh chung của 3 mặt.',
    verticesCount: 20,
    edgesCount: 30,
    facesCount: 12,
    symmetryPlanes: 15,
    params: [
      { key: 'a', label: 'Độ dài cạnh', symbol: 'a', min: 0.8, max: 3, step: 0.1, default: 1.6, unit: 'đvđd' }
    ],
    formulas: {
      volumeFormula: 'V = (15 + 7√5) · a³ / 4',
      volumeStepByStep: (p) => `V = (15 + 7·2.236) · ${p.a}³ / 4 ≈ ${(
        ((15 + 7 * Math.sqrt(5)) * (p.a ** 3)) / 4
      ).toFixed(3)}`,
      volumeCalc: (p) => ((15 + 7 * Math.sqrt(5)) * (p.a ** 3)) / 4,
      totalAreaFormula: 'S_{tp} = 3 · √(25 + 10√5) · a²',
      totalAreaStepByStep: (p) => `S_{tp} = 3 · √(25 + 10·2.236) · ${p.a}² ≈ ${(
        3 * Math.sqrt(25 + 10 * Math.sqrt(5)) * (p.a ** 2)
      ).toFixed(3)}`,
      totalAreaCalc: (p) => 3 * Math.sqrt(25 + 10 * Math.sqrt(5)) * (p.a ** 2),
      extraStats: [
        { label: 'Loại đa diện', value: '{5, 3} (ngũ giác đều, bậc 3)' },
        { label: 'Công thức Euler', value: 'Đ - C + M = 20 - 30 + 12 = 2' },
        { label: 'Khối đối ngẫu', value: 'Hai mươi diện đều (Icosahedron)' },
      ]
    },
    funFact: 'Hình 12 mặt đều gắn liền với tỉ lệ vàng φ = (1 + √5)/2. Các đỉnh của nó có thể tạo thành các hình chữ nhật vàng.'
  },

  icosahedron: {
    id: 'icosahedron',
    name: 'Regular Icosahedron',
    vietnameseName: 'Hai mươi diện đều',
    category: 'platonic',
    symbolNotation: '{3, 5}',
    description: 'Khối đa diện đều có 20 mặt là các tam giác đều bằng nhau, mỗi đỉnh là đỉnh chung của 5 mặt.',
    verticesCount: 12,
    edgesCount: 30,
    facesCount: 20,
    symmetryPlanes: 15,
    params: [
      { key: 'a', label: 'Độ dài cạnh', symbol: 'a', min: 0.8, max: 3, step: 0.1, default: 1.6, unit: 'đvđd' }
    ],
    formulas: {
      volumeFormula: 'V = 5·(3 + √5) · a³ / 12',
      volumeStepByStep: (p) => `V = 5·(3 + 2.236) · ${p.a}³ / 12 ≈ ${(
        (5 * (3 + Math.sqrt(5)) * (p.a ** 3)) / 12
      ).toFixed(3)}`,
      volumeCalc: (p) => (5 * (3 + Math.sqrt(5)) * (p.a ** 3)) / 12,
      totalAreaFormula: 'S_{tp} = 5 · √3 · a²',
      totalAreaStepByStep: (p) => `S_{tp} = 5 · √3 · ${p.a}² = ${(5 * Math.sqrt(3) * (p.a ** 2)).toFixed(3)}`,
      totalAreaCalc: (p) => 5 * Math.sqrt(3) * (p.a ** 2),
      extraStats: [
        { label: 'Loại đa diện', value: '{3, 5} (tam giác đều, bậc 5)' },
        { label: 'Công thức Euler', value: 'Đ - C + M = 12 - 30 + 20 = 2' },
        { label: 'Khối đối ngẫu', value: 'Mười hai diện đều' },
      ]
    },
    funFact: 'Khối 20 mặt đều có cấu trúc gần hình cầu nhất trong các khối Platonic và là hình dạng vỏ bọc (capsid) của nhiều loại virus trong tự nhiên!'
  },

  // Khối đa diện cơ bản
  box: {
    id: 'box',
    name: 'Rectangular Cuboid',
    vietnameseName: 'Hình hộp chữ nhật',
    category: 'basic',
    description: 'Hình hộp có 6 mặt đều là các hình chữ nhật. Các góc nhị diện đều là góc vuông.',
    verticesCount: 8,
    edgesCount: 12,
    facesCount: 6,
    symmetryPlanes: 3,
    params: [
      { key: 'a', label: 'Chiều dài', symbol: 'a', min: 1, max: 4.5, step: 0.25, default: 3.0, unit: 'đvđd' },
      { key: 'b', label: 'Chiều rộng', symbol: 'b', min: 0.8, max: 4.0, step: 0.2, default: 2.0, unit: 'đvđd' },
      { key: 'c', label: 'Chiều cao', symbol: 'c', min: 0.8, max: 4.0, step: 0.2, default: 1.6, unit: 'đvđd' },
    ],
    formulas: {
      volumeFormula: 'V = a · b · c',
      volumeStepByStep: (p) => `V = ${p.a} · ${p.b} · ${p.c} = ${(p.a * p.b * p.c).toFixed(3)}`,
      volumeCalc: (p) => p.a * p.b * p.c,
      totalAreaFormula: 'S_{tp} = 2 · (a·b + b·c + c·a)',
      totalAreaStepByStep: (p) => `S_{tp} = 2 · (${(p.a * p.b).toFixed(2)} + ${(p.b * p.c).toFixed(2)} + ${(p.c * p.a).toFixed(2)}) = ${(2 * (p.a * p.b + p.b * p.c + p.c * p.a)).toFixed(3)}`,
      totalAreaCalc: (p) => 2 * (p.a * p.b + p.b * p.c + p.c * p.a),
      lateralAreaFormula: 'S_{xq} = 2 · c · (a + b)',
      lateralAreaCalc: (p) => 2 * p.c * (p.a + p.b),
      extraStats: [
        { label: 'Độ dài đường chéo', value: 'd = √(a² + b² + c²)' },
        { label: 'Bán kính cầu ngoại tiếp', value: 'R = √(a² + b² + c²) / 2' },
      ]
    },
    funFact: 'Hình hộp chữ nhật xuất hiện nhiều nhất trong đời sống thực tế: tòa nhà, phòng học, viên gạch, bao bì đóng gói.'
  },

  pyramid_square: {
    id: 'pyramid_square',
    name: 'Regular Square Pyramid',
    vietnameseName: 'Chóp tứ giác đều (S.ABCD)',
    category: 'basic',
    description: 'Hình chóp có đáy là hình vuông, chân đường cao hạ từ đỉnh S trùng với tâm hình vuông đáy.',
    verticesCount: 5,
    edgesCount: 8,
    facesCount: 5,
    symmetryPlanes: 4,
    params: [
      { key: 'a', label: 'Cạnh đáy', symbol: 'a', min: 1, max: 4, step: 0.25, default: 2.6, unit: 'đvđd' },
      { key: 'h', label: 'Chiều cao', symbol: 'h', min: 1, max: 4.5, step: 0.25, default: 2.8, unit: 'đvđd' },
    ],
    formulas: {
      volumeFormula: 'V = (1/3) · a² · h',
      volumeStepByStep: (p) => `V = (1/3) · ${p.a}² · ${p.h} = (1/3) · ${(p.a ** 2).toFixed(2)} · ${p.h} ≈ ${((1 / 3) * (p.a ** 2) * p.h).toFixed(3)}`,
      volumeCalc: (p) => (1 / 3) * (p.a ** 2) * p.h,
      totalAreaFormula: 'S_{tp} = a² + 2·a·d (d: trung đoạn)',
      totalAreaStepByStep: (p) => {
        const d = Math.sqrt(p.h ** 2 + (p.a / 2) ** 2);
        return `Trung đoạn d = √(h² + (a/2)²) = ${d.toFixed(2)} ⇒ S_{tp} = ${(p.a ** 2 + 2 * p.a * d).toFixed(3)}`;
      },
      totalAreaCalc: (p) => {
        const d = Math.sqrt(p.h ** 2 + (p.a / 2) ** 2);
        return p.a ** 2 + 2 * p.a * d;
      },
      lateralAreaFormula: 'S_{xq} = 2 · a · √(h² + a²/4)',
      lateralAreaCalc: (p) => {
        const d = Math.sqrt(p.h ** 2 + (p.a / 2) ** 2);
        return 2 * p.a * d;
      },
      extraStats: [
        { label: 'Cạnh bên', value: 'l = √(h² + a²/2)' },
        { label: 'Đặc điểm', value: 'Các mặt bên là tam giác cân bằng nhau' },
      ]
    },
    funFact: 'Đại kim tự tháp Giza ở Ai Cập chính là một hình chóp tứ giác đều khổng lồ có tuổi đời hơn 4.500 năm!'
  },

  prism_triangular: {
    id: 'prism_triangular',
    name: 'Equilateral Triangular Prism',
    vietnameseName: 'Lăng trụ tam giác đều',
    category: 'basic',
    description: 'Hình lăng trụ đứng có 2 đáy là tam giác đều, các mặt bên là các hình chữ nhật bằng nhau.',
    verticesCount: 6,
    edgesCount: 9,
    facesCount: 5,
    symmetryPlanes: 4,
    params: [
      { key: 'a', label: 'Cạnh đáy tam giác', symbol: 'a', min: 1, max: 4, step: 0.25, default: 2.2, unit: 'đvđd' },
      { key: 'h', label: 'Chiều cao lăng trụ', symbol: 'h', min: 1, max: 4.5, step: 0.25, default: 2.8, unit: 'đvđd' },
    ],
    formulas: {
      volumeFormula: 'V = S_{đáy} · h = (a²√3 / 4) · h',
      volumeStepByStep: (p) => `V = (${p.a}² · √3 / 4) · ${p.h} = ${(p.a ** 2 * Math.sqrt(3) / 4).toFixed(2)} · ${p.h} ≈ ${((p.a ** 2 * Math.sqrt(3) / 4) * p.h).toFixed(3)}`,
      volumeCalc: (p) => (p.a ** 2 * Math.sqrt(3) / 4) * p.h,
      totalAreaFormula: 'S_{tp} = 3·a·h + 2·(a²√3 / 4)',
      totalAreaStepByStep: (p) => `S_{tp} = 3·${p.a}·${p.h} + 2·(${p.a}²√3/4) ≈ ${(3 * p.a * p.h + 2 * (p.a ** 2 * Math.sqrt(3) / 4)).toFixed(3)}`,
      totalAreaCalc: (p) => 3 * p.a * p.h + 2 * (p.a ** 2 * Math.sqrt(3) / 4),
      lateralAreaFormula: 'S_{xq} = 3 · a · h',
      lateralAreaCalc: (p) => 3 * p.a * p.h,
      extraStats: [
        { label: 'Diện tích 1 đáy', value: 'S = a²√3 / 4' },
        { label: 'Mặt bên', value: '3 hình chữ nhật kích thước a × h' },
      ]
    },
    funFact: 'Lăng kính quang học bằng thủy tinh dùng để tán sắc ánh sáng thành 7 sắc cầu vồng chính là một lăng trụ tam giác đều!'
  },

  // Khối tròn xoay
  cylinder: {
    id: 'cylinder',
    name: 'Cylinder',
    vietnameseName: 'Hình trụ tròn xoay',
    category: 'revolution',
    description: 'Hình tạo thành khi quay một hình chữ nhật quanh một cạnh cố định. Có hai đáy là hai hình tròn song song và bằng nhau.',
    verticesCount: 0,
    edgesCount: 2,
    facesCount: 3,
    params: [
      { key: 'r', label: 'Bán kính đáy', symbol: 'r', min: 0.8, max: 3.5, step: 0.2, default: 1.5, unit: 'đvđd' },
      { key: 'h', label: 'Chiều cao', symbol: 'h', min: 1, max: 5, step: 0.25, default: 3.0, unit: 'đvđd' },
    ],
    formulas: {
      volumeFormula: 'V = π · r² · h',
      volumeStepByStep: (p) => `V = π · ${p.r}² · ${p.h} = 3.1416 · ${(p.r ** 2).toFixed(2)} · ${p.h} ≈ ${(Math.PI * (p.r ** 2) * p.h).toFixed(3)}`,
      volumeCalc: (p) => Math.PI * (p.r ** 2) * p.h,
      totalAreaFormula: 'S_{tp} = 2π·r·h + 2π·r²',
      totalAreaStepByStep: (p) => `S_{tp} = 2π·${p.r}·${p.h} + 2π·${p.r}² ≈ ${(2 * Math.PI * p.r * (p.h + p.r)).toFixed(3)}`,
      totalAreaCalc: (p) => 2 * Math.PI * p.r * (p.h + p.r),
      lateralAreaFormula: 'S_{xq} = 2π · r · h',
      lateralAreaCalc: (p) => 2 * Math.PI * p.r * p.h,
      extraStats: [
        { label: 'Chu vi đáy', value: 'C = 2π · r' },
        { label: 'Diện tích một đáy', value: 'S_{đáy} = π · r²' },
        { label: 'Đường sinh', value: 'l = h' },
      ]
    },
    funFact: 'Khai triển mặt xung quanh của hình trụ ta được một hình chữ nhật có kích thước là chiều cao h và chu vi đáy 2πr.'
  },

  cone: {
    id: 'cone',
    name: 'Cone',
    vietnameseName: 'Hình nón tròn xoay',
    category: 'revolution',
    description: 'Hình tạo thành khi quay một tam giác vuông quanh một cạnh góc vuông cố định. Mặt đáy là hình tròn và đỉnh nón chiếu vuông góc xuống tâm đáy.',
    verticesCount: 1,
    edgesCount: 1,
    facesCount: 2,
    params: [
      { key: 'r', label: 'Bán kính đáy', symbol: 'r', min: 0.8, max: 3.5, step: 0.2, default: 1.8, unit: 'đvđd' },
      { key: 'h', label: 'Chiều cao', symbol: 'h', min: 1, max: 5, step: 0.25, default: 3.0, unit: 'đvđd' },
    ],
    formulas: {
      volumeFormula: 'V = (1/3) · π · r² · h',
      volumeStepByStep: (p) => `V = (1/3) · π · ${p.r}² · ${p.h} ≈ ${((1 / 3) * Math.PI * (p.r ** 2) * p.h).toFixed(3)}`,
      volumeCalc: (p) => (1 / 3) * Math.PI * (p.r ** 2) * p.h,
      totalAreaFormula: 'S_{tp} = π·r·l + π·r²',
      totalAreaStepByStep: (p) => {
        const l = Math.sqrt(p.r ** 2 + p.h ** 2);
        return `Đường sinh l = √(r² + h²) = ${l.toFixed(2)} ⇒ S_{tp} = π·${p.r}·(${l.toFixed(2)} + ${p.r}) ≈ ${(Math.PI * p.r * (l + p.r)).toFixed(3)}`;
      },
      totalAreaCalc: (p) => {
        const l = Math.sqrt(p.r ** 2 + p.h ** 2);
        return Math.PI * p.r * (l + p.r);
      },
      lateralAreaFormula: 'S_{xq} = π · r · l',
      lateralAreaCalc: (p) => {
        const l = Math.sqrt(p.r ** 2 + p.h ** 2);
        return Math.PI * p.r * l;
      },
      extraStats: [
        { label: 'Độ dài đường sinh l', value: 'l = √(r² + h²)' },
        { label: 'Góc ở đỉnh', value: '2α với sin(α) = r / l' },
        { label: 'Khai triển mặt nón', value: 'Hình quạt tròn bán kính l' },
      ]
    },
    funFact: 'Thể tích của hình nón đúng bằng 1/3 thể tích của hình trụ có cùng bán kính đáy r và chiều cao h.'
  },

  sphere: {
    id: 'sphere',
    name: 'Sphere',
    vietnameseName: 'Hình cầu / Mặt cầu',
    category: 'revolution',
    description: 'Tập hợp các điểm trong không gian cách một điểm O cố định một khoảng cách không đổi R.',
    verticesCount: 0,
    edgesCount: 0,
    facesCount: 1,
    params: [
      { key: 'R', label: 'Bán kính mặt cầu', symbol: 'R', min: 0.8, max: 3.5, step: 0.2, default: 2.0, unit: 'đvđd' },
    ],
    formulas: {
      volumeFormula: 'V = (4/3) · π · R³',
      volumeStepByStep: (p) => `V = (4/3) · π · ${p.R}³ = (4/3) · 3.1416 · ${(p.R ** 3).toFixed(2)} ≈ ${((4 / 3) * Math.PI * (p.R ** 3)).toFixed(3)}`,
      volumeCalc: (p) => (4 / 3) * Math.PI * (p.R ** 3),
      totalAreaFormula: 'S = 4 · π · R²',
      totalAreaStepByStep: (p) => `S = 4 · π · ${p.R}² = 4 · 3.1416 · ${(p.R ** 2).toFixed(2)} ≈ ${(4 * Math.PI * (p.R ** 2)).toFixed(3)}`,
      totalAreaCalc: (p) => 4 * Math.PI * (p.R ** 2),
      extraStats: [
        { label: 'Đường kính', value: 'd = 2 · R' },
        { label: 'Hình chiếu lên mặt phẳng', value: 'Hình tròn bán kính R' },
        { label: 'Thiết diện qua tâm', value: 'Hình tròn lớn bán kính R' },
      ]
    },
    funFact: 'Trong tất cả các khối hình học có cùng diện tích bề mặt, hình cầu là khối có thể tích lớn nhất (bài toán đẳng chu trong không gian).'
  },

  truncated_cone: {
    id: 'truncated_cone',
    name: 'Truncated Cone / Frustum',
    vietnameseName: 'Hình nón cụt',
    category: 'revolution',
    description: 'Phần hình nón nằm giữa mặt đáy và một mặt phẳng song song với mặt đáy cắt hình nón đó.',
    verticesCount: 0,
    edgesCount: 2,
    facesCount: 3,
    params: [
      { key: 'r1', label: 'Bán kính đáy lớn', symbol: 'R', min: 1.2, max: 3.5, step: 0.2, default: 2.2, unit: 'đvđd' },
      { key: 'r2', label: 'Bán kính đáy nhỏ', symbol: 'r', min: 0.5, max: 2.0, step: 0.1, default: 1.0, unit: 'đvđd' },
      { key: 'h', label: 'Chiều cao', symbol: 'h', min: 1, max: 4.5, step: 0.25, default: 2.6, unit: 'đvđd' },
    ],
    formulas: {
      volumeFormula: 'V = (1/3) · π · h · (R² + r² + R·r)',
      volumeStepByStep: (p) => {
        const R = p.r1;
        const r = p.r2;
        const sum = R ** 2 + r ** 2 + R * r;
        return `V = (1/3) · π · ${p.h} · (${R}² + ${r}² + ${R}·${r}) = (1/3) · π · ${p.h} · ${sum.toFixed(2)} ≈ ${((1 / 3) * Math.PI * p.h * sum).toFixed(3)}`;
      },
      volumeCalc: (p) => (1 / 3) * Math.PI * p.h * (p.r1 ** 2 + p.r2 ** 2 + p.r1 * p.r2),
      totalAreaFormula: 'S_{tp} = π·l·(R + r) + π·R² + π·r²',
      totalAreaStepByStep: (p) => {
        const l = Math.sqrt(p.h ** 2 + (p.r1 - p.r2) ** 2);
        return `Đường sinh l = √(h² + (R-r)²) = ${l.toFixed(2)} ⇒ S_{tp} ≈ ${(Math.PI * l * (p.r1 + p.r2) + Math.PI * (p.r1 ** 2 + p.r2 ** 2)).toFixed(3)}`;
      },
      totalAreaCalc: (p) => {
        const l = Math.sqrt(p.h ** 2 + (p.r1 - p.r2) ** 2);
        return Math.PI * l * (p.r1 + p.r2) + Math.PI * (p.r1 ** 2 + p.r2 ** 2);
      },
      lateralAreaFormula: 'S_{xq} = π · l · (R + r)',
      lateralAreaCalc: (p) => {
        const l = Math.sqrt(p.h ** 2 + (p.r1 - p.r2) ** 2);
        return Math.PI * l * (p.r1 + p.r2);
      },
      extraStats: [
        { label: 'Đường sinh', value: 'l = √(h² + (R - r)²)' },
        { label: 'Ứng dụng', value: 'Xô nước, chậu hoa, bóng đèn rọi' },
      ]
    },
    funFact: 'Hình nón cụt thường gặp trong đời sống như chiếc chụp đèn, cái xô hay cốc trà sữa!'
  }
};

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export const GEOMETRY_QUIZ: QuizQuestion[] = [
  {
    id: 1,
    question: 'Khối mười hai diện đều (Dodecahedron) có bao nhiêu đỉnh và bao nhiêu cạnh?',
    options: ['12 đỉnh, 20 cạnh', '20 đỉnh, 30 cạnh', '12 đỉnh, 30 cạnh', '8 đỉnh, 12 cạnh'],
    correctIndex: 1,
    explanation: 'Theo định lý khối đa diện đều, khối mười hai diện đều {5, 3} có Đ = 20 đỉnh, C = 30 cạnh và M = 12 mặt (ngũ giác đều).'
  },
  {
    id: 2,
    question: 'Khối đa diện đều loại {3, 4} là khối nào sau đây?',
    options: ['Khối tứ diện đều', 'Khối lập phương', 'Khối bát diện đều', 'Khối hai mươi diện đều'],
    correctIndex: 2,
    explanation: 'Ký hiệu {p, q} nghĩa là mỗi mặt là đa giác đều p cạnh và mỗi đỉnh là đỉnh chung của q mặt. Khối {3, 4} là khối bát diện đều (8 mặt tam giác đều, mỗi đỉnh có 4 mặt).'
  },
  {
    id: 3,
    question: 'Công thức Euler cho khối đa diện lồi liên hệ giữa Đ (đỉnh), C (cạnh), M (mặt) là gì?',
    options: ['Đ + C - M = 2', 'Đ - C + M = 2', 'Đ - C - M = 0', 'Đ + M = C + 1'],
    correctIndex: 1,
    explanation: 'Định lý Euler: Với mọi khối đa diện lồi, ta luôn có hệ thức Đ - C + M = 2 (hoặc V - E + F = 2).'
  },
  {
    id: 4,
    question: 'Một hình nón có bán kính đáy r = 3 và chiều cao h = 4. Độ dài đường sinh l bằng bao nhiêu?',
    options: ['l = 7', 'l = 5', 'l = 12', 'l = √7'],
    correctIndex: 1,
    explanation: 'Tam giác tạo bởi chiều cao, bán kính đáy và đường sinh là tam giác vuông. Theo định lý Pythagoras: l = √(r² + h²) = √(3² + 4²) = √25 = 5.'
  },
  {
    id: 5,
    question: 'Cho hình hộp chữ nhật có 3 kích thước a = 2, b = 3, c = 4. Thể tích V và diện tích toàn phần Stp lần lượt là:',
    options: ['V = 24, Stp = 52', 'V = 9, Stp = 26', 'V = 24, Stp = 26', 'V = 12, Stp = 52'],
    correctIndex: 0,
    explanation: 'V = a · b · c = 2 · 3 · 4 = 24. Stp = 2·(ab + bc + ca) = 2·(6 + 12 + 8) = 2 · 26 = 52.'
  },
  {
    id: 6,
    question: 'Số mặt phẳng đối xứng của một khối lập phương là:',
    options: ['4 mặt', '6 mặt', '9 mặt', '12 mặt'],
    correctIndex: 2,
    explanation: 'Khối lập phương có 9 mặt phẳng đối xứng: 3 mặt phẳng trung trực của các cạnh (song song các mặt) và 6 mặt phẳng đi qua các cặp cạnh đối diện (mặt chéo).'
  },
  {
    id: 7,
    question: 'Khối đa diện đều nào sau đây tự đối ngẫu (dual with itself)?',
    options: ['Khối lập phương', 'Khối bát diện đều', 'Khối tứ diện đều', 'Khối mười hai diện đều'],
    correctIndex: 2,
    explanation: 'Khối tứ diện đều tự đối ngẫu: Nối tâm các mặt của tứ diện đều sẽ tạo thành một tứ diện đều nội tiếp.'
  }
];
