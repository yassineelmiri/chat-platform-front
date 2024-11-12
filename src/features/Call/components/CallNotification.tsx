import React from 'react';
import { FaPhone, FaVideo, FaTimes } from 'react-icons/fa';

interface CallNotificationProps {
    callerName: string;
    callType: 'video' | 'audio';
    onAccept: () => void;
    onReject: () => void;
}

const CallNotification: React.FC<CallNotificationProps> = ({
    callerName,
    callType,
    onAccept,
    onReject
}) => {
    return (
        <div className="fixed bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg">
            <div className="flex items-center gap-2 mb-4">
                {callType === 'video' ? <FaVideo /> : <FaPhone />}
                <p>Incoming {callType} call from {callerName}</p>
            </div>
            <div className="flex gap-4">
                <button
                    onClick={onAccept}
                    className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                    <FaPhone /> Accept
                </button>
                <button
                    onClick={onReject}
                    className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                    <FaTimes /> Reject
                </button>
            </div>
        </div>
    );
};

export default CallNotification;