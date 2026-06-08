import { readCart, updateCartCount } from "./utils/common.js";

const cartCountText = document.querySelector(".cart-count-text");
const selectAllText = document.querySelector(".select-all-text");
const cartList = document.querySelector(".cart-list");

function renderCartItems() {
  const cartItems = readCart();
  const cartHTML = cartItems.map(
    p => `
  <article class="cart-item">
    <span class="item-check"><span class="check-box" aria-hidden="true"></span></span>
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

renderCartItems();
updateCartCount();
