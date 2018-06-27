import React from "react";

export const ContentHeader = ({ title, text }) => {
  return (
    <div className="content_header">
      <h2 className="content_head">{title}</h2>
      {text && <p className="content_text">{text}</p>}
    </div>
  );
};
