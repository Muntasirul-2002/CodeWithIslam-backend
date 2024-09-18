var express = require("express");
const userModel = require("../models/userModel");
var projectModel = require("../models/projectModel");
var router = express.Router();
var bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken"); // Import jsonwebtoken
const secret = "secret"; // Secret for signing JWT tokens

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

//signup function
router.post("/signup", async (req, res) => {
  let { username, email, password } = req.body;
  let emailCon = await userModel.findOne({ email: email });
  if (emailCon) {
    return res.json({ success: false, message: "Email already exists" });
  } else {
    bcrypt.genSalt(10, function (err, salt) {
      bcrypt.hash(password, salt, function (err, hash) {
        let user = userModel.create({
          username: username,
          email: email,
          password: hash,
        });
        return res.json({ success: true, message: "User created successfully", user });
      });
    });
  }
});

//login function
router.post("/login", async (req, res) => {
  let { email, password } = req.body;
  let user = await userModel.findOne({ email: email });

  if (user) {
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (isMatch) {
        let token = jwt.sign({ email: user.email, userId: user._id }, secret);
        return res.json({ success: true, message: "User logged in successfully", token: token, userId: user._id });
      } else {22
        return res.json({ success: false, message: "Invalid email or password" });
      }
    });
  } else {
    return res.json({ success: false, message: "User not found!" });
  }
});

//get user details by id
router.post('/get-user', async (req, res) => {
  let {userId} = req.body;
  let user = await userModel.findOne({ _id: userId})
  if(user){
    return res.json({ success: true, message:"User Details fetched!", user:user})
  }else{
    return res.json({ success: false, message:"User not found"})
  }
})

//create a new project
router.post('/create-project', async(req,res)=>{
  let {userId, title} = req.body;
  let user = await userModel.findOne({_id: userId})
  if(user){
    const project = await projectModel.create({
      title:title,
      createdBy:userId
    })
    return res.json({success:true, message:"Project created successfully", projectId:project._id})
  }else{
    return res.json({success:false, message:"User not found"})
  }
})


//get projects
router.post('/get-projects', async(req,res)=>{
  let {userId} = req.body;
  let user = await userModel.findOne({_id:userId});
  if(user){
    const getProjects = await projectModel.find({createdBy: userId})
    return res.json({success: true, message: "Projects fetched successfully", getProjects:getProjects})
  }
})

//delete project
router.post('/deleteProject', async (req, res) => {
  let {userId, projId} = req.body;
  let user = await userModel.findOne({_id:userId})
  if(user){
    let project = await projectModel.findOneAndDelete({_id:projId})
    return res.json({success: true, message: "Project deleted successfully"})
  }else{
    return res.json({success: false, message: "User not found"})
  }
})
module.exports = router;
