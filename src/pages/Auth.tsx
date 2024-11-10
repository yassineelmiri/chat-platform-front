import { useEffect, useLayoutEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthForm from "../features/auth/components/AuthForm";
import { useAuth } from "../providers/AuthProvider";

export default function Auth() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useLayoutEffect(() => {
    // check if the user is authenticated
    if (isAuthenticated) {
      // redirect to the home page if authenticated
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  return (
    <div
      className="
        flex 
        h-screen 
        flex-col 
        justify-center 
        py-12 
        sm:px-6 
        lg:px-8 
        bg-gray-100
      "
    >
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <img
          className="mx-20 w-20"
          src="public/images/logo.png"
          alt="Logo"
        />
        <h2
          className="
            mt-6 
            text-center 
            text-3xl 
            font-bold 
            tracking-tight 
            text-gray-900
          "
        >
          Sign in to your account
        </h2>
      </div>
      <AuthForm />
    </div>
  );
}