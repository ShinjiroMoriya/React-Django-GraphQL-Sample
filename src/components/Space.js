import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { Helmet } from "react-helmet";
import * as actions from "../actions";
import { bindActionCreators } from "redux";
import { ContentHeader } from "./parts/ContentHeader";
import { SpaceBlock } from "./parts/Space";
import { Pager } from "./parts/Pager";
import { authQuery, spacesQuery } from "./parts/Query";
import { expireUpdate } from "../functions";

const query = page => {
  return JSON.stringify({
    query:
      `query($page: Int) { ` +
      `auth { ${authQuery} } ` +
      `spaces(page: $page) { ${spacesQuery} } ` +
      `}`,
    variables: { page: page }
  });
};

class Space extends Component {
  constructor(props) {
    super(props);
    const page = this.props.match.params.page || 1;
    const contentLoader = () => {
      this.props
        .queryAction(query(page))
        .then(res => expireUpdate(res))
        .catch(e => console.log(e));
    };
    if (this.props.state.spaces.edges) {
      if (this.props.state.spaces.currentPage !== page) {
        contentLoader();
      }
    }
    if (!this.props.state.spaces.edges) {
      contentLoader();
    }
  }

  static fetchAction(store, token, params) {
    const space_page = params.page || 1;
    return store.dispatch(actions.queryAction(query(space_page), token));
  }

  pageLoader(e) {
    const page_number = e.currentTarget.dataset.page || 1;
    this.props
      .queryAction(query(parseInt(page_number, 10)))
      .then(res => expireUpdate(res))
      .catch(e => console.log(e));
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
            {this.props.state.queryLoading ? (
              <div className="_block_loading" />
            ) : (
              <Fragment>
                <SpaceBlock data={this.props.state.spaces} />
                <Pager
                  data={this.props.state.spaces}
                  load={this.pageLoader.bind(this)}
                  current={this.props.match.params.page || 1}
                  slug="/space/page/"
                />
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
)(Space);
