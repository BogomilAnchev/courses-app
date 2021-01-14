module.exports = function checkAuth(shouldBeAthenticated) {
    return function (req, res, next) {
        const isNotAuthWhenAuthIsReuired = shouldBeAthenticated && !req.user
        if (
            (isNotAuthWhenAuthIsReuired) ||
            (!shouldBeAthenticated && req.user)
        ) {
            res.redirect(isNotAuthWhenAuthIsReuired ? '/login' : '/');
            return;
        }
        next();
    }
}