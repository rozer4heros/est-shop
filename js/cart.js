import { readCart, writeCart, updateCartCount } from "./utils/common.js";

// ==========================================
// DOM Selectors
// ==========================================

const cartCountText = document.querySelector(".cart-count-text");
const selectAllText = document.querySelector(".select-all");
const cartList = document.querySelector(".cart-list");

// ==========================================
// State & Constants
// ==========================================

const cartItems = readCart();

// ==========================================
// Functions & Core Logic
// ==========================================

function renderCartItems() {
  const cartHTML = cartItems.map(
    p => `
  <article class="cart-item">
    <label class="item-check">
      <input type="checkbox" checked />
    </label>
    <div class="cart-thumb">
      <img src="${p.thumb}" alt="${p.title}" />
    </div>
    <div class="cart-item-info">
      <h2>${p.title}</h2>
      <p>${p.brand}</p>
      <strong>${p.price}$</strong>
    </div>
    <div class="quantity-box" aria-label="수량">
      <button type="button" aria-label="수량 줄이기">-</button>
      <span>${p.qty}</span>
      <button type="button" aria-label="수량 늘리기">+</button>
    </div>
    <button type="button" class="remove-item" aria-label="${p.title} 삭제"></button>
  </article>
  `,
  );
  cartList.innerHTML += cartHTML.join("");

  cartCountText.textContent = `총 ${cartItems.length}개의 상품`;

  // console.log(selectAllText.innerHTML);
  // selectAllText.textContent = `전체선택 (${cartItems.length}/${cartItems.length})`;
  // console.log(selectAllText.innerHTML);
}

// ==========================================
// Event Listeners
// ==========================================

// ==========================================
// Initialization & Execution
// ==========================================

renderCartItems();
updateCartCount();

/*
수량 변경/제거
-> 로컬 스토리지 값 업데이트
-> 상품 금액, 결제 금액 변경
 */
