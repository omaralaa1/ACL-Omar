
# ACML - Omar

An online learning website where trainees attend courses given by expert instructors with taking online exercises and exams in order to get a certificate in specific fields.

## Motivation
This website is built to help anyone interested in learning about any field and take a degree in it.
## Build Status
The website is being developed to be able to send actual emails and accept actual payment methods.
## Code Style
The coding style in this project is standard:
```bash
const jwt= require('jsonwebtoken')
const User=require('../models/userModel');
const requireAuth = async (req, res, next) => {
    // verify user is authenticated
    const { authorization } = req.headers
  
    if (!authorization) {
      return res.status(401).json({error: 'Authorization token required'})
    }
  
    const token = authorization.split(' ')[1]
  
    try {
      const { _id } = jwt.verify(token, process.env.SECRET)
  
      req.user = await User.findOne({ _id }).select('_id')
      next()
  
    } catch (error) {
      console.log(error)
      res.status(401).json({error: 'Request is not authorized'})
    }
  }
  
module.exports = requireAuth
```
## Tech/Framework
- Visual Studio Code
- MonogoDB
- React
- Node
- Express
- Insomnia
- Material User Interface
## Code Examples
Backend:-
- Routes
```js
const express = require("express");
const router = express.Router();
const Course = require("../models/Courses");
const {
  findCourses,
  CourseDetails,
  findallcourses,
  selectdiscounts,alldiscounts, mostPopularCourse,
  GetUserType,findCoursesForTrainee

} = require("../controllers/coursescontroller");
router.get("/findcoursesfortrainee",findCoursesForTrainee);
router.get("/", findCourses);
router.get("/mostpopular", mostPopularCourse);

router.get('/coursedetails/:id' , CourseDetails)
router.post('/selectdiscounts', selectdiscounts)
router.post('/alldiscounts', alldiscounts)
router.get('/gettype', GetUserType);
router.get('/getallcourses', findallcourses);
module.exports = router;
```
- Controllers
```js
const { default: mongoose } = require("mongoose");
const Course = require("../models/Courses");
const Users = require("../models/userModel");
const Instructor = require("../models/Instructors");
const jwt = require("jsonwebtoken");
const Trainee = require("../models/Trainees")
const getTokenFromHeader = (req) => {
  const authorization = req.get("authorization");
  if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
    return authorization.substring(7);
  }
  return null;
};


function getUserIdFromToken(token) {
  const decoded = jwt.verify(token, process.env.SECRET);
  console.log(decoded);
  return decoded._id;
}

const findCourses = async (req, res) => {
 

  const courses = await Course.find({published:"true"});

  res.status(200).json(courses);
};
const findCoursesForTrainee = async (req, res) => {
  var token =getTokenFromHeader(req);
  const userid = getUserIdFromToken(token)
  const courses = await Course.find({});
  const trainee = await Trainee.findOne({userid:userid});
  for (const course of courses) {
    for(const registeredCourse of trainee.registeredcourses){
      if(JSON.stringify(course.id)===JSON.stringify(registeredCourse))
        course.registered = true;
    }
    console.log(course.registered)

  }
   console.log(courses)

  res.status(200).json(courses);
};


const findallcourses = async (req, res) => {
  const token = getTokenFromHeader(req);
  console.log(token); 
  const userid=getUserIdFromToken(token);
  console.log(userid);

  const courses = await Course.find({});
  for(var i =0;i<courses.length;i++){
    var authorid=courses[i].author;

    var author=await Instructor.findById(authorid);
    var user =await Users.findById(author.userid);

    courses[i]={
        ...courses[i]._doc,    
        author: user.first_name +' '+user.last_name
      
};}

  res.status(200).json(courses);
};


const CourseDetails = async (req, res) => {



  const { id } = req.params;
  console.log(id);
  const courses = await Course.findById(id);

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "invalid course id" });
  }

  


if (!courses) {
  return res.status(400).json({ error: "course does not exist" });
}
return res.status(200).json(courses);
};

const selectdiscounts = async (req, res) => {
  console.log(req.body.discount);
  for (const courseid of req.body.checklist) {
    console.log(courseid);
    const shit = await Course.findOneAndUpdate(
      { _id: courseid },
      { discount: { percent: req.body.discount, start_date: req.body.start_date,
        end_date: req.body.end_date  } }
    );
  }
  res.status(200).json("success!");
};

const alldiscounts = async (req,res) => {
  console.log(req.body.discount)
  const shite = await Course.updateMany({}, {discount : {percent : req.body.discount,  start_date: req.body.start_date,
    end_date: req.body.end_date,}})
  res.status(200).json("success!")
}
const GetUserType = async(req,res)=>{
  var token =getTokenFromHeader(req);
  const userid = getUserIdFromToken(token)
  try{
   const user=await Users.findById(userid)
   console.log(user)
   return res.status(200).json(user.type)
  }catch(error)
  {
    console.log("couldn't  user")
  }
  return
}


const mostPopularCourse = async (req, res) => {
  const courses = await Course.find({}).sort({ numberOfTrainees: -1 }); 
  res.status(200).json(courses);
};







module.exports = {
  findCourses,
  CourseDetails,
  selectdiscounts, alldiscounts,GetUserType,findCoursesForTrainee,mostPopularCourse,findallcourses
};
```
- Models
```js
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const courseSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    numberOfTrainees: {
      type: Number,
      required: false,
      default: 0,
    },

    price: {
      type: Number,
      required: true,
      default: 0,
    },
    subject: {
      type: String,
      required: false,
    },
    author: {
      type: mongoose.Types.ObjectId,
      ref: "Instructors",
      required: false,
    },
    name:{
      type:String,
      required: false,
    },
    review: [
      {
        rating: { type: Number, required: false },
        reviews: { type: String, required: false },
        traineeId: { type: mongoose.Types.ObjectId, required: false },
      },
    ],

    summary: {
      type: String,
      required: true,
    },
    published:{
      type: String,
      default:false
    },
    total_hours: {
      type: Number,
      required: false,
    },
    overallRating: {
      type: Number,
      required: false,
      default: 0,
    },

    discount: {
      percent: { type: Number, required: false, default: 0 },
      start_date: { type: Date, required: false },
      end_date:{type:Date ,required:false}
    },
    maxProgress: {
      type: Number,
      required: false,
      default: 0,
    },
    traineeProgression: {
      type: Number,
      required: false,
      default: 0,
    },
    registered: {
      type: Boolean,
      default: false,},
    video: {
      type: String,
      required: false,
    },
    exam : {
      title: { type: String, required: false },
      grade: { type: Number, required: false },
      maxGrade: { type: Number, required: false },
      problems: [
        {
          questions: { type: String, required: false },
          answers: [String],
          solution: { type: String, required: false },
        },
      ],
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Course", courseSchema);
```

Frontend:-
- Components
```js
import Typography from '@mui/material/Typography';
import React from 'react';
import { makeStyles } from '@mui/styles';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';;

const useStyles = makeStyles(() => ({
  card: {
    maxWidth: 345,
    margin: 'auto',
  },
  media: {
    height: 0,
    paddingTop: '56.25%', 
  },
  title: {
    fontSize: 14,
  },
  author: {
    marginTop: 'auto'
  },
  rating: {
    marginTop: 'auto'
}}));

const CourseCard = ({course }) => {
  const classes = useStyles();

  return (
    <Card className={classes.card}>
      <CardMedia
        className={classes.media}
       
        video={course.video}
       
        title={course.title}
      />
      <CardContent>
        <Typography variant="h5" component="h2" className={classes.title}>
          {course.title}
        </Typography>
        <Typography variant="body2" component="p" className={classes.author}>
          by {course.author}
        </Typography>
        <Typography variant="body2" component="p" className={classes.rating}>
        subject: {course.rating}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default CourseCard;
```
- Pages
```js
import { useEffect, useState } from "react";
import YoutubeEmbed from "../components/YoutubeEmbed";
import ViewVideo from "../components/ViewVideo";
import { Typography,Button } from "@mui/material";
import ViewSubtitles from "../components/ViewSubtitles";
import { useAuthContext } from "../hooks/useAuthContext";

const CourseContent = () => {
  const [subtitles, setSubtitles] = useState(null);
  const [maxProgress, setMaxProgress] = useState(null);
  const params = new URLSearchParams(window.location.search);
  const courseid = params.get("courseId");
  const { user } = useAuthContext();

    const getsubtitles = async () => {
      
  
      const response = await fetch(
        `/api/trainees/getsubtitles?courseid=${courseid}`,{
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      const json = await response.json();
    

      const courseResponse = await fetch(
        `/api/courses/coursedetails/${courseid}`
      );
      const courseJSON = await courseResponse.json();
      console.log(courseJSON);

      if (response.ok) {
        setSubtitles(json);
      }
      if (courseResponse.ok) {
        setMaxProgress(courseJSON.maxProgress);
      }
    };
    getsubtitles();

  return (
    <div className="coursecontent">
      
      {subtitles &&
        subtitles.map((subtitle) => (
          <div key={subtitle._id}>
            <ViewSubtitles subtitle={subtitle} />
          </div>
        ))}


<Button variant="contained" sx={{ marginBottom: 4 }}
        onClick={() =>
          (window.location.href = `/gotoexam?courseid=${courseid}`)
       }
      >
        Take Exam
      </Button>

    </div>
  );
};
export default CourseContent;
```
## API Reference Examples
- GET a refund:-
~ Email and Password required.
Response:

    _id: new ObjectId("63b4c315eadf1efce398c649"),
    courseid: new ObjectId("639e2cd34e2f0eef4f76a8c2"),
    traineeid: new ObjectId("63a4d28da9834c2d44f96eb8"),
    coursetitle: 'mctr',
    traineemail: 'marameero',
    createdAt: 2023-01-04T00:06:45.892Z,
    updatedAt: 2023-01-04T00:06:45.892Z,
    v: 0,
    courseprice: 2

    

- POST admin adds refund to user:-
~ User ID required.
Response:
    
    _id: new ObjectId("63a4d28da9834c2d44f96eb8"),
    userid: new ObjectId("63a4d28da9834c2d44f96eb6"),
    registeredcourses: [],
    wallet: 10,
    courseProgression: [],
    createdAt: 2022-12-22T21:56:29.262Z,
    updatedAt: 2023-01-08T19:35:06.328Z,
    __v: 0
   




- POST admin rejecting a refund for user:-
Response:
    
    "message": "Refund has been rejected."
    


## How to use (Guide)
In order to use this website you are either an instructor or a trainee or a guest so here's a detailed guide for the functionalities of each.


- Guest
1. Signup.
2. Login.
3. View most popular courses.



- Trainee
1. View/Edit Profile.
2. View all courses.
3. View registered courses.
4. Take exercices, exams and certificates.
5. View wallet.
6. Report a course.
7. View reported courses.
8. View most popular courses.
9. Get a refund.
10. Rate an instructor.
11. Rate a course.
12. View courses videos.
13. Log out.



- Instructor
1. View/Edit Profile.
2. View all courses.
3. View assigned courses.
4. Apply discount on a course.
5. Close a course.
6. Report a course.
7. View reported courses.
8. Create a course.
9. Log out.
## Contribution
Contributions to this project are welcome and will be appreciated. To contribute to this project, simply make a pull request from the repository.
## Credits
- [How to write a readme file](https://www.youtube.com/watch?v=Rtpu2cWz7W8)
- [API req & React intro](https://www.youtube.com/watch?v=rpg1jOvGCtQ)
- [Node.js](https://www.youtube.com/watch?v=fgTGADljAeg&list=PLZlA0Gpn_vH_uZs4vJMIhcinABSTUH2bY&index=4)
- [MongoDB](https://www.youtube.com/watch?v=fgTGADljAeg&list=PLZlA0Gpn_vH_uZs4vJMIhcinABSTUH2bY&index=4)
- [Express](https://www.youtube.com/watch?v=fgTGADljAeg&list=PLZlA0Gpn_vH_uZs4vJMIhcinABSTUH2bY&index=4)
- [How to accept payments with stripe](https://www.youtube.com/watch?v=1r-F3FIONl8)
## The Crew
The team has disbanded. However, I appreciate everyone's effort in working on this project together.

- [Omar Alaa](https://github.com/omaralaa1)
