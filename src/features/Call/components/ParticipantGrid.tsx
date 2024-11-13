import React from 'react';
import { FaMicrophoneSlash, FaVideoSlash } from 'react-icons/fa';

interface Participant {
    userId: string;
    username: string;
    stream?: MediaStream;
    muted: boolean;
    videoOff: boolean;
}

interface ParticipantGridProps {
    participants: Map<string, Participant>;
    type: 'video' | 'audio';
}

const ParticipantGrid: React.FC<ParticipantGridProps> = ({ participants, type }) => {
    const gridCols = participants.size <= 2 ? 'grid-cols-1' : 
                    participants.size <= 4 ? 'grid-cols-2' : 
                    'grid-cols-3';

    return (
        <div className={`grid ${gridCols} gap-4 w-full max-w-6xl mx-auto`}>
            {Array.from(participants.values()).map((participant) => (
                <div key={participant.userId} 
                     className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden">
                    {type === 'video' && !participant.videoOff ? (
                        <video
                            ref={el => {
                                if (el && participant.stream) {
                                    el.srcObject = participant.stream;
                                }
                            }}
                            autoPlay
                            playsInline
                            muted={participant.muted}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-20 h-20 rounded-full bg-gray-700 flex items-center justify-center">
                                <span className="text-2xl text-white">
                                    {participant.username[0].toUpperCase()}
                                </span>
                            </div>
                        </div>
                    )}

                    {/* Participant info overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 to-transparent">
                        <div className="flex items-center justify-between">
                            <span className="text-white font-medium">
                                {participant.username}
                            </span>
                            <div className="flex gap-2">
                                {participant.muted && (
                                    <FaMicrophoneSlash className="text-red-500" />
                                )}
                                {type === 'video' && participant.videoOff && (
                                    <FaVideoSlash className="text-red-500" />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ParticipantGrid;