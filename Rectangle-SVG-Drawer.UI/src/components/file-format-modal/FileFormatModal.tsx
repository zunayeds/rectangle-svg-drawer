import Modal from 'react-modal';
import './FileFormatModal.css';

export interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const FileFormatModal = (props: ModalProps) => {
    return (
        <Modal
            className="modal"
            isOpen={props.isOpen}
            ariaHideApp={false}
            contentLabel="File Format Modal"
        >
            <div className="modal-header">
                <h4>Invalid JSON File Format</h4>
                <button className="close-button" onClick={props.onClose}>
                    ✕
                </button>
            </div>
            <div className="modal-content">
                <h5>Correct format</h5>
                &#123;
                <br />
                &emsp;"height": 50,
                <br />
                &emsp;"width": 50
                <br />
                &#125;
            </div>
        </Modal>
    );
};
