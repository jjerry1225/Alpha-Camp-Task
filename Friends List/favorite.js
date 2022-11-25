const Base_URL = "https://lighthouse-user-api.herokuapp.com";
const Index_URL = Base_URL + "/api/v1/users/";
const friendList = document.querySelector(".friendList");
const pagination = document.querySelector(".pagination");
const searchForm = document.querySelector(".searchForm");


const list = JSON.parse(localStorage.getItem('favorite')) || []
const perPageAmount = 12;
let searchFriends = [];

//函式 => 於HTML中加入每位朋友的照片與名字。
function addFriendList(data) {
  let dataList = "";
  data.forEach((item) => {
    dataList += `<div class="card m-3" style="width: 15rem;">
    <img src="${item.avatar}" class="card-img-top" alt="...">
    <div class="card-body">
      <h5 class="card-title">${item.name} ${item.surname}</h5>
    </div>
    <div class="card-footer text-muted d-flex justify-content-between">
    <button type="button" class="btn btn-primary btn-sm modal-buttton" data-bs-toggle="modal" data-bs-target="#friendModal" data-id="${item.id}">
        More
      </button>
    <button type="button" class="btn btn-danger delete-button" data-id="${item.id}">
        Delete
      </button>
  </div>
  </div>`;
  });

  friendList.innerHTML = dataList;
}

//函式 => 於Modal中呈現朋友的詳細資訊。
function showMore(id) {
  const modalName = document.querySelector(".modal-name");
  const friendImage = document.querySelector(".friendImage");
  const description = document.querySelector(".description");

  axios.get(Index_URL + id).then(function(response) {
    //console.log(response)
    modalName.innerText = response.data.name + " " + response.data.surname;
    friendImage.src = response.data.avatar;
    description.innerHTML = `<ul>
  <li>email : ${response.data.email}</li>
  <li>gender : ${response.data.gender}</li>
  <li>age : ${response.data.age}</li>
  <li>region : ${response.data.region}</li>
  <li>birthday : ${response.data.birthday}</li>
</ul>
    `;
  });
}

//函式 => 產生頁碼數量
function paginator(amount) {
  const pages = Math.ceil(amount / perPageAmount)
  let pageNumbers = ''
  for (let i = 1; i <= pages; i++) {
    pageNumbers += `<li class="page-item"><a class="page-link" href="#">${i}</a></li>`
  }
  return pagination.innerHTML = pageNumbers
}

//函式 => 控制每頁應呈現的內容
function perPageInformation(page) {
  const startItem = (page - 1) * perPageAmount
  const endItem = (page * perPageAmount)
  const data = searchFriends.length ? searchFriends : list
  return data.slice(startItem, endItem)
}

//函式 => 從favorite清單中移除
function removeFromFavorite(id) {
  //找出欲刪除朋友於list陣列中的位置
  const removeFriendIndex = list.findIndex(friend => friend.id === id)

  //從list陣列中移除
  list.splice(removeFriendIndex, 1)

  //將改變後的lsit重新存入favorite中
  localStorage.setItem('favorite', JSON.stringify(list))

  //重整朋友列表與頁碼
  const page = Math.ceil((removeFriendIndex + 1) / 12)

  if (list.length % 12 === 0) {
    addFriendList(perPageInformation(page - 1))
  } else {
    addFriendList(perPageInformation(page))
  }

  paginator(list.length)
}


friendList.addEventListener("click", function friendMore(event) {
  //在More的按鈕上設置'click'事件監聽，點選後會跑出該朋友的詳細資訊。
  if (event.target.matches(".modal-buttton")) {
    //console.log(event.target.dataset.id)
    showMore(event.target.dataset.id);
  }

  //在Delete的按鈕上設置'click'事件監聽，點選後該朋友將移除收藏清單。
  if (event.target.matches(".delete-button")) {
    removeFromFavorite(Number(event.target.dataset.id))
  }
});

//在pagination上設置'click'事件監聽，跟隨點選的頁碼呈現相應的內容
pagination.addEventListener('click', function(event) {
  const page = Number(event.target.innerText)
  addFriendList(perPageInformation(page))
})

//在Friend's name搜尋欄<form>>上設置'submit'事件監聽，篩選出符合條件的朋友。
searchForm.addEventListener("submit", function searchFriend(event) {
  event.preventDefault();
  const input = inputFriendName.value.toLowerCase().trim();

  //找出符合條件的朋友，產出新的陣列searchFrinds
  searchFriends = list.filter((friend) =>
    (friend.name + " " + friend.surname).toLowerCase().includes(input)
  );

  //如果都沒找到，則提醒該搜尋字沒有符合的朋友
  if (searchFriends.length === 0) {
    return alert('Cannot find friends with keyword : ' + input)
  }

  //呈現符合搜尋條件的朋友
  addFriendList(perPageInformation(1));
  paginator(searchFriends.length)
});

addFriendList(perPageInformation(1))
paginator(list.length)