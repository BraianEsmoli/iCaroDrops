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


/* === COMING SOON === */
// === Inicializar EmailJS ===
(function() {
  emailjs.init('xSrOCtorfN6gon9Sp');
})();

document.getElementById('comingSoonForm').addEventListener('submit', function(e) {
  e.preventDefault();

  emailjs.send('service_se1ukra', 'template_x3t3jdh', {
      user_email: document.getElementById('user_email').value
  })
  .then(function() {
      document.getElementById('formMessage').textContent = '¡Te hemos enviado el link! Revisa tu correo.';
      document.getElementById('comingSoonForm').reset();
  }, function(error) {
      document.getElementById('formMessage').textContent = 'Error al enviar. Intenta de nuevo.';
      console.error('Error:', error);
  });
});

// === Animación 3D del texto “COMING SOON” ===
const container = document.getElementById('animation-container');
container.innerHTML = ''; // Limpia cualquier canvas previo

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(50, container.clientWidth / 200, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setSize(container.clientWidth, 200);
container.appendChild(renderer.domElement);

const loader = new THREE.FontLoader();
loader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', function(font) {
  const textGeometry = new THREE.TextGeometry('COMING SOON', {
    font: font,
    size: 1,
    height: 0.2,
    curveSegments: 12,
  });

  const material = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true });
  const textMesh = new THREE.Mesh(textGeometry, material);
  textGeometry.center();
  scene.add(textMesh);

  camera.position.z = 5;

  function animate() {
    requestAnimationFrame(animate);
    textMesh.rotation.y += 0.01;
    renderer.render(scene, camera);
  }
  animate();
});


// === PRODUCTOS ===

// Mostrar spinner de carga
const grid = document.getElementById('productos-grid');
const spinner = document.createElement('div');
spinner.className = 'spinner-productos';
spinner.innerHTML = `<div class="spinner"></div>`;
grid.appendChild(spinner);

let productosMostrados = 8;
let todosLosProductos = [];

// Crear tarjeta de producto
function crearCard(producto) {
  const card = document.createElement('div');
  card.className = 'col-6 col-md-4 col-lg-3 producto-card';
  const estaAgotado = producto.agotado ? 'agotado' : '';

  card.innerHTML = `
    <div class="card-producto ${estaAgotado}"
         data-nombre="${producto.nombre}"
         data-descripcion="${producto.descripcion}"
         data-talles="${producto.talles}"
         data-imagenes='${JSON.stringify(producto.imagenes)}'>
      <img src="${producto.imagenes[0] || 'https://via.placeholder.com/300x200?text=Sin+Imagen'}" alt="${producto.nombre}">
      <div class="info-producto d-flex flex-column justify-content-between h-100">
        <div>
          <p class="precio">${producto.precio}</p>
          <p class="nombre">${producto.nombre}</p>
        </div>
        <div class="acciones mt-auto d-flex justify-content-between">
          <span class="icono info-tooltip" data-tooltip="${producto.descripcion}">
            <i class="fas fa-info-circle"></i>
          </span>
          <span class="icono"><i class="fas fa-arrow-right"></i></span>
        </div>
      </div>
      ${producto.agotado ? '<div class="sold-out-label">Sold Out</div>' : ''}
    </div>`;

  if (!producto.agotado) {
    card.querySelector('.card-producto').addEventListener('click', () => abrirModal(producto));
  }

  return card;
}

// Mostrar productos
function renderizarProductos() {
  grid.innerHTML = '';
  const visibles = todosLosProductos.slice(0, productosMostrados);
  visibles.forEach(p => grid.appendChild(crearCard(p)));

  const hayMasProductos = todosLosProductos.length > productosMostrados;
  document.getElementById('ver-mas')?.classList.toggle('d-none', !hayMasProductos);
  document.getElementById('ver-menos')?.classList.toggle('d-none', productosMostrados <= 8);
}

// Obtener productos desde Notion vía backend
fetch('https://icarodrops-backend.vercel.app/api/productos')
  .then(res => res.json())
  .then(productos => {
    todosLosProductos = productos
      .map(p => ({
        ...p,
        imagenes: Array.isArray(p.imagenes) && p.imagenes.length > 0 ? p.imagenes : ['https://via.placeholder.com/300x200?text=Sin+Imagen']
      }))
      .sort((a, b) => {
        if (a.agotado && !b.agotado) return 1;
        if (!a.agotado && b.agotado) return -1;
        return 0;
      });

    renderizarProductos();
  })
  .catch(err => {
    grid.innerHTML = '<p class="text-danger">Error al cargar los productos.</p>';
    console.error('Error al obtener productos desde backend:', err);
  });

// Modal Bootstrap
function abrirModal(producto) {
  const modal = new bootstrap.Modal(document.getElementById('modalProducto'));
  const thumbnailsContainer = document.getElementById('modalThumbnails');
  const imagenPrincipal = document.getElementById('modalImagenPrincipal');
  const thumbnailWrapper = document.getElementById('thumbnailScrollWrapper');

  thumbnailsContainer.innerHTML = '';
  imagenPrincipal.src = producto.imagenes?.[0] || 'https://via.placeholder.com/400x300?text=Sin+Imagen';

  producto.imagenes.forEach((src, index) => {
    const thumb = document.createElement('img');
    thumb.src = src;
    thumb.alt = `Miniatura ${index + 1}`;
    thumb.classList.add('modal-thumb');
    if (index === 0) thumb.classList.add('selected');

    thumb.addEventListener('click', () => {
      imagenPrincipal.src = src;
      thumbnailsContainer.querySelectorAll('img').forEach(img => img.classList.remove('selected'));
      thumb.classList.add('selected');

      // En mobile: centrar miniatura al hacer clic
      if (window.innerWidth < 769) {
        const thumbRect = thumb.getBoundingClientRect();
        const wrapperRect = thumbnailWrapper.getBoundingClientRect();
        const scrollOffset = thumb.offsetLeft - (wrapperRect.width / 2) + (thumbRect.width / 2);
        thumbnailWrapper.scrollTo({ left: scrollOffset, behavior: 'smooth' });
      }
    });

    thumbnailsContainer.appendChild(thumb);
  });

  // → Mobile extra: deslizar tocando a izquierda/derecha
  if (window.innerWidth < 769) {
    let startX = 0;
    let scrollLeft = 0;

    thumbnailWrapper.addEventListener('touchstart', (e) => {
      startX = e.touches[0].pageX - thumbnailWrapper.offsetLeft;
      scrollLeft = thumbnailWrapper.scrollLeft;
    });

    thumbnailWrapper.addEventListener('touchmove', (e) => {
      e.preventDefault();
      const x = e.touches[0].pageX - thumbnailWrapper.offsetLeft;
      const walk = (x - startX) * 1.5; // sensibilidad del swipe
      thumbnailWrapper.scrollLeft = scrollLeft - walk;
    }, { passive: false });
  }

  document.getElementById('modalTitulo').textContent = producto.nombre;
  document.getElementById('modalDescripcion').textContent = producto.descripcion || 'Sin descripción';
  document.getElementById('modalTalles').textContent = `Talles disponibles: ${producto.talles || 'No especificados'}`;
  document.getElementById('modalWhatsapp').href = `https://wa.me/5492915661942?text=Hola! Quiero consultar por la gorra ${producto.nombre}`;

  modal.show();

  const scrollUp = document.getElementById('scrollUp');
  const scrollDown = document.getElementById('scrollDown');
  const isDesktop = window.innerWidth >= 769;

  if (isDesktop && scrollUp && scrollDown) {
    if (producto.imagenes.length > 3) {
      scrollUp.style.display = 'block';
      scrollDown.style.display = 'block';
    } else {
      scrollUp.style.display = 'none';
      scrollDown.style.display = 'none';
    }

    scrollUp.onclick = () => {
      thumbnailWrapper.scrollBy({ top: -100, behavior: 'smooth' });
    };

    scrollDown.onclick = () => {
      thumbnailWrapper.scrollBy({ top: 100, behavior: 'smooth' });
    };
  } else {
    if (scrollUp) scrollUp.style.display = 'none';
    if (scrollDown) scrollDown.style.display = 'none';
  }
}

// Botones ver más / ver menos
document.getElementById('ver-mas')?.addEventListener('click', () => {
  productosMostrados += 8;
  renderizarProductos();
});

document.getElementById('ver-menos')?.addEventListener('click', () => {
  productosMostrados = 8;
  renderizarProductos();
});


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