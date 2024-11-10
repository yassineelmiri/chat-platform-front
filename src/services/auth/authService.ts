import axios from 'axios';
import axiosInstance from '../../utils/axiosInstance';
import { delay } from '../../utils';

interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData extends LoginData {
  username: string;
}

interface AuthResponse {
  token: string;
  user?: {
    id: string;
    email: string;
  };
}

export const loginService = async (loginData: LoginData): Promise<AuthResponse> => {
  delay(3000)

  try {
    const response = await axiosInstance.post<AuthResponse>('/auth/login', loginData);
    return response.data;
  } catch (error: any) {
    let errorMessage = 'Login failed';
    if (axios.isAxiosError(error)) {
      errorMessage = error.response?.data?.message ?? errorMessage;
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }
    throw new Error(errorMessage);
  }
};

export const registerService = async (registerData: RegisterData): Promise<AuthResponse> => {
  delay(3000)

  try {
    const response = await axiosInstance.post<AuthResponse>('/auth/signup', registerData);
    return response.data;
  } catch (error: any) {
    let errorMessage = 'Registration failed';
    if (axios.isAxiosError(error)) {
      errorMessage = error.response?.data?.message ?? errorMessage;
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }
    throw new Error(errorMessage);
  }
};