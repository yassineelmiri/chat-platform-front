// components/Call/ParticipantGrid.tsx
import React from 'react';
import { Participant } from './Call';

interface ParticipantGridProps {
    participants: Map<string, Participant>;
    type: 'video' | 'audio';
}

const ParticipantGrid: React.FC<ParticipantGridProps> = ({ participants, type }) => {
    const renderParticipant = (participant: Participant) => {
        const { userId, username, stream, muted, videoOff } = participant;

        return (
            <div key={userId} className="w-50 h-50 overflow-hidden border-2 border-gray-300 relative">
                {type === 'video' ? (
                    <>
                        <video
                            ref={el => {
                                if (el) el.srcObject = stream || null;
                            }}
                            autoPlay
                            playsInline
                            muted={muted}
                            className={`w-full h-full object-cover ${videoOff ? 'hidden' : ''}`}
                        />
                        {videoOff && (
                            <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
                                <span className="text-white text-lg">{username}</span>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
                        <span className="text-white text-lg">{username}</span>
                    </div>
                )}
                <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
                    <span className="bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
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
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5 mb-4">
            {Array.from(participants.values()).map(renderParticipant)}
        </div>
    );
};

export default ParticipantGrid;