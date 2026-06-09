import { readCart, writeCart, updateCartCount } from "./utils/common.js";

// ==========================================
// DOM Selectors
// ==========================================

const cartList = document.querySelector(".cart-list");
const cartCountText = document.querySelector(".cart-count-text");
const selectAll = document.querySelector(".select-all");
const selectAllText = selectAll.querySelector("span");
const selectDeleteBtn = document.querySelector(".card-list-header button");
const productAmount = document.querySelector(".order-row strong");
const totalAmount = document.querySelector(".order-total strong");

// ==========================================
// State & Constants
// ==========================================

const cart = readCart();
let cartHTML = [];

// ==========================================
// Functions & Core Logic
// ==========================================

function renderCart() {
  if (cart.length === 0) {
    cartHTML.push(`
      <article>
        장바구니가 비어있습니다.
      </article>`);
    return;
  }

  cartHTML = cart.map(
    p => `
      <article class="cart-item" data-id="${p.id}">
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
          <button class="minusBtn" type="button" aria-label="수량 줄이기">-</button>
          <span>${p.qty}</span>
          <button class="plusBtn" type="button" aria-label="수량 늘리기">+</button>
        </div>
        <button type="button" class="remove-item" aria-label="${p.title} 삭제"></button>
      </article>
    `,
  );
  cartList.innerHTML += cartHTML.join("");
}

// 상품 개수 반영
function updateCartCountFunc() {
  cartCountText.textContent = `총 ${cart.length}개의 상품`;
  // console.log(selectAllText.innerHTML);
  // selectAllText.textContent = `전체선택 (${cart.length}/${cart.length})`;
  // console.log(selectAllText.innerHTML);
}

// 상품 금액, 결제 금액 업데이트
// reduce 카트 항목들마다 수량*가격 + 수량*가격
function updateTotalAmount() {
  const sum = cart.reduce((total, item) => total + item.price * item.qty, 0);
  productAmount.textContent = `${sum.toFixed(2)}$`;
  totalAmount.textContent = `${(sum + 0).toFixed(2)}$`;
}

function saveCart() {}

// ==========================================
// Event Listeners
// ==========================================

cartList.addEventListener("click", e => {
  const cartItem = e.target.closest(".cart-item");
  if (!cartItem) return;

  const id = Number(cartItem.dataset.id);
  const targetItem = cart.find(item => item.id === id);

  if (e.target.closest(".minusBtn")) {
    if (targetItem.qty > 1) targetItem.qty--;
  } else if (e.target.closest(".plusBtn")) {
    targetItem.qty++;
  } else if (e.target.closest("*")) {
  } else if (e.target.closest(".remove-item")) {
    cart = cart.filter(p => p.id !== id);
  }

  // 로컬 스토리지 저장
  saveCart();

  // 화면 코드 생성
  renderCart();
});

// ==========================================
// Initialization & Execution
// ==========================================

renderCart();
updateCartCount();
updateCartCountFunc();
updateTotalAmount();

/*
수량 변경/제거
-> 로컬 스토리지 값 업데이트
-> 상품 금액, 결제 금액 변경
 */
