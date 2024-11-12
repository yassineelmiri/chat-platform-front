import { Member, StatusUser } from "../types/chat";

interface AvatarGroupProps {
    users?: Member[];
};

const AvatarGroup: React.FC<AvatarGroupProps> = ({
    users = []
}) => {
    const slicedUsers = users.slice(0, 3);

    const positionMap = {
        0: 'top-0 left-[12px]',
        1: 'bottom-0',
        2: 'bottom-0 right-0'
    }

    return (
        <div className="relative h-11 w-11">
            {slicedUsers.map((user, index) => (
                <div
                    key={user._id}
                    className={`
            absolute
            inline-block 
            rounded-full 
            overflow-hidden
            h-[21px]
            w-[21px]
            ${positionMap[index as keyof typeof positionMap]}
          `}>
                    <img
                        className="w-full h-full"
                        src={user?.avatar || '/images/placeholder.jpg'}
                        alt="Avatar"
                    />
                    {user.status === StatusUser.ONLINE ? (
                        <span
                            className="
            absolute 
            block 
            rounded-full 
            bg-green-500 
            ring-2 
            ring-white 
            top-0 
            right-0
            h-2 
            w-2 
            md:h-3 
            md:w-3
          "
                        />
                    ) : null}
                </div>
            ))}
        </div>
    );
}

export default AvatarGroup;