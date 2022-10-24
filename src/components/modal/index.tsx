import './style.css';

interface IModalProps {
    children: React.ReactNode
    modalOpen: boolean
    setModalOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const Modal: React.FunctionComponent<IModalProps> = ({children, modalOpen, setModalOpen}) => {
  if (!modalOpen) return null
    return (
    <div className="Modal">
        <div className="modal-container">
            <button onClick={() => setModalOpen(false)}>X</button>
            <div className="modal-content">
                {children}
            </div>
        </div>
    </div>
  );
};

export default Modal;

