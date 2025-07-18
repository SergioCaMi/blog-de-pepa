// Información de las ciudades
const ciudades = {
  palamos: {
    nombre: "Palamós",
    imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSn7S9XTzYJAo90itEe4avmv2JyFs6pcgnvIw&s",
    descripcion: "Palamós es una localidad costera de la Costa Brava, conocida por sus playas y su puerto pesquero. Es famosa por sus gambas y su ambiente marinero.",
  },
  blanes: {
    nombre: "Blanes",
    imagen:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/BLANES_DONDE_COMIENZA_LA_%29%28%28%28%28%28%C2%BA%29_COSTA_BRAVA%28%C2%BA%29%29%29%29%29%28_-_panoramio.jpg/330px-BLANES_DONDE_COMIENZA_LA_%29%28%28%28%28%28%C2%BA%29_COSTA_BRAVA%28%C2%BA%29%29%29%29%29%28_-_panoramio.jpg",
    descripcion: "Blanes es la puerta de entrada a la Costa Brava, famosa por su jardín botánico y su animado paseo marítimo. Sus playas y calas son muy apreciadas por los visitantes.",
  },
};

const citySelector = document.getElementById("citySelector");
const sortSelector = document.getElementById("sort");
const cityInfo = document.getElementById("cityInfo");
const accomodationsInfo = document.getElementById("accomodationsInfo");

const apiUrl = "https://bravabook.onrender.com/api/apartments/search";

// Función para mostrar datos de la ciudad
function updateCityInfo(cityKey) {
  const city = ciudades[cityKey];
  if (city) {
    cityInfo.style.display = "block";
    accomodationsInfo.style.display = "block";

    document.getElementById("cityNombre").textContent = city.nombre;
    document.getElementById("cityImagen").src = city.imagen;
    document.getElementById("cityDescripcion").textContent = city.descripcion;
  } else {
    cityInfo.style.display = "none";
    accomodationsInfo.style.display = "none";
  }
}

// Función para hacer el GET
async function obtenerDatos(city) {
  const response = await fetch(apiUrl + `?city=${city}`);
  if (response.ok) {
    const data = await response.json();
    console.log(data);
    return data;
  } else {
    console.log("La solicitud falló: " + response.status);
    return [];
  }
}

// Función para mostrar apartamentos
function createNodeApartments(apartments) {
  const container = document.getElementById("accomodations");
  apartments.sort((a, b) => (a.price - b.price) * Number(sortSelector.value));
  apartments.forEach((apartment) => {
    if (apartment.price >= 100) {
      if (apartment.price >= 200) {
        color = "red;";
      } else {
        color = "green";
      }
    } else {
      color = "";
    }
    const newDiv = document.createElement("div");
    newDiv.innerHTML = `
    <hr>
      <h2>${apartment.title}</h2>
      <p>Ciudad: ${apartment.city}</p>
      <a href=" https://bravabook.onrender.com/apartment/${apartment._id}#reservation">
      <img src="${apartment.mainPhoto}" alt="${apartment.title}" style="width: 100%; max-width: 300px; height: auto;">
      </a>
      <p style="color: ${color};">Precio: $${apartment.price} por noche</p>
      <p>Tamaño: ${apartment.squareMeters} m²</p>
      <p>Servicios:${JSON.stringify(apartment.services, null, 2)}</p>
      <p>Reservaciones: ${apartment.reservations.length}</p>
      <hr>
    `;
    container.appendChild(newDiv);
  });
}

// Evento Change
citySelector.addEventListener("change", (event) => {
  renderApartmentsForCity(event.target.value);
});

sortSelector.addEventListener("change", () => {
  renderApartmentsForCity(citySelector.value);
});


async function renderApartmentsForCity(cityKey) {
  updateCityInfo(cityKey);
  const data = await obtenerDatos(cityKey);
  document.getElementById("accomodations").innerHTML = '';
  document.getElementById("numAccomodations").textContent = data.length;
  createNodeApartments(data);
}