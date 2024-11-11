import { useMemo } from "react";
import { Member } from "../types/chat";
import { useAuth } from "../providers/AuthProvider";



// this hook for filter mamber  remove exist user
const useOtherUser = (users: Member[]) => {
    const { user } = useAuth();

    const otherUser = useMemo(() => {
        const currentUserEmail = user?.email;

        const otherUser = users.filter((user: Member) => user.email !== currentUserEmail);

        return otherUser[0];
    }, [user?.email, users]);

    return otherUser;
};

export default useOtherUser;