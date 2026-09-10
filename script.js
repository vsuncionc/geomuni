const products = [
  { id: 1, name: "Rosa atardecer", type: "Rosas · 12 tallos", price: 38, images: ["1490750967868-88aa4486c946","1495231916356-a86217efff12","1518709268805-4e9042af9f23","1526047932273-341f2a7631f9","1523438885200-e635ba2c371e"], tag: "Favorito" },
  { id: 2, name: "Días de peonía", type: "Peonías · 8 tallos", price: 46, images: ["1495231916356-a86217efff12","1490750967868-88aa4486c946","1469259943454-aa100abba749","1522673607200-164d1b6ce486","1523438885200-e635ba2c371e"], tag: "Nuevo" },
  { id: 3, name: "Campo silvestre", type: "Mix de temporada", price: 32, images: ["1523438885200-e635ba2c371e","1468327768560-75b778cbb551","1509223197845-458d87318791","1490750967868-88aa4486c946","1495231916356-a86217efff12"], tag: "" },
  { id: 4, name: "Tulipanes de abril", type: "Tulipanes · 15 tallos", price: 35, images: ["1559563362-c667ba5f5480","1522382529505-32c5b3a2f3d1","1520763185298-1b434c919102","1528913775512-9c4ae6b9a53e","1468327768560-75b778cbb551"], tag: "" },
  { id: 5, name: "Luz de verano", type: "Margaritas · 12 tallos", price: 29, images: ["1509223197845-458d87318791","1490750967868-88aa4486c946","1501004318641-0bd9eac7f7a8","1495231916356-a86217efff12","1523438885200-e635ba2c371e"], tag: "" },
  { id: 6, name: "Jardín secreto", type: "Mix premium", price: 52, images: ["1468327768560-75b778cbb551","1523438885200-e635ba2c371e","1490750967868-88aa4486c946","1507504031003-b417219a0fde","1495231916356-a86217efff12"], tag: "Premium" },
];

const imageUrl = (id) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=800&q=85`;
products.forEach((product) => { product.image = imageUrl(product.images[0]); });

const cart = [];
const productGrid = document.querySelector("#product-grid");
const cartItems = document.querySelector("#cart-items");
const cartCount = document.querySelector("#cart-count");
const cartTotal = document.querySelector("#cart-total");
const checkoutButton = document.querySelector("#checkout-button");
const cartPanel = document.querySelector("#cart-panel");
const cartOverlay = document.querySelector("#cart-overlay");
const toast = document.querySelector("#toast");
const lightbox = document.querySelector("#image-lightbox");
const lightboxCaption = document.querySelector("#lightbox-caption");
const lightboxSlides = document.querySelector("#lightbox-slides");
const lightboxIndicators = document.querySelector("#lightbox-indicators");
const searchInput = document.querySelector("#search-input");
const newsletterForm = document.querySelector("#newsletter-form");

const euro = (value) => `€${value.toFixed(0)}`;

function renderProducts() {
  productGrid.innerHTML = products.map((product) => `
    <article class="product-card">
      <div class="product-image" data-image="${product.id}" role="button" tabindex="0" aria-label="Ver ${product.name} en pantalla completa">
        <div id="carousel-${product.id}" class="carousel slide carousel-fade" data-bs-ride="carousel" data-bs-interval="3600">
          <div class="carousel-indicators">${product.images.map((_, index) => `<button type="button" data-bs-target="#carousel-${product.id}" data-bs-slide-to="${index}" class="${index === 0 ? "active" : ""}" aria-label="Imagen ${index + 1}"></button>`).join("")}</div>
          <div class="carousel-inner">${product.images.map((image, index) => `<div class="carousel-item ${index === 0 ? "active" : ""}"><img src="${imageUrl(image)}" alt="${product.name}, imagen ${index + 1}" /></div>`).join("")}</div>
          <button class="carousel-control-prev" type="button" data-bs-target="#carousel-${product.id}" data-bs-slide="prev" aria-label="Imagen anterior"><span class="carousel-control-prev-icon"></span></button>
          <button class="carousel-control-next" type="button" data-bs-target="#carousel-${product.id}" data-bs-slide="next" aria-label="Imagen siguiente"><span class="carousel-control-next-icon"></span></button>
        </div>
        ${product.tag ? `<span class="product-tag">${product.tag}</span>` : ""}
        <button class="add-button" type="button" data-add="${product.id}" aria-label="Añadir ${product.name} al carrito">+</button>
      </div>
      <div class="product-info">
        <div><h3>${product.name}</h3><p>${product.type}</p></div>
        <span class="product-price">${euro(product.price)}</span>
      </div>
    </article>
  `).join("");
}

function renderCart() {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  cartCount.textContent = totalItems;
  cartTotal.textContent = euro(total);
  checkoutButton.disabled = cart.length === 0;

  if (!cart.length) {
    cartItems.innerHTML = '<div class="empty-cart"><span>✿</span><p>Tu carrito está esperando<br />algo bonito.</p></div>';
    return;
  }

  cartItems.innerHTML = cart.map((item) => `
    <div class="cart-item">
      <div class="cart-item-image" style="background-image:url('${item.image}')"></div>
      <div class="cart-item-details"><strong>${item.name}</strong><span>${item.quantity} × ${euro(item.price)}</span></div>
      <button class="remove-item" type="button" data-remove="${item.id}" aria-label="Quitar ${item.name} del carrito">×</button>
    </div>
  `).join("");
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.setTimeout(() => toast.classList.remove("show"), 2200);
}

function openCart() {
  cartPanel.classList.add("is-open");
  cartPanel.setAttribute("aria-hidden", "false");
  document.querySelector("#open-cart").setAttribute("aria-expanded", "true");
  cartOverlay.hidden = false;
  document.body.style.overflow = "hidden";
}

function closeCart() {
  cartPanel.classList.remove("is-open");
  cartPanel.setAttribute("aria-hidden", "true");
  document.querySelector("#open-cart").setAttribute("aria-expanded", "false");
  cartOverlay.hidden = true;
  document.body.style.overflow = "";
}

productGrid.addEventListener("click", (event) => {
  const button = event.target.closest("[data-add]");
  if (button) {
    const product = products.find((item) => item.id === Number(button.dataset.add));
    const existing = cart.find((item) => item.id === product.id);
    if (existing) existing.quantity += 1;
    else cart.push({ ...product, quantity: 1 });
    renderCart();
    showToast(`${product.name} se añadió al carrito`);
    return;
  }

  const image = event.target.closest("[data-image]");
  if (image && !event.target.closest(".carousel-control-prev, .carousel-control-next, .carousel-indicators")) {
    openLightbox(Number(image.dataset.image));
  }
});

productGrid.addEventListener("keydown", (event) => {
  if ((event.key === "Enter" || event.key === " ") && event.target.matches("[data-image]")) {
    event.preventDefault();
    openLightbox(Number(event.target.dataset.image));
  }
});

cartItems.addEventListener("click", (event) => {
  const button = event.target.closest("[data-remove]");
  if (!button) return;
  const index = cart.findIndex((item) => item.id === Number(button.dataset.remove));
  if (index !== -1) {
    cart.splice(index, 1);
    renderCart();
  }
});

document.querySelector("#open-cart").addEventListener("click", openCart);
document.querySelector("#close-cart").addEventListener("click", closeCart);
cartOverlay.addEventListener("click", closeCart);
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && cartPanel.classList.contains("is-open")) closeCart();
  if (event.key === "Escape" && !lightbox.hidden) closeLightbox();
});
checkoutButton.addEventListener("click", () => showToast("¡Gracias! Pronto te contactaremos para finalizar tu pedido."));

function openLightbox(productId) {
  const product = products.find((item) => item.id === productId);
  if (!product) return;
  lightboxSlides.innerHTML = product.images.map((image, index) => `<div class="carousel-item ${index === 0 ? "active" : ""}"><img src="${imageUrl(image)}" alt="${product.name}, imagen ${index + 1}" /></div>`).join("");
  lightboxIndicators.innerHTML = product.images.map((_, index) => `<button type="button" data-bs-target="#lightbox-carousel" data-bs-slide-to="${index}" class="${index === 0 ? "active" : ""}" aria-label="Ver imagen ${index + 1}"></button>`).join("");
  lightboxCaption.textContent = product.name;
  lightbox.hidden = false;
  lightbox.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  document.querySelector("#close-lightbox").focus();
}

function closeLightbox() {
  lightbox.hidden = true;
  lightbox.setAttribute("aria-hidden", "true");
  lightboxSlides.innerHTML = "";
  lightboxIndicators.innerHTML = "";
  document.body.style.overflow = cartPanel.classList.contains("is-open") ? "hidden" : "";
}

document.querySelector("#close-lightbox").addEventListener("click", closeLightbox);
lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) closeLightbox();
});

renderProducts();
renderCart();

searchInput.addEventListener("input", (event) => {
  const query = event.target.value.trim().toLowerCase();
  document.querySelectorAll(".product-card").forEach((card) => {
    card.hidden = query && !card.textContent.toLowerCase().includes(query);
  });
});

newsletterForm.addEventListener("submit", (event) => {
  event.preventDefault();
  newsletterForm.reset();
  showToast("¡Listo! Revisa tu correo para usar tu descuento.");
});
