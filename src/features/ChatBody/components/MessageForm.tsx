import { HiPaperAirplane, HiPhoto } from 'react-icons/hi2';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import useCurrentChat from '../../../hooks/useCurrentChat';
import MessageInput from './MessageInput';
import useMessageActions from '../hooks/useMessageActions';
import useMessageSocket from '../hooks/useMessageSocket';
import { FiLoader } from 'react-icons/fi';
import { useEffect } from 'react';

const MessageForm = () => {
    const { isOpen, chatId, loadingSending, errorSending, sendMsgMutation } = useMessageActions();
    const { sendTypingStatus } = useMessageSocket(chatId);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<FieldValues>({
        defaultValues: {
            message: '',
        },
    });

    // Handle typing status
    const messageContent = watch('message');
    useEffect(() => {
        const timeout = setTimeout(() => {
            sendTypingStatus(messageContent.length > 0);
        }, 500);

        return () => clearTimeout(timeout);
    }, [messageContent, sendTypingStatus]);

    const onSubmit: SubmitHandler<FieldValues> = (data) => {
        setValue('message', '', { shouldValidate: true });
        sendTypingStatus(false); // Stop typing indicator when message is sent
        sendMsgMutation(data.message);
    };

    return (
        <div className='py-4 px-4 bg-white border-t flex items-center gap-2 lg:gap-4 w-full'>
            <HiPhoto size={30} className='text-sky-500' />
            <form
                onSubmit={handleSubmit(onSubmit)}
                className='flex items-center gap-2 lg:gap-4 w-full'
            >
                <MessageInput
                    id='message'
                    register={register}
                    errors={errors}
                    required
                    placeholder='Write a message'
                />
                <button
                    disabled={loadingSending}
                    type='submit'
                    className='rounded-full p-2 bg-sky-500 cursor-pointer hover:bg-sky-600 transition'
                >
                    {loadingSending ? 
                        <FiLoader className='animate-spin' /> : 
                        <HiPaperAirplane size={18} className='text-white' />
                    }
                </button>
            </form>
        </div>
    );
};

export default MessageForm;