
// import React from 'react';
// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// import { createConversation, fetchUserConversations } from '../conversationsAPI';
// import { Conversation, ConversationsListProps, CreateConversationParams } from '../types';



// const ConversationsList: React.FC<ConversationsListProps> = ({ userId }) => {
//     const queryClient = useQueryClient();

//     // Fetch conversations
//     const {
//         data: conversations = [], error, isLoading
//     } = useQuery<Conversation[], Error>({
//         queryKey: ['conversations', userId],
//         queryFn: () => fetchUserConversations(userId),

//     });

//     // Mutation for creating a new conversation


//     const mutation = useMutation({
//         mutationFn: (newConversation: CreateConversationParams) =>
//             createConversation({ ...newConversation }),
//         onSuccess: () => {
//             queryClient.invalidateQueries({ queryKey: ['conversations', userId] }); // after create succfully

//             // toast.success('Document Uploaded successfully!');

//         },
//         onError: (error: { message: string }) => {
//             // toast.error(`Error uploading document: ${error.message}`);
//         },
//     });


//     const handleCreateConversation = () => {
//         mutation.mutate({ withUser: 'someUserId', message: 'Hello!' });
//     };

//     if (isLoading) return <div>Loading...</div>;
//     if (error) return <div>Error: {error.message}</div>;

//     return (
//         <div>
//             <h2>Conversations</h2>
//             <ul>
//                 {conversations.map((conversation) => (
//                     <li key={conversation._id}>
//                         {conversation.participants.map((participant) => participant.username).join(', ')}
//                     </li>
//                 ))}
//             </ul>
//             <button onClick={handleCreateConversation} disabled={mutation.isPending}>
//                 {mutation.isPending ? 'Creating...' : 'Create Conversation'}
//             </button>
//         </div>
//     );
// };

// export default ConversationsList;