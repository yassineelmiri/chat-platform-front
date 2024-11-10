import axios from 'axios';


const apiUrl = import.meta.env.VITE_API_URL;


interface ILogin {
  email: string,
  password: string
}
export const login = async (dataLogin: ILogin) => {
  try {
    const response = await axios.post(`${apiUrl}/login`, dataLogin);
    return response.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw error.response.data;
  }
};


interface IRegister extends ILogin {
  username: string
}


export const Register = async (resgiterData: IRegister) => {
  try {
    const response = await axios.post(`${apiUrl}/signup`, resgiterData);
    return response.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw error.response.data;
  }
};
