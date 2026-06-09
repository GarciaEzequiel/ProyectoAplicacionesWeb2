const URL_API = '/api/v1/servicios'

async function cargarServicios() {
  const contenedor = document.getElementById('servicios')
  contenedor.innerHTML = '<p style="text-align:center;">Cargando áreas de atención...</p>'

  try {
    const respuesta = await fetch(URL_API)
    if (!respuesta.ok) throw new Error('Error al conectar con la API')

    const servicios = await respuesta.json()
    contenedor.innerHTML = ''

    servicios.forEach(servicio => {
      const article = document.createElement('article')
      article.className = 'servicio'
      article.innerHTML = `
        <img src="/imagenes/${servicio.imagen}" alt="${servicio.nombre}">
        <h3>${servicio.nombre}</h3>
        <p>${servicio.descripcion}</p>
      `
      contenedor.appendChild(article)
    })
  } catch (error) {
    console.error('Ocurrió un error:', error)
    contenedor.innerHTML = '<p style="text-align:center; color:red;">No se pudieron cargar los servicios.</p>'
  }
}

cargarServicios()
