import React, { Component, Fragment } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import * as actions from "../actions";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { ContentHeader } from "./parts/ContentHeader";
import { SuccessModal } from "./parts/Modal";
import Validator from "validatorjs";
import { errorQuery } from "./parts/Query";

class Password extends Component {
  constructor(props) {
    super(props);
    this.state = {
      success: false,
      messages: []
    };
    if (this.props.state.auth.status === true) {
      this.props.history.push("/");
    } else {
      this.props.queryNoAction();
    }
  }

  doValidator() {
    const email = this.refs.email.value;
    if (email) {
      let validation = new Validator(
        {
          email: email
        },
        {
          email: "email"
        },
        {
          "email.email": "Eメールアドレスを入力してください。"
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

  doSend() {
    const email = this.refs.email.value;
    if (!email) {
      this.setState({
        messages: [
          {
            filed: "error",
            message: "入力してください"
          }
        ]
      });
      return;
    }
    this.setState({ messages: [] });
    this.props
      .mutationAction(
        JSON.stringify({
          query: `mutation($email: String!) {
            resetPassword(email: $email) {
              success errors { ${errorQuery} }
            }
          }`,
          variables: {
            email: email
          }
        }),
        "resetPassword"
      )
      .then(res => {
        if (res.type === "SUCCESS") {
          this.setState({
            success: true
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
              filed: "error",
              message: e
            }
          ]
        });
      });
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
                Eメールアドレスを入力して<br />送信してください。<br />再発行手続きの内容を送付します。
              </p>
              <div className="form_element">
                <input
                  ref="email"
                  type="email"
                  placeholder="Eメールアドレス"
                  onBlur={this.doValidator.bind(this)}
                />
                <button onClick={this.doSend.bind(this)}>送信</button>
              </div>
            </div>
            <p className="btn_3">
              <Link to="/login">戻る</Link>
            </p>
          </div>
        </div>
        {this.props.state.mutationLoading && <div className="_loading" />}
        <SuccessModal status={this.state.success} message="送信しました。" />
      </Fragment>
    );
  }
}

export default connect(
  state => ({ state }),
  dispatch => ({ ...bindActionCreators(actions, dispatch) })
)(Password);
