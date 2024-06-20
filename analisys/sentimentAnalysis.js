const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config(); 

const genAI = new GoogleGenerativeAI(process.env.API_KEY);

let results = {
    countReviews : 0,
    positive: { count: 0, topics: [] },
    negative: { count: 0, topics: [] },
    neutral: { count: 0, topics: [] },
}

function analizedTopics(analisys) {
    switch (analisys.sentiment) {
        case 'positive':
            results.positive.count++;
            results.positive.topics.push(...analisys.positives);
            break;
        case 'negative':
            results.negative.count++;
            results.negative.topics.push(...analisys.negatives);
            break;
        case 'neutral':
            results.neutral.count++;
            results.neutral.topics.push(...analisys.neutrals);
            break;
        default:
            console.error('Unknown analysis type:', analisys.sentiment);
            break;
    }
}

async function analizeReview(review) {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const prompt = `Categoriza el siguiente comentario con respecto a un producto de Amazon, si este es positivo, negativo o neutral(si el numero de caracteristicas positivas y negativas sean los mismo). El comentario es : ${review} .Tu respuesta debe presentar la siguiente estructura:
    {
      "sentiment": "positive" | "negative" | "neutral",
      "positives": ["..."],
      "negatives": ["..."],
      "neutrals": ["..."]
    }`;
    
    try {
        const result = await model.generateContent(prompt);
        const response =  result.response;
        const text = response.text();
        // console.log(text);
        const jsonString = text.match(/\{.*\}/s)[0]; // Extrae el contenido entre llaves

        // Parsear la respuesta JSON
        const analysis = JSON.parse(jsonString);
        console.log(analysis);
        analizedTopics(analysis);
    } catch (error) {
        console.error('Error generating content:', error);
    }
}





async function run(reviews=[]) {

    results = {
        countReviews : 0,
        positive: { count: 0, topics: [] },
        negative: { count: 0, topics: [] },
        neutral: { count: 0, topics: [] },
    }

    results.countReviews = reviews.length;

    for (const review of reviews) {
        await analizeReview(review);
        await new Promise(resolve => setTimeout(resolve, 500));
    }
    const totalReviews = results.countReviews;
    const percentPositive = totalReviews > 0 ? ((results.positive.count / totalReviews) * 100).toFixed(2) : 0.00;
    const percentNegative = totalReviews > 0 ? ((results.negative.count / totalReviews) * 100).toFixed(2) : 0.00;
    const percentNeutral = totalReviews > 0 ? ((results.neutral.count / totalReviews) * 100).toFixed(2) : 0.00;
    return {
        totalReviews: totalReviews,
        totalPositive : results.positive.count,
        totalNegative : results.negative.count,
        totalNeutrail : results.neutral.count,
        percentPositive: percentPositive,
        percentNegative: percentNegative,
        percentNeutral: percentNeutral,
        positiveTopics: results.positive.topics,
        negativeTopics: results.negative.topics,
        neutralTopics: results.neutral.topics
    };
}

module.exports = {
    run
}