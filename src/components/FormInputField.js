import React from "react";

const FormInputField = ({
    name,
    section,
    placeholder,
    value,
    min,
    max,
    onChange,
    onBlur,
    type = "text",
    error,
}) => (
    <div className="edit__field">
        <div className="edit__field-head">{placeholder}</div>
        <input
            className="edit__field-input"
            name={name}
            section={section}
            type={type}
            value={value}
            min={min}
            max={max}
            onChange={onChange}
            onBlur={onBlur}
            style={{
                borderColor: `${error ? "red" : ""}`,
            }}
        />
        <div className="edit__field-error">{error}</div>
    </div>
);

export default FormInputField;
