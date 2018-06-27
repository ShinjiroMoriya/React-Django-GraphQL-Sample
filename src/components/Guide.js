import React, { Component, Fragment } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { ContentHeader } from "./parts/ContentHeader";
import * as actions from "../actions";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import Cookie from "js-cookie";
import { authQuery } from "./parts/Query";

const query = token => {
  return JSON.stringify({
    query: `query($token: String) {
      auth(token: $token) { ${authQuery} }
    }`,
    variables: {
      token: token
    }
  });
};

class Guide extends Component {
  constructor(props) {
    super(props);
    if (Cookie.get("uid")) {
      this.props.queryAction(query(Cookie.get("uid"))).then(res => {
        if (res.auth.status === false) {
          Cookie.remove("uid");
        }
      });
    } else {
      this.props.queryNoAction();
    }
  }

  static fetchAction(store, token) {
    return store.dispatch(actions.queryAction(query(token)));
  }

  render() {
    return (
      <Fragment>
        <Helmet>
          <title>ご利用案内｜BASYO KASHI</title>
          <meta name="description" content="BASYO KASHIのご利用案内です。" />
        </Helmet>
        <div className="content">
          <div className="content_inner">
            <ContentHeader
              title="ご利用案内"
              text="当サイトのご利用方法を紹介します。"
            />
            <div className="guide_block">
              <h3 className="content_sub_head">会員登録</h3>
              <p className="content_text _space">
                サービスをご利用いただくには「<Link
                  to="/register"
                  className="alink"
                >
                  会員登録
                </Link>」が必要です。<br />パソコン・スマートフォンから無料で登録をすることができます。
              </p>
              <p className="btn_1">
                <Link to="/register">新規登録（無料）</Link>
              </p>
            </div>
            <div className="guide_block">
              <h3 className="content_sub_head">スペースを探す</h3>
              <p className="content_text _space">
                ご希望のレンタルスペースを<Link to="/space" className="alink">
                  探す
                </Link>
                <br />レンタルするには<Link to="/login" className="alink">
                  ログイン
                </Link>が必要です。
              </p>
              <p className="btn_1">
                <Link to="/login">ログイン</Link>
              </p>
            </div>
            <div className="guide_block">
              <h3 className="content_sub_head">レンタルする</h3>
              <p className="content_text">
                ご希望のレンタルスペースの詳細ページにてご希望日・時間を登録してください。<br />ご希望に添えない場合もございます。予めご了承ください。
              </p>
            </div>
            <p className="btn_3">
              <Link to="/">トップに戻る</Link>
            </p>
          </div>
          <div className="content_color">
            <header className="content_header">
              <p className="content_text _large _space">
                ご質問などございましたら、<br />お問い合わせください。
              </p>
              <p className="btn_2">
                <Link to="/">お問い合わせ</Link>
              </p>
            </header>
          </div>
        </div>
      </Fragment>
    );
  }
}

export default connect(
  state => ({ state }),
  dispatch => ({ ...bindActionCreators(actions, dispatch) })
)(Guide);
