/*********************************************************************************
*  WEB700 – Assignment 2
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  
*  No part of this assignment has been copied manually or electronically from any other source
*  (including web sites) or distributed to other students.
* 
*  Name: __Chum Sze Yin_____ Student ID: __118496223____ Date: _31 May 2023______
*
********************************************************************************/ 

var collegeData = require("./modules/collegeData.js")

collegeData.initialize().then(function(resolveObject){
    collegeData.getAllStudents(resolveObject).then(function(resolveStudent){
        console.log(`Successfully retrieved ${resolveStudent} students`)
    }).catch(function(rejectStudent){
        console.log(rejectStudent)
    })
    collegeData.getAllStudents(resolveObject).then(function(resolveStudent){
        console.log(resolveStudent)
    }).catch(function(rejectStudent){
        console.log(rejectStudent)
    })
    collegeData.getCourses(resolveObject).then(function(resolveCourses){
        console.log(`Successfully retrieved ${resolveCourses.length} courses`)
    }).catch(function(rejectCourses){
        console.log(rejectCourses)
    })
    collegeData.getTAs(resolveObject).then(function(resolveTA){
        console.log(`Successfully retrieved ${resolveTA.length} TAs`)
    }).catch(function(rejectTA){
        console.log(rejectTA)
    })
}).catch(function(rejectObject){
    console.log(rejectObject)
})
