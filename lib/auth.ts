const TOKEN_KEY = "token";

/**
 * Get token (client-side only)
 */
export const getToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
};

/**
 * Set token in both localStorage (client)
 * and cookies (middleware access)
 */
export const setToken = (token: string) => {
  if (typeof window === "undefined") return;

  // Client-side storage
  localStorage.setItem(TOKEN_KEY, token);

  // Cookie for middleware (7 days)
  document.cookie = `${TOKEN_KEY}=${token}; path=/; max-age=604800; SameSite=Lax`;
};

/**
 * Check login status (client-side)
 */
export const isLoggedIn = (): boolean => {
  return !!getToken();
};

/**
 * Logout user completely
 */
export const logout = () => {
  if (typeof window === "undefined") return;

  // Remove client token
  localStorage.removeItem(TOKEN_KEY);

  // Remove cookie (must match path)
  document.cookie = `${TOKEN_KEY}=; path=/; max-age=0; SameSite=Lax`;

  window.location.href = "/";
};
