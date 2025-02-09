
import React from 'react';
import { FaMicrophone, FaMicrophoneSlash, FaVideo, FaVideoSlash, FaPhone } from 'react-icons/fa';
import { useCall } from '../../../providers/CallProvider';

interface CallControlsProps {
    isVideo: boolean;
    isMuted: boolean;
    isVideoOff: boolean;
    onToggleAudio: () => void;
    onToggleVideo: () => void;
}

const CallControls: React.FC<CallControlsProps> = ({
    isVideo,
    isMuted,
    isVideoOff,
    onToggleAudio,
    onToggleVideo,
}) => {
    const { endCall } = useCall();

    return (
        <div className="flex items-center justify-center gap-4 p-4 bg-gray-800 bg-opacity-90 rounded-lg backdrop-blur-sm">
            <button
                onClick={onToggleAudio}
                className={`p-4 rounded-full transition-all transform hover:scale-110
                    ${isMuted ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-600 hover:bg-gray-700'}`}
            >
                {isMuted ? 
                    <FaMicrophoneSlash className="text-white text-xl" /> : 
                    <FaMicrophone className="text-white text-xl" />
                }
            </button>

            {isVideo && (
                <button
                    onClick={onToggleVideo}
                    className={`p-4 rounded-full transition-all transform hover:scale-110
                        ${isVideoOff ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-600 hover:bg-gray-700'}`}
                >
                    {isVideoOff ? 
                        <FaVideoSlash className="text-white text-xl" /> : 
                        <FaVideo className="text-white text-xl" />
                    }
                </button>
            )}

            <button
                onClick={endCall}
                className="p-4 rounded-full bg-red-500 hover:bg-red-600 transition-all transform hover:scale-110"
            >
                <FaPhone className="text-white text-xl transform rotate-135" />
            </button>
        </div>
    );
};

export default CallControls;