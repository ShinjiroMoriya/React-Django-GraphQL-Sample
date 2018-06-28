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

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      success: false,
      messages: []
    };
    if (this.props.location.state) {
      this.from = this.props.location.state.from || "/";
    } else {
      this.from = "/";
    }
    if (Cookie.get("uid")) {
      this.props.history.push("/");
    } else {
      this.props.queryNoAction();
    }
  }

  doValidator() {
    const email = this.refs.email.value;
    const password = this.refs.password.value;
    if (email && password) {
      let validation = new Validator(
        {
          email: email,
          password: password
        },
        {
          email: "email",
          password: "min:8"
        },
        {
          "email.email": "Eメールアドレスを入力してください。",
          "min.password": {
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

  doLogin(event) {
    event.preventDefault();

    const email = this.refs.email.value;
    const password = this.refs.password.value;

    if (email && password) {
      this.setState({ messages: [] });
      this.props
        .mutationAction(
          JSON.stringify({
            query: `mutation($email: String!, $password: String!) {
              login(email: $email, password: $password) {
                success auth { ${loginQuery} } errors { ${errorQuery} }
              }
            }`,
            variables: {
              email: email,
              password: password
            }
          }),
          "login"
        )
        .then(res => {
          if (res.type === "SUCCESS") {
            this.setState({
              success: true
            });
            this.props.disabledAction();
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
        .catch(e => this.props.errorAction(e));
    }
    if (!email || !password) {
      let messages = [];
      if (!email) {
        messages.push({
          field: "email",
          message: "Eメールアドレスを入力してください"
        });
      }
      if (!password) {
        messages.push({
          field: "password",
          message: "パスワードを入力してください"
        });
      }
      this.setState({
        messages: messages
      });
    }
  }
  render() {
    return (
      <Fragment>
        <Helmet>
          <title>ログイン｜BASYO KASHI</title>
          <meta name="description" content="BASYO KASHIのログインページ" />
        </Helmet>
        <div className="content">
          <div className="content_inner">
            <ContentHeader title="ログイン" />
            <div className="form_element_wrap">
              {this.state.messages
                .filter(m => {
                  return m.field !== "email" && m.field !== "password";
                })
                .map((m, index) => {
                  return (
                    <p key={index} className="form_element_text_error">
                      {m.message}
                    </p>
                  );
                })}
              <form className="form_element" onSubmit={this.doLogin.bind(this)}>
                {this.state.messages
                  .filter(m => {
                    return m.field === "email";
                  })
                  .map((m, index) => {
                    return (
                      <p key={index} className="form_element_text_error">
                        {m.message}
                      </p>
                    );
                  })}
                <input
                  ref="email"
                  type="text"
                  placeholder="Eメールアドレス"
                  onBlur={this.doValidator.bind(this)}
                />
                {this.state.messages
                  .filter(m => {
                    return m.field === "password";
                  })
                  .map((m, index) => {
                    return (
                      <p key={index} className="form_element_text_error">
                        {m.message}
                      </p>
                    );
                  })}
                <input
                  ref="password"
                  type="password"
                  placeholder="パスワード"
                  onBlur={this.doValidator.bind(this)}
                />
                <button type="submit">ログイン</button>
                <p className="forgot_link">
                  パスワードを忘れた方は<Link to="/password">こちら</Link>
                </p>
              </form>
            </div>
            <p className="btn_3">
              <Link to={this.from}>
                {this.from === "/" ? "トップに戻る" : "戻る"}
              </Link>
            </p>
          </div>
        </div>
        {this.props.state.mutationLoading && <div className="_loading" />}
        <SuccessModal
          status={this.state.success}
          to_link={this.from}
          message="ログインしました。"
        />
      </Fragment>
    );
  }
}

export default connect(
  state => ({ state }),
  dispatch => ({ ...bindActionCreators(actions, dispatch) })
)(Login);
