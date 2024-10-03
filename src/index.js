import React from "react";
import ReactDOM from "react-dom";
import { HashRouter, Route, Switch, Redirect } from "react-router-dom";

import AdminLayout from "layouts/Admin.js";
import AuthLayout from "layouts/Auth.js";
import { DeckProvider } from "components/context/DeckContext";

ReactDOM.render(
  <HashRouter>
    <Switch>
      <DeckProvider>
        <Route path={`/admin`} component={AdminLayout} />
        <Route path={`/auth`} component={AuthLayout} />
        <Redirect from={`/`} to="/auth/loaddata" />
      </DeckProvider>
    </Switch>
  </HashRouter>,
  document.getElementById("root")
);
