import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'react-hot-toast';
import CallControls from './CallControls';
import ParticipantGrid from './ParticipantGrid';
import ConnectedUsers from './ConnectedUsers';
import NetworkStatus from './NetworkStatus';
import { FaExpandAlt, FaCompress } from 'react-icons/fa';
import { useSocket } from '../../../providers/SocketProvider';

interface CallProps {
    chatId: string;
    type: 'video' | 'audio';
    onClose: () => void;
}

interface Participant {
    userId: string;
    username: string;
    stream?: MediaStream;
    muted: boolean;
    videoOff: boolean;
}

const Call: React.FC<CallProps> = ({ chatId, type, onClose }) => {
    const { socket } = useSocket();
    const [participants, setParticipants] = useState<Map<string, Participant>>(new Map());
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOff, setIsVideoOff] = useState(false);
    const [isConnecting, setIsConnecting] = useState(true);
    const localStreamRef = useRef<MediaStream | null>(null);
    const peerConnections = useRef<Map<string, RTCPeerConnection>>(new Map());
    const callContainerRef = useRef<HTMLDivElement>(null);

    // WebRTC configuration
    const configuration: RTCConfiguration = {
        iceServers: [
            { urls: 'stun:stun.l.google.com:19302' },
            { urls: 'stun:stun1.l.google.com:19302' },
            { urls: 'stun:stun2.l.google.com:19302' },
        ],
        iceCandidatePoolSize: 10,
    };

    const createPeerConnection = async (targetUserId: string) => {
        try {
            const peerConnection = new RTCPeerConnection(configuration);

            // Add local tracks to the connection
            if (localStreamRef.current) {
                localStreamRef.current.getTracks().forEach(track => {
                    if (localStreamRef.current) {
                        peerConnection.addTrack(track, localStreamRef.current);
                    }
                });
            }

            // Handle ICE candidates
            peerConnection.onicecandidate = (event) => {
                if (event.candidate) {
                    socket.emit('ice-candidate', {
                        chatId,
                        targetUserId,
                        candidate: event.candidate,
                    });
                }
            };

            // Handle incoming tisCallInitiatingracks
            peerConnection.ontrack = (event) => {
                setParticipants(prev => {
                    const updated = new Map(prev);
                    const participant = updated.get(targetUserId);
                    if (participant) {
                        updated.set(targetUserId, {
                            ...participant,
                            stream: event.streams[0],
                        });
                    }
                    return updated;
                });
            };

            // Connection state monitoring
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

    // Initialize media devices and set up socket listeners
    useEffect(() => {
        const initializeCall = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: type === 'video',
                    audio: true,
                });

                localStreamRef.current = stream;
                const localUserId = socket.id;

                setParticipants(new Map([
                    [localUserId, {
                        userId: localUserId,
                        username: 'You',
                        stream,
                        muted: false,
                        videoOff: false,
                    }],
                ]));

                // Socket event listeners
                socket.on('userJoinedCall', async ({ userId, username }) => {
                    try {
                        const peerConnection = await createPeerConnection(userId);
                        const offer = await peerConnection.createOffer();
                        await peerConnection.setLocalDescription(offer);

                        socket.emit('offer', {
                            chatId,
                            targetUserId: userId,
                            offer,
                        });

                        setParticipants(prev => {
                            const updated = new Map(prev);
                            updated.set(userId, {
                                userId,
                                username,
                                muted: false,
                                videoOff: false,
                            });
                            return updated;
                        });

                        toast.success(`${username} joined the call`);
                    } catch (error) {
                        console.error('Error handling user joined:', error);
                        toast.error('Failed to connect with new participant');
                    }
                });

                socket.on('offer', async ({ userId, offer }) => {
                    try {
                        const peerConnection = await createPeerConnection(userId);
                        await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
                        const answer = await peerConnection.createAnswer();
                        await peerConnection.setLocalDescription(answer);

                        socket.emit('answer', {
                            chatId,
                            targetUserId: userId,
                            answer,
                        });
                    } catch (error) {
                        console.error('Error handling offer:', error);
                        toast.error('Failed to establish connection');
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
            } catch (error) {
                console.error('Error initializing call:', error);
                toast.error('Failed to access camera/microphone');
                onClose();
            }
        };

        initializeCall();

        return () => {
            // Cleanup
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
    }, [chatId, type, socket]);

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

    const toggleFullScreen = () => {
        if (!document.fullscreenElement) {
            callContainerRef.current?.requestFullscreen();
            setIsFullScreen(true);
        } else {
            document.exitFullscreen();
            setIsFullScreen(false);
        }
    };

    return (
        <div
            ref={callContainerRef}
            className={`fixed inset-0 bg-gray-900 flex flex-col ${isFullScreen ? 'z-50' : 'z-40'
                }`}
        >
            {/* Header */}
            <div className="flex justify-between items-center p-4 bg-gray-800">
                <h2 className="text-white text-lg font-semibold">
                    {type.charAt(0).toUpperCase() + type.slice(1)} Call
                </h2>
                <button
                    onClick={toggleFullScreen}
                    className="text-white hover:text-gray-300 transition-colors"
                >
                    {isFullScreen ? <FaCompress size={20} /> : <FaExpandAlt size={20} />}
                </button>
            </div>

            {/* Main content */}
            <div className="flex-1 flex overflow-hidden">
                <div className="flex-1 relative">
                    {isConnecting && (
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75">
                            <div className="text-white text-xl">Connecting...</div>
                        </div>
                    )}
                    <ParticipantGrid
                        participants={participants}
                        type={type}
                    />
                    <NetworkStatus
                        peerConnection={peerConnections.current.values().next().value}
                    />
                </div>
                <div className="w-80 bg-gray-800 p-4 overflow-y-auto">
                    <ConnectedUsers
                        participants={participants}
                        type={type}
                    />
                </div>
            </div>

            {/* Controls */}
            <div className="p-4 bg-gray-800">
                <CallControls
                    isVideo={type === 'video'}
                    isMuted={isMuted}
                    isVideoOff={isVideoOff}
                    onToggleAudio={handleToggleAudio}
                    onToggleVideo={handleToggleVideo}
                />
            </div>
        </div>
    );
};

export default Call;