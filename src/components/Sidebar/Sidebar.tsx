import { useSocket } from "../../providers/SocketProvider";
import DesktopSidebar from "./DesktopSidebar";
import MobileFooter from "./MobileFooter";



function Sidebar({ children }: {
    children?: React.ReactNode,
}) {
    const { socket, onlineUsers, isConnected } = useSocket();

    return (
        <div className="h-full">
            {isConnected ? 'Connected' : 'Disconnected'}

            <DesktopSidebar />
            <MobileFooter />
            <main className="lg:pl-20 h-full">
                {children}
            </main>
        </div>
    )
}

export default Sidebar;