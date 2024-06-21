


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


// Variables para almacenar las instancias de los gráficos
let sentimentChart = null;
let topicChart = null;

function renderAnalysis(analysisResultsDiv, analysis) {
    // Inicializa los contadores y el objeto para la frecuencia de los tópicos
    let positiveCount = 0;
    let negativeCount = 0;
    let neutralCount = 0;
    const topicFrequency = {};

    // Procesa cada análisis de reseña para contar sentimientos y tópicos
    analysis.forEach(item => {
        // Contabiliza los sentimientos
        if (item.sentimiento === 'positivo') {
            positiveCount++;
        } else if (item.sentimiento === 'negativo') {
            negativeCount++;
        } else if (item.sentimiento === 'neutral') {
            neutralCount++;
        }

        // Contabiliza los tópicos
        if (!topicFrequency[item.topico]) {
            topicFrequency[item.topico] = 0;
        }
        topicFrequency[item.topico]++;
    });

    // Calcula totales y porcentajes
    const totalReviews = positiveCount + negativeCount + neutralCount;
    const positivePercentage = (positiveCount / totalReviews) * 100;
    const negativePercentage = (negativeCount / totalReviews) * 100;
    const neutralPercentage = (neutralCount / totalReviews) * 100;

    // Calcula porcentajes de tópicos
    const totalTopics = Object.values(topicFrequency).reduce((a, b) => a + b, 0);
    const topicPercentage = {};
    for (const [topic, count] of Object.entries(topicFrequency)) {
        topicPercentage[topic] = (count / totalTopics) * 100;
    }

    // Muestra los resultados en el div
    analysisResultsDiv.innerHTML = `
        <h3>Total de Reseñas: ${totalReviews}</h3>
        <p>Positivas: ${positivePercentage.toFixed(2)}%</p>
        <p>Negativas: ${negativePercentage.toFixed(2)}%</p>
        <p>Neutrales: ${neutralPercentage.toFixed(2)}%</p>
    `;

    // Datos para el gráfico de sentimientos
    const sentimentData = {
        labels: ['Positivo', 'Negativo', 'Neutral'],
        datasets: [{
            label: 'Porcentaje de Sentimientos',
            data: [positivePercentage, negativePercentage, neutralPercentage],
            backgroundColor: ['#4CAF50', '#F44336', '#FF9800'],
        }]
    };

    // Datos para el gráfico de tópicos
    const topicData = {
        labels: Object.keys(topicPercentage),
        datasets: [{
            label: 'Porcentaje de Tópicos',
            data: Object.values(topicPercentage),
            backgroundColor: '#00FFFF',
        }]
    };

    // Destruir gráficos existentes antes de crear nuevos
    if (sentimentChart) {
        sentimentChart.destroy();
    }
    if (topicChart) {
        topicChart.destroy();
    }

    // Crear nuevos gráficos con opciones para ajustar el tamaño de las etiquetas
    const sentimentCtx = document.getElementById('sentimentChart').getContext('2d');
    const topicCtx = document.getElementById('topicChart').getContext('2d');

    sentimentChart = new Chart(sentimentCtx, {
        type: 'pie',
        data: sentimentData,
        options: {
            plugins: {
                legend: {
                    labels: {
                        font: {
                            size: 18 // Ajusta el tamaño de las etiquetas
                        }
                    }
                }
            }
        }
    });

    topicChart = new Chart(topicCtx, {
        type: 'bar',
        data: topicData,
        options: {
            scales: {
                x: {
                    ticks: {
                        font: {
                            size: 16 // Ajusta el tamaño de las etiquetas en el eje X
                        }
                    }
                },
                y: {
                    ticks: {
                        font: {
                            size: 16 // Ajusta el tamaño de las etiquetas en el eje Y
                        }
                    }
                }
            },
            plugins: {
                legend: {
                    labels: {
                        font: {
                            size: 18 // Ajusta el tamaño de las etiquetas
                        }
                    }
                }
            }
        }
    });
}
