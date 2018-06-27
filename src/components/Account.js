import React, { Component, Fragment } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { ContentHeader } from "./parts/ContentHeader";
import * as actions from "../actions";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { contractSpacesQuery } from "./parts/Query";
import moment from "moment";
import Cookie from "js-cookie";
import { authQuery } from "./parts/Query";
import { dateDisplay } from "../functions";

const query = token => {
  return JSON.stringify({
    query: `query($token: String) {
      auth(token: $token) { ${authQuery} }
      contractSpaces(
        token: $token, order: ["contract_start"]
        contractEnd_Gte: "${moment().format("Y-MM-DDTHH:mm:ss")}"
      ) { ${contractSpacesQuery} }
    }`,
    variables: {
      token: token
    }
  });
};

class Account extends Component {
  constructor(props) {
    super(props);
    if (Cookie.get("uid") && !this.props.state.contractSpaces.edges) {
      this.props.queryAction(query(Cookie.get("uid"))).then(res => {
        if (res.auth.status === false) {
          this.props.history.push("/");
        }
      });
    } else if (!Cookie.get("uid")) {
      this.props.history.push("/");
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
          <title>アカウント｜BASYO KASHI</title>
        </Helmet>
        {!this.props.state.queryLoading && (
          <div className="content">
            <div className="content_inner">
              <ContentHeader
                title="アカウント"
                text="ご利用状況をご確認いただけます。"
              />
              <div className="account_block">
                {this.props.state.contractSpaces.edges.length !== 0 ? (
                  <table className="account_table">
                    <tbody>
                      <tr>
                        <th>店舗</th>
                        <th>ご利用期間</th>
                      </tr>
                      {this.props.state.contractSpaces.edges.map(
                        (space, index) => {
                          return (
                            <tr key={index}>
                              <td>{space.node.name}</td>
                              <td>
                                {`${dateDisplay(
                                  space.node.contractStart
                                )} 〜 ${dateDisplay(space.node.contractEnd)}`}
                              </td>
                            </tr>
                          );
                        }
                      )}
                    </tbody>
                  </table>
                ) : (
                  <div className="account_block_empty">
                    <p className="account_block_text _space">
                      現在借りているスペースはありません。
                    </p>
                    <p className="btn_1">
                      <Link to="/space">借りに行く</Link>
                    </p>
                  </div>
                )}
              </div>
              <p className="btn_3">
                <Link to="/">トップに戻る</Link>
              </p>
            </div>
          </div>
        )}
      </Fragment>
    );
  }
}

export default connect(
  state => ({ state }),
  dispatch => ({ ...bindActionCreators(actions, dispatch) })
)(Account);
