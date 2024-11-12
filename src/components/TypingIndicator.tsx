import React from 'react';

interface TypingIndicatorProps {
    userId: string;
    username: string;
}

const TypingIndicator: React.FC<TypingIndicatorProps> = ({ username }) => {
    return (
        <div className="text-sm text-gray-500 italic">
            {username} is typing...
        </div>
    );
};

export default TypingIndicator;