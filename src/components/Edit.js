import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { toast } from "react-toastify";
import "react-select/dist/react-select.css";
import validate from "../utils/validate";
import { setObjPropVal } from "../utils/helpers";

// Components
import Loader from "./Loader";
import FormInputField from "./FormInputField";
import FormSelectField from "./FormSelectField";

// css
import "../css/Edit.css";

class Edit extends Component {
    state = {
        redirectToHome: false, // when set to true, will redirect to home page
        details: {}, // holds the opportunity data
        touched: {}, // stores the state for whether each field has been visited once, errors are shown only after the field has been visited
        loading: true, // displays a loader while fetching the opportunity data
        backgroundsLoading: true, // shows a loader in background field when list is loading
        skillsLoading: true, // shows a loader in skills field when list is loading
    };

    componentDidMount() {
        this.fetchOpportunityDetails();
        this.fetchBackgroundsList();
        this.fetchSkillsList();
    }

    // fetch the opportunity details and store in details state
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

    // fetch backgrounds list and store in backgrounds state
    fetchBackgroundsList = () => {
        this.setState({
            backgroundsLoading: true,
        });

        fetch(
            `http://${
                process.env.REACT_APP_API_URL
            }/v2/lists/backgrounds?access_token=${
                process.env.REACT_APP_ACCESS_TOKEN
            }
            `,
            {
                method: "GET",
            }
        )
            .then(response => {
                if (response.status !== 200) {
                    this.setState({
                        backgroundsLoading: false,
                    });
                    return;
                }

                // Examine the text in the response
                response.json().then(data => {
                    this.setState({
                        backgroundsList: data,
                        backgroundsLoading: false,
                    });
                    return;
                });
            })
            .catch(err => {
                // console.log("Cannot retrieve Data:", err);
                this.setState({
                    backgroundsLoading: false,
                });
            });
    };

    // fetch skills list and store in skills state
    fetchSkillsList = () => {
        this.setState({
            skillsLoading: true,
        });

        fetch(
            `http://${
                process.env.REACT_APP_API_URL
            }/v2/lists/skills?access_token=${
                process.env.REACT_APP_ACCESS_TOKEN
            }`,
            {
                method: "GET",
            }
        )
            .then(response => {
                if (response.status !== 200) {
                    this.setState({
                        skillsLoading: false,
                    });
                    return;
                }

                // Examine the text in the response
                response.json().then(data => {
                    this.setState({
                        skillsList: data,
                        skillsLoading: false,
                    });
                    return;
                });
            })
            .catch(err => {
                // console.log("Cannot retrieve Data:", err);
                this.setState({
                    skillsLoading: false,
                });
            });
    };

    // handle the input fields change and updates their state
    handleInputChange = event => {
        const target = event.target;
        const value = target.value;
        const section = event.target.getAttribute("section");
        const name = target.name;

        if (section) {
            this.setState(prevState => {
                return {
                    details: {
                        ...prevState.details,
                        [section]: {
                            ...prevState.details[section],
                            [name]: value,
                        },
                    },
                };
            });
        } else {
            this.setState(prevState => {
                return {
                    details: {
                        ...prevState.details,
                        [name]: value,
                    },
                };
            });
        }
    };

    // handle and update state for select fields
    handleSelectChange = (value, name) => {
        // patch request doesn't seem to work when level and option properties are not there in the selected value, these values are not available in the options retrieved from the lists api, so i have hard coded these for now
        const updatedValue = value.map(val => ({
            ...val,
            level: null,
            option: "preferred",
        }));

        this.setState(prevState => {
            return {
                details: {
                    ...prevState.details,
                    [name]: updatedValue,
                },
            };
        });
    };

    // handles location state and autocomplete using google maps for city field
    handleLocationChange = event => {
        const target = event.target;
        const value = event.target.value;
        const section = event.target.getAttribute("section");
        const name = event.target.name;
        // eslint-disable-next-line no-unused-vars
        const autocomplete = new window.google.maps.places.Autocomplete(target);
        autocomplete.addListener("place_changed", () => {
            const city = autocomplete.getPlace();
            const lat = city.geometry.location.lat();
            const lng = city.geometry.location.lng();
            const address = city.formatted_address;
            this.setState(prevState => {
                return {
                    details: {
                        ...prevState.details,
                        lat,
                        lng,
                        [section]: {
                            ...prevState.details[section],
                            [name]: address,
                        },
                    },
                };
            });
        });
        this.setState(prevState => {
            return {
                details: {
                    ...prevState.details,
                    [section]: {
                        ...prevState.details[section],
                        [name]: value,
                    },
                },
            };
        });
    };

    // sets the touched state for the field to true, if it has been visited
    handleInputBlur = (name, section) => {
        if (section) {
            this.setState(prevState => {
                return {
                    touched: {
                        ...prevState.touched,
                        [section]: {
                            ...prevState.touched[section],
                            [name]: true,
                        },
                    },
                };
            });
        } else {
            this.setState(prevState => {
                return {
                    touched: {
                        ...prevState.touched,
                        [name]: true,
                    },
                };
            });
        }
    };

    // Submit form data
    submitForm = event => {
        event.preventDefault();

        // check if form has error
        if (validate(this.state.details).hasErrors) {
            // set touched state to true for each field to show errors if any
            this.setState({
                touched: {
                    ...setObjPropVal(this.state.touched, true),
                },
            });

            // show message to review form
            toast.error("Review form for errors");
            // scroll to top
            window.scrollTo(0, 0);

            return; // do not continue if errors
        }

        this.setState({
            loading: true,
        });

        const requestData = {
            access_token: process.env.REACT_APP_ACCESS_TOKEN,
            opportunity: {
                ...this.state.details,
            },
        };

        fetch(`http://${process.env.REACT_APP_API_URL}/v2/opportunities/6124`, {
            method: "PATCH",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(requestData),
        })
            .then(response => {
                if (response.status !== 200) {
                    toast.error("Looks like there was a problem. Try Again!");
                    this.setState({
                        loading: false,
                    });
                    return;
                }

                toast.success("Opportunity updated succesfully!");
                this.setState({
                    redirectToHome: true,
                    loading: false,
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
        // destructure the required fields from the details state
        const {
            title = "",
            skills = "",
            description = "",
            backgrounds = "",
            role_info = {},
            specifics_info = {},
            applications_close_date = "",
            earliest_start_date = "",
            latest_end_date = "",
        } = this.state.details;

        // validate fields get the respective errors
        const errors = validate(this.state.details).errors;

        return (
            <Loader loading={this.state.loading}>
                {/* Redirect to home */}
                {this.state.redirectToHome && (
                    <Redirect
                        push
                        to={{
                            pathname: "/",
                        }}
                    />
                )}

                <div className="edit">
                    <div className="edit__header">Edit Details</div>

                    <form onSubmit={this.submitForm}>
                        <FormInputField
                            name="title"
                            placeholder="Title"
                            value={title}
                            onChange={this.handleInputChange}
                            onBlur={() => this.handleInputBlur("title")}
                            // if there is an error, then it will be displaye, if the field has been visited atleast once
                            error={
                                this.state.touched.title && errors.title
                                    ? errors.title
                                    : ""
                            }
                        />
                        <FormInputField
                            name="description"
                            placeholder="Description"
                            value={description}
                            onChange={this.handleInputChange}
                            onBlur={() => this.handleInputBlur("description")}
                            error={
                                this.state.touched.description &&
                                errors.description
                                    ? errors.description
                                    : ""
                            }
                        />
                        <FormInputField
                            name="city"
                            section="role_info"
                            placeholder="City"
                            value={role_info ? role_info.city : ""}
                            onChange={this.handleLocationChange}
                            onBlur={() =>
                                this.handleInputBlur("city", "role_info")
                            }
                            error={
                                this.state.touched.role_info &&
                                this.state.touched.role_info.city &&
                                errors.role_info.city
                                    ? errors.role_info.city
                                    : ""
                            }
                        />
                        <FormSelectField
                            name="backgrounds"
                            placeholder="Backgrounds"
                            multi={true}
                            value={backgrounds}
                            closeOnSelect={false}
                            onChange={(value, name) =>
                                this.handleSelectChange(value, name)
                            }
                            onBlur={() => this.handleInputBlur("backgrounds")}
                            labelKey="name"
                            valueKey="id"
                            isLoading={this.state.backgroundsLoading}
                            options={this.state.backgroundsList}
                            error={
                                this.state.touched.backgrounds &&
                                errors.backgrounds
                                    ? errors.backgrounds
                                    : ""
                            }
                        />
                        <FormSelectField
                            name="skills"
                            placeholder="Skills"
                            multi={true}
                            closeOnSelect={false}
                            value={skills}
                            onChange={(value, name) =>
                                this.handleSelectChange(value, name)
                            }
                            onBlur={() => this.handleInputBlur("skills")}
                            labelKey="name"
                            valueKey="id"
                            isLoading={this.state.skillsLoading}
                            options={this.state.skillsList}
                            error={
                                this.state.touched.skills && errors.skills
                                    ? errors.skills
                                    : ""
                            }
                        />
                        <FormInputField
                            name="selection_process"
                            section="role_info"
                            placeholder="Selection Process"
                            value={role_info ? role_info.selection_process : ""}
                            onChange={this.handleInputChange}
                            onBlur={() =>
                                this.handleInputBlur(
                                    "selection_process",
                                    "role_info"
                                )
                            }
                            error={
                                this.state.touched.role_info &&
                                this.state.touched.role_info
                                    .selection_process &&
                                errors.role_info.selection_process
                                    ? errors.role_info.selection_process
                                    : ""
                            }
                        />
                        <FormInputField
                            name="salary"
                            type="number"
                            section="specifics_info"
                            placeholder="Salary"
                            value={specifics_info ? specifics_info.salary : ""}
                            min="0"
                            onChange={this.handleInputChange}
                            onBlur={() =>
                                this.handleInputBlur("salary", "specifics_info")
                            }
                            error={
                                this.state.touched.specifics_info &&
                                this.state.touched.specifics_info.salary &&
                                errors.specifics_info.salary
                                    ? errors.specifics_info.salary
                                    : ""
                            }
                        />
                        <FormInputField
                            name="applications_close_date"
                            type="date"
                            placeholder="Application Close Date"
                            value={
                                applications_close_date
                                    ? new Date(applications_close_date)
                                          .toISOString()
                                          .substring(0, 10)
                                    : ""
                            }
                            onChange={this.handleInputChange}
                            onBlur={() =>
                                this.handleInputBlur("applications_close_date")
                            }
                            error={
                                this.state.touched.applications_close_date &&
                                errors.applications_close_date
                                    ? errors.applications_close_date
                                    : ""
                            }
                        />
                        <FormInputField
                            name="earliest_start_date"
                            type="date"
                            placeholder="Earliest Start Date"
                            value={
                                earliest_start_date
                                    ? new Date(earliest_start_date)
                                          .toISOString()
                                          .substring(0, 10)
                                    : ""
                            }
                            onChange={this.handleInputChange}
                            onBlur={() =>
                                this.handleInputBlur("earliest_start_date")
                            }
                            error={
                                this.state.touched.earliest_start_date &&
                                errors.earliest_start_date
                                    ? errors.earliest_start_date
                                    : ""
                            }
                        />
                        <FormInputField
                            name="latest_end_date"
                            type="date"
                            placeholder="Latest End Date"
                            value={
                                latest_end_date
                                    ? new Date(latest_end_date)
                                          .toISOString()
                                          .substring(0, 10)
                                    : ""
                            }
                            onChange={this.handleInputChange}
                            onBlur={() =>
                                this.handleInputBlur("latest_end_date")
                            }
                            error={
                                this.state.touched.latest_end_date &&
                                errors.latest_end_date
                                    ? errors.latest_end_date
                                    : ""
                            }
                        />
                        <button className="edit__submit" type="submit">
                            Submit
                        </button>
                    </form>
                </div>
            </Loader>
        );
    }
}

export default Edit;
