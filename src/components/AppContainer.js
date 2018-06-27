import React, { Fragment } from "react";
import { renderRoutes } from "react-router-config";
import { Router } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import { connect } from "react-redux";

class AppContainer extends React.Component {
  componentWillMount() {
    this.props.history.listen(() => {
      window.scrollTo(0, 0);
    });
  }

  render() {
    return (
      <Fragment>
        {this.props.state.messages.map((m, index) => {
          return (
            m.field === "exception" && (
              <p key={index} className="error_text">
                {m.message}
              </p>
            )
          );
        })}
        <Header location={this.props.history.location} />
        <Router history={this.props.history}>
          {renderRoutes(this.props.route.routes)}
        </Router>
        <Footer location={this.props.history.location} />
      </Fragment>
    );
  }
}

export default connect(state => ({ state }))(AppContainer);
