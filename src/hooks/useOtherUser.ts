import { useMemo } from "react";
import { Conversation } from "../dummyData/chats";
import { EMAIL_AUTHED, User } from "../dummyData/users";


const useOtherUser = (conversation: Conversation | { users: User[] }) => {


    const otherUser = useMemo(() => {
        const currentUserEmail = EMAIL_AUTHED;

        if (!currentUserEmail) {
            return null; // Return null if session or email is undefined
        }

        // Filter to find users excluding the current user by email
        const filteredUsers = conversation.users.filter((user) => user.email !== currentUserEmail);

        // Return the first match or null if none found
        return filteredUsers.length > 0 ? filteredUsers[0] : null;
    }, [EMAIL_AUTHED, conversation.users]);

    return otherUser;
};

export default useOtherUser;
