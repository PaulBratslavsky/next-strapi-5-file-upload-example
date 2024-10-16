type NextFetchRequestConfig = {
  revalidate?: number | false;
  tags?: string[];
};

interface FetchAPIOptions<T = any> {
  method: "GET" | "POST" | "PUT" | "DELETE";
  authToken?: string;
  payload?: T;
  next?: NextFetchRequestConfig;
}

class HTTPError extends Error {
  constructor(public status: number, public body: string) {
    super(`HTTP error! status: ${status}`);
    this.name = 'HTTPError';
  }
}

export async function fetchAPI(url: string, options: FetchAPIOptions) {
  const { method, authToken, payload, next } = options;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (authToken) {
    headers.Authorization = `Bearer ${authToken}`;
  }

  const fetchOptions: RequestInit & { next?: NextFetchRequestConfig } = {
    method,
    headers,
    ...(payload && { body: JSON.stringify(payload) }),
    ...(next && { next }),
  };

  try {
    const response = await fetch(url, fetchOptions);

    if (!response.ok) {
      const errorBody = await response.text();
      throw new HTTPError(response.status, errorBody);
    }

    const contentType = response.headers.get("content-type");

    if (contentType?.includes("application/json")) {
      return await response.json();
    } else {
      return await response.text();
    }

  } catch (error) {
    console.error(`Error ${method} ${url}:`, error);
    if (error instanceof HTTPError) {
      console.error(`Status: ${error.status}, Body: ${error.body}`);
    }
    throw error;
  }
}