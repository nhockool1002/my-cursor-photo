# Basic Authentication Setup

## Tổng quan

Dự án này đã được cấu hình với Basic Authentication để bảo vệ toàn bộ ứng dụng. Người dùng sẽ cần đăng nhập trước khi có thể truy cập vào bất kỳ trang nào.

## Cách hoạt động

### 1. Component AuthGuard
- `src/components/AuthGuard.tsx`: Component chính để bảo vệ ứng dụng
- Kiểm tra trạng thái đăng nhập từ localStorage
- Hiển thị form đăng nhập nếu chưa xác thực
- Tự động chuyển hướng đến nội dung ứng dụng sau khi đăng nhập thành công

### 2. Cấu hình Authentication
- `src/config/auth.ts`: File cấu hình chứa thông tin đăng nhập và cài đặt
- Quản lý session với thời gian timeout
- Có thể tùy chỉnh thông qua biến môi trường

## Thông tin đăng nhập mặc định

- **Username**: `admin`
- **Password**: `password123`

## Cách tùy chỉnh

### 1. Thay đổi thông tin đăng nhập

#### Cách 1: Sử dụng biến môi trường (Khuyến nghị)
Tạo file `.env` trong thư mục gốc:

```env
REACT_APP_AUTH_USERNAME=your_username
REACT_APP_AUTH_PASSWORD=your_password
```

#### Cách 2: Thay đổi trực tiếp trong code
Chỉnh sửa file `src/config/auth.ts`:

```typescript
export const AUTH_CONFIG = {
  username: 'your_username',
  password: 'your_password',
  // ... các cài đặt khác
};
```

### 2. Tùy chỉnh giao diện đăng nhập

Chỉnh sửa các thuộc tính trong `AUTH_CONFIG`:

```typescript
export const AUTH_CONFIG = {
  // ... thông tin đăng nhập
  loginTitle: 'Đăng nhập vào hệ thống',
  logoutButtonText: 'Thoát',
  usernameLabel: 'Tài khoản:',
  passwordLabel: 'Mật khẩu:',
  loginButtonText: 'Đăng nhập',
  errorMessage: 'Thông tin đăng nhập không chính xác!'
};
```

### 3. Thay đổi thời gian session

```typescript
export const AUTH_CONFIG = {
  // ... thông tin khác
  sessionTimeout: 60 * 60 * 1000, // 1 giờ
};
```

## Tính năng

### ✅ Đã triển khai
- [x] Form đăng nhập với validation
- [x] Lưu trạng thái đăng nhập trong localStorage
- [x] Session timeout tự động
- [x] Nút đăng xuất
- [x] Giao diện responsive
- [x] Tùy chỉnh thông qua cấu hình

### 🔄 Có thể mở rộng
- [ ] Mã hóa mật khẩu
- [ ] JWT token authentication
- [ ] Role-based access control
- [ ] Remember me functionality
- [ ] Password reset

## Bảo mật

⚠️ **Lưu ý quan trọng**: 
- Basic Authentication này chỉ phù hợp cho các ứng dụng đơn giản
- Trong môi trường production, nên sử dụng các phương pháp bảo mật mạnh hơn như JWT, OAuth, hoặc server-side authentication
- Không nên lưu trữ thông tin nhạy cảm trong localStorage mà không mã hóa

## Sử dụng

1. Chạy ứng dụng: `npm run dev`
2. Truy cập ứng dụng trong trình duyệt
3. Nhập thông tin đăng nhập mặc định:
   - Username: `admin`
   - Password: `password123`
4. Sau khi đăng nhập thành công, bạn có thể sử dụng ứng dụng bình thường
5. Để đăng xuất, nhấn nút "Đăng xuất" ở góc trên bên phải

## Troubleshooting

### Vấn đề thường gặp

1. **Không thể đăng nhập**
   - Kiểm tra thông tin đăng nhập có chính xác không
   - Xóa localStorage và thử lại

2. **Session bị mất sau khi refresh**
   - Kiểm tra cài đặt sessionTimeout
   - Đảm bảo localStorage hoạt động bình thường

3. **Giao diện không hiển thị đúng**
   - Kiểm tra CSS và responsive design
   - Đảm bảo tất cả dependencies đã được cài đặt 