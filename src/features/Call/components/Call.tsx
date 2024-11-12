
import React, { useEffect, useRef, useState } from 'react';
import { FaVideo, FaMicrophoneSlash, FaPhoneSlash } from "react-icons/fa";
import socket from '../../../utils/socket';
import { toast } from 'react-hot-toast';
import ParticipantGrid from './ParticipantGrid';
import ConnectedUsers from './ConnectedUsers';

interface CallProps {
    chatId: string;
    type: 'video' | 'audio';
    onClose: () => void;
}

export interface Participant {
    userId: string;
    username: string;
    stream?: MediaStream;
    muted: boolean;
    videoOff?: boolean;
}

const configuration = {
    iceServers: [
        { urls: 'stun:stun.l.google.com:19302' }
    ],
};

const Call: React.FC<CallProps> = ({ chatId, type, onClose }) => {
    const [participants, setParticipants] = useState<Map<string, Participant>>(new Map());
    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOff, setIsVideoOff] = useState(false);
    const [isConnecting, setIsConnecting] = useState(true);
    const localStreamRef = useRef<MediaStream | null>(null);
    const peerConnections = useRef<Map<string, RTCPeerConnection>>(new Map());

    const createPeerConnection = async (targetUserId: string) => {
        try {
            const peerConnection = new RTCPeerConnection(configuration);

            if (localStreamRef.current) {
                localStreamRef.current.getTracks().forEach(track => {
                    if (localStreamRef.current) {
                        peerConnection.addTrack(track, localStreamRef.current);
                    }
                });
            }

            peerConnection.onicecandidate = (event) => {
                if (event.candidate) {
                    socket.emit('ice-candidate', {
                        chatId,
                        targetUserId,
                        candidate: event.candidate,
                    });
                }
            };

            peerConnection.ontrack = (event) => {
                const remoteStream = event.streams[0];
                setParticipants(prev => {
                    const updated = new Map(prev);
                    const participant = updated.get(targetUserId);
                    if (participant) {
                        updated.set(targetUserId, {
                            ...participant,
                            stream: remoteStream,
                        });
                    }
                    return updated;
                });
            };

            peerConnection.onconnectionstatechange = () => {
                if (peerConnection.connectionState === 'connected') {
                    setIsConnecting(false);
                }
            };

            peerConnections.current.set(targetUserId, peerConnection);
            return peerConnection;
        } catch (error) {
            console.error('Error creating peer connection:', error);
            throw error;
        }
    };

    useEffect(() => {
        const initializeMedia = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: type === 'video',
                    audio: true,
                });
                localStreamRef.current = stream;

                const localUserId = socket.id || `local-${Date.now()}`;
                const newParticipants = new Map<string, Participant>();
                newParticipants.set(localUserId, {
                    userId: localUserId,
                    username: 'You',
                    stream,
                    muted: false,
                    videoOff: false
                });

                setParticipants(newParticipants);
                setIsConnecting(false);
            } catch (error) {
                console.error('Error accessing media devices:', error);
                toast.error('Failed to access camera/microphone');
                onClose();
            }
        };

        initializeMedia();

        socket.on('userJoinedCall', async ({ userId, username }) => {
            toast.success(`${username} joined the call`);
            setParticipants(prev => {
                const updated = new Map(prev);
                updated.set(userId, {
                    userId,
                    username,
                    muted: false,
                    videoOff: false
                });
                return updated;
            });

            try {
                const peerConnection = await createPeerConnection(userId);
                const offer = await peerConnection.createOffer();
                await peerConnection.setLocalDescription(offer);
                socket.emit('offer', { chatId, targetUserId: userId, offer });
            } catch (error) {
                console.error('Error creating offer:', error);
                toast.error('Failed to connect with new participant');
            }
        });

        socket.on('offer', async ({ userId, offer }) => {
            try {
                const peerConnection = await createPeerConnection(userId);
                await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
                const answer = await peerConnection.createAnswer();
                await peerConnection.setLocalDescription(answer);
                socket.emit('answer', { chatId, targetUserId: userId, answer });
            } catch (error) {
                console.error('Error handling offer:', error);
                toast.error('Failed to connect with participant');
            }
        });

        socket.on('answer', async ({ userId, answer }) => {
            try {
                const peerConnection = peerConnections.current.get(userId);
                if (peerConnection) {
                    await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
                }
            } catch (error) {
                console.error('Error handling answer:', error);
                toast.error('Connection failed');
            }
        });

        socket.on('ice-candidate', async ({ userId, candidate }) => {
            try {
                const peerConnection = peerConnections.current.get(userId);
                if (peerConnection) {
                    await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
                }
            } catch (error) {
                console.error('Error handling ICE candidate:', error);
            }
        });

        socket.on('userLeftCall', ({ userId, username }) => {
            const peerConnection = peerConnections.current.get(userId);
            if (peerConnection) {
                peerConnection.close();
                peerConnections.current.delete(userId);
            }

            setParticipants(prev => {
                const updated = new Map(prev);
                updated.delete(userId);
                return updated;
            });

            toast.error(`${username} left the call`);
        });

        socket.on('participantToggleAudio', ({ userId, muted }) => {
            setParticipants(prev => {
                const updated = new Map(prev);
                const participant = updated.get(userId);
                if (participant) {
                    updated.set(userId, { ...participant, muted });
                }
                return updated;
            });
        });

        socket.on('participantToggleVideo', ({ userId, videoOff }) => {
            setParticipants(prev => {
                const updated = new Map(prev);
                const participant = updated.get(userId);
                if (participant) {
                    updated.set(userId, { ...participant, videoOff });
                }
                return updated;
            });
        });

        return () => {
            localStreamRef.current?.getTracks().forEach(track => track.stop());
            peerConnections.current.forEach(connection => connection.close());
            socket.off('userJoinedCall');
            socket.off('offer');
            socket.off('answer');
            socket.off('ice-candidate');
            socket.off('userLeftCall');
            socket.off('participantToggleAudio');
            socket.off('participantToggleVideo');
        };
    }, [chatId, type]);

    const handleToggleAudio = () => {
        const newMutedState = !isMuted;
        setIsMuted(newMutedState);

        localStreamRef.current?.getAudioTracks().forEach(track => {
            track.enabled = !newMutedState;
        });

        socket.emit('toggleAudio', { chatId, muted: newMutedState });
    };

    const handleToggleVideo = () => {
        if (type === 'video') {
            const newVideoOffState = !isVideoOff;
            setIsVideoOff(newVideoOffState);

            localStreamRef.current?.getVideoTracks().forEach(track => {
                track.enabled = !newVideoOffState;
            });

            socket.emit('toggleVideo', { chatId, videoOff: newVideoOffState });
        }
    };

    const handleEndCall = () => {
        socket.emit('leaveCall', { chatId });
        onClose();
    };

    if (isConnecting) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center">
                <div className="text-white text-xl">
                    Connecting to call...
                </div>
            </div>
        );
    }

    return (
        <div className="fixed flex-wrap justify-around inset-0 flex items-start bg-black bg-opacity-70">
            <div className="bg-white rounded-lg p-6 shadow-lg w-250 mt-6">
                <div className="flex flex-col items-center">
                    <ParticipantGrid
                        participants={participants}
                        type={type}
                    />
                    <h2 className="text-lg font-semibold mt-4">
                        {Array.from(participants.values())
                            .map(p => p.username)
                            .join(', ')}
                    </h2>
                    <span className="text-gray-500">In Call</span>
                </div>

                <div className="mt-6 flex justify-around">
                    <button 
                        onClick={handleToggleVideo}
                        className={`flex flex-col items-center ${
                            isVideoOff ? 'text-red-500' : 'text-blue-500'
                        }`}
                        disabled={type !== 'video'}
                    >
                        <FaVideo size={24} className="mb-1" />
                        <span className="text-xs">Camera</span>
                    </button>
                    <button 
                        onClick={handleToggleAudio}
                        className={`flex flex-col items-center ${
                            isMuted ? 'text-red-500' : 'text-yellow-500'
                        }`}
                    >
                        <FaMicrophoneSlash size={24} className="mb-1" />
                        <span className="text-xs">Mic</span>
                    </button>
                    <button 
                        onClick={handleEndCall}
                        className="flex flex-col items-center text-red-500"
                    >
                        <FaPhoneSlash size={24} className="mb-1" />
                        <span className="text-xs">End Call</span>
                    </button>
                </div>
            </div>

            <ConnectedUsers participants={participants} />
        </div>
    );
};

export default Call;