import fetch from "isomorphic-fetch";
import Cookie from "js-cookie";

const GRAPHQL_URL = process.env.GRAPHQL_URL;

const timeoutFetch = (ms, promise) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject("通信タイムアウト");
    }, ms);
    promise.then(resolve, reject);
  });
};

export const queryNoAction = () => dispatch => {
  dispatch({
    type: "NO_REQUEST",
    queryLoading: false
  });
};

export const queryAction = (query, uid) => dispatch => {
  const token = uid || Cookie.get("uid");
  dispatch({
    type: "REQUEST",
    queryLoading: true
  });
  return timeoutFetch(
    30000,
    fetch(GRAPHQL_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token || null
      },
      body: query
    })
  )
    .then(response => response.json())
    .then(json => {
      if (json.errors) {
        return dispatch({
          type: "FAILED",
          queryLoading: false,
          messages: [
            {
              field: "exception",
              message: json.errors[0].message
            }
          ]
        });
      }
      return dispatch({
        type: "SUCCESS",
        queryLoading: false,
        messages: [],
        ...json.data
      });
    });
};

export const mutationAction = (query, type) => dispatch => {
  dispatch({
    type: "REQUEST",
    mutationLoading: true
  });
  return timeoutFetch(
    30000,
    fetch(GRAPHQL_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: Cookie.get("uid") || null
      },
      body: query
    })
  )
    .then(response => response.json())
    .then(json => {
      if (json.errors) {
        return dispatch({
          type: "FAILED",
          mutationLoading: false,
          messages: [
            {
              field: "exception",
              message: json.errors[0].message
            }
          ]
        });
      }
      if (json.data[type].success === true) {
        return dispatch({
          type: "SUCCESS",
          mutationLoading: false,
          messages: [],
          ...json.data[type]
        });
      } else {
        return dispatch({
          type: "FAILED",
          mutationLoading: false,
          messages: json.data[type].errors
        });
      }
    });
};

export const disabledAction = () => dispatch => {
  dispatch({
    type: "DISABLED",
    queryLoading: true
  });
};

export const errorAction = e => dispatch => {
  dispatch({
    type: "ERROR",
    queryLoading: false,
    messages: [
      {
        field: "exception",
        message: e
      }
    ]
  });
};

export const accountAction = account => dispatch => {
  dispatch({
    type: "ACCOUNT",
    queryLoading: false,
    account: account
  });
};
