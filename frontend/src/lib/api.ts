const API_URL: string = (import.meta.env.VITE_API_URL as string | undefined) ?? 'http://localhost:4000';

type RequestOptions = RequestInit & { skipAuth?: boolean };

type ErrorBody = {
  message?: string;
};

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { headers: optionHeaders, skipAuth, ...fetchOptions } = options;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(optionHeaders as Record<string, string>)
  };

  const response = await fetch(`${API_URL}${path}`, {
    ...fetchOptions,
    headers
  });

  if (!response.ok) {
    const fallback: ErrorBody = {};
    const errorPayload = (await response.json().catch(() => fallback)) as ErrorBody;
    let message = errorPayload.message ?? response.statusText;
    
    // Include validation issues if present
    if (errorPayload.issues) {
      const issues = JSON.stringify(errorPayload.issues);
      message += ` (Details: ${issues})`;
    }
    
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
  },
  getMemberLoans(memberId: string) {
    return request<MemberLoanResponse[]>(`/api/members/${memberId}/loans`);
  },
  getMemberFines(memberId: string) {
    return request<MemberFineResponse[]>(`/api/members/${memberId}/fines`);
  },
  getAvailableItems() {
    return request<ItemResponse[]>('/api/loans/items/available');
  },
  checkoutItem(adminKey: string, memberId: string, itemId: string) {
    return request<LoanResponse>('/api/loans/checkout', {
      method: 'POST',
      headers: {
        'x-admin-key': adminKey
      },
      body: JSON.stringify({ memberId, itemId })
    });
  },
  checkinItem(adminKey: string, loanId: string, itemId: string) {
    return request<CheckinResponse>('/api/loans/checkin', {
      method: 'POST',
      headers: {
        'x-admin-key': adminKey
      },
      body: JSON.stringify({ loanId, itemId })
    });
  },
  getAllItems(adminKey: string) {
    return request<ItemResponse[]>('/api/loans/items/all', {
      headers: {
        'x-admin-key': adminKey
      }
    });
  },
  getActiveLoans(adminKey: string) {
    return request<LoanWithItemResponse[]>('/api/loans/loans/active', {
      headers: {
        'x-admin-key': adminKey
      }
    });
  },
  getMembers(adminKey: string) {
    return request<{ members: MemberResponse[] }>('/api/admin/members', {
      headers: {
        'x-admin-key': adminKey
      }
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

export type MemberLoanResponse = {
  id: string;
  memberId: string;
  itemId: string;
  checkoutDate: string;
  dueDate: string;
  returnDate?: string;
  status: 'checked-out' | 'returned' | 'overdue';
  createdAt: string;
  updatedAt: string;
  item?: {
    id: string;
    title: string;
    itemType: 'book' | 'dvd' | 'magazine' | 'other';
    isAvailable: boolean;
  };
  potentialLateFee?: number;
};

export type MemberFineResponse = {
  id: string;
  loanId: string;
  memberId: string;
  amount: number;
  status: 'pending' | 'paid';
  calculatedDate: string;
  paidDate?: string;
  createdAt: string;
  updatedAt: string;
};

export type ItemResponse = {
  id: string;
  title: string;
  itemType: 'book' | 'dvd' | 'magazine' | 'other';
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
};

export type LoanResponse = {
  id: string;
  memberId: string;
  itemId: string;
  checkoutDate: string;
  dueDate: string;
  status: 'checked-out' | 'returned' | 'overdue';
  createdAt: string;
  updatedAt: string;
};

export type CheckinResponse = {
  loan: LoanResponse & { returnDate?: string };
  fine?: {
    id: string;
    loanId: string;
    memberId: string;
    amount: number;
    status: 'pending' | 'paid';
    calculatedDate: string;
  };
};

export type LoanWithItemResponse = LoanResponse & {
  item?: ItemResponse;
};

export type MemberResponse = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  phone: string;
  status: 'approved';
  libraryCardNumber: string;
  applicationId: string;
  createdAt: string;
  updatedAt: string;
};
