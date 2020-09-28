//jshint esversion: 6

const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
const request = require("request");

const app = express();

app.use(express.static("public")); //static folder
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res){

  res.sendFile(__dirname + "/signup.html");

});

app.post("/", function(req, res){
  const fname = req.body.firstName;
  const lname = req.body.lastName;
  const email = req.body.email;

  var data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: fname,
          LNAME: lname
        }
      }
    ]

  };

  //send to mailchimp:
  const jsonData = JSON.stringify(data);

  const url = "https://us2.api.mailchimp.com/3.0/lists/92ec11aeb1";

  const options = {
    method: "POST",
    auth: "liseidy:d58039d318a1ccc9ac7c90ee5dda43cb-us2"
  }

  const request = https.request(url, options, function(response) {

    if(response.statusCode === 200){
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }

      response.on("data", function(data){
        console.log(JSON.parse(data));
      })
  })

  request.write(jsonData);
  request.end();

});

app.post("/failure", function(req, res) {
  res.redirect("/");
});

app.listen(process.env.PORT || 3200, function(){
  console.log("Server is running on port 3200");
});

//API KEY
//d58039d318a1ccc9ac7c90ee5dda43cb-us2

//LIST ID
//92ec11aeb1
