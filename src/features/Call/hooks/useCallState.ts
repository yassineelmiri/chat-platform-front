import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import socket from '../../../utils/socket';

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

const useCallState = (chatId: string | null) => {
    const [activeCall, setActiveCall] = useState<ActiveCall | null>(null);
    const [incomingCall, setIncomingCall] = useState<IncomingCall | null>(null);
    const [isCallInitiating, setIsCallInitiating] = useState(false);

    useEffect(() => {
        const handleIncomingCall = (data: IncomingCall) => { // here litsen on Incoming call
            console.log('Incoming call:', data);
            if (activeCall) { // if already in call dreject incom call automaticly
                socket.emit('rejectCall', {
                    chatId: data.chatId,
                    callerId: data.callerId,
                    reason: 'busy'
                });
                return;
            }
            setIncomingCall(data); // save data comes from backend 
        };



        // all these func  excute with socket and get thier dat from socketio
        // this if excute tell us that user we send call he is  accept call  
        const handleCallAccepted = (data: { userId: string; username: string }) => {
            console.log('Call accepted by:', data.username);
            setIsCallInitiating(false);
            toast.success(`${data.username} joined the call`);
        };
        // this if excute tell us that user we send call he is reject call  
        const handleCallRejected = (data: { userId: string; username: string; reason?: string }) => {
            console.log('Call rejected by:', data.username);
            setIsCallInitiating(false);
            setActiveCall(null);
            toast.error(`${data.username} ${data.reason === 'busy' ? 'is busy' : 'rejected the call'}`);
        };

        // this if excute tell us that user  inside call chat he leave cll
        const handleCallEnded = (data: { userId: string; username: string }) => {
            console.log('Call ended by:', data.username);
            setActiveCall(null);
            toast.success(`${data.username} ended the call`);
        };


        // this if excute tell us that user try to join call but he got error
        const handleCallError = (error: { message: string }) => {
            console.error('Call error:', error);
            setIsCallInitiating(false);
            setActiveCall(null);
            toast.error(`Call error: ${error.message}`);
        };


        // listeners socket io
        socket.on('incomingCall', handleIncomingCall);
        socket.on('callAccepted', handleCallAccepted);
        socket.on('callRejected', handleCallRejected);
        socket.on('callEnded', handleCallEnded);
        socket.on('callError', handleCallError);

        return () => {
            socket.off('incomingCall', handleIncomingCall);
            socket.off('callAccepted', handleCallAccepted);
            socket.off('callRejected', handleCallRejected);
            socket.off('callEnded', handleCallEnded);
            socket.off('callError', handleCallError);
        };
    }, [activeCall]);


    // this func handle if you want start call chat weather audio or vidoe
    const handleStartCall = async (type: 'video' | 'audio') => {
        if (!chatId) return;

        try {
            // here we verify if user have media audi ,,,
            if (!navigator.mediaDevices?.getUserMedia) {
                throw new Error('Your browser does not support video/audio calls');
            }

            setIsCallInitiating(true);

            // get  permss from browseer to use camera and audio
            await navigator.mediaDevices.getUserMedia({
                video: type === 'video',
                audio: true,
            });


            //send event to all users inside same chat
            socket.emit('initiateCall', { chatId, type });
            setActiveCall({ type, chatId });
            toast.success('Initiating call...');
        } catch (error) {
            console.error('Error starting call:', error);
            setIsCallInitiating(false);
            toast.error(error instanceof Error ? error.message : 'Failed to start call');
        }
    };


    // thi use to accept incoming calls
    const handleAcceptCall = async () => {
        if (!incomingCall) return;

        try {
            // get  permss from browseer to use camera and audio
            await navigator.mediaDevices.getUserMedia({
                video: incomingCall.type === 'video',
                audio: true,
            });

            // send event to socket tha we accept chat call
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

    // send event to socket that we end call
    const handleEndCall = () => {
        if (activeCall) {
            socket.emit('leaveCall', { chatId: activeCall.chatId });
            setActiveCall(null);
            toast.success('Call ended');
        }
    };

    // send event to socket that we reject call
    const handleRejectCall = () => {
        if (incomingCall) {
            socket.emit('rejectCall', {
                chatId: incomingCall.chatId,
                callerId: incomingCall.callerId,
            });
            setIncomingCall(null);
        }
    };

    return {
        activeCall,
        incomingCall,
        isCallInitiating,
        handleStartCall,
        handleAcceptCall,
        handleEndCall,
        handleRejectCall
    };
};

export default useCallState;