# Amazon Product Reviews Analyzer

Este proyecto es una aplicación web que utiliza análisis de sentimientos y web scraping para obtener y analizar reseñas de productos de Amazon. Permite a los usuarios ingresar un ASIN o URL de Amazon, y obtiene las reseñas correspondientes, analiza su sentimiento y muestra los resultados en forma de gráficos y listas.

## Características

- **Obtención de reseñas**: Utiliza web scraping para obtener reseñas de productos de Amazon.
- **Análisis de sentimientos**: Utiliza análisis de sentimientos para categorizar las reseñas en positivas, negativas o neutrales.
- **Visualización de datos**: Muestra los resultados de análisis en forma de gráficos y listas.
- **Interfaz de usuario amigable**: Interfaz web fácil de usar para interactuar con la aplicación.

## Demo



https://github.com/sebitas13/Amazon-review-analyzer/assets/78001255/1d16ddc8-bbe0-4fd2-a53e-9c64eb11e421



## Instalación

1. **Clona el repositorio:**

   git clone https://github.com/tuusuario/tuprojecto.git
   cd tuprojecto

2. **Instala las dependencias:**

    npm install

3. **Configura tu archivo .env:**

    Renombra el archivo .env.example a .env y agrega tus propias claves de API de gemini.

    cp .env.example .env

4. **Inicia la aplicación:**

    npm start
    La aplicación estará disponible en http://localhost:3000.


## Uso

1. Ingresa el ASIN o URL del producto de Amazon y la cantidad de reseñas que deseas analizar.
2. Selecciona el país correspondiente para obtener las reseñas.
3. Haz clic en el botón "Get Reviews" para obtener y analizar las reseñas.
4. Observa los resultados de análisis de sentimientos, porcentaje de reseñas positivas, negativas y neutrales, y temas discutidos.

## Tecnologías utilizadas

- Node.js
- Express.js
- JavaScript (ES6+)
- HTML5
- CSS3
- Chart.js
- amazon-buddy (web scraping)
- GoogleGenerativeAI (análisis de sentimientos)

## Autor

Jesús Sebastián Huamanculi
