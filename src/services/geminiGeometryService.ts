import { CustomGeometryScene, GeminiModelId, FALLBACK_MODEL_CHAIN } from '../types/customGeometry';

export const LOCAL_STORAGE_KEY = 'gemini_api_key';
export const LOCAL_STORAGE_MODEL = 'gemini_selected_model';

export function getStoredApiKey(): string {
  if (typeof window === 'undefined') return '';
  const local = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (local && local.trim()) return local.trim();
  // Fallback to Vite env if provided
  try {
    const envKey = (import.meta as any).env?.VITE_GEMINI_API_KEY;
    if (envKey) return envKey.trim();
  } catch {}
  return '';
}

export function saveStoredApiKey(key: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(LOCAL_STORAGE_KEY, key.trim());
}

export function getStoredModel(): GeminiModelId {
  if (typeof window === 'undefined') return 'gemini-3-flash-preview';
  const model = localStorage.getItem(LOCAL_STORAGE_MODEL) as GeminiModelId;
  if (model && ['gemini-3-flash-preview', 'gemini-3-pro-preview', 'gemini-2.5-flash'].includes(model)) {
    return model;
  }
  return 'gemini-3-flash-preview';
}

export function saveStoredModel(model: GeminiModelId): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(LOCAL_STORAGE_MODEL, model);
}

// Built-in standard curated high school geometry problems
export const SAMPLE_PROBLEMS: { label: string; prompt: string; scene: CustomGeometryScene }[] = [
  {
    label: 'Chóp S.ABCD đáy vuông, SA ⊥ đáy + Thiết diện',
    prompt: 'Cho hình chóp S.ABCD có đáy ABCD là hình vuông cạnh a, SA vuông góc với (ABCD). M là trung điểm SC. Vẽ hình chóp và thiết diện cắt bởi mặt phẳng qua M song song với (SBD).',
    scene: {
      title: 'Hình chóp S.ABCD (SA ⊥ đáy) & Thiết diện qua M // (SBD)',
      problemPrompt: 'Cho hình chóp S.ABCD có đáy ABCD là hình vuông cạnh a, SA vuông góc với (ABCD). M là trung điểm SC. Vẽ hình chóp và thiết diện cắt bởi mặt phẳng qua M song song với (SBD).',
      summary: 'Hình chóp có SA vuông góc mặt phẳng đáy ABCD. Thiết diện cắt các cạnh SC, SB, SD lần lượt tại M, P, Q tạo thành tam giác MPQ đồng dạng và song song với tam giác SBD.',
      vertices: [
        { id: 'S', name: 'S', x: -1.2, y: 2.2, z: -1.0, isSpecial: true, color: '#f59e0b' },
        { id: 'A', name: 'A', x: -1.2, y: -1.2, z: -1.0, color: '#94a3b8' },
        { id: 'B', name: 'B', x: 1.2, y: -1.2, z: -1.0, color: '#38bdf8' },
        { id: 'C', name: 'C', x: 1.8, y: -1.2, z: 0.8, color: '#38bdf8' },
        { id: 'D', name: 'D', x: -0.6, y: -1.2, z: 0.8, color: '#38bdf8' },
        { id: 'O', name: 'O', x: 0.3, y: -1.2, z: -0.1, isSpecial: true, color: '#a855f7' },
        { id: 'M', name: 'M', x: 0.3, y: 0.5, z: -0.1, isSpecial: true, color: '#ec4899' },
        { id: 'P', name: 'P', x: 0.0, y: 0.5, z: -1.0, isSpecial: true, color: '#ec4899' },
        { id: 'Q', name: 'Q', x: -0.9, y: 0.5, z: -0.1, isSpecial: true, color: '#ec4899' }
      ],
      edges: [
        // Hidden / Dashed base & height
        { from: 'A', to: 'B', isDashed: true, type: 'base', color: '#64748b' },
        { from: 'A', to: 'D', isDashed: true, type: 'base', color: '#64748b' },
        { from: 'S', to: 'A', isDashed: true, type: 'height', color: '#f59e0b' },
        { from: 'A', to: 'C', isDashed: true, type: 'auxiliary', color: '#64748b' },
        { from: 'B', to: 'D', isDashed: true, type: 'auxiliary', color: '#64748b' },
        { from: 'S', to: 'O', isDashed: true, type: 'auxiliary', color: '#8b5cf6' },
        // Visible base edges
        { from: 'B', to: 'C', isDashed: false, type: 'base', color: '#38bdf8' },
        { from: 'C', to: 'D', isDashed: false, type: 'base', color: '#38bdf8' },
        // Visible lateral edges
        { from: 'S', to: 'B', isDashed: false, type: 'lateral', color: '#38bdf8' },
        { from: 'S', to: 'C', isDashed: false, type: 'lateral', color: '#38bdf8' },
        { from: 'S', to: 'D', isDashed: false, type: 'lateral', color: '#38bdf8' },
        // Section triangle MPQ
        { from: 'M', to: 'P', isDashed: false, type: 'section', color: '#f43f5e' },
        { from: 'M', to: 'Q', isDashed: false, type: 'section', color: '#f43f5e' },
        { from: 'P', to: 'Q', isDashed: true, type: 'section', color: '#f43f5e' }
      ],
      faces: [
        { name: 'Đáy ABCD', vertices: ['A', 'B', 'C', 'D'], color: '#3b82f6', opacity: 0.2 },
        { name: 'Thiết diện MPQ', vertices: ['M', 'P', 'Q'], color: '#f43f5e', opacity: 0.45 },
        { name: 'Mặt phẳng (SBD)', vertices: ['S', 'B', 'D'], color: '#8b5cf6', opacity: 0.15 }
      ],
      rightAngles: [
        { vertex: 'A', arm1: 'S', arm2: 'B', size: 0.25 },
        { vertex: 'A', arm1: 'S', arm2: 'D', size: 0.25 },
        { vertex: 'A', arm1: 'B', arm2: 'D', size: 0.22 }
      ],
      steps: [
        'Vẽ đáy ABCD dạng hình bình hành, hai cạnh AB và AD vẽ bằng nét đứt (cạnh khuất).',
        'Tại A dựng đường thẳng đứng biểu diễn đường cao SA vuông góc với (ABCD).',
        'Nối đỉnh S với B, C, D bằng các nét liền.',
        'Xác định tâm đáy O = AC ∩ BD và nối SO.',
        'Lấy M là trung điểm SC. Qua M kẻ đường thẳng // SO hoặc dựng tam giác thiết diện MPQ // (SBD).'
      ],
      keyProperties: [
        'SA ⊥ (ABCD) => SA ⊥ AB, SA ⊥ AD, SA ⊥ AC, SA ⊥ BD',
        'BC ⊥ (SAB) và CD ⊥ (SAD)',
        'Mặt phẳng (MPQ) // (SBD) nên thiết diện cắt các mặt là tam giác cân MPQ',
        'Tỉ số diện tích: S(MPQ) / S(SBD) = 1/4'
      ]
    }
  },
  {
    label: 'Chóp S.ABC đáy vuông tại B, SA ⊥ đáy + Đường cao AH',
    prompt: 'Cho hình chóp S.ABC có đáy ABC là tam giác vuông tại B, SA vuông góc với mặt phẳng (ABC). Dựng đường cao AH vuông góc với SB.',
    scene: {
      title: 'Hình chóp S.ABC (đáy vuông tại B, SA ⊥ đáy)',
      problemPrompt: 'Cho hình chóp S.ABC có đáy ABC là tam giác vuông tại B, SA vuông góc với mặt phẳng (ABC). Dựng đường cao AH vuông góc với SB.',
      summary: 'Hình chóp tam giác với SA ⊥ (ABC), tam giác ABC vuông tại B. Đoạn thẳng AH kẻ từ A vuông góc với SB chứng minh được AH ⊥ (SBC).',
      vertices: [
        { id: 'S', name: 'S', x: -1.0, y: 2.2, z: -0.8, isSpecial: true, color: '#f59e0b' },
        { id: 'A', name: 'A', x: -1.0, y: -1.2, z: -0.8, color: '#94a3b8' },
        { id: 'B', name: 'B', x: 1.4, y: -1.2, z: -0.8, color: '#38bdf8' },
        { id: 'C', name: 'C', x: 0.2, y: -1.2, z: 1.2, color: '#38bdf8' },
        { id: 'H', name: 'H', x: 0.2, y: 0.5, z: -0.8, isSpecial: true, color: '#ef4444' }
      ],
      edges: [
        { from: 'A', to: 'B', isDashed: true, type: 'base', color: '#64748b' },
        { from: 'A', to: 'C', isDashed: false, type: 'base', color: '#38bdf8' },
        { from: 'B', to: 'C', isDashed: false, type: 'base', color: '#38bdf8' },
        { from: 'S', to: 'A', isDashed: true, type: 'height', color: '#f59e0b' },
        { from: 'S', to: 'B', isDashed: false, type: 'lateral', color: '#38bdf8' },
        { from: 'S', to: 'C', isDashed: false, type: 'lateral', color: '#38bdf8' },
        { from: 'A', to: 'H', isDashed: true, type: 'auxiliary', color: '#ef4444' },
        { from: 'H', to: 'C', isDashed: false, type: 'auxiliary', color: '#ec4899' }
      ],
      faces: [
        { name: 'Đáy ABC', vertices: ['A', 'B', 'C'], color: '#3b82f6', opacity: 0.25 },
        { name: 'Mặt bên SBC', vertices: ['S', 'B', 'C'], color: '#06b6d4', opacity: 0.2 },
        { name: 'Mặt phẳng (AHC)', vertices: ['A', 'H', 'C'], color: '#ec4899', opacity: 0.3 }
      ],
      rightAngles: [
        { vertex: 'A', arm1: 'S', arm2: 'B', size: 0.25 },
        { vertex: 'B', arm1: 'A', arm2: 'C', size: 0.25 },
        { vertex: 'H', arm1: 'A', arm2: 'S', size: 0.22 }
      ],
      steps: [
        'Vẽ tam giác đáy ABC với cạnh AB nét đứt, AC và BC nét liền.',
        'Dựng đường cao SA thẳng đứng tại A bằng nét đứt.',
        'Nối SB, SC bằng nét liền.',
        'Trong tam giác vuông SAB, kẻ đường cao AH vuông góc với SB tại H.'
      ],
      keyProperties: [
        'BC ⊥ AB và BC ⊥ SA => BC ⊥ (SAB) => BC ⊥ AH',
        'AH ⊥ SB và AH ⊥ BC => AH ⊥ (SBC) => AH ⊥ SC',
        'Tam giác SBC vuông tại B vì BC ⊥ SB'
      ]
    }
  },
  {
    label: 'Chóp tứ giác đều S.ABCD tâm O',
    prompt: 'Cho hình chóp tứ giác đều S.ABCD có đáy ABCD là hình vuông tâm O, đường cao SO. Gọi M là trung điểm cạnh CD.',
    scene: {
      title: 'Hình chóp tứ giác đều S.ABCD (SO ⊥ đáy)',
      problemPrompt: 'Cho hình chóp tứ giác đều S.ABCD có đáy ABCD là hình vuông tâm O, đường cao SO. Gọi M là trung điểm cạnh CD.',
      summary: 'Hình chóp đều có đáy là hình vuông, chân đường cao trùng với tâm O của đáy. Các cạnh bên bằng nhau, các mặt bên là tam giác cân bằng nhau.',
      vertices: [
        { id: 'S', name: 'S', x: 0.0, y: 2.3, z: 0.0, isSpecial: true, color: '#f59e0b' },
        { id: 'O', name: 'O', x: 0.0, y: -1.2, z: 0.0, isSpecial: true, color: '#a855f7' },
        { id: 'A', name: 'A', x: -1.5, y: -1.2, z: -0.8, color: '#94a3b8' },
        { id: 'B', name: 'B', x: 0.9, y: -1.2, z: -0.8, color: '#94a3b8' },
        { id: 'C', name: 'C', x: 1.5, y: -1.2, z: 0.8, color: '#38bdf8' },
        { id: 'D', name: 'D', x: -0.9, y: -1.2, z: 0.8, color: '#38bdf8' },
        { id: 'M', name: 'M', x: 0.3, y: -1.2, z: 0.8, isSpecial: true, color: '#10b981' }
      ],
      edges: [
        { from: 'A', to: 'B', isDashed: true, type: 'base', color: '#64748b' },
        { from: 'A', to: 'D', isDashed: false, type: 'base', color: '#38bdf8' },
        { from: 'B', to: 'C', isDashed: false, type: 'base', color: '#38bdf8' },
        { from: 'C', to: 'D', isDashed: false, type: 'base', color: '#38bdf8' },
        { from: 'A', to: 'C', isDashed: true, type: 'auxiliary', color: '#64748b' },
        { from: 'B', to: 'D', isDashed: true, type: 'auxiliary', color: '#64748b' },
        { from: 'S', to: 'O', isDashed: true, type: 'height', color: '#f59e0b' },
        { from: 'S', to: 'A', isDashed: true, type: 'lateral', color: '#64748b' },
        { from: 'S', to: 'B', isDashed: false, type: 'lateral', color: '#38bdf8' },
        { from: 'S', to: 'C', isDashed: false, type: 'lateral', color: '#38bdf8' },
        { from: 'S', to: 'D', isDashed: false, type: 'lateral', color: '#38bdf8' },
        { from: 'S', to: 'M', isDashed: false, type: 'auxiliary', color: '#10b981' },
        { from: 'O', to: 'M', isDashed: true, type: 'auxiliary', color: '#10b981' }
      ],
      faces: [
        { name: 'Đáy ABCD', vertices: ['A', 'B', 'C', 'D'], color: '#3b82f6', opacity: 0.2 },
        { name: 'Mặt phẳng (SOM)', vertices: ['S', 'O', 'M'], color: '#10b981', opacity: 0.35 }
      ],
      rightAngles: [
        { vertex: 'O', arm1: 'S', arm2: 'M', size: 0.25 },
        { vertex: 'M', arm1: 'S', arm2: 'C', size: 0.22 }
      ],
      steps: [
        'Vẽ đáy ABCD là hình bình hành, AC cắt BD tại O.',
        'Tại O dựng đường thẳng đứng SO vuông góc với mặt phẳng đáy.',
        'Nối đỉnh S với các đỉnh A, B, C, D.',
        'Lấy M là trung điểm CD, nối SM và OM.'
      ],
      keyProperties: [
        'SO ⊥ (ABCD) => SO là chiều cao hình chóp',
        'Góc giữa mặt bên (SCD) và đáy là góc SMO',
        'Đoạn SM là trung đoạn (đường cao mặt bên)'
      ]
    }
  },
  {
    label: 'Lăng trụ tam giác đứng ABC.A\'B\'C\'',
    prompt: 'Cho hình lăng trụ đứng tam giác ABC.A\'B\'C\' có đáy ABC là tam giác vuông tại A, AB = c, AC = b, chiều cao h.',
    scene: {
      title: 'Hình lăng trụ đứng ABC.A\'B\'C\'',
      problemPrompt: 'Cho hình lăng trụ đứng tam giác ABC.A\'B\'C\' có đáy ABC là tam giác vuông tại A, AB = c, AC = b, chiều cao h.',
      summary: 'Lăng trụ đứng có các cạnh bên vuông góc với hai đáy song song. Các mặt bên là các hình chữ nhật.',
      vertices: [
        { id: 'A', name: 'A', x: -1.2, y: -1.4, z: -0.6, color: '#94a3b8' },
        { id: 'B', name: 'B', x: 1.2, y: -1.4, z: -0.6, color: '#38bdf8' },
        { id: 'C', name: 'C', x: 0.2, y: -1.4, z: 1.2, color: '#38bdf8' },
        { id: 'A_prime', name: "A'", x: -1.2, y: 1.4, z: -0.6, color: '#94a3b8' },
        { id: 'B_prime', name: "B'", x: 1.2, y: 1.4, z: -0.6, color: '#38bdf8' },
        { id: 'C_prime', name: "C'", x: 0.2, y: 1.4, z: 1.2, color: '#38bdf8' }
      ],
      edges: [
        // Bottom base
        { from: 'A', to: 'B', isDashed: true, type: 'base', color: '#64748b' },
        { from: 'A', to: 'C', isDashed: false, type: 'base', color: '#38bdf8' },
        { from: 'B', to: 'C', isDashed: false, type: 'base', color: '#38bdf8' },
        // Top base
        { from: 'A_prime', to: 'B_prime', isDashed: false, type: 'base', color: '#38bdf8' },
        { from: 'A_prime', to: 'C_prime', isDashed: false, type: 'base', color: '#38bdf8' },
        { from: 'B_prime', to: 'C_prime', isDashed: false, type: 'base', color: '#38bdf8' },
        // Lateral edges
        { from: 'A', to: 'A_prime', isDashed: true, type: 'height', color: '#f59e0b' },
        { from: 'B', to: 'B_prime', isDashed: false, type: 'lateral', color: '#38bdf8' },
        { from: 'C', to: 'C_prime', isDashed: false, type: 'lateral', color: '#38bdf8' },
        // Diagonal
        { from: 'A_prime', to: 'C', isDashed: false, type: 'auxiliary', color: '#ec4899' }
      ],
      faces: [
        { name: 'Đáy ABC', vertices: ['A', 'B', 'C'], color: '#3b82f6', opacity: 0.25 },
        { name: "Đáy A'B'C'", vertices: ['A_prime', 'B_prime', 'C_prime'], color: '#3b82f6', opacity: 0.25 },
        { name: "Mặt bên BB'C'C", vertices: ['B', 'C', 'C_prime', 'B_prime'], color: '#06b6d4', opacity: 0.2 }
      ],
      rightAngles: [
        { vertex: 'A', arm1: 'B', arm2: 'C', size: 0.25 },
        { vertex: 'A', arm1: 'A_prime', arm2: 'B', size: 0.25 }
      ],
      steps: [
        'Vẽ tam giác đáy ABC, cạnh khuất AB vẽ nét đứt.',
        'Tại 3 đỉnh A, B, C dựng 3 đường thẳng đứng bằng nhau AA\', BB\', CC\'. Cạnh AA\' vẽ nét đứt.',
        'Nối A\'B\', B\'C\', C\'A\' được đáy trên hoàn chỉnh.'
      ],
      keyProperties: [
        'AA\' ⊥ (ABC) và AA\' ⊥ (A\'B\'C\')',
        'Các mặt bên ABB\'A\', ACC\'A\', BCC\'B\' là các hình chữ nhật',
        'Thể tích V = S(ABC) * h = 1/2 * AB * AC * AA\''
      ]
    }
  },
  {
    label: 'Tứ diện đều ABCD & Trọng tâm G',
    prompt: 'Cho tứ diện đều ABCD có tất cả các cạnh bằng a. Gọi G là trọng tâm tam giác BCD, AG là đường cao của tứ diện. M là trung điểm cạnh CD.',
    scene: {
      title: 'Tứ diện đều ABCD (Đường cao AG)',
      problemPrompt: 'Cho tứ diện đều ABCD có tất cả các cạnh bằng a. Gọi G là trọng tâm tam giác BCD, AG là đường cao của tứ diện. M là trung điểm cạnh CD.',
      summary: 'Tứ diện đều có 4 mặt là tam giác đều bằng nhau. Trọng tâm G của đáy là chân đường cao hạ từ đỉnh A.',
      vertices: [
        { id: 'A', name: 'A', x: 0.0, y: 2.1, z: 0.0, isSpecial: true, color: '#f59e0b' },
        { id: 'G', name: 'G', x: 0.0, y: -1.2, z: 0.0, isSpecial: true, color: '#a855f7' },
        { id: 'B', name: 'B', x: -1.5, y: -1.2, z: -0.7, color: '#94a3b8' },
        { id: 'C', name: 'C', x: 1.5, y: -1.2, z: -0.7, color: '#38bdf8' },
        { id: 'D', name: 'D', x: 0.0, y: -1.2, z: 1.3, color: '#38bdf8' },
        { id: 'M', name: 'M', x: 0.75, y: -1.2, z: 0.3, isSpecial: true, color: '#10b981' }
      ],
      edges: [
        { from: 'B', to: 'C', isDashed: true, type: 'base', color: '#64748b' },
        { from: 'B', to: 'D', isDashed: false, type: 'base', color: '#38bdf8' },
        { from: 'C', to: 'D', isDashed: false, type: 'base', color: '#38bdf8' },
        { from: 'A', to: 'B', isDashed: true, type: 'lateral', color: '#64748b' },
        { from: 'A', to: 'C', isDashed: false, type: 'lateral', color: '#38bdf8' },
        { from: 'A', to: 'D', isDashed: false, type: 'lateral', color: '#38bdf8' },
        { from: 'A', to: 'G', isDashed: true, type: 'height', color: '#f59e0b' },
        { from: 'B', to: 'M', isDashed: true, type: 'auxiliary', color: '#10b981' },
        { from: 'A', to: 'M', isDashed: false, type: 'auxiliary', color: '#10b981' }
      ],
      faces: [
        { name: 'Đáy BCD', vertices: ['B', 'C', 'D'], color: '#3b82f6', opacity: 0.2 },
        { name: 'Mặt phẳng (ABM)', vertices: ['A', 'B', 'M'], color: '#10b981', opacity: 0.3 }
      ],
      rightAngles: [
        { vertex: 'G', arm1: 'A', arm2: 'M', size: 0.25 },
        { vertex: 'M', arm1: 'A', arm2: 'C', size: 0.22 }
      ],
      steps: [
        'Vẽ tam giác đáy BCD, cạnh BC khuất nét đứt.',
        'Dựng trung tuyến BM của đáy, lấy trọng tâm G với BG = 2/3 BM.',
        'Tại G dựng đường thẳng đứng AG vuông góc (BCD).',
        'Nối A với B, C, D và nối AM.'
      ],
      keyProperties: [
        'AG ⊥ (BCD), độ dài AG = a * √(2/3)',
        'Đoạn thẳng nối trung điểm 2 cạnh đối diện là đoạn vuông góc chung',
        'Thể tích tứ diện đều V = (a³ * √2) / 12'
      ]
    }
  },
  {
    label: 'Khối hộp chữ nhật ABCD.A\'B\'C\'D\'',
    prompt: 'Cho hình hộp chữ nhật ABCD.A\'B\'C\'D\'. Kẻ đường chéo AC\' và mặt phẳng (A\'BD).',
    scene: {
      title: 'Hình hộp chữ nhật ABCD.A\'B\'C\'D\' & Mặt phẳng (A\'BD)',
      problemPrompt: 'Cho hình hộp chữ nhật ABCD.A\'B\'C\'D\'. Kẻ đường chéo AC\' và mặt phẳng (A\'BD).',
      summary: 'Hình hộp chữ nhật có 6 mặt đều là các hình chữ nhật. Đường chéo AC\' vuông góc với mặt phẳng (A\'BD) trong trường hợp hình lập phương.',
      vertices: [
        { id: 'A', name: 'A', x: -1.3, y: -1.1, z: -0.9, color: '#94a3b8' },
        { id: 'B', name: 'B', x: 1.3, y: -1.1, z: -0.9, color: '#38bdf8' },
        { id: 'C', name: 'C', x: 1.7, y: -1.1, z: 0.9, color: '#38bdf8' },
        { id: 'D', name: 'D', x: -0.9, y: -1.1, z: 0.9, color: '#38bdf8' },
        { id: 'A_prime', name: "A'", x: -1.3, y: 1.1, z: -0.9, color: '#94a3b8' },
        { id: 'B_prime', name: "B'", x: 1.3, y: 1.1, z: -0.9, color: '#38bdf8' },
        { id: 'C_prime', name: "C'", x: 1.7, y: 1.1, z: 0.9, color: '#38bdf8' },
        { id: 'D_prime', name: "D'", x: -0.9, y: 1.1, z: 0.9, color: '#38bdf8' }
      ],
      edges: [
        // Base ABCD
        { from: 'A', to: 'B', isDashed: true, type: 'base', color: '#64748b' },
        { from: 'A', to: 'D', isDashed: true, type: 'base', color: '#64748b' },
        { from: 'B', to: 'C', isDashed: false, type: 'base', color: '#38bdf8' },
        { from: 'C', to: 'D', isDashed: false, type: 'base', color: '#38bdf8' },
        // Top base
        { from: 'A_prime', to: 'B_prime', isDashed: false, type: 'base', color: '#38bdf8' },
        { from: 'B_prime', to: 'C_prime', isDashed: false, type: 'base', color: '#38bdf8' },
        { from: 'C_prime', to: 'D_prime', isDashed: false, type: 'base', color: '#38bdf8' },
        { from: 'D_prime', to: 'A_prime', isDashed: false, type: 'base', color: '#38bdf8' },
        // Verticals
        { from: 'A', to: 'A_prime', isDashed: true, type: 'height', color: '#f59e0b' },
        { from: 'B', to: 'B_prime', isDashed: false, type: 'lateral', color: '#38bdf8' },
        { from: 'C', to: 'C_prime', isDashed: false, type: 'lateral', color: '#38bdf8' },
        { from: 'D', to: 'D_prime', isDashed: false, type: 'lateral', color: '#38bdf8' },
        // Plane (A'BD)
        { from: 'A_prime', to: 'B', isDashed: true, type: 'section', color: '#ec4899' },
        { from: 'A_prime', to: 'D', isDashed: false, type: 'section', color: '#ec4899' },
        { from: 'B', to: 'D', isDashed: true, type: 'section', color: '#ec4899' }
      ],
      faces: [
        { name: 'Đáy ABCD', vertices: ['A', 'B', 'C', 'D'], color: '#3b82f6', opacity: 0.2 },
        { name: "Mặt phẳng (A'BD)", vertices: ['A_prime', 'B', 'D'], color: '#ec4899', opacity: 0.35 }
      ],
      rightAngles: [
        { vertex: 'A', arm1: 'B', arm2: 'D', size: 0.25 },
        { vertex: 'A', arm1: 'A_prime', arm2: 'B', size: 0.25 }
      ],
      steps: [
        'Vẽ đáy ABCD là hình bình hành với các cạnh khuất AB, AD là nét đứt.',
        'Tại 4 đỉnh dựng 4 đoạn thẳng đứng bằng nhau AA\', BB\', CC\', DD\'.',
        'Nối 4 đỉnh phía trên tạo thành đáy A\'B\'C\'D\'.'
      ],
      keyProperties: [
        'Độ dài đường chéo AC\' = √(a² + b² + c²)',
        'Thể tích V = a * b * c',
        'Mặt phẳng (A\'BD) chia khối hộp thành các phần đa diện'
      ]
    }
  }
];

/**
 * Fast keyword-based pattern matching fallback
 */
export function findMatchingSample(prompt: string): CustomGeometryScene | null {
  const p = prompt.toLowerCase();
  
  if ((p.includes('chóp') || p.includes('s.abcd')) && (p.includes('sa vuông') || p.includes('sa ⊥') || p.includes('sa vuong'))) {
    return SAMPLE_PROBLEMS[0].scene;
  }
  if ((p.includes('s.abc') || p.includes('chóp tam giác')) && (p.includes('vuông tại b') || p.includes('tam giác vuông') || p.includes('ah'))) {
    return SAMPLE_PROBLEMS[1].scene;
  }
  if ((p.includes('tứ giác đều') || p.includes('chóp đều')) && p.includes('tâm o')) {
    return SAMPLE_PROBLEMS[2].scene;
  }
  if (p.includes('lăng trụ') || p.includes('abc.a\'b\'c\'') || p.includes("abc.a'b'c'")) {
    return SAMPLE_PROBLEMS[3].scene;
  }
  if (p.includes('tứ diện đều') || (p.includes('tứ diện') && p.includes('trọng tâm'))) {
    return SAMPLE_PROBLEMS[4].scene;
  }
  if (p.includes('hộp chữ nhật') || p.includes('lập phương') || p.includes('hộp')) {
    return SAMPLE_PROBLEMS[5].scene;
  }
  return null;
}

const SYSTEM_PROMPT = `Bạn là một Giáo Viên Toán Hình Học Không Gian THPT & Chuyên gia Đồ Hoạ 3D Toán Học hàng đầu Việt Nam.
Nhiệm vụ của bạn là nhận vào một ĐỀ BÀI HOẶC YÊU CẦU VẼ HÌNH HỌC KHÔNG GIAN từ người dùng, sau đó tính toán toạ độ 3D chính xác, phân tích các đỉnh, cạnh nét liền/nét đứt, các mặt phẳng, đường cao và thiết diện.

QUY TẮC DỰNG HÌNH CHUẨN TOÁN HỌC SGK VIỆT NAM:
1. Toạ độ hệ trục:
   - Trục Y là phương thẳng đứng (chiều cao h, đáy nằm ở y ≈ -1.2, các đỉnh trên đỉnh chóp/lăng trụ y > 1.2).
   - Trục X là phương ngang (-2.0 đến +2.0).
   - Trục Z là phương sâu (trước/sau, -1.5 đến +1.5).
   - Tâm hình nằm gần gốc toạ độ (0, 0, 0).
2. Quy ước nét vẽ (RẤT QUAN TRỌNG):
   - "isDashed: true": Cho các cạnh KHUẤT (bị che lấp ở phía sau theo góc nhìn phối cảnh SGK, ví dụ đáy phía sau AB, AD; đường cao bên trong SA hoặc SO; đường nối phụ khuất).
   - "isDashed: false": Cho các cạnh THẤY được (nét liền).
3. Đầy đủ các đỉnh và nhãn:
   - Tên đỉnh chuẩn: S, A, B, C, D, A', B', C', D', H, M, N, P, O, G...
4. Cạnh đặc biệt:
   - "type": "height" (đường cao, màu cam #f59e0b), "section" (thiết diện, màu hồng #ec4899), "auxiliary" (đường phụ, màu xanh lá #10b981), "base" (cạnh đáy, #38bdf8 hoặc #64748b), "lateral" (cạnh bên, #38bdf8).
5. Ký hiệu góc vuông (rightAngles):
   - Xác định các góc vuông quan trọng (như chân đường cao vuông góc với cạnh đáy).

BẠN PHẢI TRẢ VỀ DUY NHẤT MỘT ĐỐI TƯỢNG JSON (không kèm markdown, không kèm lời dẫn ngoài JSON), đúng theo định dạng sau:
{
  "title": "Tên hình ngắn gọn",
  "problemPrompt": "Đề bài của người dùng",
  "summary": "Tóm tắt ngắn gọn hình và các yếu tố giả thiết",
  "vertices": [
    { "id": "S", "name": "S", "x": 0.0, "y": 2.2, "z": 0.0, "isSpecial": true, "color": "#f59e0b" },
    { "id": "A", "name": "A", "x": -1.2, "y": -1.2, "z": -1.0, "color": "#94a3b8" }
  ],
  "edges": [
    { "from": "A", "to": "B", "isDashed": true, "type": "base", "color": "#64748b" }
  ],
  "faces": [
    { "name": "Đáy ABCD", "vertices": ["A", "B", "C", "D"], "color": "#3b82f6", "opacity": 0.25 }
  ],
  "rightAngles": [
    { "vertex": "A", "arm1": "S", "arm2": "B", "size": 0.25 }
  ],
  "steps": [
    "Bước 1: Vẽ đáy...",
    "Bước 2: Dựng đường cao..."
  ],
  "keyProperties": [
    "Tính chất 1...",
    "Tính chất 2..."
  ]
}`;

export type StepId = 1 | 2 | 3;

export interface StepProgressEvent {
  step: StepId;
  model: GeminiModelId;
  status: 'trying' | 'success' | 'failed';
  error?: string;
  message?: string;
}

export type GenerationProgressCallback = (event: StepProgressEvent) => void;

/**
 * Call Gemini API with Fallback Chain and Auto-Retry per step
 */
export async function generate3DGeometryFromPrompt(
  prompt: string,
  preferredModel?: GeminiModelId,
  onProgress?: GenerationProgressCallback
): Promise<CustomGeometryScene> {
  const apiKey = getStoredApiKey();

  // If no API key is set, check if we have a match in sample database or use default
  if (!apiKey) {
    const matched = findMatchingSample(prompt);
    if (matched) {
      if (onProgress) {
        onProgress({ step: 1, model: 'gemini-3-flash-preview', status: 'success', message: 'Phân tích từ cơ sở dữ liệu mẫu' });
        onProgress({ step: 2, model: 'gemini-3-flash-preview', status: 'success', message: 'Dựng toạ độ đỉnh mẫu' });
        onProgress({ step: 3, model: 'gemini-3-flash-preview', status: 'success', message: 'Hoàn tất mặt phẳng & thiết diện' });
      }
      return { ...matched, problemPrompt: prompt };
    }
    // Return sample 0 as base template if no API key
    if (onProgress) {
      onProgress({ step: 1, model: 'gemini-3-flash-preview', status: 'success' });
      onProgress({ step: 2, model: 'gemini-3-flash-preview', status: 'success' });
      onProgress({ step: 3, model: 'gemini-3-flash-preview', status: 'success' });
    }
    return {
      ...SAMPLE_PROBLEMS[0].scene,
      problemPrompt: prompt,
      summary: `[Chế độ mẫu chuẩn] Đã dựng hình mẫu chóp S.ABCD. Để dựng hình tự do cho bất kỳ đề bài phức tạp nào, vui lòng bấm nút "Settings (API Key)" trên Header để nhập key.`
    };
  }

  // Model fallback list starting with preferredModel or stored model
  const startModel = preferredModel || getStoredModel();
  const modelsToTry: GeminiModelId[] = [
    startModel,
    ...FALLBACK_MODEL_CHAIN.filter((m) => m !== startModel)
  ];

  let lastErrorMsg = '';

  for (let i = 0; i < modelsToTry.length; i++) {
    const model = modelsToTry[i];
    try {
      // Step 1: Phân tích đề bài
      if (onProgress) {
        onProgress({
          step: 1,
          model,
          status: 'trying',
          message: `Đang phân tích giả thiết hình học với model ${model}...`
        });
      }

      // Perform API call
      const scene = await callGeminiApiForScene(prompt, model, apiKey);

      // Step 1 completed successfully
      if (onProgress) {
        onProgress({
          step: 1,
          model,
          status: 'success',
          message: `Đã phân tích xong đề bài (${model})`
        });
      }

      // Step 2: Dựng toạ độ 3D & phân loại cạnh
      if (onProgress) {
        onProgress({
          step: 2,
          model,
          status: 'trying',
          message: `Đang tính toán toạ độ ${scene.vertices.length} đỉnh và ${scene.edges.length} cạnh...`
        });
      }

      // Small tick for realistic visual feedback
      await new Promise((res) => setTimeout(res, 250));

      if (onProgress) {
        onProgress({
          step: 2,
          model,
          status: 'success',
          message: `Đã xác lập toạ độ 3D và cạnh nét đứt/thấy`
        });
      }

      // Step 3: Dựng mặt phẳng, đường cao & thiết diện
      if (onProgress) {
        onProgress({
          step: 3,
          model,
          status: 'trying',
          message: `Đang dựng ${scene.faces.length} mặt phẳng & góc vuông...`
        });
      }

      await new Promise((res) => setTimeout(res, 200));

      if (onProgress) {
        onProgress({
          step: 3,
          model,
          status: 'success',
          message: `Hoàn tất mô hình không gian 3D`
        });
      }

      return scene;
    } catch (err: any) {
      const errMsg = err?.message || String(err);
      lastErrorMsg = errMsg;
      console.warn(`[Gemini Fallback] Model ${model} failed: ${errMsg}`);

      if (onProgress) {
        onProgress({
          step: 1, // failing on step
          model,
          status: 'failed',
          error: errMsg,
          message: i < modelsToTry.length - 1
            ? `Model ${model} bị lỗi: ${errMsg}. Đang tự động chuyển sang ${modelsToTry[i + 1]}...`
            : `Model ${model} bị lỗi: ${errMsg}`
        });
      }
      // Continue to next model in fallback chain
    }
  }

  // If all models failed, throw raw error as required by rule 3
  throw new Error(lastErrorMsg || 'Tất cả các model Gemini đều không phản hồi');
}

/**
 * Internal single call to Gemini REST API
 */
async function callGeminiApiForScene(
  prompt: string,
  model: GeminiModelId,
  apiKey: string
): Promise<CustomGeometryScene> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const requestBody = {
    contents: [
      {
        role: 'user',
        parts: [
          {
            text: `${SYSTEM_PROMPT}\n\nĐỀ BÀI CẦN DỰNG HÌNH:\n"${prompt}"`
          }
        ]
      }
    ],
    generationConfig: {
      temperature: 0.1,
      responseMimeType: 'application/json'
    }
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(requestBody)
  });

  if (!response.ok) {
    let errDetail = `${response.status} ${response.statusText}`;
    try {
      const errJson = await response.json();
      if (errJson?.error?.message) {
        const code = errJson.error.code || response.status;
        const status = errJson.error.status ? ` ${errJson.error.status}` : '';
        errDetail = `${code}${status}: ${errJson.error.message}`;
      }
    } catch {}
    throw new Error(errDetail);
  }

  const data = await response.json();
  const textOutput = data?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!textOutput) {
    throw new Error('Mô hình không trả về nội dung toạ độ');
  }

  // Clean and parse JSON
  let cleanJson = textOutput.trim();
  if (cleanJson.startsWith('```json')) {
    cleanJson = cleanJson.replace(/^```json\s*/, '').replace(/```\s*$/, '');
  } else if (cleanJson.startsWith('```')) {
    cleanJson = cleanJson.replace(/^```\s*/, '').replace(/```\s*$/, '');
  }

  const parsed = JSON.parse(cleanJson) as CustomGeometryScene;
  if (!parsed.vertices || !Array.isArray(parsed.vertices) || parsed.vertices.length < 3) {
    throw new Error('Dữ liệu toạ độ đỉnh không hợp lệ');
  }

  return {
    ...parsed,
    problemPrompt: prompt
  };
}
