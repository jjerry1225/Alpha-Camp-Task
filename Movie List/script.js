const BASE_URL = "https://movie-list.alphacamp.io";
const INDEX_URL = BASE_URL + "/api/v1/movies/";
const POSTER_URL = BASE_URL + "/posters/";
const MOVIE_PER_PAGE = 12;

const movies = [];
let filteredMovies = [];
const list = JSON.parse(localStorage.getItem("favoriteMovies")) || [];
let currentPage = 1;

const dataPanel = document.querySelector("#data-panel");
const searchForm = document.querySelector("#search-form");
const searchInput = document.querySelector("#search-input");
const paginator = document.querySelector("#paginator");
const cardModeBtn = document.querySelector("#card-mode-button");
const listModeBtn = document.querySelector("#list-mode-button");

//函式 => 檢查該電影是否已加入收藏清單，若已加入則調整其like button的內容與顏色。
function checkFavoriteExist() {
  const favoriteButtons = dataPanel.querySelectorAll(".btn-add-favorite");
  favoriteButtons.forEach((favoriteButton) => {
    if (list.some((movie) => movie.id === Number(favoriteButton.dataset.id))) {
      favoriteButton.classList.remove("btn-danger");
      favoriteButton.classList.add("btn-info");
      favoriteButton.innerText = "liked";
    }
  });
}

//函式 => 呈現電影列表，
//     => 設定條件式，選擇呈現「卡片」模式或「列表」模式
//     => 另外依該電影是否已被收藏，其Like的按鈕將會呈現不同樣式。
function renderMovieList(data) {
  let rowHTML = "";

  if (dataPanel.matches(".card-mode")) {
    data.forEach(function (item) {
      rowHTML += `<div class="col-sm-3">
    <div class="mb-2">
      <div class="card">
        <img
          src="${POSTER_URL + item.image}"
          class="card-img-top"
          alt="Movie Poster"
        />
        <div class="card-body">
          <h5 class="card-title">${item.title}</h5>
        </div>
        <div class="card-footer">
          <button
            class="btn btn-primary btn-show-movie"
            data-bs-toggle="modal"
            data-bs-target="#movie-modal"
            data-id=${item.id}
          >
            More
          </button>
          <button class="btn btn-danger float-end btn-add-favorite" data-id=${
            item.id
          }>Like</button>
        </div>
      </div>
    </div>
  </div>
`;
    });
    dataPanel.innerHTML = rowHTML;
  } else if (dataPanel.matches(".list-mode")) {
    data.forEach(function (item) {
      rowHTML += `<li class="list-group-item">${item.title}
      <button class="btn btn-primary float-end ms-3 btn-show-movie" data-bs-toggle="modal" data-bs-target="#movie-modal" data-id=${item.id}>More</button>
      <button class="btn btn-danger float-end btn-add-favorite" data-id=${item.id}>Like</button>
</li>
`;
    });
    dataPanel.innerHTML = rowHTML;
  }

  checkFavoriteExist();
}

//函式 => 呈現頁碼
function renderPaginator(amount) {
  const numberOfPages = Math.ceil(amount / MOVIE_PER_PAGE);
  let rowHTML = "";

  for (let page = 1; page <= numberOfPages; page++) {
    rowHTML += `<li class="page-item"><a class="page-link" href="#" data-page=${page}>${page}</a></li>`;
  }

  paginator.innerHTML = rowHTML;
}

//函式 => 依照頁碼呈現相應內容
function getMovieByPage(page) {
  //page 1 -> movies 0 - 11
  //page 2 -> movies 12 - 23
  //page 3 -> movies 24 - 35
  //page 4 -> movies 36 - 47
  //....

  const data = filteredMovies.length ? filteredMovies : movies;
  const startIndex = (page - 1) * MOVIE_PER_PAGE;
  return data.slice(startIndex, startIndex + MOVIE_PER_PAGE);
}

//函式 => show出該moive的詳細資料
function showMovieModal(id) {
  const modalTitle = document.querySelector("#movie-modal-title");
  const modalImage = document.querySelector("#movie-modal-image");
  const modalDate = document.querySelector("#movie-modal-date");
  const modalDescription = document.querySelector("#movie-modal-description");

  axios.get(INDEX_URL + id).then(function (response) {
    const data = response.data.results;
    modalTitle.innerText = data.title;
    modalDate.innerText = `Release date : ${data.release_date}`;
    modalDescription.innerText = data.description;
    modalImage.innerHTML = `<img src="${
      POSTER_URL + data.image
    }" alt="movie-poster" class="img-fluid">`;
  });
}

//函式 => 加入收藏清單。
function addToFavorite(id) {
  //console.log(id)
  const movie = movies.find((movie) => movie.id === id);

  if (list.some((movie) => movie.id === id)) {
    return alert("此電影已經在收藏清單中");
  }

  list.push(movie);

  localStorage.setItem("favoriteMovies", JSON.stringify(list));
}

//監聽事件 => 在dataPanel中監聽click事件，以觸發"呈現詳細資料"或"加入收藏清單"等函式，並且若觸擊Like的按鈕，其顏色會改變，文字顯示Liked，示意已加入收藏清單。
dataPanel.addEventListener("click", function onPanelClicked(event) {
  if (event.target.matches(".btn-show-movie")) {
    showMovieModal(Number(event.target.dataset.id));
  } else if (event.target.matches(".btn-add-favorite")) {
    addToFavorite(Number(event.target.dataset.id));
    event.target.classList.remove("btn-danger");
    event.target.classList.add("btn-info");
    event.target.innerText = "Liked";
  }
});

//監聽事件 => 在paginator中監聽click事件，以呈現點擊頁碼的相對應內容。
paginator.addEventListener("click", function onPaginatorclicked(event) {
  if (event.target.tagName !== "A") return;
  const page = Number(event.target.dataset.page);
  currentPage = page;
  renderMovieList(getMovieByPage(currentPage));
});

//監聽事件 => 在searchForm中監聽submit事件，以呈現搜尋內容
searchForm.addEventListener("submit", function onSearchFormSubmitted(event) {
  event.preventDefault();
  const keyword = searchInput.value.trim().toLowerCase();

  if (!keyword.length) {
    alert("Please enter valid string");
  }

  filteredMovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(keyword)
  );

  if (filteredMovies.length === 0) {
    renderPaginator(movies.length);
    renderMovieList(getMovieByPage(1));
    return alert("Cannot find movies with keyword : " + keyword);
  }

  currentPage = 1;

  renderPaginator(filteredMovies.length);
  renderMovieList(getMovieByPage(currentPage));
});

//監聽事件 => 在listModeBtn上監聽click事件，以切換為列表模式。
listModeBtn.addEventListener("click", function (event) {
  if (event.target.matches("#list-mode-button")) {
    dataPanel.classList.remove("card-mode");
    dataPanel.classList.add("list-mode");
    renderMovieList(getMovieByPage(currentPage));
  }
});

//監聽事件 => 在cardModeBtn上監聽click事件，以切換為卡片模式。
cardModeBtn.addEventListener("click", function (event) {
  if (event.target.matches("#card-mode-button")) {
    dataPanel.classList.remove("list-mode");
    dataPanel.classList.add("card-mode");
    renderMovieList(getMovieByPage(currentPage));
  }
});

axios.get(INDEX_URL).then(function (response) {
  //for (const movie of response.data.results) {
  //  movies.push(movie)}
  movies.push(...response.data.results);
  renderPaginator(movies.length);
  renderMovieList(getMovieByPage(1));
});