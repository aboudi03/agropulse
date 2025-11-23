const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface HttpClientOptions extends RequestInit {
  path: string;
}

export async function httpClient<T>({ path, ...init }: HttpClientOptions): Promise<T> {
  if (!API_BASE_URL) {
    throw new Error("❌ NEXT_PUBLIC_API_BASE_URL is not defined in .env.local");
  }

  // Ensure the path ALWAYS begins with a slash
  if (!path.startsWith("/")) {
    path = "/" + path;
  }

  // Build final URL cleanly
  const url = API_BASE_URL + path;

  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...init.headers,
    },
    ...init,
  });

  if (!response.ok) {
    let errorText = "";
    try {
      errorText = await response.text();
    } catch {
      /* ignore */
    }

    throw new Error(
      `Request failed with status ${response.status}${errorText ? `: ${errorText}` : ""}`
    );
  }

  // Handle empty body (204 or empty 200)
  const text = await response.text().catch(() => "");

  if (!text) return undefined as unknown as T;

  try {
    return JSON.parse(text) as T;
  } catch {
    return text as unknown as T;
  }
}
