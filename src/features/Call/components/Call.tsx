import React, { useEffect, useRef, useState } from 'react';
import CallControls from './CallControls';
import socket from '../../../utils/socket';

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
    videoOff?: boolean;
}

const configuration = {
    iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        // Add your TURN servers here if needed
    ],
};

const Call: React.FC<CallProps> = ({ chatId, type, onClose }) => {
    const [participants, setParticipants] = useState<Map<string, Participant>>(new Map());
    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOff, setIsVideoOff] = useState(false);
    const localStreamRef = useRef<MediaStream | null>(null);
    const peerConnections = useRef<Map<string, RTCPeerConnection>>(new Map());

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

            // Handle incoming tracks
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
            } catch (error) {
                console.error('Error accessing media devices:', error);
                onClose(); // Close call on error
            }
        };

        initializeMedia();

        // Socket event listeners
        socket.on('userJoinedCall', async ({ userId, username }) => {
            console.log('User joined:', userId, username);
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

            // Create peer connection and send offer
            try {
                const peerConnection = await createPeerConnection(userId);
                const offer = await peerConnection.createOffer();
                await peerConnection.setLocalDescription(offer);
                socket.emit('offer', { chatId, targetUserId: userId, offer });
            } catch (error) {
                console.error('Error creating offer:', error);
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

        socket.on('userLeftCall', ({ userId }) => {
            // Clean up peer connection
            const peerConnection = peerConnections.current.get(userId);
            if (peerConnection) {
                peerConnection.close();
                peerConnections.current.delete(userId);
            }

            // Remove participant
            setParticipants(prev => {
                const updated = new Map(prev);
                updated.delete(userId);
                return updated;
            });
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

    const renderParticipant = (participant: Participant) => {
        const { userId, username, stream, muted, videoOff } = participant;
        const isLocalUser = userId === socket.id || userId.startsWith('local-');

        return (
            <div key={userId} className="relative">
                {type === 'video' ? (
                    <>
                        <video
                            ref={el => {
                                if (el) el.srcObject = stream || null;
                            }}
                            autoPlay
                            playsInline
                            muted={isLocalUser || muted}
                            className={`w-full rounded-lg ${videoOff ? 'hidden' : ''}`}
                        />
                        {videoOff && (
                            <div className="w-full h-full bg-gray-800 rounded-lg flex items-center justify-center">
                                <span className="text-white text-xl">{username}</span>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="w-full h-32 bg-gray-800 rounded-lg flex items-center justify-center">
                        <span className="text-white text-xl">{username}</span>
                    </div>
                )}
                <div className="absolute bottom-2 left-2 flex items-center gap-2">
                    <span className="bg-black bg-opacity-50 text-white px-2 py-1 rounded">
                        {username}
                    </span>
                    {muted && (
                        <span className="bg-red-500 bg-opacity-75 text-white px-2 py-1 rounded">
                            🎤
                        </span>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex flex-col">
            <div className="flex-1 p-4">
                <div className={`grid gap-4 h-full ${participants.size > 1 ? 'grid-cols-2' : 'grid-cols-1'
                    }`}>
                    {Array.from(participants.values()).map(renderParticipant)}
                </div>
            </div>

            <div className="p-4">
                <CallControls
                    isVideo={type === 'video'}
                    isMuted={isMuted}
                    isVideoOff={isVideoOff}
                    onToggleAudio={handleToggleAudio}
                    onToggleVideo={handleToggleVideo}
                    onEndCall={onClose}
                />
            </div>
        </div>
    );
};

export default Call;