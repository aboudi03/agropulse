const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

interface HttpClientOptions extends RequestInit {
  path: string;
}

export async function httpClient<T>({ path, ...init }: HttpClientOptions): Promise<T> {
  const headers = new Headers(init.headers);
  
  // Inject Authorization header if token exists
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("auth_token");
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
  }

  // Set default content type if not present
  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  // Ensure the path ALWAYS begins with a slash
  const cleanPath = path.startsWith("/") ? path : "/" + path;
  const url = API_BASE_URL + cleanPath;

  let response: Response;
  
  try {
    response = await fetch(url, {
      ...init,
      headers,
    });
  } catch (error) {
    // Network error or CORS issue
    throw new Error(`Network error: ${error instanceof Error ? error.message : 'Failed to fetch'}`);
  }

  if (!response.ok) {
    // Handle 401 Unauthorized - Auto logout
    if (response.status === 401 && typeof window !== "undefined") {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("auth_user");
      // Only redirect if not already on login page to avoid loops
      if (!window.location.pathname.includes("/login") && !window.location.pathname.includes("/register")) {
        window.location.href = "/login";
      }
    }
    
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
