


document.getElementById('reviewForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    const asinOrUrl = document.getElementById('asinOrUrl').value;
    const number = document.getElementById('number').value;
    const country = document.getElementById('country').value;
    const reviewsDiv = document.getElementById('reviews');
    const analysisResultsDiv = document.getElementById('analysisResults');
    const loader = document.getElementById('loader');
    const getReviewsBtn = document.getElementById('getReviewsBtn');
    loader.style.display = 'block';
    getReviewsBtn.style.display = 'none';
    getReviewsBtn.disabled = true;
    try {
        
        const isUrl = asinOrUrl.startsWith('http');
        const asin = isUrl ? extractAsinFromUrl(asinOrUrl) : asinOrUrl;
       
        const responseReviews = await fetch(`/reviews/${asin}?number=${number}&country=${country}`);
        const data = await responseReviews.json();
        const {reviews , analysis} = data;
        console.log(reviews, analysis);
        renderReviews(reviewsDiv,reviews);
        renderAnalysis(analysisResultsDiv, analysis);
    } catch (error) {
        console.error('Error fetching reviews:', error);
        document.getElementById('reviews').innerHTML = '<p>Error fetching reviews.</p>';
    }finally {
        // Ocultar loader
        loader.style.display = 'none';
        getReviewsBtn.style.display = 'block';
        getReviewsBtn.disabled = false;
    }
});

function extractAsinFromUrl(url) {
    const match = url.match(/\/([A-Z0-9]{10})(?:[/?]|$)/i);
    return match ? match[1] : null;
}

function titleReplace(review){
    return review.title.replace(/\d+(\.\d+)? out of 5 stars\s*/, '').trim();
}

function renderReviews(container,data){
    container.innerHTML = '';

    if (data.result && data.result.length > 0) {

        container.innerHTML  =  data.result.map( review => {
            const title = titleReplace(review);
            return `<div class="review">
                 <h3>${title}</h3>
                 <p>Rating: ${review.rating} out of 5</p>
                 <p>Name: ${review.name}</p>
                 <p>Review: ${review.review}</p></div>`
            }).join("");

    } else {
        container.innerHTML = '<p>No reviews found.</p>';
    }   
}


function renderAnalysis(container, analysis) {
    const totalReviewsElement = document.getElementById('totalReviews');
    const percentPositiveElement = document.getElementById('percentPositive');
    const percentNegativeElement = document.getElementById('percentNegative');
    const percentNeutralElement = document.getElementById('percentNeutral');
    const positiveTopicsList = document.getElementById('positiveTopics');
    const negativeTopicsList = document.getElementById('negativeTopics');
    const neutralTopicsList = document.getElementById('neutralTopics');

    totalReviewsElement.textContent = analysis.totalReviews;
    percentPositiveElement.textContent = analysis.percentPositive + '%';
    percentNegativeElement.textContent = analysis.percentNegative + '%';
    percentNeutralElement.textContent = analysis.percentNeutral + '%';

    renderTopics(positiveTopicsList, analysis.positiveTopics);
    renderTopics(negativeTopicsList, analysis.negativeTopics);
    renderTopics(neutralTopicsList, analysis.neutralTopics);
    renderChart(analysis);
    
}

function renderTopics(container, topics) {
    container.innerHTML = '';
    topics.forEach(topic => {
        const li = document.createElement('li');
        li.textContent = topic;
        container.appendChild(li);
    });
}

let sentimentChart = null;
function renderChart(analysis) {
    // Destruir el gráfico existente si existe
    if (sentimentChart) {
        sentimentChart.destroy();
    }
    const ctx = document.getElementById('sentimentChart').getContext('2d');
    sentimentChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Positive', 'Negative', 'Neutral'],
            datasets: [{
                data: [analysis.percentPositive, analysis.percentNegative, analysis.percentNeutral],
                backgroundColor: ['#66ff66', '#ff6666', '#999999'],
                borderColor: ['#66ff66', '#ff6666', '#999999'],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                tooltip: {
                    callbacks: {
                        label: function(tooltipItem) {
                            return tooltipItem.label + ': ' + tooltipItem.raw + '%';
                        }
                    }
                }
            }
        }
    });
}

