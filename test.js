
const prompt = `Amazon.com es una de las mayores plataformas de comercio electrónico del mundo, donde se venden productos, realiza un analsis de sentimiento del siguiente comentario :${review}, proporcione el sentimiento y el tema del comentario 
        ejemplo : {"sentimiento" : "positivo" , "topico" : "atencion al cliente"} , En caso
        el analisis no se puede determinar Output: {"sentimiento" : "positivo" , "topico" : "indeterminado"}`;

const old_prompt = `Categoriza el siguiente comentario con respecto a un producto de Amazon, si este es positivo, negativo o neutral. El comentario es : ${review} .Tu respuesta debe presentar la siguiente estructura:
    {
      "sentiment": "positive" | "negative" | "neutral",
      "positives": ["..."],
      "negatives": ["..."],
      "neutrals": ["..."]
    }`;