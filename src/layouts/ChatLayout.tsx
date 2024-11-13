// // src/features/Chat/components/ChatLayout.tsx
// import React from 'react';
// import { useSocketConnection } from '../hooks/useSocket';
// import useCallState from '../features/Call/hooks/useCallState';
// import Call from '../features/Call/components/Call';
// import CallNotification from '../features/Call/components/CallNotification';
// import useCurrentChat from '../hooks/useCurrentChat';

// interface ChatLayoutProps {
   
//     children: React.ReactNode;
// }

// const ChatLayout: React.FC<ChatLayoutProps> = ({  children }) => {

//     const {chatId} = useCurrentChat()
//     useSocketConnection(chatId);
    
//     const {
//         activeCall,
//         incomingCall,
//         handleAcceptCall,
//         handleRejectCall,
//         handleEndCall
//     } = useCallState(chatId);

//     return (
//         <div className="h-full">
//             {children}
            
//             {/* Call Component */}
//             {activeCall && (
//                 <Call
//                     chatId={activeCall.chatId}
//                     type={activeCall.type}
//                     onClose={handleEndCall}
//                 />
//             )}
            
//             {/* Call Notification */}
//             {incomingCall && (
//                 <CallNotification
//                     callerName={incomingCall.callerName}
//                     callType={incomingCall.type}
//                     onAccept={handleAcceptCall}
//                     onReject={handleRejectCall}
//                 />
//             )}
//         </div>
//     );
// };

// export default ChatLayout;