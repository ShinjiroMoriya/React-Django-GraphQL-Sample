import React from "react";
import { Link } from "react-router-dom";
import Modal from "react-modal";
Modal.setAppElement("#root");

export const SuccessModal = ({ status, to_link = "/", message, close }) => {
  return (
    <Modal isOpen={status} className="success_modal" overlayClassName="overlay">
      <div className="modal_inner">
        <p className="success_modal_icon">
          <img src="/assets/images/success.svg" alt="" />
        </p>
        <p
          className="success_modal_text"
          dangerouslySetInnerHTML={{ __html: message }}
        />
        {close ? (
          <button className="success_modal_close" onClick={close}>
            閉じる
          </button>
        ) : (
          <p className="btn_1">
            <Link to={to_link}>
              {to_link === "/" ? "トップに戻る" : "戻る"}
            </Link>
          </p>
        )}
      </div>
    </Modal>
  );
};
