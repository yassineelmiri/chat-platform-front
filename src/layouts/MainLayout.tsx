import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar/Sidebar";
import ChatBody from "../features/ChatBody/components/ChatBody";
import { Toaster } from "react-hot-toast";

const MainLayout = () => {
    return (
        <div className="flex  min-h-screen bg-white w-full">

            <Sidebar >
                <div className="h-full ">
                    <Outlet />
                </div>
            </Sidebar>


            <ChatBody />

            <Toaster
                position="top-center"
                reverseOrder={false}
            />
        </div>
    );
};


export default MainLayout