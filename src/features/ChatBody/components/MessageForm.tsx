import React from 'react';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { FiLoader } from 'react-icons/fi';
import { HiPaperAirplane, HiPhoto } from 'react-icons/hi2';
import useMessageActions from '../hooks/useMessageActions';
import socket from '../../../utils/socket'; // Import the socket instance

const MessageForm = () => {
    const { chatId, loadingSending, sendMsgMutation } = useMessageActions();

    const { register, handleSubmit, setValue, formState: { errors } } = useForm<FieldValues>({
        defaultValues: {
            message: '',
        },
    });

    const onSubmit: SubmitHandler<FieldValues> = (data) => {
        setValue('message', '', { shouldValidate: true });

        // Send message using mutation
        sendMsgMutation(data.message);

        // Emit message to server for real-time updates
        socket.emit("sendMessage", { chatId, content: data.message });
    };

    return (
        <div className='py-4 px-4 bg-white border-t flex items-center gap-2 lg:gap-4 w-full'>
            <HiPhoto size={30} className='text-sky-500' />

            <form
                onSubmit={handleSubmit(onSubmit)}
                className='flex items-center gap-2 lg:gap-4 w-full'
            >
                <input
                    {...register('message', { required: true })}
                    placeholder='Write a message'
                    className="border p-2 rounded w-full"
                />
                <button
                    disabled={loadingSending}
                    type='submit'
                    className='rounded-full p-2 bg-sky-500 cursor-pointer hover:bg-sky-600 transition'
                >
                    {loadingSending ? <FiLoader className='animate-spin' /> : <HiPaperAirplane size={18} className='text-white' />}
                </button>
            </form>
        </div>
    );
};

export default MessageForm;
