const express = require('express');
const app = new express();

const dotenv = require("dotenv");
dotenv.config();

/** Get a callable instance of the API service endpoint. */
function getNLUInstance() {
  // Mostly a case of reusing the code that was already written in Week 3 except
  // that the API has a different NodeJS package than the Translator did.
  let api_key = process.env.API_KEY;
  let api_url = process.env.API_URL;
  
  const NLU_v1 = require('ibm-watson/natual-language-understanding/v1');
  const { IamAuthenticator } = require('ibm-watson/auth');
  
  const languageUnderstander = new NLU_v1({
    version: '2020-08-01',
    authenticator: new IamAuthenticator({
      apikey: api_key,
    }),
    serviceUrl: api_url,
  });
  return languageUnderstander;
}

app.use(express.static('client'))

const cors_app = require('cors');
app.use(cors_app());

app.get("/",(req,res)=>{
    res.render('index.html');
  });

app.get("/url/emotion", (req,res) => {

    return res.send({"happy":"90","sad":"10"});
});

app.get("/url/sentiment", (req,res) => {
    return res.send("url sentiment for "+req.query.url);
});

app.get("/text/emotion", (req,res) => {
    return res.send({"happy":"10","sad":"90"});
});

app.get("/text/sentiment", (req,res) => {
    return res.send("text sentiment for "+req.query.text);
});

let server = app.listen(8080, () => {
    console.log('Listening', server.address().port)
})

