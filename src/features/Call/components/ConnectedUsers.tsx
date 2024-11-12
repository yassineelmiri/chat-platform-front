// components/Call/ConnectedUsers.tsx
import React from 'react';
import { Participant } from './Call';

interface ConnectedUsersProps {
    participants: Map<string, Participant>;
}

const ConnectedUsers: React.FC<ConnectedUsersProps> = ({ participants }) => {
    return (
        <div className="bg-white h-[100vh] rounded-lg p-6 shadow-lg w-100 mt-6">
            <h3 className="text-xl font-semibold mb-4">Connected Users</h3>
            <div className="flex flex-col items-center gap-5">
                {Array.from(participants.values()).map((participant) => (
                    <div
                        key={participant.userId}
                        className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg shadow-md hover:bg-gray-100 transition-colors duration-300 w-full"
                    >
                        <div className="flex flex-col">
                            <span className="text-sm font-semibold text-gray-800">
                                {participant.username}
                            </span>
                            <span className={`text-xs ${
                                participant.muted ? 'text-red-500' : 'text-green-500'
                            }`}>
                                {participant.muted ? 'Muted' : 'Speaking'}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ConnectedUsers;