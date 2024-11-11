import { useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import useOtherUser from "../../../hooks/useOtherUser";
import { useAuth } from "../../../providers/AuthProvider";
import { Chat } from "../../../types/chat";

interface UseChatBoxProps {
  chat: Chat;
}

const useChatBox = ({ chat }: UseChatBoxProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const otherUser = useOtherUser(chat.members);

  const handleClick = useCallback(() => {
    navigate(`/chat/${chat._id}`);
  }, [chat, navigate]);

  const userEmail = useMemo(() => user?.email, [user?.email]);

  const lastMessageText = useMemo(() => {
    if (chat?.lastMessage) {
      return chat.lastMessage;
    }
    return "Started a conversation";
  }, [chat?.lastMessage]);

  const formattedDate = chat?.createdAt ? format(new Date(chat.createdAt), "p") : null;

  return {
    handleClick,
    otherUser,
    userEmail,
    lastMessageText,
    formattedDate,
  };
};

export default useChatBox;
