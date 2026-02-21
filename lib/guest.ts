const GUEST_TOKEN_KEY = "guest_owner_token";

export const getGuestToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(GUEST_TOKEN_KEY);
};

export const setGuestToken = (token: string) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(GUEST_TOKEN_KEY, token);
};

export const clearGuestToken = () => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(GUEST_TOKEN_KEY);
};
