import { daysFromNow } from "./helpers";

// Validation logic for the form

// validate all the fields and return respective errors
const validate = ({
    title,
    skills = [],
    description,
    backgrounds = [],
    role_info = {},
    specifics_info = {},
    applications_close_date,
    earliest_start_date,
    latest_end_date,
}) => {
    const errors = {};
    let hasErrors = false;

    // errors
    const reqError = "This field is required";
    const titleError = "Cannot be more than 100 characters";
    const backgroundsError = "Maximum 3 backgrounds can be set";
    const appCloseMinError = "Cannot be less than 30 days from current date";
    const appCloseMaxError = "Cannot be more than 90 days from current date";
    const salError = "Cannot be less than 0";

    if (!title) {
        errors.title = reqError;
        hasErrors = true;
    }
    if (title && title.length > 100) {
        errors.title = titleError;
        hasErrors = true;
    }

    if (!skills || skills.length === 0) {
        errors.skills = reqError;
        hasErrors = true;
    }

    if (!description) {
        errors.description = reqError;
        hasErrors = true;
    }

    if (!backgrounds || backgrounds.length === 0) {
        errors.backgrounds = reqError;
        hasErrors = true;
    }
    if (backgrounds && backgrounds.length > 3) {
        errors.backgrounds = backgroundsError;
        hasErrors = true;
    }

    if (role_info) {
        const roleErrors = {};

        if (!role_info.city) {
            roleErrors.city = reqError;
            hasErrors = true;
        }

        if (!role_info.selection_process) {
            roleErrors.selection_process = reqError;
            hasErrors = true;
        }

        errors.role_info = roleErrors;
    }

    if (specifics_info) {
        const specificsErrors = {};

        if (!specifics_info.salary) {
            specificsErrors.salary = reqError;
            hasErrors = true;
        }
        if (specifics_info.salary < 0) {
            specificsErrors.salary = salError;
            hasErrors = true;
        }

        errors.specifics_info = specificsErrors;
    }

    if (!applications_close_date) {
        errors.applications_close_date = reqError;
        hasErrors = true;
    }
    if (applications_close_date && daysFromNow(applications_close_date) < 30) {
        errors.applications_close_date = appCloseMinError;
        hasErrors = true;
    }
    if (applications_close_date && daysFromNow(applications_close_date) > 90) {
        errors.applications_close_date = appCloseMaxError;
        hasErrors = true;
    }

    if (!earliest_start_date) {
        errors.earliest_start_date = reqError;
        hasErrors = true;
    }

    if (!latest_end_date) {
        errors.latest_end_date = reqError;
        hasErrors = true;
    }

    return { errors, hasErrors };
};

export default validate;
