import React, { Component } from "react";
import { connect } from "react-redux";
import { Navigation } from "./parts/Navs";

class Footer extends Component {
  render() {
    return (
      <footer className="footer">
        <div className="footer_logo">
          <img src="/assets/images/logo_w.svg" alt="BASYO KASHI" />
        </div>
        <ul className="footer_link">
          <Navigation data={this.props} />
        </ul>
        <p className="footer_copy">
          <small>&copy; 2018 BASYO KASHI. All Rights Reserved.</small>
        </p>
      </footer>
    );
  }
}

export default connect(state => ({ state }))(Footer);
