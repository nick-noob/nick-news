const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

require("dotenv").config();

const app = express();

app.use(express.static("public"))

app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res){
    res.sendFile(__dirname + "/index.html");
});

app.post("/", function(req, res){

    const email = req.body.email;

    console.log(email);

    const data = {
        members: [
            {
               email_address: email,
               status: "subscribed",
                
            }
        ]
    };

    const jsonData = JSON.stringify(data);

    const url = process.env.MAILCHIMP_LIST_URL;

    const options = {
        method: "POST",
        auth: `rickypp:${process.env.MAILCHIMP_API_KEY}`,
        headers: {
            "content-type": "application/json",
            "content-length": jsonData.length
        }
    }

    const request = https.request(url, options, function(response){

       if (response.statusCode === 200) {
            res.sendFile(__dirname + "/success.html");
        } else {
            res.sendFile(__dirname + "/failure.html");
        }

        response.on("data", function(data){
            console.log(JSON.parse(data));
        });
    })
    
    request.write(jsonData);
    request.end();

});

app.post("/success", function(req, res){
    res.redirect("/");
});

app.post("/failure", function(req, res){
    res.redirect("/");
});

app.listen(process.env.PORT || 3000, function(){
    console.log("Server is Running on Port 3000");
});








