import React, { Component, Fragment } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { ContentHeader } from "./parts/ContentHeader";
import * as actions from "../actions";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { contractSpacesQuery } from "./parts/Query";
import Cookie from "js-cookie";
import { authQuery } from "./parts/Query";
import { dateDisplay, expireUpdate } from "../functions";

const query = token => {
  return JSON.stringify({
    query: `query {
      auth { ${authQuery} }
      contractSpaces(order: ["contract_start"]) { ${contractSpacesQuery} }
    }`
  });
};

class Account extends Component {
  constructor(props) {
    super(props);
    if (Cookie.get("uid") && !this.props.state.contractSpaces.edges) {
      this.props
        .queryAction(query())
        .then(res => {
          expireUpdate(res);
          if (res.auth.status === false) {
            this.props.history.push("/");
          }
        })
        .catch(e => console.log(e));
    } else if (!Cookie.get("uid")) {
      this.props.history.push("/");
    } else {
      this.props.queryNoAction();
    }
  }

  static fetchAction(store, token) {
    return store.dispatch(actions.queryAction(query(), token));
  }

  render() {
    return (
      <Fragment>
        <Helmet>
          <title>アカウント｜BASYO KASHI</title>
        </Helmet>
        <div className="content">
          <div className="content_inner">
            {this.props.state.queryLoading ? (
              <div className="_block_loading" />
            ) : (
              <Fragment>
                <ContentHeader
                  title="アカウント"
                  text="ご利用状況をご確認いただけます。"
                />
                <div className="account_block">
                  {this.props.state.contractSpaces.edges ? (
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
              </Fragment>
            )}
          </div>
        </div>
      </Fragment>
    );
  }
}

export default connect(
  state => ({ state }),
  dispatch => ({ ...bindActionCreators(actions, dispatch) })
)(Account);
