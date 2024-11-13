import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { useSocket } from './SocketProvider';
import Call from '../features/Call/components/Call';
import CallNotification from '../features/Call/components/CallNotification';

// Types and Interfaces
interface ActiveCall {
    type: 'video' | 'audio';
    chatId: string;
    participants?: Map<string, {
        userId: string;
        username: string;
        stream?: MediaStream;
        muted: boolean;
        videoOff: boolean;
    }>;
}

interface IncomingCall {
    callerId: string;
    callerName: string;
    type: 'video' | 'audio';
    chatId: string;
}

interface CallContextType {
    initiateCall: (chatId: string, type: 'video' | 'audio') => Promise<void>;
    acceptCall: (callData?: IncomingCall) => Promise<void>;
    rejectCall: (chatId: string, callerId: string) => void;
    endCall: () => void;
    isCallInitiating: boolean;
    activeCall: ActiveCall | null;
    incomingCall: IncomingCall | null;
    localStream: MediaStream | null;
}

const CallContext = createContext<CallContextType | undefined>(undefined);

export const CallProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { socket } = useSocket();
    const [activeCall, setActiveCall] = useState<ActiveCall | null>(null);
    const [incomingCall, setIncomingCall] = useState<IncomingCall | null>(null);
    const [isCallInitiating, setIsCallInitiating] = useState(false);
    const [localStream, setLocalStream] = useState<MediaStream | null>(null);

    // Cleanup function for media streams
    const cleanupMediaStream = useCallback(() => {
        if (localStream) {
            localStream.getTracks().forEach(track => track.stop());
            setLocalStream(null);
        }
    }, [localStream]);

    // Request media permissions
    const requestMediaPermissions = async (type: 'video' | 'audio'): Promise<MediaStream> => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: type === 'video',
                audio: true,
            });
            setLocalStream(stream);
            return stream;
        } catch (error) {
            console.error('Media permission error:', error);
            throw new Error('Failed to access camera/microphone. Please check permissions.');
        }
    };

    // Handle incoming calls
    useEffect(() => {
        const handleIncomingCall = async (data: IncomingCall) => {
            console.log('Incoming call:', data);
            
            // Reject if already in a call
            if (activeCall) {
                socket.emit('rejectCall', {
                    chatId: data.chatId,
                    callerId: data.callerId,
                    reason: 'busy'
                });
                return;
            }

            try {
                // Request permissions before showing notification
                await requestMediaPermissions(data.type);
                setIncomingCall(data);

                toast.custom(
                    (t) => (
                        <CallNotification
                            callerName={data.callerName}
                            callType={data.type}
                            onAccept={() => {
                                toast.dismiss(t.id);
                                acceptCall(data);
                            }}
                            onReject={() => {
                                toast.dismiss(t.id);
                                rejectCall(data.chatId, data.callerId);
                            }}
                        />
                    ),
                    {
                        duration: 30000,
                        position: 'top-center',
                    }
                );
            } catch (error) {
                console.error('Permission error:', error);
                socket.emit('rejectCall', {
                    chatId: data.chatId,
                    callerId: data.callerId,
                    reason: 'permission_denied'
                });
                toast.error('Please allow camera/microphone access to receive calls');
            }
        };

        const handleCallAccepted = (data: { userId: string; username: string }) => {
            console.log('Call accepted by:', data.username);
            setIsCallInitiating(false);
            toast.success(`${data.username} joined the call`);
        };

        const handleCallRejected = (data: { userId: string; username: string; reason?: string }) => {
            console.log('Call rejected by:', data.username);
            setIsCallInitiating(false);
            setActiveCall(null);
            cleanupMediaStream();
            toast.error(`${data.username} ${data.reason === 'busy' ? 'is busy' : 'rejected the call'}`);
        };

        const handleCallEnded = (data: { userId: string; username: string }) => {
            console.log('Call ended by:', data.username);
            setActiveCall(null);
            cleanupMediaStream();
            toast.success(`${data.username} ended the call`);
        };

        const handleCallError = (error: { message: string }) => {
            console.error('Call error:', error);
            setIsCallInitiating(false);
            setActiveCall(null);
            cleanupMediaStream();
            toast.error(`Call error: ${error.message}`);
        };

        // Socket event listeners
        socket.on('incomingCall', handleIncomingCall);
        socket.on('callAccepted', handleCallAccepted);
        socket.on('callRejected', handleCallRejected);
        socket.on('callEnded', handleCallEnded);
        socket.on('callError', handleCallError);

        // Cleanup listeners
        return () => {
            socket.off('incomingCall', handleIncomingCall);
            socket.off('callAccepted', handleCallAccepted);
            socket.off('callRejected', handleCallRejected);
            socket.off('callEnded', handleCallEnded);
            socket.off('callError', handleCallError);
            cleanupMediaStream();
        };
    }, [socket, activeCall, cleanupMediaStream]);

    const initiateCall = async (chatId: string, type: 'video' | 'audio') => {
        if (!chatId) {
            toast.error('Invalid chat ID');
            return;
        }

        try {
            setIsCallInitiating(true);

            // Check browser support
            if (!navigator.mediaDevices?.getUserMedia) {
                throw new Error('Your browser does not support video/audio calls');
            }

            // Request permissions and get stream
            await requestMediaPermissions(type);

            // Emit socket event to initiate call
            socket.emit('initiateCall', { chatId, type });
            
            // Set active call state
            setActiveCall({ type, chatId });
            toast.success('Initiating call...');
        } catch (error) {
            console.error('Error starting call:', error);
            setIsCallInitiating(false);
            cleanupMediaStream();
            toast.error(error instanceof Error ? error.message : 'Failed to start call');
        }
    };

    const acceptCall = async (callData?: IncomingCall) => {
        const callToAccept = callData || incomingCall;
        if (!callToAccept) {
            console.error('No call to accept');
            return;
        }

        try {
            // Ensure we have media permissions
            if (!localStream) {
                await requestMediaPermissions(callToAccept.type);
            }

            // Emit socket event to accept call
            socket.emit('acceptCall', {
                chatId: callToAccept.chatId,
                callerId: callToAccept.callerId,
            });

            // Update call state
            setActiveCall({
                type: callToAccept.type,
                chatId: callToAccept.chatId
            });
            setIncomingCall(null);
        } catch (error) {
            console.error('Error accepting call:', error);
            toast.error('Failed to accept call: Please check your camera/microphone permissions');

            socket.emit('rejectCall', {
                chatId: callToAccept.chatId,
                callerId: callToAccept.callerId,
                reason: 'permission_denied'
            });
            setIncomingCall(null);
            cleanupMediaStream();
        }
    };

    const rejectCall = (chatId: string, callerId: string) => {
        socket.emit('rejectCall', { chatId, callerId });
        setIncomingCall(null);
        cleanupMediaStream();
    };

    const endCall = () => {
        if (activeCall) {
            socket.emit('leaveCall', { chatId: activeCall.chatId });
            setActiveCall(null);
            cleanupMediaStream();
            toast.success('Call ended');
        }
    };

    return (
        <CallContext.Provider
            value={{
                initiateCall,
                acceptCall,
                rejectCall,
                endCall,
                isCallInitiating,
                activeCall,
                incomingCall,
                localStream
            }}
        >
            {children}
            {activeCall && (
                <Call
                    chatId={activeCall.chatId}
                    type={activeCall.type}
                    onClose={endCall}
                />
            )}
        </CallContext.Provider>
    );
};

// Custom hook to use call context
export const useCall = () => {
    const context = useContext(CallContext);
    if (!context) {
        throw new Error('useCall must be used within a CallProvider');
    }
    return context;
};