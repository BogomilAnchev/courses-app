const courseModel = require('../models/item');
const userModel = require('../models/user');;

module.exports = {
    getCourses(req, res, next) {
        let search = req.query.search
        let query = {}
        if(search) {
            query.name = new RegExp(search, 'i');
        }
        courseModel.find(query)
            .sort(({createdAt: 1}))
            .then((courses) => {
                let coursesToRender = courses.slice()
                if (!req.user) {
                    coursesToRender.sort((a, b) => b.usersEnrolled.length - a.usersEnrolled.length)
                    coursesToRender = coursesToRender.slice(0, 3)
                }
                res.render('index', {courses: coursesToRender, search});
            })
            .catch(next);
    },
    getCourse(req, res, next) {
        const id = req.params.id;
        courseModel.findById(id)
            .then(course => {
                const isCreator = course.creator == req.user._id;
                const isLiked = course.usersEnrolled.includes(req.user._id);
                res.render('details', { course, isCreator, isLiked });
            })
            .catch(next);
    },
    postCreateCourse(req, res, next) {
        const { name, description, imageUrl, duration } = req.body;
        courseModel.create({ name, description, duration, imageUrl, creator: req.user._id })
            .then(() => res.redirect('/'))
            .catch(next);
    },
    getCreateCourse(req, res, next) {
        res.render('create');
    },
    getEditCourse(req, res, next) {
        const id = req.params.id;
        courseModel.findById(id)
            .then(course => {
                res.render('edit', course)
            })
            .catch(next);

    },
    postEditCourse(req, res, next) {
        const id = req.params.id;
        const { name, description, imageUrl, duration } = req.body;
        courseModel.updateOne({ _id: id }, { name, description, imageUrl, duration })
            .then(() => res.redirect('/'))
            .catch(next);
    },
    getDeleteCourse(req, res, next) {
        const id = req.params.id;
        courseModel.deleteOne({ _id: id })
            .then(() => {
                res.redirect('/');
            })
            .catch(next);
    },
    enroll(req, res, next) {
        const courseId = req.params.id;
        const userId = req.user._id;
        Promise.all([
            userModel.updateOne({ _id: userId }, { $push: { enrolledCourses: courseId } }),
            courseModel.updateOne({ _id: courseId }, { $push: { usersEnrolled: userId } })
        ])
            .then(() => {
                res.redirect('/details/' + courseId);
            }).catch(next)
    }

}