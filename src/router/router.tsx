import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/home";
import Auth from "../pages/auth";




export const router = createBrowserRouter([
    {
        path: "/",
        element: <Home />,
        errorElement: <div>Error: Page Not Found</div>,
    },
    {
        path: "/auth",
        element: <Auth />,
    },

]);