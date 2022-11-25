const Base_URL = "https://lighthouse-user-api.herokuapp.com";
const Index_URL = Base_URL + "/api/v1/users/";

const friendList = document.querySelector(".friendList");
const searchForm = document.querySelector(".searchForm");
const pagination = document.querySelector(".pagination");

const friends = [];
const list = JSON.parse(localStorage.getItem('favorite')) || []
let searchFriends = [];
const perPageAmount = 12;

//函式 => 於HTML中加入每位朋友的照片與名字。
function addFriendList(data) {
  let dataList = "";
  data.forEach((item) => {
    //若是該item已加入favorite list中，則like-button的呈現會不一樣，故設置條件式篩選。
    if (list.some(favorite => favorite.id === item.id)) {
      dataList += `<div class="card m-3" style="width: 15rem;">
    <img src="${item.avatar}" class="card-img-top" alt="...">
    <div class="card-body">
      <h5 class="card-title">${item.name} ${item.surname}</h5>
    </div>
    <div class="card-footer text-muted d-flex justify-content-between">
    <button type="button" class="btn btn-primary btn-sm modal-buttton" data-bs-toggle="modal" data-bs-target="#friendModal" data-id="${item.id}">
        More
      </button>
    <button type="button" class="btn btn-success like-button" data-id="${item.id}">
        Liked
      </button>
  </div>
  </div>`;
    } else {
      dataList += `<div class="card m-3" style="width: 15rem;">
    <img src="${item.avatar}" class="card-img-top" alt="...">
    <div class="card-body">
      <h5 class="card-title">${item.name} ${item.surname}</h5>
    </div>
    <div class="card-footer text-muted d-flex justify-content-between">
    <button type="button" class="btn btn-primary btn-sm modal-buttton" data-bs-toggle="modal" data-bs-target="#friendModal" data-id="${item.id}">
        More
      </button>
    <button type="button" class="btn btn-danger like-button" data-id="${item.id}">
        Like
      </button>
  </div>
  </div>`;
    }

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

//函式 => 加入收藏清單
function addToFavorite(id) {

  const favoriteFriend = friends.find(friend => friend.id === id)

  //提醒已加入收藏清單
  if (list.some(friend => friend.id === id)) {
    return alert('This friend has been added in favorite list already.')
  }

  //若尚未加入，則將該朋友加入list陣列中。
  list.push(favoriteFriend)

  //將list加入localStorage中
  localStorage.setItem('favorite', JSON.stringify(list))
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
  const data = searchFriends.length ? searchFriends : friends
  return data.slice(startItem, endItem)
}


friendList.addEventListener("click", function friendMore(event) {
  //在More的按鈕上設置'click'事件監聽，點選後會跑出該朋友的詳細資訊。
  if (event.target.matches(".modal-buttton")) {
    //console.log(event.target.dataset.id)
    showMore(event.target.dataset.id);
  }

  //在Like的按鈕上設置'click'事件監聽，點選後該朋友將加入收藏清單，並將like按鈕變為綠色，文字修正為Liked。
  if (event.target.matches(".like-button")) {
    addToFavorite(Number(event.target.dataset.id))
    event.target.classList.remove('btn-danger')
    event.target.classList.add('btn-success')
    event.target.innerText = 'Liked'
  }
});


//在Friend's name搜尋欄<form>>上設置'submit'事件監聽，篩選出符合條件的朋友。
searchForm.addEventListener("submit", function searchFriend(event) {
  event.preventDefault();
  const input = inputFriendName.value.toLowerCase().trim();

  //找出符合條件的朋友，產出新的陣列searchFrinds
  searchFriends = friends.filter((friend) =>
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

//在pagination上設置'click'事件監聽，跟隨點選的頁碼呈現相應的內容
pagination.addEventListener('click', function(event) {
  const page = Number(event.target.innerText)
  addFriendList(perPageInformation(page))
})


//從API中取得朋友資訊，並於朋友列表中一一列出。
axios.get(Index_URL).then(function(response) {
  friends.push(...response.data.results);
  //console.log(friends)
  addFriendList(perPageInformation(1));
  paginator(friends.length)
});
