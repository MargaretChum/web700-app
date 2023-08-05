const Sequelize = require('sequelize');

var sequelize = new Sequelize('xxuyvjza', 'xxuyvjza', '9xUS37hmdXWqUU0VW9CtbYnKQ5qqFnC4', {
    host: 'stampy.db.elephantsql.com',
    dialect: 'postgres',
    port: 5432,
    dialectOptions: {
        ssl: { rejectUnauthorized: false }
    },
    query: { raw: true }
});

//Student Table OR Model
var Student = sequelize.define('Student', {

    studentNum: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    firstName: Sequelize.STRING,
    lastName: Sequelize.STRING,
    email: Sequelize.STRING,
    addressStreet: Sequelize.STRING,
    addressCity: Sequelize.STRING,
    addressProvince: Sequelize.STRING,
    TA: Sequelize.BOOLEAN,
    status: Sequelize.STRING,
    course: Sequelize.INTEGER
});

//Course Table OR Model
var Course = sequelize.define('Course', {

    courseId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    courseCode: Sequelize.STRING,
    courseDescription: Sequelize.STRING

});

Course.hasMany(Student, { foreignKey: 'course' });

module.exports.initialize = function () {
    return new Promise((resolve, reject) => {

        sequelize
            .authenticate()
            .then(function () {
                //SYNC IF AUTHENTICATION IS OK
                sequelize
                    .sync()
                    .then(function () {
                        resolve();
                    })
                    .catch(err => {
                        //log error and reject()
                        console.log('Unable to sync the database:', err);
                        reject("Unable to sync the database");
                    })
            })
            .catch(function (err) {
                //log error and reject()
                console.log('Unable to connect to the database:', err);
                reject("Unable to connect to the database");
            });
    });
}

module.exports.getAllStudents = function () {
    return new Promise((resolve, reject) => {

        console.log("EXECUTING ----------- getAllStudents")
        Student
            .findAll()
            .then(function (students) {
                console.log("RESULT ----------- getAllStudents",students)
                resolve(students);
            })
            .catch(function (error) {
                reject("no results returned");
            });
    })
}

module.exports.getStudentsByCourse = function (course) {
    return new Promise(function (resolve, reject) {

        console.log("EXECUTING ----------- getStudentsByCourse")
        Student
            .findAll({
                where: {
                    course: course
                }
            })
            .then(function (students) {
                console.log("RESULT ----------- getStudentsByCourse:", students)
                resolve(students);
            })
            .catch(function (error) {
                reject("no results returned");
            });
    });
};

module.exports.getStudentByNum = function (num) {
    return new Promise(function (resolve, reject) {
        console.log("EXECUTING ----------- getStudentByNum")
        Student
            .findAll({
                where: {
                    studentNum: num
                }
            })
            .then(function (students) {
                console.log("RESULT ----------- getStudentByNum:", students[0])
                resolve(students[0]);
            })
            .catch(function (error) {
                reject("no results returned");
            });
    });
};

module.exports.getCourses = function () {
    return new Promise((resolve, reject) => {
        console.log("EXECUTING ----------- getCourses")
        Course
            .findAll()
            .then(function (courses) {
                console.log("RESULT ----------- getCourses:", courses)
                resolve(courses);
            })
            .catch(function (error) {
                reject("no results returned");
            });
    });
};

module.exports.getCourseById = function (id) {
    return new Promise(function (resolve, reject) {

        console.log("EXECUTING ----------- getCourseById")
        Course
            .findAll({
                where: {
                    courseId: id
                }
            })
            .then(function (courses) {
                console.log("RESULT ----------- getCourseById:", courses)
                resolve(courses[0]);
            })
            .catch(function (error) {
                reject("no results returned");
            });
    });
};


module.exports.addStudent = function (studentData) {
    return new Promise(function (resolve, reject) {

        //Make Sure TA is set to true/false
        studentData.TA = (studentData.TA) ? true : false;

        //assign null to blank objects
        for (var prop in studentData) {
            if (studentData[prop] == "") {
                prop = null;
            }
        }

        console.log("EXECUTING ----------- addStudent", studentData)
        //Create Student Record
        Student
            .create({
                firstName: studentData.firstName,
                lastName: studentData.lastName,
                email: studentData.email,
                addressStreet: studentData.addressStreet,
                addressCity: studentData.addressCity,
                addressProvince: studentData.addressProvince,
                TA: studentData.TA,
                status: studentData.status,
                course: studentData.course
            })
            .then(function (student) {
                // you can now access the newly created Student via the variable student
                console.log("Student created success!");
                resolve();
            })
            .catch(function (error) {
                console.log("something went wrong! - CREATE");
                reject("unable to create student");
            });

    });
};

module.exports.updateStudent = function (studentData) {
    return new Promise(function (resolve, reject) {

        //Make Sure TA is set to true/false
        studentData.TA = (studentData.TA) ? true : false;

        //assign null to blank objects
        for (var prop in studentData) {
            if (studentData[prop] == "") {
                prop = null;
            }
        }

        console.log("EXECUTING ----------- updateStudent", studentData)
        //Update Student Record where studentNum matches from app
        Student
            .update({
                firstName: studentData.firstName,
                lastName: studentData.lastName,
                email: studentData.email,
                addressStreet: studentData.addressStreet,
                addressCity: studentData.addressCity,
                addressProvince: studentData.addressProvince,
                TA: studentData.TA,
                status: studentData.status,
                course: studentData.course
            }, {
                where: {
                    studentNum: studentData.studentNum
                }
            })
            .then(function (student) {
                console.log("Student update success!");
                resolve();
            })
            .catch(function (error) {
                console.log("something went wrong! - UPDATE");
                reject("unable to update student");
            });
    });
};

module.exports.addCourse = function (courseData) {
    return new Promise(function (resolve, reject) {

        //assign null to blank objects
        for (var prop in courseData) {
            if (courseData[prop] == "") {
                prop = null;
            }
        }
        
        console.log("EXECUTING ----------- addCourse", courseData)
        //Create Course Record
        Course
            .create({
                courseCode: courseData.courseCode,
                courseDescription: courseData.courseDescription
            })
            .then(function (course) {
                // you can now access the newly created Course via the variable student
                console.log("Course created success!");
                resolve();
            })
            .catch(function (error) {
                console.log("something went wrong! - CREATE");
                reject("unable to create course");
            });

    });
};

module.exports.updateCourse = function (courseData) {
    return new Promise(function (resolve, reject) {

        //assign null to blank objects
        for (var prop in courseData) {
            if (courseData[prop] == "") {
                prop = null;
            }
        }
        console.log("EXECUTING ----------- updateCourse", courseData)
        //Update Course Record where courseId matches from app
        Course
            .update({
                courseCode: courseData.courseCode,
                courseDescription: courseData.courseDescription
            }, {
                where: {
                    courseId: courseData.courseId
                }
            })
            .then(function (course) {
                console.log("Course update success!");
                resolve();
            })
            .catch(function (error) {
                console.log("something went wrong! - UPDATE");
                reject("unable to update course");
            });
    });
};

module.exports.deleteCourseById = function (id) {
    return new Promise(function (resolve, reject) {

        //Delete Course Record where courseId matches from app
        Course
            .destroy({
                where: {
                    courseId: id
                }
            })
            .then(function (course) {
                console.log("Course Delete success!");
                resolve();
            })
            .catch(function (error) {
                console.log("something went wrong! - DELETE");
                reject("unable to delete course");
            });
    });
};

module.exports.deleteStudentByNum = function (studentNum) {
    return new Promise(function (resolve, reject) {

        //Delete Student Record where studentNum matches from app
        Student
            .destroy({
                where: {
                    studentNum: studentNum
                }
            })
            .then(function (student) {
                console.log("Student Delete success!");
                resolve();
            })
            .catch(function (error) {
                console.log("something went wrong! - DELETE");
                reject("unable to delete student");
            });
    });
};