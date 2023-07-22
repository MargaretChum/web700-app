/*********************************************************************************
*  WEB700 – Assignment 05
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part 
*  of this assignment has been copied manually or electronically from any other source 
*  (including 3rd party web sites) or distributed to other students.
* 
*  Name: ___Chum Sze Yin____ Student ID: __118496223___ Date: ___22 Jul 2023____
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
    app.listen(HTTP_PORT, ()=> {console.log("server listening on port:" + HTTP_PORT)});

    //http://localhost:8080/students?course=value
    app.get("/students",(req, res) => {    

      if(req.query.course){
        collegeData.getStudentsByCourse(req.query.course)
         .then(function(studentsByCourse){         //resolve promise of getStudentsByCourse()
           res.render('students', {data: studentsByCourse})
         })
         .catch(function(err){       //reject promise of getStudentsByCourse()
          res.render('students',{message: "no results"});
         })
       }
       else{
          collegeData.getAllStudents()
         .then(function(students){         //resolve promise of getAllStudents()
           //res.send(students)
           res.render('students', {data: students}); 
         })
         .catch(function(err){       //reject promise of getAllStudents()
           res.render('students',{message: "no results"});
         })
     }
    });

    //http://localhost:8080/tas
    // app.get("/tas", (req, res) => {
    //   collegeData.getTAs()
    //     .then(function(tas){         //resolve promise of getTAs()
    //       res.send(tas)
    //     })
    //     .catch(function(err){       //reject promise of getTAs()
    //       var msg = {
    //         message: "no result"
    //       }
    //       res.send(JSON.stringify(msg.message))
    //     }) 
    // });

    //http://localhost:8080/courses
    app.get("/courses", (req, res) => {
      collegeData.getCourses()
        .then(function(courses){         //resolve promise of getTAs()
          res.render('courses', {data: courses});
          //res.send(courses)
        })
        .catch(function(err){       //reject promise of getTAs()
          res.render('students',{message: "no results"});
          // var msg = {
          //   message: "no result"
          // }
          // res.send(JSON.stringify(msg.message))
        }) 
    });

    //http://localhost:8080/student/number
    app.get("/student/:num", (req, res) => {
      
        collegeData.getStudentByNum(req.params.num)
         .then(function(student){         //resolve promise of getStudentsByNum()
          res.render("student", { student: student})
          //res.send(studentByNum)
         })
         .catch(function(err){       //reject promise of getStudentsByNum()
          res.render("student",{message: "no results"}); 
         })
    });

     //http://localhost:8080/course/id
     app.get("/course/:id", (req, res) => {
      
      collegeData.getCourseById(req.params.id)
       .then(function(coursebyid){         
        res.render("course", {course: coursebyid })
        //res.send(courseById)
       })
       .catch(function(err){       
        res.render("course",{message: "no results"}); 
       })
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

    //http://localhost:8080/addStudent -- Return addStudent.html
    app.get("/addStudent", (req, res) => {
      res.render('addStudent') 
      //res.sendFile(__dirname +'/views/addStudent.html')
    })

    //add "Post route"
    http://localhost:8080/students/add -- Create Post route
    app.post('/students/add', (req, res) => {
      collegeData.addStudent(req.body) 
        .then(() => {
          res.redirect('/students'); // redirect to "/student"
        })
    });

    http://localhost:8080/students/update 
    app.post('/student/update', (req, res) => {
      //console.log(req.body);  
      collegeData.updateStudent(req.body) 
        .then(function(update) {
      res.redirect("/students");
      })
      .catch(function(err){       
        res.render("student",{message: "no update made"}); 
       })
    });
  
  //error
    app.use((req, res) => {
        res.status(404).sendFile(__dirname +'/Error.jpg')   
   });
  })      
  .catch(function(err){       //reject promise of initialize()
    var msg = {
      message: "no result"
    }
    res.send(JSON.stringify(msg.message))
});



