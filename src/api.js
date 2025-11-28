export const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export async function apiGet(path) {
  const res = await fetch(`${BACKEND_URL}${path}`, {
    credentials: "include",
  });

  if (res.status === 401) {
    return { unauthorized: true };
  }

  let data;
  try {
    data = await res.json();
  } catch {
    data = null;
  }

  if (!res.ok) {
    throw new Error(
      data?.error
        ? data.error
        : typeof data === "object"
        ? JSON.stringify(data)
        : "Unexpected error"
    );
  }

  return data;
}

export async function apiPost(path, body) {
  const res = await fetch(`${BACKEND_URL}${path}`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (res.status === 401) {
    return { unauthorized: true };
  }

  let data;
  try {
    data = await res.json();
  } catch {
    data = null;
  }

  if (!res.ok) {
    throw new Error(
      data?.error
        ? data.error
        : typeof data === "object"
        ? JSON.stringify(data)
        : "Unexpected error"
    );
  }

  return data;
}
