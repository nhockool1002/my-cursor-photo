import React, { useState, useEffect, useRef } from 'react';
import { AUTH_CONFIG, isValidSession, createSession, clearSession } from '@/config/auth';

interface AuthGuardProps {
  children: React.ReactNode;
  username?: string;
  password?: string;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ 
  children, 
  username = AUTH_CONFIG.username, 
  password = AUTH_CONFIG.password 
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLogin, setShowLogin] = useState(true);
  const [error, setError] = useState('');
  const [shake, setShake] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    // Kiểm tra xem đã đăng nhập chưa
    if (isValidSession()) {
      setIsAuthenticated(true);
      setShowLogin(false);
    }
  }, []);

  const handleLogin = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const inputUsername = formData.get('username') as string;
    const inputPassword = formData.get('password') as string;

    if (inputUsername === username && inputPassword === password) {
      setIsAuthenticated(true);
      setShowLogin(false);
      setError('');
      createSession();
    } else {
      setError(AUTH_CONFIG.errorMessage);
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setShowLogin(true);
    clearSession();
  };

  if (!isAuthenticated) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: 'Inter, Arial, sans-serif',
        transition: 'background 0.5s',
      }}>
        <form
          ref={formRef}
          onSubmit={handleLogin}
          style={{
            background: 'white',
            padding: '2.5rem 2rem',
            borderRadius: '18px',
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
            width: '100%',
            maxWidth: '370px',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.2rem',
            position: 'relative',
            animation: shake ? 'shake 0.5s' : undefined,
          }}
        >
          <h2 style={{
            textAlign: 'center',
            marginBottom: '0.5rem',
            color: '#222',
            fontWeight: 700,
            letterSpacing: '0.5px',
            fontSize: '2rem',
          }}>
            {AUTH_CONFIG.loginTitle}
          </h2>
          <div style={{ position: 'relative' }}>
            <span style={{
              position: 'absolute',
              left: '14px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#888',
              fontSize: '1.1rem',
              pointerEvents: 'none',
            }}>
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path fill="#888" d="M12 12c2.7 0 8 1.34 8 4v2H4v-2c0-2.66 5.3-4 8-4Zm0-2a4 4 0 1 1 0-8 4 4 0 0 1 0 8Z"/></svg>
            </span>
            <input
              type="text"
              id="username"
              name="username"
              required
              placeholder="Tên đăng nhập"
              autoComplete="username"
              style={{
                width: '100%',
                padding: '0.85rem 0.85rem 0.85rem 2.5rem',
                border: error ? '1.5px solid #e74c3c' : '1.5px solid #e0e0e0',
                borderRadius: '8px',
                fontSize: '1.05rem',
                outline: 'none',
                background: '#f8f9fa',
                color: '#222',
                transition: 'border 0.2s, box-shadow 0.2s',
                boxShadow: error ? '0 0 0 2px #ffeaea' : 'none',
              }}
              onFocus={e => e.currentTarget.style.border = '1.5px solid #1976d2'}
              onBlur={e => e.currentTarget.style.border = error ? '1.5px solid #e74c3c' : '1.5px solid #e0e0e0'}
            />
            <style>{`
              #username::placeholder {
                color: #b0b6be;
                opacity: 1;
              }
            `}</style>
          </div>
          <div style={{ position: 'relative' }}>
            <span style={{
              position: 'absolute',
              left: '14px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#888',
              fontSize: '1.1rem',
              pointerEvents: 'none',
            }}>
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path fill="#888" d="M12 17a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm6-2v-2a6 6 0 1 0-12 0v2a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2a2 2 0 0 0-2-2Zm-8-2a4 4 0 1 1 8 0v2H6v-2Z"/></svg>
            </span>
            <input
              type="password"
              id="password"
              name="password"
              required
              placeholder="Mật khẩu"
              autoComplete="current-password"
              style={{
                width: '100%',
                padding: '0.85rem 0.85rem 0.85rem 2.5rem',
                border: error ? '1.5px solid #e74c3c' : '1.5px solid #e0e0e0',
                borderRadius: '8px',
                fontSize: '1.05rem',
                outline: 'none',
                background: '#f8f9fa',
                color: '#222',
                transition: 'border 0.2s, box-shadow 0.2s',
                boxShadow: error ? '0 0 0 2px #ffeaea' : 'none',
              }}
              onFocus={e => e.currentTarget.style.border = '1.5px solid #1976d2'}
              onBlur={e => e.currentTarget.style.border = error ? '1.5px solid #e74c3c' : '1.5px solid #e0e0e0'}
            />
            <style>{`
              #password::placeholder {
                color: #b0b6be;
                opacity: 1;
              }
            `}</style>
          </div>
          {error && (
            <div style={{
              color: '#e74c3c',
              fontSize: '0.98rem',
              marginTop: '-0.7rem',
              marginBottom: '-0.3rem',
              textAlign: 'center',
              minHeight: '1.5em',
              letterSpacing: '0.1px',
              animation: shake ? 'shake 0.5s' : undefined,
            }}>
              {error}
            </div>
          )}
          <button
            type="submit"
            style={{
              width: '100%',
              padding: '0.95rem',
              background: 'linear-gradient(90deg, #1976d2 0%, #21cbf3 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1.08rem',
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(33, 203, 243, 0.08)',
              transition: 'background 0.2s, transform 0.1s',
              marginTop: '0.5rem',
            }}
            onMouseDown={e => e.currentTarget.style.transform = 'scale(0.97)'}
            onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
          >
            {AUTH_CONFIG.loginButtonText}
          </button>
          {/* Hiệu ứng shake animation */}
          <style>{`
            @keyframes shake {
              0% { transform: translateX(0); }
              20% { transform: translateX(-8px); }
              40% { transform: translateX(8px); }
              60% { transform: translateX(-6px); }
              80% { transform: translateX(6px); }
              100% { transform: translateX(0); }
            }
          `}</style>
        </form>
      </div>
    );
  }

  return (
    <div>
      {/* Đã ẩn nút Đăng xuất */}
      {children}
    </div>
  );
};

export default AuthGuard; 