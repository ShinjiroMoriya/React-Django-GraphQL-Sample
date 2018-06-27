import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { Navigation } from "./parts/Navs";
import { bindActionCreators } from "redux";
import * as actions from "../actions";

class Header extends Component {
  spMenu() {
    document.body.classList.toggle("open");
  }

  render() {
    return (
      <header className="header">
        <div className="header_logo">
          <Link to="/">
            <img src="/assets/images/logo.svg" alt="BASYO KASHI" />
          </Link>
        </div>
        {!this.props.state.queryLoading && (
          <Fragment>
            <div className="header_menu">
              <ul className="header_menu_list">
                <Navigation data={this.props} side={this.spMenu} />
              </ul>
              {this.props.state.auth.status === true && (
                <Fragment>
                  <p className="header_account_link">
                    {this.props.state.auth.account.name && (
                      <Link to="/account" onClick={this.spMenu}>
                        {this.props.state.auth.account.name}さん
                      </Link>
                    )}
                  </p>
                  <p className="header_account_logout">
                    <Link to="/logout" onClick={this.spMenu}>
                      ログアウト
                    </Link>
                  </p>
                </Fragment>
              )}
            </div>
            <div className="sp_menu" onClick={this.spMenu}>
              <div className="sp_menu_trigger">
                <span />
                <span />
                <span />
              </div>
            </div>
          </Fragment>
        )}
      </header>
    );
  }
}

export default connect(
  state => ({ state }),
  dispatch => ({ ...bindActionCreators(actions, dispatch) })
)(Header);
