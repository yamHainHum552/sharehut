const GUEST_SESSION_KEY = "guest_session_id";
const GUEST_NAME_KEY = "guest_display_name";

export const getOrCreateGuestSession = (): string => {
  if (typeof window === "undefined") return "";

  let id = localStorage.getItem(GUEST_SESSION_KEY);

  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(GUEST_SESSION_KEY, id);
  }

  return id;
};

export const getOrCreateGuestName = (): string => {
  if (typeof window === "undefined") return "Guest";

  let name = localStorage.getItem(GUEST_NAME_KEY);

  if (!name) {
    const short = Math.floor(Math.random() * 9000) + 1000;
    name = `Guest-${short}`;
    localStorage.setItem(GUEST_NAME_KEY, name);
  }

  return name;
};
