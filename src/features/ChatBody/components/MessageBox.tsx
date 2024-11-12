
import clsx from "clsx";
import { useState } from "react";
import { format } from "date-fns";
import { useAuth } from "../../../providers/AuthProvider";
import { Message } from "../../../types/message";
import Avatar from "../../../components/Avatar";
import ImageModal from "./ImageModal";


interface MessageBoxProps {
    data: Message;
    isLast?: boolean;
}

const MessageBox: React.FC<MessageBoxProps> = ({
    data,
    isLast
}) => {
    const { user } = useAuth();
    const [imageModalOpen, setImageModalOpen] = useState(false);


    const isOwn = user?.email === data?.sender?.email
    const seenList = (data.readBy || [])
        .filter((user) => user.email !== data?.sender?.email)
        .map((user) => user.username)
        .join(', ');

    const container = clsx('flex gap-3 p-4', isOwn && 'justify-end');
    const avatar = clsx(isOwn && 'order-2');
    const body = clsx('flex flex-col gap-2', isOwn && 'items-end');
      const message = clsx(
        'text-sm w-fit overflow-hidden', 
        isOwn ? 'bg-sky-500 text-white' : 'bg-gray-100', 
        data.content ? 'rounded-md p-0' : 'rounded-full py-2 px-3'
      );

    return (
        <div className={container}>
            <div className={avatar}>
                <Avatar user={data.sender} />
            </div>
            <div className={body}>
                <div className="flex items-center gap-1">
                    <div className="text-sm text-gray-500">
                        {data.sender.username}
                    </div>
                    <div className="text-xs text-gray-400">
                        {format(new Date(data.createdAt), 'p')}
                    </div>
                </div>
                <div className={message}>
                    <ImageModal src={data.content} isOpen={imageModalOpen} onClose={() => setImageModalOpen(false)} />
                    {data.type !== 'text' ? (
                        <img
                            alt="Image"
                            height="288"
                            width="288"
                            onClick={() => setImageModalOpen(true)}
                            src={data.content}
                            className="
                object-cover 
                cursor-pointer 
                hover:scale-110 
                transition 
                translate
              "
                        />
                    ) : (
                        <div>{data.content}</div>
                    )}
                </div>
                {isLast && isOwn && seenList.length > 0 && (
                    <div
                        className="
            text-xs 
            font-light 
            text-gray-500
            "
                    >
                        {`Seen by ${seenList}`}
                    </div>
                )}
            </div>
        </div>
    );
}

export default MessageBox;