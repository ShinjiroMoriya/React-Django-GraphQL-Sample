import React from "react";
import { Link } from "react-router-dom";
import DatePicker from "react-datepicker";
import moment from "moment";
import Modal from "react-modal";
Modal.setAppElement("#root");

export const SpaceBlock = props => {
  return (
    <div className="space_blocks">
      {props.data.edges &&
        props.data.edges.map(({ node }, index) => {
          return <SpaceItem key={index} space={node} />;
        })}
    </div>
  );
};

export const SpaceItem = props => {
  return (
    <div className="space_block">
      <Link to={`/space/${props.space.pk}`}>
        <img
          src={props.space.thumbnailImage}
          className="img-responsive"
          alt=""
        />
      </Link>
      <p className="space_block_text">{props.space.name}</p>
    </div>
  );
};

export const DatePickerWrap = ({ date, onClick, placeholder }) => {
  return (
    <DatePicker
      withPortal
      showTimeSelect
      isClearable={true}
      timeFormat="HH:mm"
      timeIntervals={60}
      dateFormatCalendar={"YYYY年 MMM"}
      dateFormat="Y年MM月DD日 HH:mm"
      minTime={moment()
        .hours(10)
        .minutes(0)}
      maxTime={moment()
        .hours(19)
        .minutes(30)}
      selected={date}
      onChange={onClick}
      placeholderText={placeholder}
    />
  );
};

export const SpaceModal = ({ state, submit, close }) => {
  return (
    <Modal
      isOpen={state.showModal}
      onRequestClose={close}
      className="modal"
      overlayClassName="overlay"
    >
      <div className="modal_inner">
        {state.message && (
          <p className="form_element_text_error">{state.message}</p>
        )}
        <p className="space_detail_form_text">下記内容でよろしいでしょうか？</p>
        <p className="space_detail_form_head">開始日</p>
        {state.startDate && (
          <p className="space_detail_form_data">
            {state.startDate.format("Y年MM月DD日 HH:mm")}
          </p>
        )}
        <p className="space_detail_form_head">終了日</p>
        {state.endDate && (
          <p className="space_detail_form_data">
            {state.endDate.format("Y年MM月DD日 HH:mm")}
          </p>
        )}
        <button
          className="space_detail_form_submit _w100 _space"
          onClick={submit}
        >
          送信
        </button>
        <button className="space_detail_form_cancel _w100" onClick={close}>
          キャンセル
        </button>
      </div>
    </Modal>
  );
};
