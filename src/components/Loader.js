import React, { Fragment } from "react";

// CSS
import "../css/Loader.css";

// Displays a loader, if loading is true else renders its children
const Loader = ({ loading, children }) => {
    const loader = (
        <div className="loader">
            <span />
            <span />
            <span />
            <span />
        </div>
    );
    return <Fragment>{loading ? loader : children}</Fragment>;
};

export default Loader;
