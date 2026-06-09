import { readCart, writeCart, updateCartCount } from "./utils/common.js";

// ==========================================
// DOM Selectors
// ==========================================

const cartList = document.querySelector(".cart-list");
const cartCountText = document.querySelector(".cart-count-text");
const selectAll = document.querySelector(".select-all");
const selectAllText = selectAll.querySelector("span");
const selectDeleteBtn = document.querySelector(".cart-list-header button");
const productAmount = document.querySelector(".order-row strong");
const totalAmount = document.querySelector(".order-total strong");

// ==========================================
// State & Constants
// ==========================================

let cart = readCart();
let cartHTML = [];

// ==========================================
// Functions & Core Logic
// ==========================================

function renderCart() {
  // 기존 항목 제거
  cartList.querySelectorAll(".cart-item").forEach(el => {
    el.remove();
  });
  cartHTML = [];

  if (cart.length === 0) {
    cartHTML.push(`
      <article>
        장바구니가 비어있습니다.
      </article>`);
  } else {
    cartHTML = cart.map(
      p => `
        <article class="cart-item" data-id="${p.id}">
          <label class="item-check">
            <input type="checkbox" />
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
  }
  // cartList.innerHTML += cartHTML.join("");
  cartList.insertAdjacentHTML("beforeend", cartHTML.join(""));
  updateSelectState();
}

// 상품 개수 반영
function updateCartCountFunc() {
  cartCountText.textContent = `총 ${cart.length}개의 상품`;
}

// 상품 금액, 결제 금액 업데이트
// reduce 카트 항목들마다 수량*가격 + 수량*가격
function updateTotalAmount() {
  const sum = cart.reduce((total, item) => total + item.price * item.qty, 0);
  productAmount.textContent = `${sum.toFixed(2)}$`;
  totalAmount.textContent = `${(sum + 0).toFixed(2)}$`;
}

function updateSelectState() {
  const checkBoxes = getCheckBoxes();
  const checkedCount = checkBoxes.filter(b => b.checked).length;
  selectAllText.textContent = `전체선택 (${checkedCount}/${checkBoxes.length})`;

  // 모두 체크시, 전체 선택 부분 체크 true
  selectAll.querySelector("input").checked = checkedCount > 0 && checkedCount === checkBoxes.length ? true : false;
}
function getCheckBoxes() {
  return [...cartList.querySelectorAll(".cart-item input")];
}

function saveCart() {
  writeCart(cart);
  updateCartCount();
  updateCartCountFunc();
  updateTotalAmount();
}

// ==========================================
// Event Listeners
// ==========================================

// 수량 변경, 삭제
cartList.addEventListener("click", e => {
  const cartItem = e.target.closest(".cart-item");
  if (!cartItem) return;

  const id = Number(cartItem.dataset.id);
  const targetItem = cart.find(item => item.id === id);

  if (e.target.closest(".minusBtn")) {
    if (targetItem.qty > 1) targetItem.qty--;
    saveCart();
    renderCart();
  } else if (e.target.closest(".plusBtn")) {
    targetItem.qty++;
    saveCart();
    renderCart();
  } else if (e.target.closest(".remove-item")) {
    cart = cart.filter(p => p.id !== id);
    saveCart();
    renderCart();
  }
});

// 체크박스 클릭
selectAll.querySelector("input").addEventListener("change", e => {
  /*
  if (e.target.checked) {
    getCheckBoxes().forEach(cb => {
      cb.checked = true;
    });
  } else {
    cb.checked = false;
  }
  */
  getCheckBoxes().forEach(cb => {
    cb.checked = e.target.checked ? true : false;
  });
  updateSelectState();
});
cartList.addEventListener("change", e => {
  if (e.target.matches(".cart-item input")) {
    updateSelectState();
  }
});

// 선택 삭제
selectDeleteBtn.addEventListener("click", e => {
  /*
  cart 수정
    체크된 상품의 id 파악 - 변수명 checkedIds
    cart에서 id와 일치하는 요소를 제외
  saveCart 실행, renderCart 실행
   */
  const checkedIds = getCheckBoxes()
    .filter(cb => cb.checked)
    .map(cb => Number(cb.closest(".cart-item").dataset.id));

  if (checkedIds.length === 0) return;
  cart = cart.filter(p => !checkedIds.includes(p.id));

  saveCart();
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
