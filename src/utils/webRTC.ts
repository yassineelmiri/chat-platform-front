// src/features/Call/utils/webRTC.ts
export const RTCConfig = {
    iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
        { urls: 'stun:stun2.l.google.com:19302' },
    ],
};

export const getMediaConstraints = (type: 'video' | 'audio') => ({
    audio: true,
    video: type === 'video' ? {
        width: { ideal: 1280 },
        height: { ideal: 720 },
        facingMode: 'user'
    } : false
});