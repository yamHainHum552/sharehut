const API_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api`;

export const api = async (
  path: string,
  method: string,
  body?: any,
  token?: string,
) => {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  const res = await fetch(`${API_URL}${normalizedPath}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  return res.json();
};
