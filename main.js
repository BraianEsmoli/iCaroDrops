/* === NAVBAR OCULTARSE LUEGO DE SCROLL 100 VH === */
document.addEventListener('DOMContentLoaded', () => {
  const navbar = document.getElementById('mainNavbar');

  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll <= window.innerHeight) {
      // Mostrar navbar con transición
      navbar.classList.remove('navbar-hidden');
    } else {
      // Ocultar navbar con transición
      navbar.classList.add('navbar-hidden');
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

/* === VER MAS PRODUCTOS === */
document.addEventListener('DOMContentLoaded', () => {
  const productos = document.querySelectorAll('.producto-card');
  const verMasBtn = document.getElementById('ver-mas');
  const verMenosBtn = document.getElementById('ver-menos');

  let productosMostrados = 8;

  function actualizarProductos(animarNuevos = false) {
    productos.forEach((card, i) => {
      if (i < productosMostrados) {
        const estabaOculto = card.classList.contains('d-none');
        card.classList.remove('d-none');

        // ✅ solo animar si estaba oculto antes y estamos mostrando más
        if (animarNuevos && estabaOculto) {
          card.classList.add('mostrar-suave');
          setTimeout(() => card.classList.remove('mostrar-suave'), 600);
        }

      } else {
        card.classList.add('d-none');
      }
    });

    verMasBtn.classList.toggle('d-none', productosMostrados >= productos.length);
    verMenosBtn.classList.toggle('d-none', productosMostrados < productos.length);
  }

  verMasBtn?.addEventListener('click', () => {
    productosMostrados += 8;
    actualizarProductos(true); // ✅ animar nuevos
  });

  verMenosBtn?.addEventListener('click', () => {
    productosMostrados = 8;
    actualizarProductos(false); // ❌ no animar
  });

  actualizarProductos(); // primera carga
});


/* === MODAL PRODUCTOS === */
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

// Listener para todas las cards
document.querySelectorAll('.card-producto').forEach(card => {
  card.addEventListener('click', () => {
    abrirModal({
      imagen: card.dataset.imagen,
      nombre: card.dataset.nombre,
      descripcion: card.dataset.descripcion,
      talles: card.dataset.talles
    });
  });
});

/* === SCRIPT EXTRA PARA MODAL: DESACTIVAR WHATSAPP SI ESTÁ AGOTADO === */
function abrirModal(producto) {
  const modal = document.getElementById('modalProducto');
  document.getElementById('modalImagen').src = producto.imagen;
  document.getElementById('modalTitulo').textContent = producto.nombre;
  document.getElementById('modalDescripcion').textContent = producto.descripcion;
  document.getElementById('modalTalles').textContent = `Talles disponibles: ${producto.talles}`;

  const btnWhatsapp = document.getElementById('modalWhatsapp');
  btnWhatsapp.href = `https://wa.me/5491123456789?text=Hola! Quiero consultar por la gorra ${producto.nombre}`;

  // Si la card tiene clase "agotado", desactivar botón
  const card = [...document.querySelectorAll('.card-producto')].find(c =>
    c.dataset.nombre === producto.nombre &&
    c.dataset.descripcion === producto.descripcion
  );

  if (card && card.classList.contains('agotado')) {
    btnWhatsapp.classList.add('disabled');
    btnWhatsapp.textContent = 'Producto agotado';
    btnWhatsapp.removeAttribute('href');
  } else {
    btnWhatsapp.classList.remove('disabled');
    btnWhatsapp.textContent = 'Consultar por stock';
  }

  modal.style.display = 'flex';
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