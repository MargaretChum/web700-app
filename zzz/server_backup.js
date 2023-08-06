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
var HTTP_PORT = process.env.PORT || 8080;
var express = require("express");
var app = express();
var collegeData = require("./modules/collegeData.js");
var exphbs = require('express-handlebars'); //config express-handlebars


app.use(express.static(__dirname +'/public'));
app.use(express.urlencoded({extended: true}));
app.post('/submit',(req,res)=>{
  const formData = req.body;
  console.log(formData)
});
//Fix Navigation Bar to show correct "active" item
app.use(function(req,res,next){
  let route = req.path.substring(1);
  app.locals.activeRoute = "/" + (isNaN(route.split('/')[1]) ? route.replace(/\/(?!.*)/, "") : route.replace(/\/(.*)/, ""));    
  next();
});

// add handlebars engine
app.engine('.hbs', exphbs.engine(
  {
  extname: '.hbs',
  layout:'main',
  helpers:{
    navLink: function(url, options){
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
    },

  }
}));

app.set('view engine', '.hbs');


collegeData.initialize()
  .then(                          //resolve promise of initialize()
    function(){
      // setup http server to listen on HTTP_PORT
    app.listen(HTTP_PORT, ()=> {console.log("server listening on port:" + HTTP_PORT)
  });
})      
.catch(function(err){       //reject promise of initialize()
  console.log("unable to start server: " + err)
});

//http://localhost:8080 -- Return home.html
app.get("/", (req, res) => {
  res.render('home')  
  //res.sendFile(__dirname+'/views/home_copy.html')
});

//http://localhost:8080/about -- Return abouthtml
app.get("/about", (req, res) => {
  res.render('about') 
  //res.sendFile(__dirname+'/views/about.html')
});

//http://localhost:8080/htmlDemo -- Return htmlDemo.html
app.get("/htmlDemo", (req, res) => {
  res.render('htmlDemo') 
  //res.sendFile(__dirname +'/views/htmlDemo.html')
});

//http://localhost:8080/students?course=value
app.get("/students",(req, res) => {    

  if(req.query.course){
    collegeData.getStudentsByCourse(req.query.course)
     .then((studentsByCourse) => {         //resolve promise of getStudentsByCourse()
       (data.length > 0) ? res.render('students', {data: studentsByCourse}) : res.render("students", { message: "no results" });
      }).catch((err) => { //reject promise of getStudentsByCourse()   
      res.render('students',{message: "no results"});
     })
   }
   else{
      collegeData.getAllStudents()
     .then((students) => {         //resolve promise of getAllStudents()
       (data.length > 0) ?  res.render('students', {data: students}) : res.render("students", { message: "no results" });
     })
     .catch((err) => {       //reject promise of getAllStudents()
       res.render('students',{message: "no results"});
     })
 }
});

//http://localhost:8080/addStudent -- Return addStudent.html
//app.get("/addStudent", (req, res) => {
  //res.render('addStudent') 
  //res.sendFile(__dirname +'/views/addStudent.html')
//});

//http://localhost:8080/students/add --NEW!!!
app.get("/students/add", (req,res) => {
  collegeData.getCourses().then((data)=>{
      res.render("addStudent", {courses: data});
   }).catch((err) => {
     // set course list to empty array
     res.render("addCourse", {courses: [] });
  });
});


//add "Post route"
http://localhost:8080/students/add -- Create Post route
app.post('/students/add', (req, res) => {
  collegeData.addStudent(req.body) 
    .then(() => {
      res.redirect('/students'); // redirect to "/student"
    })
});

//http://localhost:8080/student/number
app.get("/student/:num", (req, res) => {

  // initialize an empty object to store the values
  let viewData = {};

  collegeData.getStudentByNum(req.params.studentNum).then((data) => {
      if (data) {
          viewData.student = data; //store student data in the "viewData" object as "student"
      } else {
          viewData.student = null; // set student to null if none were returned
      }
  }).catch((err) => {
      viewData.student = null; // set student to null if there was an error 
  }).then(data.getCourses)
  .then((data) => {
      viewData.courses = data; // store course data in the "viewData" object as "courses"

      // loop through viewData.courses and once we have found the courseId that matches
      // the student's "course" value, add a "selected" property to the matching 
      // viewData.courses object

      for (let i = 0; i < viewData.courses.length; i++) {
          if (viewData.courses[i].courseId == viewData.student.course) {
              viewData.courses[i].selected = true;
          }
      }

  }).catch(() => {
      viewData.courses = []; // set courses to empty if there was an error
  }).then(() => {
      if (viewData.student == null) { // if no student - return an error
          res.status(404).send("Student Not Found");
      } else {
          res.render("student", { viewData: viewData }); // render the "student" view
      }
  });
});


app.post('/student/update', (req, res) => {
  //console.log(req.body);  
  collegeData.updateStudent(req.body) .then(() => {
  res.redirect("/students");
  });
});

//http://localhost:8080/students/delete/:studentNum
app.get("/student/delete/:studentNum", (req,res)=>{
  data.deleteStudentByNum(req.params.studentNum).then(()=>{
    res.redirect("/students");
  }).catch((err)=>{
    res.status(500).send("Unable to Remove Student / Student Not Found");
  });
});


//http://localhost:8080/courses
app.get("/courses", (req, res) => {
  collegeData.getCourses().then((courses) => {
      (data.length > 0) ? res.render("courses", { data: courses }) : res.render("courses", { message: "no results" });
  }).catch((err) => {
      res.render("courses", { message: "no results" });
  });
});

 //http://localhost:8080/course/id
 app.get("/course/:id", (req, res) => {
  
  collegeData.getCourseById(req.params.id).then((coursebyid) => {
   (coursebyid) ? res.render("course", {course: coursebyid }): res.status(404).send("Course Not Found");
    //res.send(courseById)
   })
   .catch((err) => {       
    res.render("course",{message: "no results"}); 
   })
});

//http://localhost:8080/course/add
app.get("/courses/add", (req, res) => {
  res.render("addCourse");
});

//http://localhost:8080/course/update
app.post("/course/update", (req, res) => {
  data.updateCourse(req.body).then(() => {
      res.redirect("/courses");
  });
});

//http://localhost:8080/course/add
app.post("/courses/add", (req, res) => {
  data.addCourse(req.body).then(()=>{
    res.redirect("/courses");
  });
});

 //http://localhost:8080/delete/id
 app.get("/course/delete/:id", (req, res) => {
  
  collegeData.deleteCourseById(req.params.id).then(() => {
    res.redirect("/courses");
  }).catch((err)=>{
    res.status(500).send("Unable to Remove Course / Course Not Found");
  });
});

app.use((req, res) => {
  res.status(404).send("Page Not Found");
});




//error
app.use((req, res) => {
    res.status(404).sendFile(__dirname +'/Error.jpg')   
});    
  
