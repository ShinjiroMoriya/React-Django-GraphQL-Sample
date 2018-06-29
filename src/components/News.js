import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { Helmet } from "react-helmet";
import * as actions from "../actions";
import { bindActionCreators } from "redux";
import { ContentHeader } from "./parts/ContentHeader";
import { NewsBlock } from "./parts/News";
import { Pager } from "./parts/Pager";
import { authQuery, newsQuery } from "./parts/Query";
import { expireUpdate } from "../functions";

const query = page => {
  return JSON.stringify({
    query:
      `query($page: Int) { ` +
      `auth { ${authQuery} } ` +
      `newsItems(page: $page) { ${newsQuery} } ` +
      `}`,
    variables: { page: page }
  });
};

class News extends Component {
  constructor(props) {
    super(props);
    const page = this.props.match.params.page || 1;
    const contentLoader = () => {
      this.props
        .queryAction(query(page))
        .then(res => expireUpdate(res))
        .catch(e => console.log(e));
    };
    if (this.props.state.newsItems.edges) {
      if (this.props.state.newsItems.currentPage !== page) {
        contentLoader();
      }
    }
    if (!this.props.state.newsItems.edges) {
      contentLoader();
    }
  }

  static fetchAction(store, token, params) {
    const news_page = params.page || 1;
    return store.dispatch(actions.queryAction(query(news_page), token));
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
          <title>ニュース｜BASYO KASHI</title>
          <meta name="description" content="ニュースです。" />
        </Helmet>
        <div className="content">
          <div className="content_inner">
            <ContentHeader title="ニュース" text="最新情報をお届け" />
            {this.props.state.queryLoading && (
              <div className="_block_loading" />
            )}
            <NewsBlock data={this.props.state.newsItems} />
            {this.props.state.newsItems.edges && (
              <Pager
                data={this.props.state.newsItems}
                load={this.pageLoader.bind(this)}
                current={this.props.match.params.page || 1}
                slug="/news/page/"
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
)(News);
