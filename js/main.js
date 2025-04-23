document.addEventListener('DOMContentLoaded', () => {
  const navbar = document.getElementById('mainNavbar');
  const logoWrap = document.getElementById('navbarLogoWrap');
  const navbarCollapse = document.getElementById('navbarContent');
  const navbarToggler = document.querySelector('.navbar-toggler');

  function handleScroll() {
    const scrollTop = window.pageYOffset;

    if (window.innerWidth >= 992) {
      if (scrollTop > window.innerHeight) {
        navbar.classList.add('navbar-hidden');
      } else {
        navbar.classList.remove('navbar-hidden');
      }
    } else {
      if (scrollTop > window.innerHeight) {
        logoWrap.classList.add('hide-logo');
        logoWrap.classList.remove('show-logo');
      } else {
        logoWrap.classList.remove('hide-logo');
        logoWrap.classList.add('show-logo');
      }
    }
  }

  window.addEventListener('scroll', handleScroll);
  handleScroll();

  document.addEventListener('click', (e) => {
    const isOpen = navbarCollapse.classList.contains('show');
    const clickedOutside = !navbarCollapse.contains(e.target) && !navbarToggler.contains(e.target);

    if (isOpen && clickedOutside) {
      new bootstrap.Collapse(navbarCollapse).hide();
    }
  });
});


/* === CAROUSEL INFINITO SEC EXCLUSIVE === */
window.addEventListener('DOMContentLoaded', () => {
  const track = document.getElementById('carousel-track');
  const images = [...track.children];

  // Duplicamos dinámicamente
  images.forEach(img => {
    const clone = img.cloneNode(true);
    track.appendChild(clone);
  });
});


// main.js
import { obtenerProductosDesdeNotion } from './notion.js';

// Mostrar spinner de carga
const grid = document.getElementById('productos-grid');
const spinner = document.createElement('div');
spinner.className = 'spinner-productos';
spinner.innerHTML = `<div class="spinner"></div>`;
grid.appendChild(spinner);

// Función para crear una card de producto
function crearCard(producto) {
  const card = document.createElement('div');
  card.className = 'col-6 col-md-4 col-lg-3 producto-card';

  const estaAgotado = producto.agotado ? 'agotado' : '';

  card.innerHTML = `
    <div class="card-producto ${estaAgotado}"
         data-imagen="${producto.imagen}"
         data-nombre="${producto.nombre}"
         data-descripcion="${producto.descripcion}"
         data-talles="${producto.talles}">

      <img src="${producto.imagen}" alt="${producto.nombre}">

      <div class="info-producto">
        <p class="precio">${producto.precio}</p>
        <p class="nombre">${producto.nombre}</p>
        <div class="acciones">
          <span class="icono info-tooltip" data-tooltip="${producto.descripcion}">
            <i class="fas fa-info-circle"></i>
          </span>
          <span class="icono"><i class="fas fa-arrow-right"></i></span>
        </div>
      </div>
      ${producto.agotado ? '<div class="sold-out-label">Sold Out</div>' : ''}
    </div>`;

  if (!producto.agotado) {
    card.querySelector('.card-producto').addEventListener('click', () => {
      abrirModal(producto);
    });
  }

  return card;
}

// Renderizar productos desde Notion
obtenerProductosDesdeNotion()
  .then(productos => {
    grid.innerHTML = ''; // Limpiar spinner
    productos.forEach(p => grid.appendChild(crearCard(p)));
  })
  .catch(err => {
    grid.innerHTML = '<p class="text-danger">Error al cargar los productos.</p>';
    console.error('Error al obtener productos:', err);
  });

// Modal
function abrirModal(producto) {
  document.getElementById('modalImagen').src = producto.imagen;
  document.getElementById('modalTitulo').textContent = producto.nombre;
  document.getElementById('modalDescripcion').textContent = producto.descripcion;
  document.getElementById('modalTalles').textContent = `Talles disponibles: ${producto.talles}`;
  document.getElementById('modalWhatsapp').href = `https://wa.me/5492915661942?text=Hola! Quiero consultar por la gorra ${producto.nombre}`;
  document.getElementById('modalProducto').style.display = 'flex';
}

function cerrarModal() {
  document.getElementById('modalProducto').style.display = 'none';
}


/* === EFECTO FADEUP, APARECE SOLO CUANDO SE VE EN PANTALLA === */
document.addEventListener('DOMContentLoaded', () => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, {
    threshold: 0.1
  });

  document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));
});