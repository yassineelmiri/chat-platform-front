import axios from 'axios';
import axiosInstance from '../../utils/axiosInstance';


interface LoginData {
  email: string;
  password: string;
}

interface RegisterData extends LoginData {
  usernam: string;
  confirmPassword: string
}

interface AuthResponse {
  token: string;
  user?: {
    id: string;
    email: string;

  };
}

export const loginService = async (loginData: LoginData): Promise<AuthResponse> => {
  try {
    const response = await axiosInstance.post<AuthResponse>('/auth/login', loginData);
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data?.message || 'Login failed';
    } else {
      throw 'An unexpected error occurred during login';
    }
  }
};

export const registerService = async (registerData: RegisterData): Promise<AuthResponse> => {
  try {
    const response = await axiosInstance.post<AuthResponse>('/auth/signup', registerData);
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data?.message || 'Registration failed';
    } else {
      throw 'An unexpected error occurred during registration';
    }
  }
};