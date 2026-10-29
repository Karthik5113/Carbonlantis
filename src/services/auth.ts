import { DUMMY_LOGIN_CREDENTIALS } from '../pages/LoginPage';

const AUTH_STORAGE_KEY = 'carbonlantis_mrv_session';

export interface AuthSession {
  email: string;
  name: string;
  role: string;
  token: string;
  loginTime: string;
}

export const authService = {
  /**
   * Check if user is actively authenticated
   */
  isAuthenticated(): boolean {
    const raw = sessionStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return false;
    try {
      const session = JSON.parse(raw) as AuthSession;
      return !!session.token;
    } catch {
      return false;
    }
  },

  /**
   * Retrieve active session user
   */
  getSession(): AuthSession | null {
    const raw = sessionStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as AuthSession;
    } catch {
      return null;
    }
  },

  /**
   * Perform authentication and persist session token
   */
  login(email: string, pass: string): { success: boolean; error?: string; session?: AuthSession } {
    // Validate credentials against configured dummy credentials
    if (
      email.trim().toLowerCase() === DUMMY_LOGIN_CREDENTIALS.email.toLowerCase() &&
      pass === DUMMY_LOGIN_CREDENTIALS.password
    ) {
      const session: AuthSession = {
        email: DUMMY_LOGIN_CREDENTIALS.email,
        name: DUMMY_LOGIN_CREDENTIALS.name,
        role: DUMMY_LOGIN_CREDENTIALS.role,
        token: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${btoa(Date.now().toString())}`,
        loginTime: new Date().toISOString()
      };
      sessionStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
      return { success: true, session };
    }

    // Flexible fallback for demo testing if needed
    if (email.trim() && pass.length >= 6) {
      const session: AuthSession = {
        email,
        name: email.split('@')[0],
        role: 'Field Operator',
        token: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${btoa(Date.now().toString())}`,
        loginTime: new Date().toISOString()
      };
      sessionStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
      return { success: true, session };
    }

    return {
      success: false,
      error: `Invalid credentials. Use ${DUMMY_LOGIN_CREDENTIALS.email} / ${DUMMY_LOGIN_CREDENTIALS.password}`
    };
  },

  /**
   * Terminate active session and clear credentials
   */
  logout(): void {
    sessionStorage.removeItem(AUTH_STORAGE_KEY);
  }
};

