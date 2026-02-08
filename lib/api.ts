import { CONFIG } from "./config";

export let sessionToken: string | null = null;

export const setSessionToken = (token: string) => {
  sessionToken = token;
};

export const getSessionToken = () => sessionToken;

let unauthenticatedHandler: (() => void) | null = null;
export const setUnauthenticatedHandler = (handler: () => void) => {
  unauthenticatedHandler = handler;
};

export const getAuthHeaders = (): Record<string, string> => {
  return sessionToken ? { Authorization: `Bearer ${sessionToken}` } : {};
};

export const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  const authHeaders = getAuthHeaders();
  const headers: Record<string, string> = {
    ...authHeaders,
    ...(options.body instanceof FormData
      ? {}
      : { "Content-Type": "application/json" }),
  };

  const response = await fetch(`${CONFIG.API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    sessionToken = null;
    if (unauthenticatedHandler) {
      unauthenticatedHandler();
    }
    throw new Error("Session expired");
  }

  return response;
};

export async function login(email: string, password: string) {
  try {
    const response = await fetch(`${CONFIG.API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.ok && data.status === "ok") {
      setSessionToken(data.user.session_token);
      return { success: true, user: data.user };
    } else {
      return { success: false, error: data.detail || "Login failed" };
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Network error",
    };
  }
}

export async function logout() {
  try {
    if (sessionToken) {
      const authHeaders = getAuthHeaders();
      await fetch(`${CONFIG.API_URL}/auth/logout`, {
        method: "POST",
        headers: authHeaders,
      });
    }
  } catch (error) {
    // console.error("Logout error:", error);
  } finally {
    sessionToken = null;
  }
}
