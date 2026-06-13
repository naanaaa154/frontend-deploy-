import { useAuthStore } from "~/features/auth/stores/auth-store";

type FetchOptions = RequestInit & { skipAuth?: boolean };

export async function authFetch(input: RequestInfo, init?: FetchOptions) {
  const token = useAuthStore.getState().token;

  const headers: Record<string, string> = {};
  if (init && init.headers) {
    try {
      const h = init.headers as Record<string, string>;
      Object.assign(headers, h);
    } catch (e) {
      /* ignore */
    }
  }

  if (!init?.skipAuth && token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const merged: RequestInit = {
    ...init,
    headers: {
      ...(init && init.headers ? (init.headers as Record<string, string>) : {}),
      ...headers,
    },
  };

  const res = await fetch(input, merged);

  if (res.status === 401 || res.status === 403) {
    // token expired or unauthorized — clear auth and redirect to login
    try {
      useAuthStore.getState().logout();
    } catch (e) {
      // swallow
    }
    // Preserve current location so user can return after login if desired
    window.location.href = "/login";
    throw new Error("Unauthorized");
  }

  return res;
}

export async function authJson<T>(input: RequestInfo, init?: FetchOptions): Promise<T> {
  const res = await authFetch(input, init);
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.detail || res.statusText || "Request failed");
  }
  return res.json();
}

export default authFetch;
