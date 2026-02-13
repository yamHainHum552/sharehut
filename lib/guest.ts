const GUEST_TOKEN_KEY = "guest_owner_token";

export const getGuestToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem(GUEST_TOKEN_KEY);
};

export const setGuestToken = (token: string) => {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(GUEST_TOKEN_KEY, token);
};

export const clearGuestToken = () => {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(GUEST_TOKEN_KEY);
};
