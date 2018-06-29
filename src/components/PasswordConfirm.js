import React, { Component, Fragment } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import * as actions from "../actions";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { ContentHeader } from "./parts/ContentHeader";
import { SuccessModal } from "./parts/Modal";
import Validator from "validatorjs";
import { loginQuery, errorQuery } from "./parts/Query";
import Cookie from "js-cookie";
import { stringToDate } from "../functions";

class PasswordConfirm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      success: false,
      messages: []
    };

    if (Cookie.get("uid")) {
      this.props.history.push("/");
    } else {
      this.props.queryNoAction();
    }
  }

  doValidator() {
    const password = this.refs.password.value;
    const password_confirm = this.refs.password_confirm.value;
    if (password && password_confirm && password !== password_confirm) {
      this.setState({
        messages: [
          {
            field: "password",
            message: "パスワードが一致しません。"
          }
        ]
      });
      return;
    }

    if (password && password_confirm) {
      let validation = new Validator(
        {
          password: password,
          password_confirm: password_confirm
        },
        {
          password: "min:8",
          password_confirm: "min:8"
        },
        {
          "min.password": {
            string: "8文字以上で入力してください。"
          },
          "min.password_confirm": {
            string: "8文字以上で入力してください。"
          }
        }
      );
      if (validation.fails()) {
        let messages = [];
        Object.keys(validation.errors.errors).map(v => {
          return validation.errors.errors[v].map(n => {
            return messages.push({
              field: v,
              message: n
            });
          });
        });
        this.setState({
          messages: messages
        });
      } else {
        this.setState({
          messages: []
        });
      }
    }
  }

  doSubmit(event) {
    event.preventDefault();

    const password = this.refs.password.value;
    const password_confirm = this.refs.password_confirm.value;
    if (password && password === password_confirm) {
      this.setState({ messages: [] });
      this.props
        .mutationAction(
          JSON.stringify({
            query:
              `mutation($token: String!, $password: String!) { ` +
              `resetPasswordConfirm(token: $token, password: $password) { ` +
              `success auth { ${loginQuery} } ` +
              `errors { ${errorQuery} } ` +
              `} }`,
            variables: {
              token: this.props.match.params.token,
              password: password
            }
          }),
          "resetPasswordConfirm"
        )
        .then(res => {
          if (res.type === "SUCCESS") {
            this.setState({
              success: true
            });
            Cookie.set("uid", res.auth.token, {
              expires: stringToDate(res.auth.expire),
              secure: true
            });
          } else {
            this.setState({
              messages: res.messages
            });
          }
        })
        .catch(e => {
          this.setState({
            messages: [
              {
                field: "exception",
                message: e
              }
            ]
          });
        });
    }
  }
  render() {
    return (
      <Fragment>
        <Helmet>
          <title>パスワード再設定｜BASYO KASHI</title>
          <meta
            name="description"
            content="BASYO KASHIのパスワード再設定ページ"
          />
        </Helmet>
        <div className="content">
          <div className="content_inner">
            <ContentHeader title="パスワード再設定" />
            <div className="form_element_wrap">
              {this.state.messages.map((m, index) => {
                return (
                  <p key={index} className="form_element_text_error">
                    {m.message}
                  </p>
                );
              })}
              <p className="form_element_text">
                再登録するパスワードを入力してください。
              </p>
              <form
                className="form_element"
                onSubmit={this.doSubmit.bind(this)}
              >
                <input
                  ref="password"
                  type="password"
                  placeholder="パスワード"
                  onBlur={this.doValidator.bind(this)}
                />
                <input
                  ref="password_confirm"
                  type="password"
                  placeholder="確認パスワード"
                  onBlur={this.doValidator.bind(this)}
                />
                <button type="submit">登録</button>
              </form>
            </div>
            <p className="btn_3">
              <Link to="/login">戻る</Link>
            </p>
          </div>
        </div>
        {this.props.state.mutationLoading && <div className="_loading" />}
        <SuccessModal status={this.state.success} message="登録しました。" />
      </Fragment>
    );
  }
}

export default connect(
  state => ({ state }),
  dispatch => ({ ...bindActionCreators(actions, dispatch) })
)(PasswordConfirm);
