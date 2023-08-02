const fs = require("fs");

class Data{
    constructor(students, courses){
        this.students = students;
        this.courses = courses;
    }
}

let dataCollection = null;

module.exports.initialize = function () {
    return new Promise( (resolve, reject) => {
        fs.readFile('./data/courses.json','utf8', (err, courseData) => {
            if (err) {
                reject("unable to load courses"); return;
            }

            fs.readFile('./data/students.json','utf8', (err, studentData) => {
                if (err) {
                    reject("unable to load students"); return;
                }

                dataCollection = new Data(JSON.parse(studentData), JSON.parse(courseData));
                resolve();
            });
        });
    });
}

module.exports.getAllStudents = function(){
    return new Promise((resolve,reject)=>{
        if (dataCollection.students.length == 0) {
            reject("query returned 0 results"); return;
        }

        resolve(dataCollection.students);
    })
}

module.exports.getTAs = function () {
    return new Promise(function (resolve, reject) {
        var filteredStudents = [];

        for (let i = 0; i < dataCollection.students.length; i++) {
            if (dataCollection.students[i].TA == true) {
                filteredStudents.push(dataCollection.students[i]);
            }
        }

        if (filteredStudents.length == 0) {
            reject("query returned 0 results"); return;
        }

        resolve(filteredStudents);
    });
};

module.exports.getCourses = function(){
   return new Promise((resolve,reject)=>{
    if (dataCollection.courses.length == 0) {
        reject("query returned 0 results"); return;
    }

    resolve(dataCollection.courses);
   });
};

module.exports.getStudentByNum = function (num) {
    return new Promise(function (resolve, reject) {
        //var foundStudent =[];
        var foundStudent = null;

        for (let i = 0; i < dataCollection.students.length; i++) {
            if (dataCollection.students[i].studentNum == num) {
                //foundStudent.push(dataCollection.students[i]);
                foundStudent = dataCollection.students[i];
            }
        }

        if (!foundStudent) {
            reject("no results returned"); return;
        }

        resolve(foundStudent);
    });
};

module.exports.getStudentsByCourse = function (course) {
    return new Promise(function (resolve, reject) {
        var filteredStudents = [];

        for (let i = 0; i < dataCollection.students.length; i++) {
            if (dataCollection.students[i].course == course) {
                filteredStudents.push(dataCollection.students[i]);
            }
        }

        if (filteredStudents.length == 0) {
            reject("no results returned"); return;
        }

        resolve(filteredStudents);
    });
};

module.exports.addStudent= function(studentData){
    return new Promise((resolve, reject) => {
        if (studentData.TA === undefined) {
          studentData.TA = false;
        } else {
          studentData.TA = true;
        }
        studentData.course = parseInt(studentData.course);
        studentData.studentNum = dataCollection.students.length + 1;
        dataCollection.students.push(studentData);
    
        resolve();
      });
};

module.exports.getCourseById = function (id) {
    return new Promise(function (resolve, reject) {
        //var foundcourse =[];
        var foundcourse =null;

        for (let i = 0; i < dataCollection.courses.length; i++) {
            if (dataCollection.courses[i].courseId == id) {
                //foundcourse.push(dataCollection.courses[i]);
                foundcourse = dataCollection.courses[i]
            }
        }

        if (!foundcourse) {
            reject("no results returned"); return;
        }

        resolve(foundcourse);
    });
};

module.exports.updateStudent= function(studentData){
    return new Promise((resolve, reject) => {
        var foundStudent = null;

        for (let i = 0; i < dataCollection.students.length; i++) {
            if (dataCollection.students[i].studentNum == studentData.studentNum) {
                
                dataCollection.students[i].firstName = studentData.firstName;
                dataCollection.students[i].lastName = studentData.lastName;
                dataCollection.students[i].email = studentData.email;
                dataCollection.students[i].addressStreet = studentData.addressStreet;
                dataCollection.students[i].addressCity = studentData.addressCity;
                dataCollection.students[i].addressProvince = studentData.addressProvince;
                dataCollection.students[i].addressProvince = studentData.addressProvince;
                if (studentData.TA == null) {
                    dataCollection.students[i].TA = false;
                }else{
                    dataCollection.students[i].TA = true;
                }
                dataCollection.students[i].status = studentData.status;
                dataCollection.students[i].course = parseInt(studentData.course);
            }
        }

        if (studentData == null) {
            reject("no results returned"); return;
        }
        resolve();
    });
};