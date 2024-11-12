import React from 'react';
import { FaPhone, FaPhoneSlash, FaVideo } from 'react-icons/fa';

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
        <div className="fixed top-4 right-4 bg-white rounded-lg shadow-lg p-4 w-80 animate-slide-in">
            <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                    {callType === 'video' ? (
                        <FaVideo className="text-blue-500 text-xl" />
                    ) : (
                        <FaPhone className="text-blue-500 text-xl" />
                    )}
                </div>
                <div>
                    <h3 className="font-semibold">{callerName}</h3>
                    <p className="text-sm text-gray-500">
                        Incoming {callType} call...
                    </p>
                </div>
            </div>
            
            <div className="flex justify-end gap-4">
                <button
                    onClick={onReject}
                    className="flex items-center gap-2 px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600 transition-colors"
                >
                    <FaPhoneSlash />
                    <span>Reject</span>
                </button>
                <button
                    onClick={onAccept}
                    className="flex items-center gap-2 px-4 py-2 rounded bg-green-500 text-white hover:bg-green-600 transition-colors"
                >
                    <FaPhone />
                    <span>Accept</span>
                </button>
            </div>
        </div>
    );
};

export default CallNotification;