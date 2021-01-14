module.exports = function setErrorViewName(viewName) {
    return function(req, res, next) {
        res.locals.validationErrorViewName = viewName;
        next();
    }
}