export const processBirthDate = (date: string) => {
    let today = new Date().getTime();
    let birthDate = parseInt(date);

    let difference = today - birthDate;
    let yearsDifference = difference / (1000 * 3600 * 24 * 365);

    return yearsDifference;
};