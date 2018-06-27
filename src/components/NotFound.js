import React, { Component, Fragment } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import * as actions from "../actions";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

class Notfound extends Component {
  componentWillMount() {
    this.props.queryNoAction();
  }
  render() {
    return (
      <Fragment>
        <Helmet>
          <title>ページは存在しません｜BASYO KASHI</title>
        </Helmet>
        <div className="content">
          <div className="content_inner _space">
            <header className="content_header">
              <h2 className="content_head">
                指定されたURLのページは存在しません。
              </h2>
              <p className="content_text">
                ページが移動または削除されたか、URLの入力間違いの可能性があります。
              </p>
            </header>
            <p className="btn_3">
              <Link to="/">トップに戻る</Link>
            </p>
          </div>
        </div>
      </Fragment>
    );
  }
}

export default connect(
  state => ({ state }),
  dispatch => ({ ...bindActionCreators(actions, dispatch) })
)(Notfound);
