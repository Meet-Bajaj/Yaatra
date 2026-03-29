import { isAxiosError } from 'axios';

export const getErrorMessage = (error: unknown) => {
  if (isAxiosError(error)) {
    if (error.response?.data?.message) {
      return String(error.response.data.message);
    }

    if (error.code === 'ECONNABORTED') {
      return 'The request took too long. Please try again.';
    }

    if (error.message === 'Network Error') {
      return 'Network error. Please check your connection and backend URL.';
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'Something went wrong. Please try again.';
};
