
import React, { useEffect, useRef, useState } from 'react';
import { FaVideo, FaMicrophoneSlash, FaPhoneSlash } from "react-icons/fa";
import socket from '../../../utils/socket';
import { toast } from 'react-hot-toast';
import ParticipantGrid from './ParticipantGrid';
import ConnectedUsers from './ConnectedUsers';
import { useCallModalStore } from '../store/CallModalStore';
import Modal from '../../../components/Modal';

interface CallProps {
    chatId: string;
    type: 'video' | 'audio'; // Type of call (video or audio only)
    onClose: () => void;   // Callback function when call ends
}

//  here i Define interface for call participants
export interface Participant {
    userId: string;
    username: string;
    stream?: MediaStream;
    muted: boolean;
    videoOff?: boolean;
}

// WebRTC configuration for peer connections
//ICE Candidate  = Finding ways to connect <nta fi asfi and fi casa ntla9aw fi marrakch
// we use STUN Server that mean I can send it through the post office if direct delivery doesn't work
const configuration = {
    iceServers: [
        { urls: 'stun:stun.l.google.com:19302' }  //  hada Google public STUN server 
    ],
};

const Call: React.FC<CallProps> = ({ chatId, type, onClose }) => {

    const { closeModal, isModalOpen } = useCallModalStore()

    const [participants, setParticipants] = useState<Map<string, Participant>>(new Map());
    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOff, setIsVideoOff] = useState(false);
    const [isConnecting, setIsConnecting] = useState(true);
    const localStreamRef = useRef<MediaStream | null>(null);
    const peerConnections = useRef<Map<string, RTCPeerConnection>>(new Map());

    // this func to create new WebRTC peer connections
    const createPeerConnection = async (targetUserId: string) => {
        try {

            // Create a new WebRTC connection
            const peerConnection = new RTCPeerConnection(configuration);

            // here we check if we have our own video/audio stream
            if (localStreamRef.current) {
                //if yes  add  all our tracks (video/audio) to the connection
                localStreamRef.current.getTracks().forEach(track => {
                    if (localStreamRef.current) {
                        peerConnection.addTrack(track, localStreamRef.current);
                    }
                });
            }

            //  When we find a way to connect (ICE candidate)
            // Itis like saying
            // hey I found a way we might be able to connect!
            // Here is the address/method we can try
            peerConnection.onicecandidate = (event) => {
                if (event.candidate) {
                    // we seend this connection info to the other user
                    socket.emit('ice-candidate', {
                        chatId,
                        targetUserId,
                        candidate: event.candidate,
                    });
                }
            };


            // here when we receive video/audio tracks from the other user
            peerConnection.ontrack = (event) => {

                // here we get their stream
                const remoteStream = event.streams[0];


                // update our list of participants with their stream
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


            // When connection state changes
            peerConnection.onconnectionstatechange = () => {

                // If we are connected stop showing Load ui state "connecting"
                if (peerConnection.connectionState === 'connected') {
                    setIsConnecting(false);
                }
            };


            // Save this connection in our list
            peerConnections.current.set(targetUserId, peerConnection);
            return peerConnection;
        } catch (error) {
            console.error('Error creating peer connection:', error);
            throw error;
        }
    };


    // this is a main useEffect hook for setting up media and socket listeners
    useEffect(() => {
        // Initialize local media stream
        const initializeMedia = async () => {
            // ... (gets user media and sets up local stream)
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

        //  this is asocket event listeners for handling WebRTC signaling
        // handles new user joining
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
                // here i create a new connection with another user
                const peerConnection = await createPeerConnection(userId);
                // Create an "offer" (like saying hey m i want to connect with you azin)
                const offer = await peerConnection.createOffer();
                // after that we save this offer in our own connection
                await peerConnection.setLocalDescription(offer);

                // and here we send this offer to the other user through socket
                socket.emit('offer', { chatId, targetUserId: userId, offer });
            } catch (error) {

                // if anything goes wrong, show an error message
                console.error('Error creating offer:', error);
                toast.error('Failed to connect with new participant');
            }
        });


        //this handles incoming connection offers
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


        //handles connection answers
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


        //handles ICE candidates
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


        //handles user disconnection
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



    // Handler functions for user interactions
    const handleToggleAudio = () => {


        //toggles audio mute state
        const newMutedState = !isMuted;
        setIsMuted(newMutedState);

        localStreamRef.current?.getAudioTracks().forEach(track => {
            track.enabled = !newMutedState;
        });

        socket.emit('toggleAudio', { chatId, muted: newMutedState });
    };

    const handleToggleVideo = () => {

        //toggles video enabled state
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

        //handles call termination
        socket.emit('leaveCall', { chatId });
        onClose();
    };


    // here i  load state UI
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
        <Modal isOpen={isModalOpen} onClose={closeModal}>

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
                            className={`flex flex-col items-center ${isVideoOff ? 'text-red-500' : 'text-blue-500'
                                }`}
                            disabled={type !== 'video'}
                        >
                            <FaVideo size={24} className="mb-1" />
                            <span className="text-xs">Camera</span>
                        </button>
                        <button
                            onClick={handleToggleAudio}
                            className={`flex flex-col items-center ${isMuted ? 'text-red-500' : 'text-yellow-500'
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
        </Modal>
    );
};

export default Call;