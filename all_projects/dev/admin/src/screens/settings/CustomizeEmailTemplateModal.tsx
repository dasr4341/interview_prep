import Modal from 'react-modal';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
};

export function CustomizeEmailTemplateModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}): JSX.Element {
  return (
    <Modal isOpen={isOpen} style={customStyles}>
      <h2 className="h2">Customize Email</h2>
      <div className="flex flex-col mb-8 m-w-screen-2/3">
        <label className="leading-loose">Email Details</label>
        <input
          className="input mb-4"
          type="text"
          placeholder="Send To Address"
        />
        <input className="input mb-4" type="text" placeholder="Subject" />
        <textarea className="textarea" rows={4} />
      </div>
      <button className="btn mr-4" onClick={onClose}>
        Preview email
      </button>
      <button onClick={onClose}>Cancel</button>
    </Modal>
  );
}
