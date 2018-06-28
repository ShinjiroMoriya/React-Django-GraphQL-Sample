import React from "react";
import { Link } from "react-router-dom";
import { dateDisplay } from "../../functions";

export const NewsBlock = props => {
  return props.data.edges ? (
    <ul className="news">
      {props.data.edges.map((item, index) => {
        return <NewsItem key={index} news={item.node} />;
      })}
    </ul>
  ) : null;
};

export const NewsItem = props => {
  return (
    <li>
      <Link to={`/news/${props.news.pk}`}>
        <span className="news_date">
          {dateDisplay(props.news.activeDate, "Y年MM月DD日")}
        </span>
        {props.news.name}
      </Link>
    </li>
  );
};
