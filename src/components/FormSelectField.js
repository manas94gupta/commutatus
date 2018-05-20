import React from "react";
import Select from "react-select";

const FormSelectField = ({
    name,
    placeholder,
    value,
    options,
    onChange,
    onBlur,
    multi,
    closeOnSelect,
    isLoading = false,
    labelKey,
    valueKey,
    error,
}) => (
    <div className="edit__field">
        <div className="edit__field-head">{placeholder}</div>
        <Select
            multi={multi}
            closeOnSelect={closeOnSelect}
            name={name}
            options={options}
            value={value}
            isLoading={isLoading}
            labelKey={labelKey}
            valueKey={valueKey}
            onChange={selected => onChange(selected, name)}
            onBlur={onBlur}
            style={{
                borderColor: `${error ? "red" : ""}`,
            }}
        />
        <div className="edit__field-error">{error}</div>
    </div>
);

export default FormSelectField;
