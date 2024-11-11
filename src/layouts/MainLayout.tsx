import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar/Sidebar";
import ChatBody from "../features/ChatBody/components/ChatBody";

const MainLayout = () => {
    return (
        <div className="flex  min-h-screen bg-white w-full">

            <Sidebar >
                <div className="h-full ">
                    <Outlet />
                </div>
            </Sidebar>


            <ChatBody />


        </div>
    );
};


export default MainLayout