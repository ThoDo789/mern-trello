import React from "react";
import { Button, Modal } from "react-bootstrap";
import {
  MODAL_ACTION_CLOSE,
  MODAL_ACTION_CONFIRM,
} from "../../ultilities/contants";
const ConfirmModal = ({ title, content, show, onAction }) => {
  console.log(show);
  return (
    <Modal
      show={show}
      onHide={() => onAction(MODAL_ACTION_CLOSE)}
      backdrop="static" //just only click button inside element be implement
      keyboard={false} // just only click even be implement
      animation={false} //fix bug findDOMNode to conflict react with ui library
    >
      <Modal.Header closeButton={true}>
        <Modal.Title className="h5">{title}</Modal.Title>
      </Modal.Header>

      <Modal.Body>{content}</Modal.Body>

      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={() => onAction(MODAL_ACTION_CLOSE)}
        >
          Close
        </Button>
        <Button
          variant="primary"
          onClick={() => onAction(MODAL_ACTION_CONFIRM)}
        >
          Confirm
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ConfirmModal;
