var HTTP_PORT = process.env.PORT || 8080;
var express = require("express");
var app = express();
var collegeData = require("./modules/collegeData.js")

collegeData.initialize()
  .then(                          //resolve promise of initialize()
    function(){
    // setup http server to listen on HTTP_PORT
    app.listen(HTTP_PORT, ()=> {console.log("server listening on port:" + HTTP_PORT)});

    //http://localhost:8080/students?course=value
    app.get("/students", (req, res) => {

      if(req.query.course){
       collegeData.getStudentsByCourse(req.query.course)
        .then(function(studentsByCourse){         //resolve promise of getStudentsByCourse()
          res.send(studentsByCourse)
        })
        .catch(function(err){       //reject promise of getStudentsByCourse()
          var msg = {
            message: "no result"
          }
          res.send(JSON.stringify(msg.message))
        })

      }
      else{
      collegeData.getAllStudents()
        .then(function(students){         //resolve promise of getAllStudents()
          res.send(students)
        })
        .catch(function(err){       //reject promise of getAllStudents()
          var msg = {
            message: "no result"
          }
          res.send(JSON.stringify(msg.message))
        })
      } 
    });

    //http://localhost:8080/tas
    app.get("/tas", (req, res) => {
      collegeData.getTAs()
        .then(function(tas){         //resolve promise of getTAs()
          res.send(tas)
        })
        .catch(function(err){       //reject promise of getTAs()
          var msg = {
            message: "no result"
          }
          res.send(JSON.stringify(msg.message))
        }) 
    });

    //http://localhost:8080/courses
    app.get("/courses", (req, res) => {
      collegeData.getCourses()
        .then(function(courses){         //resolve promise of getTAs()
          res.send(courses)
        })
        .catch(function(err){       //reject promise of getTAs()
          var msg = {
            message: "no result"
          }
          res.send(JSON.stringify(msg.message))
        }) 
    });

    //http://localhost:8080/student/number
    app.get("/student/:num", (req, res) => {
      
        collegeData.getStudentByNum(req.params.num)
         .then(function(studentByNum){         //resolve promise of getStudentsByNumber()
           res.send(studentByNum)
         })
         .catch(function(err){       //reject promise of getStudentsByNumber()
           var msg = {
             message: "no result"
           }
           res.send(JSON.stringify(msg.message))
         })
    });

//app.use(express.static("./views"))
    //http://localhost:8080 -- Return home.html
    app.get("/", (req, res) => {
        res.sendFile(__dirname+'/views/home.html')
  });

    //http://localhost:8080/about -- Return abouthtml
    app.get("/about", (req, res) => {
      res.sendFile(__dirname+'/views/about.html')
  });
    //http://localhost:8080/htmlDemo -- Return htmlDemo.html
    app.get("/htmlDemo", (req, res) => {
      res.sendFile(__dirname +'/views/htmlDemo.html')
  });

    //http://localhost:8080/about -- Return htmlDemo.html
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

