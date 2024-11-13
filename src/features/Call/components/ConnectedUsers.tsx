import React from 'react';
import { FaMicrophone, FaMicrophoneSlash, FaVideo, FaVideoSlash } from 'react-icons/fa';

interface Participant {
    userId: string;
    username: string;
    muted: boolean;
    videoOff: boolean;
}

interface ConnectedUsersProps {
    participants: Map<string, Participant>;
    type: 'video' | 'audio';
}

const ConnectedUsers: React.FC<ConnectedUsersProps> = ({ participants, type }) => {
    return (
        <div className="bg-white rounded-lg shadow-lg p-4 w-64">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">
                Participants ({participants.size})
            </h3>
            <div className="space-y-3">
                {Array.from(participants.values()).map((participant) => (
                    <div key={participant.userId} 
                         className="flex items-center justify-between p-2 rounded-lg bg-gray-50">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                                <span className="text-sm font-medium text-gray-600">
                                    {participant.username[0].toUpperCase()}
                                </span>
                            </div>
                            <span className="text-sm font-medium text-gray-700">
                                {participant.username}
                            </span>
                        </div>
                        <div className="flex gap-2">
                            {participant.muted ? (
                                <FaMicrophoneSlash className="text-red-500" />
                            ) : (
                                <FaMicrophone className="text-green-500" />
                            )}
                            {type === 'video' && (
                                participant.videoOff ? (
                                    <FaVideoSlash className="text-red-500" />
                                ) : (
                                    <FaVideo className="text-green-500" />
                                )
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ConnectedUsers;