import { FaPhone, FaVideo } from "react-icons/fa";

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
        <div className="fixed top-4 right-4 bg-white rounded-lg shadow-xl p-4 w-80 animate-slide-in">
            <div className="flex items-center gap-3 mb-3">
                <div className={`p-2 rounded-full ${callType === 'video' ? 'bg-blue-100' : 'bg-green-100'}`}>
                    {callType === 'video' ? 
                        <FaVideo className="text-blue-500 text-xl" /> : 
                        <FaPhone className="text-green-500 text-xl" />
                    }
                </div>
                <div>
                    <h3 className="font-semibold text-gray-800">Incoming {callType} call</h3>
                    <p className="text-sm text-gray-600">from {callerName}</p>
                </div>
            </div>
            <div className="flex justify-end gap-2">
                <button
                    onClick={onReject}
                    className="px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md transition-colors"
                >
                    Decline
                </button>
                <button
                    onClick={onAccept}
                    className="px-4 py-2 text-sm font-medium text-white bg-green-500 hover:bg-green-600 rounded-md transition-colors"
                >
                    Accept
                </button>
            </div>
        </div>
    );
};
export default CallNotification;