import React from "react";
import { createGenerateClassName, jssPreset } from "@material-ui/core";
import { FuseLayout, FuseTheme } from "@fuse";
import JssProvider from "react-jss/lib/JssProvider";
import Provider from "react-redux/es/components/Provider";
import { Router } from "react-router-dom";
import { create } from "jss";
import jssExtend from "jss-extend";
import history from "../history";
import store from "./store";
import AppContext from "./AppContext";
import routes from "./fuse-configs/routesConfig";

import { I18nextProvider } from "react-i18next";
import i18n from "./i18n";

const jss = create({
  ...jssPreset(),
  plugins: [...jssPreset().plugins, jssExtend()],
});

jss.options.insertionPoint = document.getElementById("jss-insertion-point");
const generateClassName = createGenerateClassName();

const App = () => {
  return (
    <I18nextProvider i18n={i18n}>
      <AppContext.Provider
        value={{
          routes,
        }}
      >
        <JssProvider jss={jss} generateClassName={generateClassName}>
          <Provider store={store}>
            <Router history={history}>
              <FuseTheme>
                <FuseLayout />
              </FuseTheme>
            </Router>
          </Provider>
        </JssProvider>
      </AppContext.Provider>
    </I18nextProvider>
  );
};

export default App;
