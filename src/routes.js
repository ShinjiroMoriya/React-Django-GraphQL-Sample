import AppContainer from "./components/AppContainer";
import Top from "./components/Top";
import Space from "./components/Space";
import SpaceDetail from "./components/SpaceDetail";
import Guide from "./components/Guide";
import News from "./components/News";
import NewsDetail from "./components/NewsDetail";
import Login from "./components/Login";
import Logout from "./components/Logout";
import Password from "./components/Password";
import PasswordConfirm from "./components/PasswordConfirm";
import Register from "./components/Register";
import Account from "./components/Account";
import NotFound from "./components/NotFound";

const Routes = [
  {
    component: AppContainer,
    routes: [
      {
        exact: true,
        path: "/",
        component: Top
      },
      {
        exact: true,
        path: "/space",
        component: Space
      },
      {
        exact: true,
        path: "/space/page/:page",
        component: Space
      },
      {
        exact: true,
        path: "/space/:pk",
        component: SpaceDetail
      },
      {
        exact: true,
        path: "/news",
        component: News
      },
      {
        exact: true,
        path: "/news/page/:page",
        component: News
      },
      {
        exact: true,
        path: "/news/:pk",
        component: NewsDetail
      },
      {
        exact: true,
        path: "/guide",
        component: Guide
      },
      {
        exact: true,
        path: "/login",
        component: Login
      },
      {
        exact: true,
        path: "/logout",
        component: Logout
      },
      {
        exact: true,
        path: "/register",
        component: Register
      },
      {
        exact: true,
        path: "/password",
        component: Password
      },
      {
        exact: true,
        path: "/password/:token",
        component: PasswordConfirm
      },
      {
        exact: true,
        path: "/account",
        component: Account
      },
      {
        path: "*",
        component: NotFound
      }
    ]
  }
];

export default Routes;
