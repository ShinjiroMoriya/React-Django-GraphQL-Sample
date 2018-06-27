import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { Helmet } from "react-helmet";
import { bindActionCreators } from "redux";
import { ContentHeader } from "./parts/ContentHeader";
import { DatePickerWrap, SpaceModal } from "./parts/Space";
import numeral from "numeral";
import moment from "moment";
import "moment/locale/ja";
import * as actions from "../actions";
import { SuccessModal } from "./parts/Modal";
import { authQuery, spaceQuery, contractSpacesQuery ,errorQuery } from "./parts/Query";
import Cookie from "js-cookie";
import { stringToDate } from "../functions";

const query = (token, pk) => {
  return JSON.stringify({
    query: `query($token: String, $spaceId: String!) {
      auth(token: $token) { ${authQuery} }
      space(spaceId: $spaceId) { ${spaceQuery} }
    }`,
    variables: {
      spaceId: pk,
      token: token
    }
  });
};

class SpaceDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      success: false,
      startDate: null,
      endDate: null,
      showModal: false,
      messages: []
    };
    this.props
      .queryAction(query(Cookie.get("uid"), this.props.match.params.pk))
      .then(res => {
        if (res.auth.status === true) {
          Cookie.set("uid", Cookie.get("uid"), {
            expires: stringToDate(res.auth.expire),
            secure: true
          });
        } else {
          Cookie.remove("uid");
        }
      });
  }

  static fetchAction(store, token, params) {
    return store.dispatch(
      actions.queryAction(query(token, params.pk))
    );
  }

  successClose() {
    this.setState({
      success: false
    });
  }

  contractClose() {
    this.setState({
      showModal: false
    });
  }

  datePickerStartChange(date) {
    this.setState({
      startDate: date,
      messages: []
    });
  }

  datePickerEndChange(date) {
    this.setState({
      endDate: date,
      messages: []
    });
  }

  contractConfirm() {
    const now = moment();
    if (!this.state.startDate || !this.state.endDate) {
      let messages = [];
      if (!this.state.startDate) {
        messages.push({
          field: "date_start",
          message: "開始日を選択してください。"
        });
      }
      if (!this.state.endDate) {
        messages.push({
          field: "date_end",
          message: "終了日を選択してください。"
        });
      }
      this.setState({
        messages: messages
      });
      return false;
    }
    if (now > this.state.startDate) {
      this.setState({
        messages: [
          {
            field: "date",
            message: "開始日を現在以降を選択してください。"
          }
        ]
      });
      return false;
    }
    if (this.state.startDate >= this.state.endDate) {
      this.setState({
        messages: [
          {
            field: "date",
            message: "日時の指定に誤りがございます。"
          }
        ]
      });
      return false;
    }
    this.setState({
      showModal: true
    });
  }

  contractSubmit() {
    this.setState({ messages: [] });
    this.props
      .mutationAction(
        JSON.stringify({
          query: `mutation($startDate: String!, $endDate: String!, $token: String!, $spaceId: String!) {
          spaceContract(startDate: $startDate, endDate: $endDate, token: $token, spaceId: $spaceId) {
            success
            errors { ${errorQuery} }
            space { ${spaceQuery} }
            contractSpaces { ${contractSpacesQuery} }
          }
        }`,
          variables: {
            startDate: this.state.startDate,
            endDate: this.state.endDate,
            spaceId: this.props.match.params.pk,
            token: Cookie.get("uid")
          }
        }),
        "spaceContract"
      )
      .then(res => {
        if (res.type === "SUCCESS") {
          this.setState({
            success: true,
            showModal: false,
            startDate: null,
            endDate: null
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

  render() {
    return (
      <Fragment>
        <Helmet>
          <title>{`${this.props.state.space.name}｜スペース｜BASYO KASHI`}</title>
          <meta name="description" content={`${this.props.state.space.name}です`} />
        </Helmet>
        {this.props.state.space.name && (
          <div className="content">
            <div className="content_inner">
              <ContentHeader title={this.props.state.space.name} />
              <div className="space_detail">
                <div className="space_detail_image">
                  {this.props.state.space.mainImage && <img src={this.props.state.space.mainImage} alt="" />}
                </div>
                <table className="space_detail_table">
                  <tbody>
                    <tr>
                      <th>店舗名</th>
                      <td>{this.props.state.space.name}</td>
                    </tr>
                    <tr>
                      <th>店舗について</th>
                      <td>{this.props.state.space.description}</td>
                    </tr>
                    <tr>
                      <th>価格</th>
                      <td>{numeral(this.props.state.space.price).format("0,0")}円</td>
                    </tr>
                    {!this.props.state.space.contractStatus ? (
                      this.props.state.auth.status === true ? (
                        <tr>
                          <th>店舗を借りる</th>
                          <td>
                            <p className="space_detail_form_text">
                              開始日時と終了日時を選択して確認を押してください。
                            </p>
                            <div className="space_detail_form">
                              {this.state.messages
                                .filter(m => {
                                  return m.field !== "date_end";
                                })
                                .map((m, index) => {
                                  return (
                                    <p
                                      key={index}
                                      className="form_element_text_error"
                                    >
                                      {m.message}
                                    </p>
                                  );
                                })}
                              <div className="space_detail_form_block">
                                <DatePickerWrap
                                  onClick={this.datePickerStartChange.bind(
                                    this
                                  )}
                                  date={this.state.startDate}
                                  placeholder="開始日を選択してください"
                                />
                              </div>
                              {this.state.messages
                                .filter(m => {
                                  return m.field === "date_end";
                                })
                                .map((m, index) => {
                                  return (
                                    <p
                                      key={index}
                                      className="form_element_text_error"
                                    >
                                      {m.message}
                                    </p>
                                  );
                                })}
                              <div className="space_detail_form_block">
                                <DatePickerWrap
                                  onClick={this.datePickerEndChange.bind(this)}
                                  date={this.state.endDate}
                                  placeholder="終了日時を選択してください"
                                />
                              </div>
                              <button
                                className="space_detail_form_submit"
                                onClick={this.contractConfirm.bind(this)}
                              >
                                確認
                              </button>
                            </div>
                            <SpaceModal
                              state={this.state}
                              submit={this.contractSubmit.bind(this)}
                              close={this.contractClose.bind(this)}
                            />
                          </td>
                        </tr>
                      ) : (
                        <tr>
                          <td colSpan="2">
                            <p className="space_detail_form_text _ct">
                              ログインして借りよう
                            </p>
                            <p className="color_1_btn">
                              <Link
                                to={{
                                  pathname: "/login",
                                  state: { from: this.props.location.pathname }
                                }}
                              >
                                ログインする
                              </Link>
                            </p>
                          </td>
                        </tr>
                      )
                    ) : (
                      <tr>
                        <td colSpan="2">
                          <p className="space_detail_text">契約済</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <p className="color_3_btn">
                <Link to="/space">一覧に戻る</Link>
              </p>
            </div>
          </div>
        )}
        <SuccessModal
          status={this.state.success}
          close={this.successClose.bind(this)}
          message="契約しました。<br>ありがとうございます。"
        />
      </Fragment>
    );
  }
}

export default connect(
  state => ({ state }),
  dispatch => ({ ...bindActionCreators(actions, dispatch) })
)(SpaceDetail);
