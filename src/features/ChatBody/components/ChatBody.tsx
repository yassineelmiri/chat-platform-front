import React, { useMemo, useState, useEffect } from "react";
import EmptyState from "../../../components/EmptyState";
import Header from "./Header";
import MessageForm from "./MessageForm";
import MessageBody from "./MessageBody";
import useChatBody from "../hooks/useChatBody";
import socket from "../../../utils/socket";
import { FaPhone, FaVideo } from "react-icons/fa";
import Call from "../../Call/components/Call";
import CallNotification from "../../Call/components/CallNotification";
import { toast } from "react-hot-toast";

interface ActiveCall {
    type: 'video' | 'audio';
    chatId: string;
}

interface IncomingCall {
    callerId: string;
    callerName: string;
    type: 'video' | 'audio';
    chatId: string;
}

const ChatBody: React.FC = () => {
    const { isOpen, chatId, chatData, isLoading, error } = useChatBody();
    const chat = useMemo(() => chatData, [chatData, chatId]);

    const [activeCall, setActiveCall] = useState<ActiveCall | null>(null);
    const [incomingCall, setIncomingCall] = useState<IncomingCall | null>(null);
    const [isCallInitiating, setIsCallInitiating] = useState(false);

    useEffect(() => {

        // here i Handle incoming calls
        const handleIncomingCall = (data: IncomingCall) => {
            console.log('Incoming call:', data);
            // If already in a call  automatically reject
            if (activeCall) {
                socket.emit('rejectCall', {
                    chatId: data.chatId,
                    callerId: data.callerId,
                    reason: 'busy'
                });
                return;
            }
            setIncomingCall(data);
            // TODO :i will  Play sound notification here if needed

        };

        // handle call accepted
        const handleCallAccepted = (data: { userId: string; username: string }) => {
            console.log('Call accepted by:', data.username);
            setIsCallInitiating(false);
            toast.success(`${data.username} joined the call`);
        };

        // handle call rejected
        const handleCallRejected = (data: { userId: string; username: string; reason?: string }) => {
            console.log('Call rejected by:', data.username);
            setIsCallInitiating(false);
            setActiveCall(null);
            toast.error(`${data.username} ${data.reason === 'busy' ? 'is busy' : 'rejected the call'}`);
        };

        // handle call ended
        const handleCallEnded = (data: { userId: string; username: string }) => {
            console.log('Call ended by:', data.username);
            setActiveCall(null);
            toast.success(`${data.username} ended the call`);
        };

        // handle connection errors
        const handleCallError = (error: { message: string }) => {
            console.error('Call error:', error);
            setIsCallInitiating(false);
            setActiveCall(null);
            toast.error(`Call error: ${error.message}`);
        };

        // here i subscribe to events sockt
        socket.on('incomingCall', handleIncomingCall);
        socket.on('callAccepted', handleCallAccepted);
        socket.on('callRejected', handleCallRejected);
        socket.on('callEnded', handleCallEnded);
        socket.on('callError', handleCallError);

        // cleanup
        return () => {
            socket.off('incomingCall', handleIncomingCall);
            socket.off('callAccepted', handleCallAccepted);
            socket.off('callRejected', handleCallRejected);
            socket.off('callEnded', handleCallEnded);
            socket.off('callError', handleCallError);
        };
    }, [activeCall]);




    const handleStartCall = async (type: 'video' | 'audio') => {
        try {
            // check if browser supports getUserMedia <webrtc>
            if (!navigator.mediaDevices?.getUserMedia) {
                throw new Error('Your browser does not support video/audio calls');
            }

            setIsCallInitiating(true);

            // request permissions before initiating call
            await navigator.mediaDevices.getUserMedia({
                video: type === 'video',
                audio: true,
            });

            socket.emit('initiateCall', { chatId, type });
            setActiveCall({ type, chatId });
            toast.success('Initiating call...');
        } catch (error) {
            console.error('Error starting call:', error);
            setIsCallInitiating(false);
            toast.error(error instanceof Error ? error.message : 'Failed to start call');
        }
    };

    const handleAcceptCall = async () => {
        if (!incomingCall) return;

        try {
            // check permissions before accepting
            await navigator.mediaDevices.getUserMedia({
                video: incomingCall.type === 'video',
                audio: true,
            });

            socket.emit('acceptCall', {
                chatId: incomingCall.chatId,
                callerId: incomingCall.callerId,
            });

            setActiveCall({
                type: incomingCall.type,
                chatId: incomingCall.chatId
            });
            setIncomingCall(null);
        } catch (error) {
            console.error('Error accepting call:', error);
            toast.error('Failed to accept call: Please check your camera/microphone permissions');

            socket.emit('rejectCall', {
                chatId: incomingCall.chatId,
                callerId: incomingCall.callerId,
                reason: 'permission_denied'
            });
            setIncomingCall(null);
        }
    };

    const handleEndCall = () => {
        if (activeCall) {
            socket.emit('leaveCall', { chatId: activeCall.chatId });
            setActiveCall(null);
            toast.success('Call ended');
        }
    };

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
                        onReject={() => {
                            socket.emit('rejectCall', {
                                chatId: incomingCall.chatId,
                                callerId: incomingCall.callerId,
                            });
                            setIncomingCall(null);
                        }}
                    />
                )}

                <MessageForm />
            </div>
        </div>
    );
};

export default ChatBody;