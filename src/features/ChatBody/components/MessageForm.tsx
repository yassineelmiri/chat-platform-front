'use client';

import { HiPaperAirplane, HiPhoto } from 'react-icons/hi2';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import axios from 'axios';
import useCurrentChat from '../../../hooks/useCurrentChat';
import MessageInput from './MessageInput';
import useMessageActions from '../hooks/useMessageActions';
import { FiLoader } from 'react-icons/fi';


const MessageForm = () => {


    const { isOpen, chatId, loadingSending, errorSending, sendMsgMutation } = useMessageActions(); // fetch list of messages belong this chat

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<FieldValues>({
        defaultValues: {
            message: '',
        },
    });

    const onSubmit: SubmitHandler<FieldValues> = (data) => {
        setValue('message', '', { shouldValidate: true });

        sendMsgMutation(data.message)

    };



    return (
        <div
            className='
        py-4 
        px-4 
        bg-white 
        border-t 
        flex 
        items-center 
        gap-2 
        lg:gap-4 
        w-full
      '
        >

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
                    className='
            rounded-full 
            p-2 
            bg-sky-500 
            cursor-pointer 
            hover:bg-sky-600 
            transition
          '
                >
                    {loadingSending ? <FiLoader className='animate-spin' /> : <HiPaperAirplane size={18} className='text-white' />}

                </button>
            </form>
        </div>
    );
};

export default MessageForm;