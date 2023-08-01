
const regex = /^(?!.*\s)(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[~`!@#$%^&*()--+={}\[\]|\\:;"'<>,.?/_₹]).{7,12}$/;

const validatePassword = (password: string) => {

    return regex.test(password);

};

export default validatePassword;
