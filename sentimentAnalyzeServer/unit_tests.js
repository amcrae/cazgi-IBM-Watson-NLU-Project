const sant = require('./sentimentAnalyzerServer');

testPassed = {}

async function testSentimentGood1() {
    const input = "This is wonderful news, let's jump with joy."
    try {
        let sent = await sant.internal_infer_text_sentiment(input)
        console.log("output:", sent);
        if (!("score" in sent)) {
            throw new Error("No score member in map.");
        }
        if (!("label" in sent)) {
            throw new Error("No label member in map.");
        }
        if (sent.score<0.0)  {
            throw new Error("Score too low");
        }
        testPassed["testSentimentGood1"] = true;
    } catch (err) {
        console.error("FAIL due to error thrown:", err);
        testPassed["testSentimentGood1"] = false;
    }
}

async function testSentimentTooShort() {
    const input = "Terrific"
    try {
        let sent = await sant.internal_infer_text_sentiment(input)
        console.log("output:", sent);
        if (("score" in sent)) {
            throw new Error("Score member in map.");
        }
        if (("label" in sent)) {
            throw new Error("Label member in map.");
        }
        if (sent.score<0.0)  {
            throw new Error("Score too negative");
        }
        console.log("FAIL.")
        testPassed["testSentimentTooShort"] = false;
    } catch (err) {
        console.error("PASS due to error properly thrown:", err);
        testPassed["testSentimentTooShort"] = true;
    }
}

async function testSentimentBad1() {
    const input = "Which sadist made await only valid in asynch functions!? \
        Who the hell wants to write a busy wait loop when await could do it!";
    try {
        let sent = await sant.internal_infer_text_sentiment(input)
        console.log("output:", sent);
        if (!("score" in sent)) {
            throw new Error("No score member in map.");
        }
        if (!("label" in sent)) {
            throw new Error("No score member in map.");
        }
        if (sent.score>0.0)  {
            throw new Error("Positivity too high");
        }
        console.log("PASS.")
        testPassed["testSentimentBad1"] = true;
    } catch (err) {
        console.error("FAIL due to error thrown:", err);
        testPassed["testSentimentBad1"] = false;
    }
}

async function testEmotionBad1() {
    const input = "Which sadist made await only valid in asynch functions!? \
        Who the hell wants to write a busy wait loop when await could do it!";
    try {
        let emos = await sant.internal_infer_text_emotion(input)
        console.log("output:", emos);
        if (!("anger" in emos)) {
            throw new Error("No anger in map.");
        }
        if (emos.anger<0.1)  {
            throw new Error("Not angry enough for angry input text");
        }
        console.log("PASS.")
        testPassed["testEmotionBad1"] = true;
    } catch (err) {
        console.error("FAIL due to error thrown:", err);
        testPassed["testEmotionBad1"] = false;
    }
}


async function testSentimentOkay_URL() {
    // const input = "https://en.wikipedia.org/w/index.php?title=Firefox_Focus&oldid=834063053"
    const input = "https://tools.ietf.org/rfc/rfc1036.txt"
    try {
        let sent = await sant.internal_infer_url_sentiment(input)
        console.log("output:", sent);
        if (!(sent!=null && ("score" in sent))) {
            throw new Error("No score member in map.");
        }
        if (!("label" in sent)) {
            throw new Error("No label member in map.");
        }
        if (sent.score<0.0)  {
            throw new Error("Score too negative for neutral article");
        }
        testPassed["testSentimentOkay_URL"] = true;
    } catch (err) {
        console.error("FAIL due to error thrown:", err);
        testPassed["testSentimentOkay_URL"] = false;
    }
}


async function testEmotionsOK_URL() {
    //const input = "https://en.wikipedia.org/w/index.php?title=Firefox_Focus&oldid=834063053"
    //TODO: Should cope with HTML content by extracting plain text nodes 
    //      similar to how Beautiful Soup works in Python.
    //      In the meantime, use a known plaintext document.
    const input = "https://raw.githubusercontent.com/amcrae/cazgi-IBM-Watson-NLU-Project/master/LICENSE";
    try {
        let emos = await sant.internal_infer_url_emotion(input)
        console.log("output:", emos);
        if (!("sadness" in emos)) {
            throw new Error("No sadness in map.");
        }
        if (emos.sadness<0.25)  {
            throw new Error("Not sad enough for legalese.");
        }
        console.log("PASS.")
        testPassed["testEmotionsOK_URL"] = true;
    } catch (err) {
        console.error("FAIL due to error thrown:", err);
        testPassed["testEmotionsOK_URL"] = false;
    }
}


const all_tests = [
    testSentimentGood1,
    testSentimentTooShort,
    testSentimentBad1,
    testEmotionBad1,
    testSentimentOkay_URL,
    testEmotionsOK_URL
];

(async function testRunner() {
    for (i in all_tests) {
        let t = all_tests[i];
        await t();
    }
    console.log("Report:", testPassed);
    var P = 0; var T=0;
    for (k in testPassed) { 
        T++;
        if (testPassed[k]) P++;
    }
    console.log("Total Passed", P, "/", T);
    sant.server.close();
    console.log("ended server.")
})().catch( console.error );