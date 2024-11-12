import Modal from "../../../components/Modal";


interface ImageModalProps {
    isOpen?: boolean;
    onClose: () => void;
    src?: string | null;
}

const ImageModal: React.FC<ImageModalProps> = ({
    isOpen,
    onClose,
    src
}) => {
    if (!src) {
        return null;
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="w-80 h-80">
                <img
                    className="object-cover w-full h-full"

                    alt="Image"
                    src={src}
                />
            </div>
        </Modal>
    )
}

export default ImageModal;