const API_URL: string = (import.meta.env.VITE_API_URL as string | undefined) ?? 'http://localhost:4000';

type RequestOptions = RequestInit & { skipAuth?: boolean };

type ErrorBody = {
  message?: string;
};

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    ...options
  });

  if (!response.ok) {
    const fallback: ErrorBody = {};
    const errorPayload = (await response.json().catch(() => fallback)) as ErrorBody;
    const message = errorPayload.message ?? response.statusText;
    throw new Error(message);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const responseData: unknown = await response.json();
  return responseData as T;
}

export const api = {
  apply(data: MemberApplicationPayload) {
    return request<MemberApplicationResponse>('/api/members/apply', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },
  checkStatus(applicationId: string) {
    return request<MemberApplicationResponse>(`/api/members/applications/${applicationId}`);
  },
  login(payload: MemberLoginPayload) {
    return request<MemberSessionResponse>('/api/members/login', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  }
};

export type MemberApplicationPayload = {
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  phone: string;
  pin: string;
};

export type MemberApplicationResponse = {
  id: string;
  status: 'pending' | 'approved' | 'rejected';
  libraryCardNumber?: string;
};

export type MemberLoginPayload = {
  libraryCardNumber: string;
  pin: string;
};

export type MemberSessionResponse = {
  token: string;
  member: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    status: 'pending' | 'approved' | 'rejected';
    libraryCardNumber: string;
  };
};
