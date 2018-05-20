import React, { Component } from "react";
import { toast } from "react-toastify";

// Components
import Loader from "./Loader";

// css
import "../css/Main.css";

class Main extends Component {
    state = {
        details: {}, // holds the opportunity data
        loading: true, // displays a loader while fetching the opportunity data
    };

    componentDidMount() {
        this.fetchOpportunityDetails();
    }

    // fetch the opportunity details and store in details object
    fetchOpportunityDetails = () => {
        this.setState({
            loading: true,
        });

        fetch(
            `http://${process.env.REACT_APP_API_URL}/v2/opportunities/${
                process.env.REACT_APP_OPPORTUNITY_ID
            }?access_token=${process.env.REACT_APP_ACCESS_TOKEN}`,
            {
                method: "GET",
            }
        )
            .then(response => {
                if (response.status !== 200) {
                    toast.error("Looks like there was a problem. Try Again!");
                    this.setState({
                        loading: false,
                    });
                    return;
                }

                // Examine the text in the response
                response.json().then(data => {
                    this.setState({
                        details: { ...data },
                        loading: false,
                    });
                    return;
                });
            })
            .catch(err => {
                // console.log("Cannot retrieve Data:", err);
                toast.error("Something Went Wrong. Try Again Later!");
                this.setState({
                    loading: false,
                });
            });
    };

    render() {
        // destructure the required fields from the details object
        const {
            cover_photo_urls = "",
            title = "",
            branch,
            location = "",
            skills = [],
            description = "",
            backgrounds = [],
            role_info = {},
            specifics_info = {},
            lat = "",
            lng = "",
            applications_close_date = "",
            earliest_start_date = "",
            latest_end_date = "",
        } = this.state.details;

        return (
            <Loader loading={this.state.loading}>
                <div className="main">
                    <div className="main__hero flex-row">
                        <div
                            className="main__hero-pic"
                            style={{
                                backgroundImage: `url(
                                    ${cover_photo_urls}
                                )`,
                                backgroundSize: "cover",
                            }}
                        />
                        <div className="main__hero-content flex-column">
                            <div className="main__hero-title">{title}</div>
                            <div className="main__hero-organisation">
                                <span className="main__hero-org-name">
                                    {branch ? branch.organisation.name : ""}
                                </span>
                                <span className="main__hero-org-location">
                                    {location}
                                </span>
                            </div>
                            <div className="main__hero-tags-wrapper flex-row">
                                {skills &&
                                    skills.map((skill, index) => (
                                        <span
                                            key={index}
                                            className="main_hero-tag"
                                        >
                                            {skill.name}
                                        </span>
                                    ))}
                            </div>
                        </div>
                    </div>

                    <div className="main__body-wrapper">
                        <div className="main__body">
                            <div className="main__body-description main__body-section">
                                <div className="main__body-head">
                                    Description
                                </div>
                                <div className="main__body-content">
                                    {description}
                                </div>
                            </div>
                            <div className="main__body-background main__body-section">
                                <div className="main__body-head">
                                    Preferred Background
                                </div>
                                <div className="main__body-content">
                                    {backgrounds &&
                                        backgrounds.map((background, index) => (
                                            <span
                                                key={index}
                                                className="main__body-background-item"
                                            >
                                                {background.name}
                                            </span>
                                        ))}
                                </div>
                            </div>
                            <div className="main__body-selection main__body-section">
                                <div className="main__body-head">
                                    Selection Process
                                </div>
                                <div className="main__body-content">
                                    {role_info
                                        ? role_info.selection_process
                                        : "N.A."}
                                </div>
                            </div>
                            <div className="main__body-salary main__body-section">
                                <div className="main__body-head">Salary</div>
                                <div className="main__body-content">
                                    {specifics_info
                                        ? specifics_info.salary
                                        : "N.A."}
                                </div>
                            </div>
                            <div className="main__body-map main__body-section">
                                <img
                                    src={`https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&key=${
                                        process.env.REACT_APP_GMAPS_KEY
                                    }&zoom=14&size=450x100&markers=${lat},${lng}&scale=1`}
                                    alt=""
                                />
                            </div>
                        </div>
                    </div>

                    <div className="main__footer flex-row flex-space-between-center">
                        <div className="main__footer-app-close-date main__footer-section">
                            <div className="main__body-head">
                                Application Close Date
                            </div>
                            <div className="main__body-content">
                                {new Date(
                                    applications_close_date
                                ).toLocaleDateString()}
                            </div>
                        </div>
                        <div className="main__footer-start-date main__footer-section">
                            <div className="main__body-head">
                                Earliest Start Date
                            </div>
                            <div className="main__body-content">
                                {new Date(
                                    earliest_start_date
                                ).toLocaleDateString()}
                            </div>
                        </div>
                        <div className="main__footer-end-date main__footer-section">
                            <div className="main__body-head">
                                Latest End Date
                            </div>
                            <div className="main__body-content">
                                {new Date(latest_end_date).toLocaleDateString()}
                            </div>
                        </div>
                    </div>
                </div>
            </Loader>
        );
    }
}

export default Main;
