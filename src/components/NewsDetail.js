import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { Helmet } from "react-helmet";
import { bindActionCreators } from "redux";
import { ContentHeader } from "./parts/ContentHeader";
import * as actions from "../actions";
import { authQuery, newsItemQuery } from "./parts/Query";
import { dateDisplay, expireUpdate } from "../functions";

const query = pk => {
  return JSON.stringify({
    query: `query($newsId: String!) { ` +
      `auth { ${authQuery} } ` +
      `newsItem(newsId: $newsId) { ${newsItemQuery} } ` +
    `}`,
    variables: { newsId: pk }
  });
};

class NewsDetail extends Component {
  constructor(props) {
    super(props);
    this.props
      .queryAction(query(this.props.match.params.pk))
      .then(res => expireUpdate(res))
      .catch(e => console.log(e));
  }

  static fetchAction(store, token, params) {
    return store.dispatch(actions.queryAction(query(params.pk), token));
  }

  render() {
    return (
      <Fragment>
        <Helmet>
          <title>{`${
            this.props.state.newsItem.name
          }｜ニュース｜BASYO KASHI`}</title>
          <meta
            name="description"
            content={`${this.props.state.newsItem.name}です`}
          />
        </Helmet>
        <div className="content">
          <div className="content_inner">
            {this.props.state.queryLoading ? (
              <div className="_block_loading" />
            ) : (
              <Fragment>
                <ContentHeader title={this.props.state.newsItem.name} />
                <div className="news_detail">
                  <p className="news_detail_date">
                    {dateDisplay(
                      this.props.state.newsItem.activeDate,
                      "Y年MM月DD日"
                    )}
                  </p>
                  <div
                    className="news_detail_content"
                    dangerouslySetInnerHTML={{
                      __html: this.props.state.newsItem.content
                    }}
                  />
                </div>
                <p className="color_3_btn">
                  <Link to="/news">一覧に戻る</Link>
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
)(NewsDetail);
