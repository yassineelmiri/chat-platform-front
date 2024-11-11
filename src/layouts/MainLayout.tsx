import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar/Sidebar";
import ChatBody from "../features/chats/components/ChatBody";

const MainLayout = () => {
    return (
        <div className="flex  min-h-screen bg-white">

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