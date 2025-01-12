const express = require('express');
const app = new express();
const axios = require('axios').default;

const dotenv = require("dotenv");
dotenv.config();

/** Get a callable instance of the API service endpoint. */
function getNLUInstance() {
  // Mostly a case of reusing the code that was already written in Week 3 except
  // that the API has a different NodeJS package than the Translator did.
  let api_key = process.env.API_KEY;
  let api_url = process.env.API_URL;
  
  const NLU_v1 = require('ibm-watson/natural-language-understanding/v1');
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

// Will write functions of a literal string input first, under the assumption
// these can be reused later with a string that was first downloaded from a url.


/** Returns a promise which, when fulfilled, contains the document sentiment
 *  portion of the NLU API result, this being
 *    a positivity score -1 to +1 and 
 *    the sentiment label positive/neutral/negative.
 *  Example reponse:
 *   { "score": -0.315193, "label": "negative" }
 * */
 async function internal_infer_text_sentiment(text) {
    console.log(`Getting sentiment of ${text.substring(0,30)}...`);
    let api = getNLUInstance();
    // API docs at https://cloud.ibm.com/apidocs/natural-language-understanding?code=node#sentiment
    const analyzeParams = {
        'text': text,
        'features': {
            'sentiment': { }
        }
    };
    try {
        let analysisResults = (await api.analyze(analyzeParams)).result;
        console.log("api result object: ", analysisResults);
        let sentimentScore = analysisResults["sentiment"]["document"];
        return sentimentScore;
    } catch (err) {
        console.error('Sentiment API error:', err);
        throw new Error(JSON.stringify(err).substring(0,50));
    };
}


/**
 * Returns a promise which, when fulfilled, contains a 
 *  dictionary of possible emotion probability scores for the given text.
*/
async function internal_infer_text_emotion(text) {
    console.log(`Getting sentiment of ${text.substring(0,50)}...`);
    let api = getNLUInstance();
    const analyzeParams = {
        'text': text,
        'features': {
            'emotion': { }
        }
    };
    try {
        let analysisResults = (await api.analyze(analyzeParams)).result;
        console.log("api result object: ", analysisResults);
        let emoScores = analysisResults["emotion"]["document"]["emotion"];
        return emoScores;
    } catch (err) {
        console.error('Emotions API error:', err);
        throw new Error(JSON.stringify(err).substring(0,50));
    };
}

/**
 * General text downloader used by the other services.
 * @param {*} url The plain text document to download.
 */
async function internal_wrangle_url_text(url) {
    console.log("Downloading ", url, "...");
    let text = null;
    try {
        const res = await axios.get(url,{
            headers:{
                Accept: 'text/plain'
            },
        });
        text = res.data.trim();
        console.log("..Downloaded", text.substring(0,200), "(..).");
        return text;
    } catch (e) {
        throw Error("Error during download.", e);
    }
}


/**
 * Same output as the internal_infer_text_sentiment function
 * except this analyzes text downloaded from the given URL.
*/
async function internal_infer_url_sentiment(url) {
    let text = await internal_wrangle_url_text(url);
    let sentiment = await internal_infer_text_sentiment(text);
    return sentiment;
}


/**
 * Same output as the internal_infer_text_emotion function
 * except this analyzes text downloaded from the given URL.
*/
async function internal_infer_url_emotion(url) {
    let text = await internal_wrangle_url_text(url);
    let emos = await internal_infer_text_emotion(text);
    return emos;
}



app.use(express.static('client'))

const cors_app = require('cors');
app.use(cors_app());

app.get("/",(req,res)=>{
    res.render('index.html');
  });

app.get("/url/emotion", (req,res) => {
    internal_infer_url_emotion(req.query.url)
    .then( (answer) => res.send(answer) )
    .catch( (err) => {
        res.status(500).send(err)
    } )
});

app.get("/url/sentiment", (req,res) => {
    internal_infer_url_sentiment(req.query.url)
    .then( (answer) => res.send(answer) )
    .catch( (err) => {
        res.status(500).send(err)
    } )
});

app.get("/text/emotion", (req,res) => {
    internal_infer_text_emotion(req.query.text)
    .then( (answer) => res.send(answer) )
    .catch( (err) => {
        res.status(500).send(err)
    } )
});

app.get("/text/sentiment", (req,res) => {
    internal_infer_text_sentiment(req.query.text)
    .then( (answer) => res.send(answer) )
    .catch( (err) => {
        res.status(500).send(err)
    } )
});

let server = app.listen(8080, () => {
    console.log('Listening', server.address().port)
});

// Exported so they can be used in a test harness via require().
exports.server = server;
exports.internal_infer_text_sentiment = internal_infer_text_sentiment;
exports.internal_infer_text_emotion = internal_infer_text_emotion;
exports.internal_infer_url_sentiment = internal_infer_url_sentiment
exports.internal_infer_url_emotion = internal_infer_url_emotion
