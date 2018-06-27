import React from "react";
import { Link } from "react-router-dom";

const Numbers = (current, total_page, page_number) => {
  var n = total_page < page_number ? total_page : page_number;
  var n_harf = Math.floor(n / 2);
  var c_n_harf_1 = current - n_harf;
  var c_n_harf_2 = current + n_harf;
  var n_start = c_n_harf_1 <= 0 ? 1 : c_n_harf_1;
  var n_end = c_n_harf_1 <= 0 ? n : c_n_harf_2;
  var r_n_start = n_end > total_page ? total_page - n + 1 : n_start;
  var r_n_end = n_end > total_page ? total_page : n_end;
  return { start: r_n_start, end: r_n_end + 1 };
};

const Range = (start, stop, step) => {
  if (stop == null) {
    stop = start || 0;
    start = 0;
  }
  if (!step) {
    step = stop < start ? -1 : 1;
  }
  var length = Math.max(Math.ceil((stop - start) / step), 0);
  var range = Array(length);
  for (var idx = 0; idx < length; idx++, start += step) {
    range[idx] = start;
  }
  return range;
};

export const Pager = props => {
  const { pages } = props.data;
  const slug = props.slug;
  const current = parseInt(props.current, 10);
  const PagerData = Numbers(current, pages, 3);

  return (
    pages !== 1 && (
      <div className="pager_wrap">
        <ul className="pager">
          {Range(PagerData.start, PagerData.end).map(index => {
            return current === index ? (
              <li key={index}>
                <span>{index}</span>
              </li>
            ) : (
              <li key={index} data-page={index} onClick={props.load}>
                <Link to={slug + index}>{index}</Link>
              </li>
            );
          })}
        </ul>
      </div>
    )
  );
};
