const products = [
  { id: 1, name: "Rosa atardecer", type: "Rosas · 12 tallos", price: 38, image: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=700&q=85", tag: "Favorito" },
  { id: 2, name: "Días de peonía", type: "Peonías · 8 tallos", price: 46, image: "https://images.unsplash.com/photo-1495231916356-a86217efff12?auto=format&fit=crop&w=700&q=85", tag: "Nuevo" },
  { id: 3, name: "Campo silvestre", type: "Mix de temporada", price: 32, image: "https://images.unsplash.com/photo-1523438885200-e635ba2c371e?auto=format&fit=crop&w=700&q=85", tag: "" },
  { id: 4, name: "Tulipanes de abril", type: "Tulipanes · 15 tallos", price: 35, image: "https://images.unsplash.com/photo-1559563362-c667ba5f5480?auto=format&fit=crop&w=700&q=85", tag: "" },
  { id: 5, name: "Luz de verano", type: "Margaritas · 12 tallos", price: 29, image: "https://images.unsplash.com/photo-1509223197845-458d87318791?auto=format&fit=crop&w=700&q=85", tag: "" },
  { id: 6, name: "Jardín secreto", type: "Mix premium", price: 52, image: "https://images.unsplash.com/photo-1468327768560-75b778cbb551?auto=format&fit=crop&w=700&q=85", tag: "Premium" },
];

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
const lightboxImage = document.querySelector("#lightbox-image");
const lightboxCaption = document.querySelector("#lightbox-caption");

const euro = (value) => `€${value.toFixed(0)}`;

function renderProducts() {
  productGrid.innerHTML = products.map((product) => `
    <article class="product-card">
      <div class="product-image" style="background-image:url('${product.image}')" data-image="${product.id}" role="button" tabindex="0" aria-label="Ver ${product.name} en pantalla completa">
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
  if (image) openLightbox(Number(image.dataset.image));
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
  lightboxImage.src = product.image;
  lightboxImage.alt = product.name;
  lightboxCaption.textContent = product.name;
  lightbox.hidden = false;
  lightbox.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  document.querySelector("#close-lightbox").focus();
}

function closeLightbox() {
  lightbox.hidden = true;
  lightbox.setAttribute("aria-hidden", "true");
  lightboxImage.src = "";
  document.body.style.overflow = cartPanel.classList.contains("is-open") ? "hidden" : "";
}

document.querySelector("#close-lightbox").addEventListener("click", closeLightbox);
lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) closeLightbox();
});

renderProducts();
renderCart();
