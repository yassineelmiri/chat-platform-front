import React, { useState } from 'react';

import Modal from '../Modal';
import Button from '../Button';

interface SettingsModalProps {
    isOpen?: boolean;
    onClose: () => void;

}

const SettingsModal: React.FC<SettingsModalProps> = ({
    isOpen,
    onClose,


}) => {

    const [isLoading, setIsLoading] = useState(false)



    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <form >
                <div className='space-y-12'>
                    <div className='border-b border-gray-900/10 pb-12'>
                        <h2
                            className='
                text-base 
                font-semibold 
                leading-7 
                text-gray-900
              '
                        >
                            Profile
                        </h2>
                        <p className='mt-1 text-sm leading-6 text-gray-600'>
                            Edit your public information.
                        </p>




                    </div>
                </div>

                <div
                    className='
            mt-6 
            flex 
            items-center 
            justify-end 
            gap-x-6
          '
                >
                    <Button disabled={isLoading} secondary onClick={onClose}>
                        Cancel
                    </Button>
                    <Button disabled={isLoading} type='submit'>
                        Save
                    </Button>
                </div>
            </form>
        </Modal>
    );
};

export default SettingsModal;