import { addToCart, updateCartCount } from "./utils/common.js";

// ==========================================
// DOM Selectors
// ==========================================

// Detail Tab DOM
const detailTabMenus = document.querySelectorAll(".detail-tabs a");
const detailTabContents = document.querySelectorAll(".detail-content");

// Quantity DOM
const quantityCtrl = document.querySelector(".quantity-control");
const quantity = document.querySelector("#quantity");
const addCart = document.querySelector("#addcart");

// ==========================================
// State & Constants
// ==========================================

let product = {};

let currentQty = Number(quantity.value) || 1;

// ==========================================
// Functions & Core Logic
// ==========================================
export async function fetchProduct() {
  // console.log(location.href);
  // console.log(location.search);

  let params = new URLSearchParams(location.search);
  // console.log(params.get("id"));

  const productID = params.get("id");
  // console.log(typeof productID);
  if (!productID) {
    alert("잘못된 접근입니다. 홈으로 이동합니다.");
    location.href = "./index.html";
  }

  try {
    const res = await fetch("./data/products.json");
    if (!res.ok) throw new Error("Failed to fetch data/products.json");
    const data = await res.json();

    // 조회된 상품정보에서 상품의 id가 productID와 일치하는 요소를 찾아 product에 할당
    product = data.products.find(p => p.id === Number(productID));
    if (!product) {
      alert("존재하지 않는 상품입니다. 홈으로 이동합니다.");
      location.href = "./index.html";
    }
    createContent(product);
    createRecommendList(data.products, product.category, Number(productID));
  } catch (e) {
    console.error(e);
  } finally {
    console.log("조회 종료");
    console.log(product);
  }
}

function createContent(data) {
  const category = document.querySelector(".product-category"),
    title = document.querySelector("#product-title"),
    desc = document.querySelector(".product-description"),
    priceSale = document.querySelector(".sale-price"),
    priceOrigin = document.querySelector(".origin-price"),
    priceDCRate = document.querySelector(".discount-rate"),
    imgMain = document.querySelector(".main-image img"),
    detailImg = document.querySelector(".detail-visual img"),
    details = document.querySelector(".feature-list");

  category.textContent = data.category;
  title.textContent = data.title;
  desc.textContent = data.description;
  priceSale.textContent = `${data.price}$`;
  priceOrigin.textContent = `${(data.price / (1 - data.discountPercentage / 100)).toFixed(2)}$`;
  priceDCRate.textContent = `약 ${Math.min(data.discountPercentage.toFixed(), 99)}%`;
  imgMain.setAttribute("src", data.images[0]);
  imgMain.setAttribute("alt", data.title);
  detailImg.setAttribute("src", data.images[0]);
  detailImg.setAttribute("alt", data.title);
  details.innerHTML = `<li>${data.description}</li>`;
}
function createRecommendList(all, category, id) {
  /*
  all에서 category가 일치하는 원소를 걸러서 recommendList 배열에 값 할당
  recommend-grid에 recommendList의 데이터를 article형태로 생성
   */
  const recommendList = all
    .filter(p => p.category === category && p.id !== id)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 4);
  /*
  const frag = document.createDocumentFragment();
  recommendList.forEach(p => {
    const articleEl = document.createElement("article");
    articleEl.className = "product-card";
    articleEl.innerHTML = `
      <img src="${p.images[0]}" alt="${p.title}" />
      <div class="product-info">
        <h3><a href="#">${p.title}</a></h3>
        <p>${p.category}</p>
        <div class="product-bottom">
          <strong>${p.price}$</strong>
          <button type="button" class="cart-add" aria-label="${p.title} 장바구니 담기"></button>
        </div>
      </div>
    `;
    frag.appendChild(articleEl);
  });
  recommendGrid.appendChild(frag);
   */
  const recommendHTML = recommendList.map(
    p => `
    <article class="product-card">
      <img src="${p.images[0]}" alt="${p.title}" />
      <div class="product-info">
        <h3><a href="detail.html?id=${p.id}">${p.title}</a></h3>
        <p>${p.category}</p>
        <div class="product-bottom">
          <strong>${p.price}$</strong>
          <button type="button" class="cart-add" aria-label="${p.title} 장바구니 담기"></button>
        </div>
      </div>
    </article>
    `,
  );
  document.querySelector(".recommend-grid").innerHTML = recommendHTML.join("");
}

// ==========================================
// Event Listeners
// ==========================================

// 상품 상세 Tab
/*
detailTabMenus를 클릭하면
  target에 클릭한 그 요소의 href 속성의 값을 할당
  모든 detailTabContent는 안보이고
  target에 해당하는 요소에 active 추가
 */
detailTabMenus.forEach(menu => {
  menu.addEventListener("click", e => {
    e.preventDefault();

    const target = menu.getAttribute("href");
    detailTabContents.forEach(content => {
      content.style.display = target.includes(content.id) ? "block" : "none";
    });
  });
});

// 상품 수량 변경하기
/*
quantityCtrlEl 클릭했을 때, 클릭한 그 요소의 가까운 부모가 button이라면
  변수 currentQty quantityEl의 내용을 할당
  그 버튼의 내용이 - 와 같다면
    currentQty를 1 차감
  아니라면
    currentQty를 1 증가
 */
quantityCtrl.addEventListener("click", e => {
  const btn = e.target.closest("button");
  if (!btn) return;

  currentQty = Number(quantity.value);
  if (btn.textContent === "-") {
    if (currentQty > 1) currentQty--;
  } else {
    currentQty++;
  }
  quantity.value = currentQty;
});

// 장바구니 담기
/*
장바구니 담기 버튼을 클릭하면 현재 수량을 addToCart 함수에 인수를 넣어 실행
 */
addCart.addEventListener("click", e => {
  addToCart(product, Number(quantity.value));
});

// ==========================================
// Initialization & Execution
// ==========================================
fetchProduct();
updateCartCount();
