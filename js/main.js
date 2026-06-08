import { addToCart, updateCartCount } from "./utils/common.js";

// ==========================================
// DOM Selectors
// ==========================================

// Product Grid DOM
const productGrid = document.querySelector(".product-grid");

// Pagination DOM
const pager = document.querySelector(".pagination .pager");
const pagerPrevBtn = document.querySelector(".pagination .prev");
const pagerNextBtn = document.querySelector(".pagination .next");

// Filter DOM
const filteredCount = document.querySelector(".products-tools > span");
const categoryFilter = document.querySelector("#category-filter");
const priceFilter = document.querySelector("#price-filter");
const brandFilter = document.querySelector("#brand-filter");

// Sort DOM
const sortSelect = document.querySelector("#sort");

// ==========================================
// State & Constants
// ==========================================

// Pagination State
const countPerPage = 12;
const pagerPerGroup = 5;
let curPage = 1;
let curGroup = 1;
let paginationCount = 0;

// Filter State
let allProducts = [];
let filteredData = [];
let selectedCategories = [];
let selectedPriceRange = "";
let selectedBrands = [];

// ==========================================
// Functions & Core Logic
// ==========================================

// 상품 조회
async function fetchProducts() {
  try {
    const res = await fetch("./data/products.json");
    const data = await res.json();
    allProducts = data.products;
    filteredData = allProducts.filter(p => true);
    console.log(allProducts);

    createPagination(filteredData.length);
    renderProducts(filteredData);
    renderCategories();
    renderPriceRanges();
    renderBrands();
  } catch {
  } finally {
  }
}
function renderProducts(data = filteredData) {
  const pagedData = paginate(data, curPage);
  const productHTML = pagedData.map(
    p => `
      <article class="product-card">
        <img src="${p.thumbnail}" alt="${escHTML(p.title)}" />
        <div class="product-info">
          <h3><a href="detail.html?id=${p.id}">${escHTML(p.title)}</a></h3>
          <p>${escHTML(p.brand)}</p>
          <div class="product-bottom">
            <strong>${p.price}$</strong>
            <button type="button" data-id="${p.id}" class="cart-add" aria-label="${escHTML(p.title)} 장바구니 담기"></button>
          </div>
        </div>
      </article>
      `,
  );
  productGrid.innerHTML = productHTML.join("");
  filteredCount.innerHTML = `총 ${data.length}개 상품`;
}

function renderCategories() {
  const categories = [...new Set(allProducts.map(p => p.category))];
  const frag = document.createDocumentFragment();
  categories.forEach(c => {
    const label = document.createElement("label");
    label.innerHTML = `<input type="checkbox" name="category" value="${c}" />${c}`;
    frag.appendChild(label);
  });
  categoryFilter.appendChild(frag);

  const categoryInputs = categoryFilter.querySelectorAll("input");
  categoryInputs.forEach(input => {
    input.addEventListener("change", e => {
      if (input.value === "all") {
        // all 체크시 나머지 해제
        categoryInputs.forEach(l => {
          if (l.value === "all") return;
          l.checked = false;
        });
        input.checked = true;
        selectedCategories = [];
      } else {
        // all이 아닌 카테고리 체크시 all 체크 해제
        categoryInputs.forEach(l => {
          if (l.value != "all") return;
          l.checked = false;
        });
        selectedCategories = [...categoryInputs].filter(l => l.checked).map(l => l.value);
      }
      applyFilter();
    });
  });
}
function renderPriceRanges() {
  const priceHTML = `
  <label><input type="radio" name="price" value="low" /> 10$ 이하</label>
  <label><input type="radio" name="price" value="mid" /> 10$ ~ 100$</label>
  <label><input type="radio" name="price" value="high" /> 100$ ~ 1000$</label>
  <label><input type="radio" name="price" value="vhigh" /> 1000$ 이상</label>
  `;
  priceFilter.innerHTML += priceHTML;

  const priceInputs = priceFilter.querySelectorAll("input");
  priceInputs.forEach(input => {
    input.addEventListener("change", e => {
      selectedPriceRange = input.value;
      applyFilter();
    });
  });
}
function renderBrands() {
  const brands = [...new Set(allProducts.filter(p => p).map(p => p.brand))];
  const frag = document.createDocumentFragment();
  brands.forEach(b => {
    const label = document.createElement("label");
    label.innerHTML = `<input type="checkbox" name="brand" value="${b}" />${b}`;
    frag.appendChild(label);
  });
  brandFilter.appendChild(frag);

  const brandInputs = brandFilter.querySelectorAll("input");
  brandInputs.forEach(input => {
    input.addEventListener("change", e => {
      selectedBrands = [...brandInputs].filter(l => l.checked).map(l => l.value);
      console.log(selectedBrands);

      applyFilter();
    });
  });
}
function applyFilter() {
  let result = allProducts
    .filter(p => (selectedCategories.length === 0 ? true : selectedCategories.includes(p.category)))
    .filter(p => (selectedBrands.length === 0 ? true : selectedBrands.includes(p.brand)));
  switch (selectedPriceRange) {
    case "low":
      result = result.filter(p => p.price < 10);
      break;
    case "mid":
      result = result.filter(p => p.price >= 10 && p.price < 100);
      break;
    case "high":
      result = result.filter(p => p.price >= 100 && p.price < 1000);
      break;
    case "vhigh":
      result = result.filter(p => p.price >= 1000);
      break;
    default: // includes case all:
      break;
  }
  filteredData = result;

  curPage = 1;
  curGroup = 1;

  renderProducts(filteredData);
  createPagination(filteredData.length);
}

function createPagination(total) {
  paginationCount = Math.ceil(total / countPerPage);
  const pagerGroupCount = Math.ceil(paginationCount / pagerPerGroup);

  // 1, 2, 3, 4, 5 => 1
  // 6, 7, 8, 9, 10 => 6
  const startPage = (curGroup - 1) * pagerPerGroup + 1;
  const endPage = Math.min(startPage + pagerPerGroup - 1, paginationCount);

  let pagerHTML = "";
  for (let i = startPage; i <= endPage; i++) {
    pagerHTML += `<a href="#" class="${i === curPage ? "active" : ""}">${i}</a>`;
  }
  pager.innerHTML = pagerHTML;

  if (curGroup === 1) pagerPrevBtn.classList.add("disabled");
  else pagerPrevBtn.classList.remove("disabled");
  if (curGroup === pagerGroupCount) pagerNextBtn.classList.add("disabled");
  else pagerNextBtn.classList.remove("disabled");

  const pagerBtns = pager.querySelectorAll("a");
  pagerBtns.forEach(curBtn => {
    curBtn.addEventListener("click", e => {
      e.preventDefault();
      let targetPage = Number(curBtn.textContent);

      if (curPage === targetPage) return;
      curPage = targetPage;
      renderProducts(filteredData);

      // 모든 페이지에서 active 제거, 현재 활성화된 a에만 active 추가
      pagerBtns.forEach(b => {
        b.classList.remove("active");
      });
      curBtn.classList.add("active");
    });
  });
}
function paginate(dataArray = [], page = 1) {
  const start = (page - 1) * countPerPage;
  const end = start + countPerPage;
  return dataArray.slice(start, end);
}

function moveGroup(dir) {
  curGroup += dir;
  curPage = (curGroup - 1) * 5 + 1;
  createPagination(allProducts.length);
  renderProducts(filteredData);
}

function escHTML(string) {
  if (!string) return "";
  return string
    .toString()
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll("&", "&amp;")
    .replaceAll("'", "&apos;")
    .replaceAll('"', "&quot;");
}

// ==========================================
// Event Listeners
// ==========================================
pagerPrevBtn.addEventListener("click", e => {
  e.preventDefault();
  moveGroup(-1);
});
pagerNextBtn.addEventListener("click", e => {
  e.preventDefault();
  moveGroup(+1);
});

sortSelect.addEventListener("change", e => {
  const selectedValue = sortSelect.value;
  switch (selectedValue) {
    case "인기순":
      filteredData.sort((a, b) => {
        return b.rating - a.rating;
      });
      break;
    case "최신순":
      filteredData.sort((a, b) => {
        return new Date(b.meta.createdAt) - new Date(a.meta.createdAt);
      });
      break;
    case "낮은 가격순":
      filteredData.sort((a, b) => {
        return a.price - b.price;
      });
      break;
    case "높은 가격순":
      filteredData.sort((a, b) => {
        return b.price - a.price;
      });
      break;
    default:
      filteredData.sort((a, b) => {
        return a.id - b.id;
      });
      break;
  }
  curPage = 1;
  curGroup = 1;
  renderProducts(filteredData);
  createPagination();
});

// 장바구니에 추가
productGrid.addEventListener("click", e => {
  const btn = e.target.closest("button");
  if (!btn) return;

  const pid = Number(btn.dataset.id);
  const product = allProducts.find(p => p.id === pid);
  addToCart(product);
});

// ==========================================
// Initialization & Execution
// ==========================================
fetchProducts();
updateCartCount();
