import React from 'react';
import { FaMicrophone, FaMicrophoneSlash, FaVideo, FaVideoSlash, FaPhone } from 'react-icons/fa';

interface CallControlsProps {
    isVideo: boolean;
    isMuted: boolean;
    isVideoOff: boolean;
    onToggleAudio: () => void;
    onToggleVideo: () => void;
    onEndCall: () => void;
}

const CallControls: React.FC<CallControlsProps> = ({
    isVideo,
    isMuted,
    isVideoOff,
    onToggleAudio,
    onToggleVideo,
    onEndCall
}) => {
    return (
        <div className="flex items-center justify-center gap-4 p-4 bg-gray-800 rounded-lg">
            <button
                onClick={onToggleAudio}
                className={`p-3 rounded-full transition-colors ${
                    isMuted ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-600 hover:bg-gray-700'
                }`}
            >
                {isMuted ? <FaMicrophoneSlash /> : <FaMicrophone />}
            </button>

            {isVideo && (
                <button
                    onClick={onToggleVideo}
                    className={`p-3 rounded-full transition-colors ${
                        isVideoOff ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-600 hover:bg-gray-700'
                    }`}
                >
                    {isVideoOff ? <FaVideoSlash /> : <FaVideo />}
                </button>
            )}

            <button
                onClick={onEndCall}
                className="p-3 rounded-full bg-red-500 hover:bg-red-600 transition-colors"
            >
                <FaPhone className="transform rotate-135" />
            </button>
        </div>
    );
};

export default CallControls;