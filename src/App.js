import React, { Component, Fragment } from "react";
import { Route, Switch } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Components
import Header from "./components/Header";
import Main from "./components/Main";
import Edit from "./components/Edit";

// Css
import "./App.css";

class App extends Component {
    render() {
        return (
            <Fragment>
                <ToastContainer
                    position="bottom-right"
                    hideProgressBar={true}
                />

                <Switch>
                    <Route path="/edit" component={Edit} />
                    <Route
                        path="/"
                        render={() => (
                            <Fragment>
                                <Header />
                                <Main />
                            </Fragment>
                        )}
                    />
                </Switch>
            </Fragment>
        );
    }
}

export default App;
