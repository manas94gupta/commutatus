// takes in a date and returns the number of days from current date
export const daysFromNow = date => {
    // 1000*60*60*24
    const millisecondsPerDay = 86400000;

    // current date
    const now = new Date();

    const nowSecs = Date.parse(now);
    const dateSecs = Date.parse(date);

    const daysFromNow = (dateSecs - nowSecs) / millisecondsPerDay;

    return daysFromNow;
};

// iterate over a non nested object and set the specified value to all its properties
export const setObjPropVal = (obj, val) => {
    const objCopy = { ...obj };
    for (const key of Object.keys(objCopy)) {
        if (objCopy[key] instanceof Object) {
            // check if property is an object
            // recursively call the function to set its properties
            objCopy[key] = { ...setObjPropVal(objCopy[key], val) };
        } else {
            objCopy[key] = val;
        }
    }
    return objCopy;
};
