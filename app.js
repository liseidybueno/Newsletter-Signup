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

  const url = "MAILCHIMPLISTID";

  const options = {
    method: "POST",
    auth: "MAILCHIMPAPIKEY"
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

