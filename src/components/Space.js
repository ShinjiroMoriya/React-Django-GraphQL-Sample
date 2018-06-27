import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { Helmet } from "react-helmet";
import * as actions from "../actions";
import { bindActionCreators } from "redux";
import { ContentHeader } from "./parts/ContentHeader";
import { SpaceBlock } from "./parts/Space";
import { Pager } from "./parts/Pager";
import { authQuery, spacesQuery } from "./parts/Query";
import Cookie from "js-cookie";
import { stringToDate } from "../functions";

const query = (token, page) => {
  return JSON.stringify({
    query: `query($token: String, $page: Int) {
      auth(token: $token) { ${authQuery} }
      spaces(page: $page) { ${spacesQuery} }
    }`,
    variables: {
      page: page,
      token: token
    }
  });
};

const expireUpdate = res => {
  if (res.auth.status === true) {
    Cookie.set("uid", Cookie.get("uid"), {
      expires: stringToDate(res.auth.expire),
      secure: true
    });
  } else {
    Cookie.remove("uid");
  }
};

class Space extends Component {
  constructor(props) {
    super(props);
    const page = this.props.match.params.page || 1;
    const page_loader = () => {
      this.props
        .queryAction(query(Cookie.get("uid"), page))
        .then(res => expireUpdate(res));
    };
    if (this.props.state.spaces.edges) {
      if (this.props.state.spaces.currentPage !== page) {
        page_loader();
      }
    }
    if (!this.props.state.spaces.edges) {
      page_loader();
    }
  }

  static fetchAction(store, token) {
    return store.dispatch(actions.queryAction(query(token)));
  }

  pageLoader(e) {
    const page_number = e.currentTarget.dataset.page || 1;
    this.props
      .queryAction(query(Cookie.get("uid"), parseInt(page_number, 10)))
      .then(res => expireUpdate(res));
  }

  render() {
    return (
      <Fragment>
        <Helmet>
          <title>スペース｜BASYO KASHI</title>
          <meta name="description" content="スペースです。" />
        </Helmet>
        <div className="content">
          <div className="content_inner">
            <ContentHeader
              title="スペース"
              text="レンタルスペースをかんたん予約"
            />
            <SpaceBlock data={this.props.state.spaces} />
            {this.props.state.spaces.edges && (
              <Pager
                data={this.props.state.spaces}
                load={this.pageLoader.bind(this)}
                current={this.props.match.params.page || 1}
                slug="/space/page/"
              />
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
)(Space);
