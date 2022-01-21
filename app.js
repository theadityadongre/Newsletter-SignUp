const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({
  extended: true
}));

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/failure", function(req,res){
  res.redirect("/");
});

app.post("/", function(req, res) {

  const fName = req.body.fName;
  const lName = req.body.lName;
  const email = req.body.email;

  const data = {
    members:[
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: fName,
          LNAME: lName
        }
      }
    ]
  }
    const jsonData = JSON.stringify(data);

    const url = "https://us20.api.mailchimp.com/3.0/lists/********";  // add your mailChimp Audience id

    const options = {
      method: "POST",
      auth: "*************************************"   //add your mailchimp authentication key here
    }

    const request = https.request(url, options, function(response){
        response.on("data", function(data){
          console.log(JSON.parse(data));

          if(response.statusCode === 200){
            res.sendFile(__dirname + "/success.html");
          }else{
            res.sendFile(__dirname + "/failure.html");
          }
        })
    })

    request.write(jsonData);
    request.end();
});

app.listen(process.env.PORT || 3000, function() {
  console.log("Server is running on port 3000.");
});
