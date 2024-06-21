const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config(); 

const genAI = new GoogleGenerativeAI(process.env.API_KEY);

// let results = {
//     countReviews : 0,
//     positive: { count: 0, topics: [] },
//     negative: { count: 0, topics: [] },
//     neutral: { count: 0, topics: [] },
// }

let results = [];

async function analizeReview(review) {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const prompt = `Amazon.com es una de las mayores plataformas de comercio electrónico del mundo, donde se venden productos que incluyen libros, electrónica, ropa, alimentos, juguetes, y mucho más. realiza un analsis de sentimiento del siguiente comentario : ${review}. Proporcione el sentimiento y el tema del comentario, 
        ejemplo : {"sentimiento" : "positivo" , "topico" : "comodidad"} , En caso
        el analisis no se puede determinar Output: {"sentimiento" : "neutral" , "topico" : "indeterminado"}`;
    
    try {
        const result = await model.generateContent(prompt);
        const response =  result.response;
        const text = response.text();
        
        const jsonString = JSON.parse(text.match(/\{.*\}/s)[0]);
        results.push(jsonString);
        
    } catch (error) {
        console.error('Error generating content:', error);
    }
}



// function analizedTopics(analisys) {
//     switch (analisys.sentiment) {
//         case 'positive':
//             results.positive.count++;
//             results.positive.topics.push(...analisys.positives);
//             break;
//         case 'negative':
//             results.negative.count++;
//             results.negative.topics.push(...analisys.negatives);
//             break;
//         case 'neutral':
//             results.neutral.count++;
//             results.neutral.topics.push(...analisys.neutrals);
//             break;
//         default:
//             console.error('Unknown analysis type:', analisys.sentiment);
//             break;
//     }
// }


async function getAnalysis(reviews=[]) {
    results = [];

    for (const review of reviews) {
        await analizeReview(review);
        await new Promise(resolve => setTimeout(resolve, 500));
    }

    return results;
}

module.exports = {
    getAnalysis
}