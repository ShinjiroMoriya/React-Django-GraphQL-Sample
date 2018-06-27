import { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actions from "../actions";
import Cookie from "js-cookie";
import { authQuery } from "./parts/Query";

class Logout extends Component {
  constructor(props) {
    super(props);

    this.props.mutationAction(
      JSON.stringify({
        query: `mutation($token: String!) {
          logout(token: $token) {
            auth { ${authQuery} }
            success errors { field message }
          }
        }`,
        variables: {
          token: Cookie.get("uid")
        }
      }),
      "logout"
    );

    Cookie.remove("uid");

    this.props.history.push("login");
  }

  render() {
    return null;
  }
}

export default connect(
  state => ({ state }),
  dispatch => ({ ...bindActionCreators(actions, dispatch) })
)(Logout);
