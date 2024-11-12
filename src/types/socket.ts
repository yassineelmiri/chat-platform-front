
export interface CallEvents {
    'userJoinedCall': (data: { userId: string; username: string }) => void;
    'offer': (data: { userId: string; offer: RTCSessionDescriptionInit }) => void;
    'answer': (data: { userId: string; answer: RTCSessionDescriptionInit }) => void;
    'ice-candidate': (data: { userId: string; candidate: RTCIceCandidateInit }) => void;
    'userLeftCall': (data: { userId: string; username: string }) => void;
    'participantToggleAudio': (data: { userId: string; muted: boolean }) => void;
    'participantToggleVideo': (data: { userId: string; videoOff: boolean }) => void;
}

export interface CallEmitEvents {
    'initiateCall': (data: { chatId: string; type: 'video' | 'audio' }) => void;
    'joinCall': (data: { chatId: string }) => void;
    'leaveCall': (data: { chatId: string }) => void;
    'offer': (data: { chatId: string; targetUserId: string; offer: RTCSessionDescriptionInit }) => void;
    'answer': (data: { chatId: string; targetUserId: string; answer: RTCSessionDescriptionInit }) => void;
    'ice-candidate': (data: { chatId: string; targetUserId: string; candidate: RTCIceCandidateInit }) => void;
    'toggleAudio': (data: { chatId: string; muted: boolean }) => void;
    'toggleVideo': (data: { chatId: string; videoOff: boolean }) => void;
}