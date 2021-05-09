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


async function testSentimentOkayURLWP() {
    const input = "https://en.wikipedia.org/w/index.php?title=Firefox_Focus&oldid=834063053"
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
        testPassed["testSentimentOkayURLWP"] = true;
    } catch (err) {
        console.error("FAIL due to error thrown:", err);
        testPassed["testSentimentOkayURLWP"] = false;
    }
}


async function testEmotionsOK_WPURL() {
    const input = "https://en.wikipedia.org/w/index.php?title=Firefox_Focus&oldid=834063053"
    try {
        let emos = await sant.internal_infer_text_emotion(input)
        console.log("output:", emos);
        if (!("joy" in emos)) {
            throw new Error("No joy in map.");
        }
        if (emos.joy<0.05)  {
            throw new Error("Not joyful enough for positive article.");
        }
        console.log("PASS.")
        testPassed["testEmotionsOK_WPURL"] = true;
    } catch (err) {
        console.error("FAIL due to error thrown:", err);
        testPassed["testEmotionsOK_WPURL"] = false;
    }
}


Promise.all( 
    [
        testSentimentGood1(),
        testSentimentTooShort(),
        testSentimentBad1(),
        testEmotionBad1(),
        testSentimentOkayURLWP(),
        testEmotionsOK_WPURL()
    ] 
).then(
        (x) => { 
            console.log("Report:", testPassed);
            var P = 0; var T=0;
            for (k in testPassed) { 
                T++;
                if (testPassed[k]) P++;
            }
            console.log("Total Passed", P, "/", T);
            sant.server.close();
            console.log("ended server.")
        }
);