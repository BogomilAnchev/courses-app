const courseController = require('../controllers/item');
const userController = require('../controllers/user');
const checkAuth = require('../middlewares/check-auth');
const userValidators = require('../body-validators/user');
const itemValidators = require('../body-validators/item');
const handleValidationErrors = require('../middlewares/handle-validation-errors');
const setValidationErrorViewName = require('../middlewares/set-validation-error-view-name')


module.exports = (app) => {
    app.get('/', courseController.getCourses);
    app.get('/details/:id', checkAuth(true), courseController.getCourse);

    app.get('/create', checkAuth(true), courseController.getCreateCourse);
    app.post('/create',
        setValidationErrorViewName('create'),
        checkAuth(true),
        itemValidators,
        handleValidationErrors,
        courseController.postCreateCourse
    );

    app.get('/edit/:id', checkAuth(true), courseController.getEditCourse);
    app.post('/edit/:id',
        setValidationErrorViewName('edit'),
        checkAuth(true),
        itemValidators,
        handleValidationErrors,
        courseController.postEditCourse,
    );

    app.get('/delete/:id', checkAuth(true), courseController.getDeleteCourse);
    app.get('/enroll/:id', checkAuth(true), courseController.enroll)

    app.get('/login', checkAuth(false), userController.getLogin);
    app.post('/login',
        setValidationErrorViewName('login'),
        checkAuth(false),
        userValidators.checkLogin,
        handleValidationErrors,
        userController.postLogin
    );

    app.get('/register', checkAuth(false), userController.getRegister);
    app.post('/register',
        setValidationErrorViewName('register'),
        checkAuth(false),
        userValidators.checkUsername,
        userValidators.repeatPasswordCheck,
        handleValidationErrors,
        userController.postRegister
    );

    app.get('/logout', checkAuth(true), userController.getLogout);

    app.get('*', function (req, res) {
        res.render('404');
    })
};