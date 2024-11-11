import { useState } from "react";
import GroupChatModal from "../../../components/GroupChatModal";
import clsx from "clsx";
import { MdOutlineGroupAdd } from 'react-icons/md';
import ChatBox from "./ChatBox";
import { useChats } from "../../../hooks/useChats";
import useCurrentChat from "../../../hooks/useCurrentChat";


interface ChatListProps {
  users: any[];
  title?: string;
}

const ChatList: React.FC<ChatListProps> = ({

  users
}) => {


  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: chats, isLoading, error } = useChats();  // fetch chats form hook
  const { chatId, isOpen } = useCurrentChat();  //get chatid 

  console.log(chats)


  if (isLoading) return <div>Loading chats...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!chats?.length) return <div>No chats found</div>;

  return (
    <>
      <GroupChatModal
        users={users}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
      <aside className={clsx(`
        fixed 
        inset-y-0 
        pb-20
        lg:pb-0
        lg:left-20 
        lg:w-80 
        lg:block
        overflow-y-auto 
        border-r 
        border-gray-200 
      `, isOpen ? 'hidden' : 'block w-full left-0')}>
        <div className="px-5">
          <div className="flex justify-between mb-4 pt-4">
            <div className="text-2xl font-bold text-neutral-800">
              Messages
            </div>
            <div
              onClick={() => setIsModalOpen(true)}
              className="
                rounded-full 
                p-2 
                bg-gray-100 
                text-gray-600 
                cursor-pointer 
                hover:opacity-75 
                transition
              "
            >
              <MdOutlineGroupAdd size={20} />
            </div>
          </div>
          {chats.map((item) => (
            <ChatBox
              key={item._id}
              chat={item}
              selected={chatId === item._id}
            />
          ))}
        </div>
      </aside>
    </>
  );
}

export default ChatList;