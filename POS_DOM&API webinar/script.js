// 3.變數宣告
const menu = document.getElementById("menu");
const cart = document.getElementById("cart");
const totalAmount = document.getElementById("total-amount");
const button = document.getElementById("submit-button");

let productData = [];
let cartItems = [];
let total = 0;

// 4.GET API 菜單產品資料
axios
  .get("https://ac-w3-dom-pos.firebaseio.com/products.json")
  .then(function (res) {
    productData = res.data;
    displayProduct(productData);
    //console.log(products)
  })
  .catch(function (error) {
    console.log(error);
  });

// 5.將產品資料加入菜單區塊

function displayProduct(products) {
  products.forEach((product) => {
    menu.innerHTML += `
      <div class="col-3">
        <div class="card" >
          <img src=${product.imgUrl} class="card-img-top" alt="..." id=${product.id}>
          <div class="card-body">
            <h5 class="card-title" id=${product.id}>${product.name}</h5>
            <p class="card-text" id=${product.id}>${product.price}</p>
            <a id=${product.id} href="javascript:;" class="btn btn-primary">加入購物車</a>
          </div>
        </div>
      </div>
    `;
  });
}

// 6.加入購物車
function addToCart(event) {
  // 找到觸發event的node元素，並得到其產品id
  const id = event.target.id;

  // 在productData的資料裡，找到點擊的產品資訊，加入 cartItems
  const shopItem = productData.find((item) => item.id === id);
  const name = shopItem.name;
  const price = shopItem.price;

  // 加入購物車變數cartItems 分：有按過、沒按過
  const targetItem = cartItems.find((item) => item.id === id);

  if (targetItem) {
    targetItem.quantity += 1;
  } else {
    cartItems.push({
      id: id, // id,
      name: name, // name,
      price: price, // price,
      quantity: 1
    });
  }

  // 畫面顯示購物車清單
  cart.innerHTML = cartItems
    .map(
      (item) => `
    <li class="list-group-item"><span>${item.name} X ${item.quantity} 小計：${
        item.price * item.quantity
      }</span><button type="button" class="btn btn-danger btn-sm float-right delete"  id="${
        item.id
      }">-
</button></li>
  `
    )
    .join(" ");

  // 計算總金額
  calculateTotalAmount(price);
}

//刪除購物車內容
function deleteFromCart(event) {
  const target = event.target;
  const id = target.id;
  const deleteItem = cartItems.find((item) => item.id === id);
  const deletPrice = deleteItem.price;
  //每點一次delete btn，總金額就會扣一次該產品的價錢。
  total -= deletPrice;
  totalAmount.textContent = total;

  //找出欲刪除的項目目前在cartItems陣列中的位置。
  const deleteIndex = cartItems.findIndex((item) => item.id === id);

  //設定條件式：當點選delete btn，選中的產品其數量>1時，該產品數量會減少，同時調整顯示於購物車清單上的內容。
  if (target.matches(".delete") && cartItems[deleteIndex].quantity > 1) {
    cartItems[deleteIndex].quantity--;
    target.parentElement.innerHTML = `<span>${cartItems[deleteIndex].name} X ${
      cartItems[deleteIndex].quantity
    } 小計：${
      cartItems[deleteIndex].price * cartItems[deleteIndex].quantity
    }</span><button type="button" class="btn btn-danger btn-sm float-right delete"  id="${
      cartItems[deleteIndex].id
    }">-
</button>`;

    //當點選delete btn，選中的產品其數量<=1時，數量減少，同時直接將該項目從cartItems陣列移除->避免此時點選加入購物車時，購物車清單中跑出數量為0的產品。
    //最終該項目也須從購物車清單中移除。
  } else if (
    target.matches(".delete") &&
    cartItems[deleteIndex].quantity <= 1
  ) {
    cartItems[deleteIndex].quantity--;
    cartItems.splice(deleteIndex, 1);
    target.parentElement.remove();
  }
}

// 7.計算總金額
function calculateTotalAmount(amount) {
  total += amount;
  totalAmount.textContent = total;
}

// 8.送出訂單
function submit() {}

// 9.重置資料
function reset() {}

// 10. 加入事件監聽
menu.addEventListener("click", addToCart);
cart.addEventListener("click", deleteFromCart);