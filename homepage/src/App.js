import React, { Component } from "react";
// import HomePage from './components/HomePage'
import Home from "./components/Home";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Blog from "./components/Blog";
import Package from "./components/Package";
import Navigation from "./components/Navigation";
import { I18nextProvider } from "react-i18next";
import i18n from "./components/i18n";
import PackageModal from "./components/PackageModal";
import Cookies from "js-cookie";
import Axios from "axios";
import TagManager from "react-gtm-module";

class App extends Component {
    state = {
        packageModal: false,
        packageName: "",
        packagePrice: 0,
        email: ""
    };

    async componentDidMount() {
        if (Cookies.get("isLoggedIn") === "true") {
            let cookieValue = Cookies.get("email");
            let res = await Axios.get("https://beta.arislab.ai/api/utility/emailDecoder/encodedEmail/" + cookieValue);
            let email = res.data.result;
            this.setState({
                email: email
            });
        }
    }

    togglePackageModal = () => {
        this.setState({ packageModal: !this.state.packageModal });
    };

    selectPackage = (packageName, price) => {
        this.setState({ packageName: packageName, packagePrice: price });
        this.togglePackageModal();
    };

    clickSignUpBtn = async position => {
        const tagManagerArgs1 = {
            dataLayer: {
                event: "ARIS",
                pageCategory: "Homepage",
                pageAction: "Click",
                pageLabel: "Click " + position + " sign up button",
                pageUser: this.props.email || "Anonymous"
            }
        };
        await TagManager.dataLayer(tagManagerArgs1);
        const tagManagerArgs2 = {
            dataLayer: {
                event: "ARIS",
                pageCategory: "Homepage",
                pageAction: "Click",
                pageLabel: "v2 Click " + position + " sign up button",
                pageUser: this.props.email || "Anonymous"
            }
        };
        await TagManager.dataLayer(tagManagerArgs2);
        window.location.href = "https://beta.arislab.ai/";
    };

    render() {
        return (
            <I18nextProvider i18n={i18n}>
                <BrowserRouter>
                    <div className={"" + i18n.language.includes("en") ? "en" : "th"}>
                        <PackageModal
                            show={this.state.packageModal}
                            onClose={this.togglePackageModal}
                            packageName={this.state.packageName}
                            packagePrice={this.state.packagePrice}
                            email={this.state.email}
                        />
                        <Navigation />
                        <Switch>
                            <Route path="/package" render={props => <Package {...props} clickSignUpBtn={this.clickSignUpBtn} selectPackage={this.selectPackage} />} />
                            <Route path="/blog" component={Blog} />
                            <Route path="/" component={Home} />
                        </Switch>
                    </div>
                </BrowserRouter>
            </I18nextProvider>
        );
    }
}

export default App;
