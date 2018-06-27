import express from "express";
import React from "react";
import ReactDOMServer from "react-dom/server";
import proxy from "http-proxy-middleware";
import assets from "./build/asset-manifest.json";
import https from "https";
import http from "http";
import { readFileSync } from "fs";
import { StaticRouter } from "react-router-dom";
import { Helmet } from "react-helmet";
import { matchRoutes, renderRoutes } from "react-router-config";
import Routes from "./src/routes";
import { minify } from "html-minifier";
import Template from "./src/template";
import helmet from "helmet";
import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import thunk from "redux-thunk";
import reducers from "./src/reducers";
import cookieParser from "cookie-parser";
import favicon from "serve-favicon";
import path from "path";

if (typeof window === "undefined") {
  global.window = {};
}

const PORT = process.env.PORT || 3000;
const DJANGO_PORT = 8000;

if (process.env.DEV) {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}

const app = express();
app.use(cookieParser());
app.use(helmet());
app.use(
  proxy("/graphql", {
    target: "http://localhost:" + DJANGO_PORT
  })
);

app.use("/assets", express.static("build/assets"));
app.use(favicon(path.join(__dirname, "build/assets/images", "favicon.ico")));
const loggedMiddleware = (req, res, next) => {
  if (req.cookies.uid) {
    return res.redirect("/");
  }
  return next();
};

const authMiddleware = (req, res, next) => {
  if (!req.cookies.uid) {
    return res.redirect("/login");
  }
  return next();
};

app.get("/account", authMiddleware);
app.get("/login", loggedMiddleware);
app.get("/register", loggedMiddleware);
app.get("/password", loggedMiddleware);
app.get("/password/*", loggedMiddleware);
app.get("*", (req, res) => {
  const store = createStore(reducers, applyMiddleware(thunk));
  const branch = matchRoutes(Routes, req.url);
  const fetchData = branch.map(({ route, match }) => {
    const fetchAction = route.component.fetchAction;
    const params = Object.keys(match.params).length !== 0 ? match.params : null;
    return fetchAction instanceof Function
      ? fetchAction(store, req.cookies.uid, params)
      : Promise.resolve(null);
  });
  return Promise.all(fetchData)
    .then(() => {
      const context = {};
      const html = ReactDOMServer.renderToStaticMarkup(
        <Provider store={store}>
          <StaticRouter location={req.url} context={context}>
            {renderRoutes(Routes)}
          </StaticRouter>
        </Provider>
      );

      const helmet = Helmet.renderStatic();

      const html_template = minify(
        Template({
          helmet: helmet,
          html: html,
          assets: assets,
          initialState: store.getState()
        }),
        {
          collapseWhitespace: true
        }
      );
      return res.send(html_template);
    })
    .catch(error => {
      res.status(500).send(error.message);
    });
});

if (process.env.DEV) {
  const options = {
    key: readFileSync("../localhost.key"),
    cert: readFileSync("../localhost.crt")
  };
  https.createServer(options, app).listen(PORT);
} else {
  http.createServer(app).listen(PORT);
}
