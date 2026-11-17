const products = [
  {
    name: "The Sunday Corset Dress",
    price: 128,
    category: "clothing",
    color: "Vanilla / Embroidered",
    image: "maison-sunday/floral-embroidered-corset-dress",
    localImage: "/assets/images/Floral%20Embroidered%20Corset%20Dress%20Flat%20Lay.png",
    tag: "A new favorite",
  },
  {
    name: "The Afterglow Set",
    price: 96,
    category: "clothing",
    color: "Pink swirl / Two piece",
    image: "maison-sunday/pastel-swirl-resortwear",
    localImage: "/assets/images/Pastel%20Swirl%20Resortwear%20Flat%20Lay.png",
    tag: "The getaway edit",
  },
  {
    name: "The Little Daydream Sneaker",
    price: 84,
    category: "shoes",
    color: "Petal pink / Floral",
    image: "maison-sunday/pink-floral-sneakers",
    localImage: "/assets/images/Pink%20Floral%20Sneakers%20with%20White%20Accents.png",
    tag: "Made for wandering",
  },
  {
    name: "The Sunday Knit",
    price: 112,
    category: "clothing",
    color: "Cream / Soft stripe",
    image: "maison-sunday/cream-striped-vest-outfit",
    localImage: "/assets/images/Cream%20Striped%20Vest%20Outfit%20Flat%20Lay.png",
    tag: "",
  },
  {
    name: "The Golden Hour Boot",
    price: 158,
    category: "shoes",
    color: "Cognac / Croc effect",
    image: "maison-sunday/cognac-boots-burgundy-knit",
    localImage: "/assets/images/Cognac%20Boots%20and%20Burgundy%20Knit%20Flat%20Lay.png",
    tag: "A forever piece",
  },
];

const productGrid = document.querySelector("#product-grid");
const emptyState = document.querySelector("#empty-state");
const searchInput = document.querySelector("#product-search");
const filterButtons = [...document.querySelectorAll(".filter-button")];
const bagCount = document.querySelector(".bag-count");
const bagButton = document.querySelector(".bag-button");
const toast = document.querySelector(".toast");
const newsletterForm = document.querySelector(".newsletter-form");
const newsletterStatus = document.querySelector(".newsletter-status");
const menuToggle = document.querySelector(".menu-toggle");
const mainNav = document.querySelector(".main-nav");

let activeFilter = "all";
let itemCount = 0;
let toastTimeout;

function imageUrl(publicId) {
  const config = window.STORE_CONFIG;
  if (!config?.useCloudinary || !config.cloudinaryCloudName) return null;

  const cloudName = encodeURIComponent(config.cloudinaryCloudName);
  const encodedPublicId = publicId.split("/").map(encodeURIComponent).join("/");
  return `https://res.cloudinary.com/${cloudName}/image/upload/f_auto,q_auto,w_1000,c_limit/${encodedPublicId}`;
}

document.querySelectorAll("[data-cloudinary-id]").forEach((image) => {
  const url = imageUrl(image.dataset.cloudinaryId);
  if (url) image.src = url;
});

function renderProducts() {
  const query = searchInput.value.trim().toLowerCase();
  const visibleProducts = products.filter((product) => {
    const matchesFilter = activeFilter === "all" || product.category === activeFilter;
    const matchesSearch = `${product.name} ${product.color}`.toLowerCase().includes(query);
    return matchesFilter && matchesSearch;
  });

  productGrid.innerHTML = visibleProducts.map((product) => `
    <article class="product-card">
      <div class="product-image-wrap">
        <img src="${imageUrl(product.image) || product.localImage}" alt="${product.name}, ${product.color}" loading="lazy">
        ${product.tag ? `<span class="product-tag">${product.tag}</span>` : ""}
        <button class="quick-add" type="button" data-product="${product.name}">Add to bag +</button>
      </div>
      <div class="product-meta">
        <p class="product-name">${product.name}</p>
        <p class="product-price">$${product.price}</p>
      </div>
      <p class="product-color">${product.color}</p>
    </article>
  `).join("");

  emptyState.hidden = visibleProducts.length > 0;
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("is-visible");
  window.clearTimeout(toastTimeout);
  toastTimeout = window.setTimeout(() => {
    toast.classList.remove("is-visible");
  }, 2400);
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    activeFilter = button.dataset.filter;
    filterButtons.forEach((filterButton) => {
      const isActive = filterButton === button;
      filterButton.classList.toggle("is-active", isActive);
      filterButton.setAttribute("aria-pressed", String(isActive));
    });
    renderProducts();
  });
});

searchInput.addEventListener("input", renderProducts);

productGrid.addEventListener("click", (event) => {
  const addButton = event.target.closest(".quick-add");
  if (!addButton) return;

  itemCount += 1;
  bagCount.textContent = String(itemCount);
  bagButton.setAttribute("aria-label", `Shopping bag, ${itemCount} ${itemCount === 1 ? "item" : "items"}`);
  showToast(`${addButton.dataset.product} added to your bag.`);
});

bagButton.addEventListener("click", () => {
  showToast(itemCount ? `Your bag has ${itemCount} ${itemCount === 1 ? "lovely find" : "lovely finds"}.` : "Your bag is waiting for a lovely find.");
});

newsletterForm.addEventListener("submit", (event) => {
  event.preventDefault();
  newsletterStatus.textContent = "You're on the list. Look out for a little note from us.";
  newsletterForm.reset();
});

menuToggle.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Open menu" : "Close menu");
  mainNav.classList.toggle("is-open", !isOpen);
});

mainNav.addEventListener("click", (event) => {
  if (!event.target.closest("a")) return;
  mainNav.classList.remove("is-open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open menu");
});

renderProducts();