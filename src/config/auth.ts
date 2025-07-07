// Cấu hình Basic Authentication
export const AUTH_CONFIG = {
  // Thông tin đăng nhập mặc định
  // Trong môi trường production, nên sử dụng biến môi trường
  username: import.meta.env.VITE_AUTH_USERNAME || 'admin',
  password: import.meta.env.VITE_AUTH_PASSWORD || 'password@123',
  // 
  
  // Cấu hình session
  sessionKey: 'basic-auth',
  sessionTimeout: 24 * 60 * 60 * 1000, // 24 giờ
  
  // Cấu hình giao diện
  loginTitle: 'Đăng nhập',
  logoutButtonText: 'Đăng xuất',
  usernameLabel: 'Tên đăng nhập:',
  passwordLabel: 'Mật khẩu:',
  loginButtonText: 'Đăng nhập',
  errorMessage: 'Sai tên đăng nhập hoặc mật khẩu!'
};

// Hàm kiểm tra session có hợp lệ không
export const isValidSession = (): boolean => {
  const authStatus = localStorage.getItem(AUTH_CONFIG.sessionKey);
  if (authStatus !== 'true') return false;
  
  // Kiểm tra thời gian session (nếu có)
  const sessionTime = localStorage.getItem(`${AUTH_CONFIG.sessionKey}-time`);
  if (sessionTime) {
    const now = Date.now();
    const sessionStart = parseInt(sessionTime);
    if (now - sessionStart > AUTH_CONFIG.sessionTimeout) {
      // Session hết hạn
      localStorage.removeItem(AUTH_CONFIG.sessionKey);
      localStorage.removeItem(`${AUTH_CONFIG.sessionKey}-time`);
      return false;
    }
  }
  
  return true;
};

// Hàm tạo session mới
export const createSession = (): void => {
  localStorage.setItem(AUTH_CONFIG.sessionKey, 'true');
  localStorage.setItem(`${AUTH_CONFIG.sessionKey}-time`, Date.now().toString());
};

// Hàm xóa session
export const clearSession = (): void => {
  localStorage.removeItem(AUTH_CONFIG.sessionKey);
  localStorage.removeItem(`${AUTH_CONFIG.sessionKey}-time`);
}; 