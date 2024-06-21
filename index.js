const express = require('express');
const amazonScraper = require('amazon-buddy');
const {getAnalysis} = require('./analisys/sentimentAnalysis');
const app = express();
const port = 3000;
let arrayReviews = [];
app.use(express.static('public'));

app.get('/reviews/:asin', async (req, res) => {
    const asin = req.params.asin;
    const number = req.query.number || 10;
    const country = req.query.country || 'PE';
    try {

        const reviews = await amazonScraper.reviews({ asin: asin, number: number, country: country });
        arrayReviews = [...reviews.result];

        arrayReviews = arrayReviews.map(e=>e.review);    
        const analysis = await getAnalysis(arrayReviews);
        console.log(analysis);
        res.status(200).json({
            status : true,
            reviews : reviews,
            analysis : analysis
        });
    } catch (error) {
        console.error('Error fetching reviews:', error);
        res.status(500).json({ error: 'Error fetching reviews' });
    }
});


app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
