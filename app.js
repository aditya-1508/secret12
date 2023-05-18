//jshint esversion:6
require('dotenv').config();
const express=require('express');
const bodyParser=require('body-parser');
const ejs=require('ejs');
const mongoose=require('mongoose');
const encrypt=require('mongoose-encryption');
async function main(){

  await mongoose.connect("mongodb://127.0.0.1:27017/userDB");

  const userSchema=mongoose.Schema({
    email:String,
    password:String

  });
userSchema.plugin(encrypt,{secret:process.env.SECRET,encryptedFields:['password']});

const user= new mongoose.model("user",userSchema);
console.log(process.env.API_KEY);
const app=express();

app.use(express.static("public"));
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));

app.get("/",function(req,res){
  res.render("home");
});

app.get("/register",function(req,res){

  res.render("register");
});

app.get("/login",function(req,res){
  res.render("login");
});
app.post("/register",function(req,res){
  const username=req.body.username;
  const password=req.body.password;
  user.create({
    email:username,
    password:password
  }).then((result)=>{
    console.log("succssfully registered");
  });
  res.render("secrets");

});
app.post("/login",function(req,res){
  const username=req.body.username;
  const password=req.body.password;

  user.findOne({email:username}).then((founduser,err)=>{
    if(err){
      console.log(err);
    }else
    {
      if(founduser){


        if(founduser.password===password){
          res.render("secrets");
        }else
        {
          console.log("ugu");
        }
      }
    }
  });
});
app.listen(3000,function(){
  console.log("listening on port 3000");
});
};main();
