/*********************************************************************************
*  WEB700 – Assignment 06
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part 
*  of this assignment has been copied manually or electronically from any other source 
*  (including 3rd party web sites) or distributed to other students.
* 
*  Name: ___Chum Sze Yin____ Student ID: __118496223___ Date: ___5 Aug 2023____
*
*Online (Cyclic) Link: https://pleasant-hare-gaiters.cyclic.app/
********************************************************************************/ 
const HTTP_PORT = process.env.PORT || 8080;
const express = require("express");
const path = require("path")
const collegeData = require("./modules/collegeData.js");
const { isNull } = require("util");
const app = express();
const exphbs = require("express-handlebars");

app.use(express.static("public"))
//folder that contains home/about/htmlDemo.html
app.use(express.static("./views"))
app.use(express.urlencoded({ extended: true }))
app.use(function (req, res, next) {
    let route = req.path.substring(1);
    app.locals.activeRoute = "/" + (isNaN(route.split('/')[1]) ? route.replace(/\/(?!.*)/, "") : route.replace(/\/(.*)/, ""));
    next();
});

// // Register handlebars as the rendering engine for views
app.engine(".hbs", exphbs.engine({
    extname: ".hbs",
    helpers: {
        navLink: function (url, options) {
            return '<li' +
                ((url == app.locals.activeRoute) ? ' class="nav-item active" ' : ' class="nav-item" ') +
                '><a class="nav-link" href="' + url + '">' + options.fn(this) + '</a></li>';
        },
        equal: function (lvalue, rvalue, options) {
            if (arguments.length < 3)
                throw new Error("Handlebars Helper equal needs 2 parameters");
            if (lvalue != rvalue) {
                return options.inverse(this);
            } else {
                return options.fn(this);
            }
        }
    }
})
);
app.set("view engine", ".hbs");

collegeData
    .initialize()
    .then(
        success => {
            console.log(`Successfully initialized Object`)

            //setup http server to listen on HTTP_PORT
            app.listen(HTTP_PORT, () => {
                console.log("server listening on port: " + HTTP_PORT)
            })

            // Query String to read data
            //http://localhost:8080/students?course=value
            app.get("/students", (req, res) => {

                if ((req.query.course)) {
                    //getStudentsByCourse
                    collegeData
                        .getStudentsByCourse(req.query.course)
                        .then(
                            student => {
                                if (student.length > 0) {
                                    res.render("students", { students: student })
                                } else {
                                    res.render("students", { message: "no results" })
                                }
                            })
                        .catch(
                            error => {
                                res.render("students", { message: "no results" })
                            })
                } else {

                    //getAllStudents
                    collegeData
                        .getAllStudents()
                        .then(
                            student => {
                                if (student.length > 0) {
                                    res.render("students", { students: student })
                                } else {
                                    res.render("students", { message: "no results" })
                                }
                            })
                        .catch(
                            error => {
                                res.render("students", { message: "no results" })
                            })
                }
            });

            //http://localhost:8080/courses
            app.get("/courses", (req, res) => {

                //getCourses
                collegeData
                    .getCourses()
                    .then(
                        courses => {
                            if (courses.length > 0) {
                                res.render("courses", { courses: courses });
                            } else {
                                res.render("courses", { message: "no results" });
                            }
                        })
                    .catch(
                        error => {
                            res.render("courses", {
                                message: "no results"
                            })
                        })
            });

            app.get("/student/:studentNum", (req, res) => {

                // initialize an empty object to store the values
                let viewData = {};

                collegeData
                    .getStudentByNum(req.params.studentNum)
                    .then(
                        student => {
                            if (student) {
                                viewData.student = student; //store student data in the "viewData" object as "student"
                            } else {
                                viewData.student = null; // set student to null if none were returned
                            }
                        })
                    .catch(() => {
                        viewData.student = null; // set student to null if there was an error 
                    })
                    .then(collegeData.getCourses)
                    .then((courses) => {
                        viewData.courses = courses; // store course data in the "viewData" object as "courses"

                        // loop through viewData.courses and once we have found the courseId that matches
                        // the student's "course" value, add a "selected" property to the matching 
                        // viewData.courses object

                        for (let i = 0; i < viewData.courses.length; i++) {
                            if (viewData.courses[i].courseId == viewData.student.course) {
                                viewData.courses[i].selected = true;
                            }
                        }

                    })
                    .catch(() => {
                        viewData.courses = []; // set courses to empty if there was an error
                    })
                    .then(() => {
                        if (viewData.student == null) { // if no student - return an error
                            res.status(404).send("Student Not Found");
                        } else {
                            res.render("student", { viewData: viewData }); // render the "student" view
                        }
                    });
            });

            //http://localhost:8080/course/id
            app.get("/course/:id", (req, res) => {

                //getCourseById
                collegeData
                    .getCourseById(req.params.id)
                    .then(
                        course => {
                            if (course == null) {
                                res.status(404).send("Course Not Found")
                            } else {
                                res.render("course", { course: course })
                            }
                        })
                    .catch(
                        error => { res.render("course", { message: "no result" }) })
            });

            //http://localhost:8080/course/delete/id
            app.get("/course/delete/:id", (req, res) => {

                //deleteCourseById
                collegeData
                    .deleteCourseById(req.params.id)
                    .then(
                        course => { res.redirect("/courses") })
                    .catch(
                        error => {
                            res.status(500).send("Unable to Remove Course / Course not found")
                        })
            });

            //http://localhost:8080/student/delete/studentNum
            app.get("/student/delete/:studentNum", (req, res) => {

                //deleteStudentByNum
                collegeData
                    .deleteStudentByNum(req.params.studentNum)
                    .then(
                        student => { res.redirect("/students") })
                    .catch(
                        error => {
                            res.status(500).send("Unable to Remove Student / Student not found")
                        })
            });

            //http://localhost:8080/students/add
            app.post("/students/add", (req, res) => {

                //addStudent
                collegeData
                    .addStudent(req.body)
                    .then(
                        student => { res.redirect("/students") })
                    .catch(
                        error => {
                            console.log(error)
                        })
            });

            //http://localhost:8080/student/update
            app.post("/student/update", (req, res) => {
                // check if passed data is correct
                console.log(req.body);
                //updateStudent
                collegeData
                    .updateStudent(req.body)
                    .then(
                        student => {
                            res.redirect("/students")
                        })
                    .catch(
                        error => {
                            console.log(error)
                        })
            });

            //http://localhost:8080/courses/add
            app.post("/courses/add", (req, res) => {

                //addCourse
                collegeData
                    .addCourse(req.body)
                    .then(
                        course => { res.redirect("/courses") })
                    .catch(
                        error => {
                            console.log(error)
                        })
            });

            //http://localhost:8080/course/update
            app.post("/course/update", (req, res) => {
                // check if passed data is correct
                console.log(req.body);
                //updateCourse
                collegeData
                    .updateCourse(req.body)
                    .then(
                        student => {
                            res.redirect("/courses")
                        })
                    .catch(
                        error => {
                            console.log(error)
                        })
            });

            //http://localhost:8080/students/add
            app.get("/students/add", (req, res) => {

                //getCourses
                collegeData
                    .getCourses()
                    .then(
                        courses => {
                            res.render('addStudent', { courses: courses })
                        })
                    .catch(
                        error => {
                            res.render('addStudent', { courses: [] })
                        })

            });

            //http://localhost:8080/courses/add
            app.get("/courses/add", (req, res) => {
                res.render('addCourse', {
                    // Default is main.hbs
                    // layout: true // do not use the default Layout (main.hbs)
                });
            });

            //http://localhost:8080/
            app.get("/", (req, res) => {
                // res.sendFile(path.join(__dirname, "/views/home.html"))
                res.render('home', {
                    // Default is main.hbs
                    // layout: true // do not use the default Layout (main.hbs)
                });
            });

            //http://localhost:8080/about
            app.get("/about", (req, res) => {
                // res.sendFile(path.join(__dirname, "/views/about.html"))
                res.render('about', {
                    // Default is main.hbs
                    // layout: true // do not use the default Layout (main.hbs)
                });
            });

            //http://localhost:8080/htmlDemo
            app.get("/htmlDemo", (req, res) => {
                // res.sendFile(path.join(__dirname, "/views/htmlDemo.html"))
                res.render('htmlDemo', {
                    // Default is main.hbs
                    // layout: true // do not use the default Layout (main.hbs)
                });
            });

            app.use((req, res) => {
                res.status(404).send("Page Not Found");
            });

        })
    .catch(
        error => {
            console.log(error)
        })

