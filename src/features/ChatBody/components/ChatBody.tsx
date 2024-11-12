import React, { useMemo, useState, useEffect } from "react";
import EmptyState from "../../../components/EmptyState";
import Header from "./Header";
import MessageForm from "./MessageForm";
import MessageBody from "./MessageBody";
import useChatBody from "../hooks/useChatBody";
import { FaPhone, FaVideo } from "react-icons/fa";
import Call from "../../Call/components/Call";
import CallNotification from "../../Call/components/CallNotification";
import useCallState from "../../Call/hooks/useCallState";


// ChatBody.tsx
const ChatBody: React.FC = () => {
    const { isOpen, chatId, chatData, isLoading, error } = useChatBody();
    const chat = useMemo(() => chatData, [chatData, chatId]);

    const {
        activeCall,
        incomingCall,
        isCallInitiating,
        handleStartCall,
        handleAcceptCall,
        handleEndCall,
        handleRejectCall
    } = useCallState(chatId);

    if (!chatId) {
        return (
            <div className="lg:pl-80 h-full w-full">
                <div className="flex flex-col h-full">
                    <EmptyState />
                </div>
            </div>
        );
    }

    if (isLoading) return <div className="lg:pl-80 h-full w-full flex items-center justify-center">Loading...</div>;
    if (error) return <div className="lg:pl-80 h-full w-full flex items-center justify-center text-red-500">Error: {error instanceof Error ? error.message : "Unknown error"}</div>;
    if (!chatData) return null;

    return (
        <div className="lg:pl-80 h-full w-full">
            <div className="flex flex-col justify-between flex-1 h-full flex-grow bg-[#DBEAFE] w-full">
                {chat && <Header chat={chat} />}
                <MessageBody />
                <div className="flex gap-2 p-4">
                    <button
                        onClick={() => handleStartCall('audio')}
                        disabled={isCallInitiating || !!activeCall}
                        className={`flex items-center gap-2 px-4 py-2 rounded transition-colors ${isCallInitiating || activeCall
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-blue-500 hover:bg-blue-600'
                            } text-white`}
                    >
                        <FaPhone /> Audio Call
                    </button>
                    <button
                        onClick={() => handleStartCall('video')}
                        disabled={isCallInitiating || !!activeCall}
                        className={`flex items-center gap-2 px-4 py-2 rounded transition-colors ${isCallInitiating || activeCall
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-blue-500 hover:bg-blue-600'
                            } text-white`}
                    >
                        <FaVideo /> Video Call
                    </button>
                </div>

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

                <MessageForm />
            </div>
        </div>
    );
};

export default ChatBody;