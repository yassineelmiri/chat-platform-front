
import React from 'react';
import { FaVideo, FaVideoSlash, FaMicrophone, FaMicrophoneSlash, FaPhoneSlash } from "react-icons/fa";

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
        <div className="flex justify-center items-center gap-8 bg-white p-4 rounded-lg shadow-lg">
            {isVideo && (
                <button
                    onClick={onToggleVideo}
                    className={`flex flex-col items-center transition-colors ${
                        isVideoOff ? 'text-red-500' : 'text-blue-500'
                    } hover:opacity-80`}
                >
                    {isVideoOff ? (
                        <>
                            <FaVideoSlash size={24} className="mb-1" />
                            <span className="text-xs">Turn On Camera</span>
                        </>
                    ) : (
                        <>
                            <FaVideo size={24} className="mb-1" />
                            <span className="text-xs">Turn Off Camera</span>
                        </>
                    )}
                </button>
            )}

            <button
                onClick={onToggleAudio}
                className={`flex flex-col items-center transition-colors ${
                    isMuted ? 'text-red-500' : 'text-blue-500'
                } hover:opacity-80`}
            >
                {isMuted ? (
                    <>
                        <FaMicrophoneSlash size={24} className="mb-1" />
                        <span className="text-xs">Unmute</span>
                    </>
                ) : (
                    <>
                        <FaMicrophone size={24} className="mb-1" />
                        <span className="text-xs">Mute</span>
                    </>
                )}
            </button>

            <button
                onClick={onEndCall}
                className="flex flex-col items-center text-red-500 hover:opacity-80 transition-colors"
            >
                <FaPhoneSlash size={24} className="mb-1" />
                <span className="text-xs">End Call</span>
            </button>
        </div>
    );
};

export default CallControls;