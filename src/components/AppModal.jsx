import { Modal } from 'antd';

/**
 * Displays a modal.
 *
 * @param {{ modal: any; setModal: any; handleModalOk: any; id: any; }} props
 * @param {object} props.modal Object containing antd.Modal props
 * @param {useState.function} props.setModal
 * @param {function} props.handleModalOk
 * @param {string} props.id
 * @returns {*}
 */
function AppModal({ modal, setModal, handleModalOk, id }) {
  const closeModal = () => {
    setModal({ ...modal, okText: 'OK', open: false });
  };

  return (
    <Modal
      id={id}
      title={modal.title}
      footer={modal.footer}
      className={modal.className}
      width={modal.width}
      cancelButtonProps={{ style: { display: modal.cancelCSS } }}
      closable={false}
      open={modal.open}
      okText={modal.okText}
      onCancel={closeModal}
      onOk={handleModalOk || closeModal}
      okButtonProps={modal.okButtonProps}
    >
      {modal.body}
    </Modal>
  );
}

export default AppModal;
