# VẼ HÌNH KG _ PHẠM HẬU

Ứng dụng vẽ hình học không gian 3D tương tác thông minh hàng đầu dành cho giáo viên và học sinh THPT: **Vẽ hình tự động theo yêu cầu người nhập đề** và khám phá các khối đa diện chuẩn toán học SGK.

## ✨ Tính Năng Nổi Bật

1. **Vẽ Theo Yêu Cầu Người Nhập Đề (AI 3D Geometry)**:
   - Nhập hoặc dán bất kỳ đề bài hình học không gian nào (chóp, lăng trụ, tứ diện, hộp chữ nhật, thiết diện, đường cao...).
   - AI tự động tính toán toạ độ 3D, phân loại cạnh nét liền và nét đứt (cạnh khuất) chuẩn quy ước SGK.
   - Hiển thị thiết diện mặt phẳng màu trong suốt, ký hiệu góc vuông 3D và phương pháp dựng hình từng bước.
   - Tích hợp sẵn bộ đề bài mẫu THPT để thử nghiệm ngay với 1 cú nhấp chuột.

2. **Cơ Chế Model AI & Fallback Tự Động**:
   - Model mặc định: `gemini-3-flash-preview` (tốc độ cao)
   - Tự động chuyển đổi khi lỗi/hết quota sang: `gemini-3-pro-preview` -> `gemini-2.5-flash`
   - Báo lỗi chi tiết trực quan nếu tất cả các model đều gặp sự cố.

3. **Quản Lý API Key Trực Tiếp Trên Trình Duyệt**:
   - Nút **Settings (API Key)** với dòng chữ đỏ *"Lấy API key để sử dụng app"* luôn hiển thị trên thanh Header.
   - Nhập và lưu API Key an toàn trong `localStorage`.
   - Hướng dẫn lấy key miễn phí tại: [Google AI Studio](https://aistudio.google.com/api-keys).

4. **11 Khối Hình Học Chuẩn SGK**:
   - 5 khối đa diện đều Platonic (Tứ diện đều, Lập phương, Bát diện đều, 12 mặt đều, 20 mặt đều).
   - Khối chóp, lăng trụ, hình hộp.
   - Khối tròn xoay: Trụ, nón, cầu, nón cụt.
   - Mặt phẳng cắt mặt cắt (Section slice), tách lớp (Exploded view), công thức diện tích & thể tích.

5. **Xuất Bản & Chia Sẻ**:
   - Chụp ảnh 3D chuẩn PNG với độ phân giải cao.
   - Sao chép toạ độ, tóm tắt và lời giải toán học.

## 🚀 Triển Khai Lên Vercel

Dự án đã được cấu hình sẵn file `vercel.json` phục vụ Single Page Application (SPA) routing:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### Chạy cục bộ (Local Development)

```bash
# Cài đặt gói thư viện
npm install  # hoặc bun install

# Chạy môi trường phát triển
npm run dev

# Đóng gói sản phẩm
npm run build
```
