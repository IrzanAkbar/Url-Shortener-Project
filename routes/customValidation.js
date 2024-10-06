var validateEmail = (req,res,next) => {
    var email = req.body.email;
    var errors = [];
    if(!isValidEmail(email)){
        errors.push('Invalid Email');
    }
    req.validationErrors = req.validationErrors || [];
    req.validationErrors.push(...errors);
    next()
}

var validatePass = (req,res,next) => {
    var password = req.body.password;
    var errors = []
    if(!isValidPass(password)){
        errors.push('Password must be at least 6 characters long');
    }
    req.validationErrors = req.validationErrors || [];
    req.validationErrors.push(...errors);
    next()
}

var isValidEmail = (email) => {
    var regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/ 
    return regex.test(email);
}

var isValidPass = (password) => {
    return password.length > 5;
}

module.exports = {validateEmail,validatePass};