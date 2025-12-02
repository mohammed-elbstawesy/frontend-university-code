export interface Url {
    _id: string;
    originalUrl: string;
    user?: {
      _id: string;
      email: string;
    };
    createdAt: string;
    updatedAt: string;
    report?: string;
  }
  