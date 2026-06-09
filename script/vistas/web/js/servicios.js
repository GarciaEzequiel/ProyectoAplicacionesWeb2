// Reemplaza con la URL real de tu proyecto en MockAPI
const URL_API = 'https://69f54577fb098eb7f0b52e0b.mockapi.io/api/v1/servicios';

async function cargarServicios() {
    const contenedor = document.getElementById('servicios');

    // Mostramos un mensaje de carga provisional con tu clase "servicio"
    contenedor.innerHTML = '<p style="text-align:center;">Cargando áreas de atención...</p>';

    try {
        const respuesta = await fetch(URL_API);

        if (!respuesta.ok) {
            throw new Error('Error al conectar con la API');
        }

        const servicios = await respuesta.json();

        // Vaciamos el mensaje de carga
        contenedor.innerHTML = '';

        // Recorremos los datos que vinieron de la API
        servicios.forEach(servicio => {

            // Creamos un nuevo elemento <article>
            const article = document.createElement('article');
            // Le ponemos tu misma clase de CSS
            article.className = 'servicio';

            // Recreamos exactamente la misma estructura de HTML que tenías antes
            // inyectando las variables de la API
            article.innerHTML = `
                <img src="${servicio.imagen_url}" alt="${servicio.titulo}">
                <h3>${servicio.titulo}</h3>
                <p>${servicio.descripcion}</p>
            `;

            // Lo pegamos dentro del contenedor principal <section id="servicios">
            contenedor.appendChild(article);
        });

    } catch (error) {
        console.error('Ocurrió un error:', error);
        contenedor.innerHTML = '<p style="text-align:center; color:red;">No se pudieron cargar los servicios.</p>';
    }
}

// Ejecutamos la función apenas termine de cargar este archivo
cargarServicios();
