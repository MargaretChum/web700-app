// const fs = require("fs");

// class Data{
//     constructor(students, courses){
//         this.students = students;
//         this.courses = courses;
//     }
// }

// let dataCollection = null;

const Sequelize = require('sequelize');
var sequelize = new Sequelize('xxuyvjza', 'xxuyvjza', '9xUS37hmdXWqUU0VW9CtbYnKQ5qqFnC4', {
    host: 'stampy.db.elephantsql.com',
    dialect: 'postgres',
    port: 5432,
    dialectOptions: {
        ssl: { rejectUnauthorized: false }
    },
    query:{ raw: true }
});
// Define a "Data" Model
var Student = sequelize.define('Student', {
    studentNum:{
        type: Sequelize.INTEGER,
        primaryKey: true,
        autolncrement:true 
    },
    firstName: Sequelize.STRING,
    lastName: Sequelize.STRING,
    email: Sequelize.STRING,
    addressStreet: Sequelize.STRING,
    addressCity: Sequelize.STRING,
    addressProvince: Sequelize.STRING,
    TA: Sequelize.BOOLEAN,
    status: Sequelize.STRING
});

var Course = sequelize.define('Course', {
    courseId:{
        type: Sequelize.INTEGER,
        primaryKey: true, 
        autolncrement:true
    },
    courseCode: Sequelize.STRING,
    courseDescription: Sequelize.STRING,
});

//hasMany Relationship
Course.hasMany(Student, {foreignKey: 'course'});


module.exports.initialize = function () {
    return new Promise( (resolve, reject) => {
        //Get data from database
        sequelize.sync().then(()=>{
            resolve();
        }).catch(() => {
            reject("unable to sync the database");return;
        });
    });
}

module.exports.getAllStudents = function(){
    return new Promise(function (resolve, reject) {
        Student.findAll().then((data) => {        
             resolve(data)
        }).catch(err => {
            reject("no record returned"); return;
        });
    });
}

// module.exports.getTAs = function () {
//     return new Promise(function (resolve, reject) {
//         var filteredStudents = [];

//         for (let i = 0; i < dataCollection.students.length; i++) {
//             if (dataCollection.students[i].TA == true) {
//                 filteredStudents.push(dataCollection.students[i]);
//             }
//         }

//         if (filteredStudents.length == 0) {
//             reject(); return; //removed "query returned 0 results"
//         }

//         resolve(); //removed filteredStudents
//     });
// };

module.exports.getCourses = function(){
   return new Promise((resolve,reject)=>{
        Course.findAll().then(function(data){
            resolve(data);
        }).catch((err) =>{
            reject("no results returned"); return;
        });
    });
};

module.exports.getStudentByNum = function (num) {
    return new Promise(function (resolve, reject) {
        Student.findAll({
            where: {
                studentNum: num
            }
        }).then(function (data) {
            resolve(data[0]);
        }).catch((err) => {
            reject("no results returned"); return;
        });
    });
};

module.exports.getStudentsByCourse = function (course) {
    return new Promise(function (resolve, reject) {
        Student.findAll({
            where: {
                course: course
            }
        }).then(function (data) {
            resolve(data);
        }).catch(() => {
            reject("no results returned"); return;
        });
    });
};


module.exports.addStudent= function(studentData){
    return new Promise((resolve, reject) => {
        studentData.TA = (studentData.TA) ? true : false;

        for (var property in studentData) {
            if (studentData[property] === '')
            studentData[property] = null;
        }

        Student.create(studentData).then(() => {
            resolve();
        }).catch((err) => {
            console.log(err);
            reject("unable to create student"); return;
        });

    });
};

module.exports.deleteStudentByNum = function(studentNum){
    return new Promise(function (resolve, reject) {
        Student.destroy({
            where: {
                studentNum: studentNum
            }
        }).then(function () {
            resolve();
        }).catch((err) => {
            reject("unable to delete student"); return;
        });
    });
}

module.exports.updateStudent= function(studentData){
    return new Promise((resolve, reject) => {
 
        studentData.TA = (studentData.TA) ? true : false;

        for (var prop in studentData) {
            if (studentData[prop] === '')
            studentData[prop] = null;
        }

        Student.update(studentData, {
            where: { studentNum: studentData.studentNum }
        }).then(() => {
            resolve();
        }).catch((e) => {
            reject("unable to update student"); return;
        });
    });

};
module.exports.addCourse = function (courseData) {
    return new Promise(function (resolve, reject) {

        for (var property in courseData) {
            if (courseData[property] === '')
            courseData[property] = null;
        }

        Course.create(courseData).then(() => {
            resolve();
        }).catch((err) => {
            reject("unable to create course"); return;
        });

    });
};

module.exports.getCourseById = function (id) {
    return new Promise(function (resolve, reject) {
        Course.findAll({
            where: {
                courseId: id
            }
        }).then(function (data) {
            resolve(data[0]);
        }).catch(() => {
            reject("no results returned"); return;
        });
    });
};



module.exports.updateCourse = function (courseData) {

    return new Promise(function (resolve, reject) {

        for (var property in courseData) {
            if (courseData[property] === '')
            courseData[property] = null;
        }

        Course.update(courseData, {
            where: { courseId: courseData.courseId }
        }).then(() => {
            resolve();
        }).catch((e) => {
            reject("unable to update course"); return;
        });
    });

};

module.exports.deleteCourseById = function(id){
    return new Promise(function (resolve, reject) {
        Course.destroy({
            where: {
                courseId: id
            }
        }).then(function () {
            resolve();
        }).catch((err) => {
            reject("unable to delete course"); return;
        });
    });
}