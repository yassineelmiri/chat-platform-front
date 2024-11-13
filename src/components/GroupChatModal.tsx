import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    FieldValues,
    SubmitHandler,
    useForm
} from 'react-hook-form';

import Modal from './Modal';
import Input from './inputs/Input';
import Select from './inputs/Select';
import Button from './Button';
import { Member } from '../types/chat';

interface GroupChatModalProps {
    isOpen?: boolean;
    onClose: () => void;

}

const GroupChatModal: React.FC<GroupChatModalProps> = ({
    isOpen,
    onClose,

}) => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [users, setUsers] = useState<Member[]>([]); // fetch users  from backend and add them here

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors }
    } = useForm<FieldValues>({
        defaultValues: {
            name: '',
            members: []
        }
    });

    const members = watch('members');

    //TODO
    // here display list of friends of user 

    const onSubmit: SubmitHandler<FieldValues> = (data) => {


        // here add logic to create  nw  group 
        // this is thata need passed :
        //     {
        //         "members":["673358a0232c00e921772323"], // list of ids users want add to group
        //     "isGroup":true // mantion that this chat is group
        // }
        console.log('on create new group')

    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="space-y-12">
                    <div className="border-b border-gray-900/10 pb-12">
                        <h2 className="text-base font-semibold leading-7 text-gray-900">
                            Create a group chat
                        </h2>
                        <p className="mt-1 text-sm leading-6 text-gray-600">
                            Create a chat with more than 2 people.
                        </p>
                        <div className="mt-10 flex flex-col gap-y-8">
                            <Input
                                disabled={isLoading}
                                label="Name"
                                id="name"
                                errors={errors}
                                required
                                register={register}
                            />
                            <Select
                                disabled={isLoading}
                                label="Members"
                                options={users.map((user) => ({
                                    value: user._id,
                                    label: user.username
                                }))}
                                onChange={(value) => setValue('members', value, {
                                    shouldValidate: true
                                })}
                                value={members}
                            />
                        </div>
                    </div>
                </div>
                <div className="mt-6 flex items-center justify-end gap-x-6">
                    <Button
                        disabled={isLoading}
                        onClick={onClose}
                        type="button"
                        secondary
                    >
                        Cancel
                    </Button>
                    <Button disabled={isLoading} type="submit">
                        Create
                    </Button>
                </div>
            </form>
        </Modal>
    );
};

export default GroupChatModal;
