import { createBrowserRouter } from "react-router-dom";


/// here should add routers/ pages
export const router = createBrowserRouter([
    {
        path: "/",
        element: <div>Hello world!</div>,
    },


    {
        path: "/profile",
        element: <div>Hello user!</div>,
    },
]);