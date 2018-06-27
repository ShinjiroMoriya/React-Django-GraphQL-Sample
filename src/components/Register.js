import React, { Component, Fragment } from "react";
import { Helmet } from "react-helmet";
import { Link, Redirect } from "react-router-dom";
import * as actions from "../actions";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { ContentHeader } from "./parts/ContentHeader";
import { SuccessModal } from "./parts/Modal";
import { authQuery, errorQuery } from "./parts/Query";
import Cookie from "js-cookie";
import { stringToDate } from "../functions";

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      success: false,
      messages: []
    };
  }

  componentWillMount() {
    if (Cookie.get("uid")) {
      this.props.history.push("/");
    } else {
      this.props.queryNoAction();
    }
  }

  doRegister() {
    const email = this.refs.email.value;
    const password = this.refs.password.value;
    const password_confirm = this.refs.password_confirm.value;

    if (email && password === password_confirm) {
      this.setState({ messages: [] });
      this.props
        .mutationAction(
          JSON.stringify({
            query: `mutation($email: String!, $password: String!) {
              register(email: $email, password: $password) {
                success token auth { ${authQuery} }
                errors { ${errorQuery} }
              }
            }`,
            variables: {
              email: email,
              password: password
            }
          }),
          "register"
        )
        .then(res => {
          if (res.type === "SUCCESS") {
            this.setState({ success: true });
            Cookie.set("uid", res.token, {
              expires: stringToDate(res.auth.expire),
              secure: true
            });
          } else {
            if (res.messages.length !== 0) {
              this.setState({ messages: res.messages });
            }
          }
        });
    } else {
      this.setState({
        messages: [
          {
            field: "form",
            message: "入力に誤りがあります。"
          }
        ]
      });
    }
  }
  render() {
    return Cookie.get("uid") ? (
      <Redirect to="/" />
    ) : (
      <Fragment>
        <Helmet>
          <title>会員登録｜BASYO KASHI</title>
          <meta name="description" content="BASYO KASHIの会員登録ページ" />
        </Helmet>
        <div className="content">
          <div className="content_inner">
            <ContentHeader title="会員登録" />
            <div className="form_element_wrap">
              {this.state.messages.map((m, index) => {
                return (
                  <p key={index} className="form_element_text_error">
                    {m.message}
                  </p>
                );
              })}
              <div className="form_element">
                <input ref="email" type="email" placeholder="Eメールアドレス" />
                <input
                  ref="password"
                  type="password"
                  placeholder="パスワード"
                />
                <input
                  ref="password_confirm"
                  type="password"
                  placeholder="パスワード確認"
                />
                <button onClick={this.doRegister.bind(this)}>登録</button>
              </div>
            </div>
            <p className="btn_3">
              <Link to="/">トップに戻る</Link>
            </p>
          </div>
        </div>
        {this.props.state.mutationLoading && <div className="_loading" />}
        <SuccessModal
          status={this.state.success}
          message="会員登録しました。"
        />
      </Fragment>
    );
  }
}

export default connect(
  state => ({ state }),
  dispatch => ({ ...bindActionCreators(actions, dispatch) })
)(Register);
