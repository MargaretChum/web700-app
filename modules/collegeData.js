//Create a class to manage the data
class Data {
    constructor (students, courses){
        this.students = students;
        this.courses = courses;
    }
}

var dataCollection = null

//const { Console } = require('console');
// Initialize() 
const fs = require('fs');
var studentDataFromFile 
var courseDataFromFile

// 1. Function to read students file
module.exports.initialize = function() {
    return new Promise(function (resolve,reject){  
        fs.readFile('./data/students.json', 'utf8', function(err, dataFromSomeFile){
            if (err){
                reject("unable to read students.json"); 

            }else{
            studentDataFromFile = JSON.parse(dataFromSomeFile); 
            }
            fs.readFile('./data/courses.json', 'utf8', function(err, dataFromSomeFile){
                if (err){
                    reject("unable to read courses.json"); 

                }else{
                courseDataFromFile = JSON.parse(dataFromSomeFile); 
                }
                
                // INSTANTIATION
                dataCollection = new Data(studentDataFromFile, courseDataFromFile)
                resolve(dataCollection) //<--this will return the promise of dataCollection with value
            })
        
        })
    })
}


module.exports.getAllStudents = function(dataCollection) {
    return new Promise(function (resolve,reject){
        if (dataCollection.students.length == 0){
            reject("No results returned")
        } else{
        resolve(dataCollection.students)
        }
    })
}

module.exports.getTAs = function(dataCollection) {
    return new Promise(function (resolve,reject){
        var temp = 0
        if (dataCollection.students.length == 0){
            reject("No results returned")
        }else{
            for (i = 0; i < dataCollection.students.length; i++){   
                if (dataCollection.students[i].TA == true){
                    temp++}                           
            }
            resolve(temp)
        }
    })    
}

module.exports.getCourses = function(dataCollection) {
    return new Promise(function (resolve,reject){
        if (dataCollection.courses.length == 0){
            reject("No results returned")
        } else{
        resolve(dataCollection.courses)
        }
    })
}