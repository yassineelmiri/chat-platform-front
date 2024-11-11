import { useParams } from "react-router-dom";
import { useMemo } from "react";


interface Params {
    [key: string]: string | undefined;
    chatId?: string;
}

const useCurrentChat = () => {
    const params = useParams<Params>();



    const chatId = useMemo(() => {
        if (!params.chatId) {
            return '';
        }

        return params.chatId;
    }, [params.chatId]);

    const isOpen = useMemo(() => !!chatId, [chatId]);
    console.log(chatId)
    return useMemo(() => ({
        isOpen,
        chatId
    }), [isOpen, chatId]);
};

export default useCurrentChat;
