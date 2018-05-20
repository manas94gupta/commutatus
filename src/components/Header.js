import React, { Component } from "react";
import { Link } from "react-router-dom";

// css
import "../css/Header.css";

class Header extends Component {
    render() {
        return (
            <div className="header flex-row flex-space-between-center">
                <div className="header__option-list flex-row flex-space-between-center">
                    <i className="fa fa-star" aria-hidden="true" />
                    <i className="fa fa-share-alt" aria-hidden="true" />
                    <i className="fa fa-flag" aria-hidden="true" />
                </div>
                <div className="header__edit-btn-wrapper">
                    <Link to="/edit" className="header__edit-btn">
                        <i className="fa fa-pencil" aria-hidden="true" /> &nbsp;
                        Edit
                    </Link>
                </div>
            </div>
        );
    }
}

export default Header;
