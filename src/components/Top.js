import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { Helmet } from "react-helmet";
import { ContentHeader } from "./parts/ContentHeader";
import * as actions from "../actions";
import { bindActionCreators } from "redux";
import { NewsBlock } from "./parts/News";
import { SpaceBlock } from "./parts/Space";
import { authQuery, topSpaceQuery, topNewsQuery } from "./parts/Query";
import { expireUpdate } from "../functions";

const query = () => {
  return JSON.stringify({
    query: `query { ` +
      `auth { ${authQuery} } ` +
      `topSpaces { ${topSpaceQuery} } ` +
      `topNewsItems { ${topNewsQuery} } ` +
    `}`
  });
};

class Top extends Component {
  constructor(props) {
    super(props);
    if (!this.props.state.topSpaces.edges) {
      this.props
        .queryAction(query())
        .then(res => expireUpdate(res))
        .catch(e => console.log(e));
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
          <title>BASYO KASHI</title>
          <meta name="description" content="BASYO KASHI" />
        </Helmet>
        <div className="full_image">
          <img src="/assets/images/main.jpg" alt="" />
        </div>
        <div className="content">
          <div className="content_inner">
            <ContentHeader
              title="おすすめスペース"
              text="レンタルスペースをかんたん予約"
            />
            <SpaceBlock data={this.props.state.topSpaces} />
            <p className="btn_1">
              <Link to="/space">もっと見る</Link>
            </p>
          </div>
        </div>
        <div className="content _border">
          <div className="content_inner">
            <header className="content_header">
              <h2 className="content_head">ニュース</h2>
            </header>
            <NewsBlock data={this.props.state.topNewsItems} />
            <p className="btn_1">
              <Link to="/news">もっと見る</Link>
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
)(Top);
