import React, { Fragment } from "react";
import { Link } from "react-router-dom";

export const Navigation = props => {
  const { location } = props.data;
  const pathname = location.pathname;
  return (
    <Fragment>
      <li>
        <Link
          onClick={props.side}
          to="/"
          className={pathname.match(/^\/$/) ? "active" : null}
        >
          トップ
        </Link>
      </li>
      <li>
        <Link
          onClick={props.side}
          to="/space"
          className={pathname.match(/^\/space/) ? "active" : null}
        >
          スペース
        </Link>
      </li>
      <li>
        <Link
          onClick={props.side}
          to="/guide"
          className={pathname.match(/^\/guide$/) ? "active" : null}
        >
          ご利用ガイド
        </Link>
      </li>
      <li>
        <Link
          onClick={props.side}
          to="/news"
          className={pathname.match(/^\/news/) ? "active" : null}
        >
          ニュース
        </Link>
      </li>
      {props.data.state.auth.status === false && (
        <li>
          <Link
            onClick={props.side}
            to="/login"
            className={pathname.match(/^\/login$/) ? "active" : null}
          >
            ログイン
          </Link>
        </li>
      )}
    </Fragment>
  );
};
