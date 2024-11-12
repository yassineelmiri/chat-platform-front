
import { HiChevronLeft } from 'react-icons/hi'
import { HiEllipsisHorizontal } from 'react-icons/hi2';
import { useMemo, useState } from "react";

import useOtherUser from '../../../hooks/useOtherUser';
import ProfileDrawer from '../../../components/ProfileDrawer';
import { Link } from 'react-router-dom';
import AvatarGroup from '../../../components/AvatarGroup';
import Avatar from '../../../components/Avatar';
import { Chat } from '../../../types/chat';
import { FaPhone, FaSearch, FaVideo } from 'react-icons/fa';
import useCallState from '../../Call/hooks/useCallState';
import CallControls from '../../Call/components/CallControls';
import CallNotification from '../../Call/components/CallNotification';
import toast from 'react-hot-toast';
import Call from '../../Call/components/Call';



interface HeaderProps {
    chat: Chat
}

const Header: React.FC<HeaderProps> = ({ chat }) => {
    const otherUser = useOtherUser(chat.members);
    const [drawerOpen, setDrawerOpen] = useState(false);

    if (!chat._id) return toast.error('chat id required')

    const {
        activeCall,
        incomingCall,
        isCallInitiating,
        handleStartCall,
        handleAcceptCall,
        handleEndCall,
        handleRejectCall
    } = useCallState(chat._id);


    const statusText = useMemo(() => {
        if (chat.isGroup) {
            return `${chat.members.length} members`;
        }

        return 'Active'
    }, [chat]);

    return (
        <>
            <ProfileDrawer
                chat={chat}
                isOpen={drawerOpen}
                onClose={() => setDrawerOpen(false)}
            />
          {activeCall && (
                    <Call
                        chatId={activeCall.chatId}
                        type={activeCall.type}
                        onClose={handleEndCall}
                    />
                )}

            {incomingCall && (
                <CallNotification
                    callerName={incomingCall.callerName}
                    callType={incomingCall.type}
                    onAccept={handleAcceptCall}
                    onReject={handleRejectCall}
                />
            )}

            <div
                className="
        bg-white 
        w-full 
        flex 
        border-b-[1px] 
        sm:px-4 
        py-3 
        px-4 
        lg:px-6 
        justify-between 
        items-center 
        shadow-sm
      "
            >
                <div className="flex gap-3 items-center">
                    <Link
                        to="/chat"
                        className="
            lg:hidden 
            block 
            text-sky-500 
            hover:text-sky-600 
            transition 
            cursor-pointer
          "
                    >
                        <HiChevronLeft size={32} />
                    </Link>
                    {chat.isGroup ? (
                        <AvatarGroup users={chat.members} />
                    ) : (
                        <Avatar user={otherUser} />
                    )}
                    <div className="flex flex-col">
                        <div>{chat.name || otherUser?.username}</div>
                        <div className="text-sm text-gray-500">{statusText}</div>
                    </div>
                </div>
                <div className="flex items-center gap-4">


                    <button
                        onClick={() => handleStartCall('audio')}
                        disabled={isCallInitiating || !!activeCall}
                        className={`flex items-center gap-2 px-4 py-2 rounded transition-colors ${isCallInitiating || activeCall
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-blue-500 hover:bg-blue-600'
                            } text-white`}
                    >
                        <FaPhone />
                    </button>


                    <button
                        onClick={() => handleStartCall('video')}
                        disabled={isCallInitiating || !!activeCall}
                        className={`flex items-center gap-2 px-4 py-2 rounded transition-colors ${isCallInitiating || activeCall
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-blue-500 hover:bg-blue-600'
                            } text-white`}
                    >
                        <FaVideo />
                    </button>
                    <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                        <FaSearch className="w-5 h-5 text-gray-600" />
                    </button>

                    <HiEllipsisHorizontal
                        size={32}
                        onClick={() => setDrawerOpen(true)}
                        className="
          text-sky-500
          cursor-pointer
          hover:text-sky-600
          transition
        "
                    />
                </div>

            </div >

        </>
    );
}

export default Header;