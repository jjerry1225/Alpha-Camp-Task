const cat = document.querySelector(".cat-img");
const count = document.querySelector(".number");
const voice = document.querySelector(".voice");
const mouse = document.querySelector(".mouse");
mouse.style.display = "none";

// 按下滑鼠時，數字需增加，圖片也變成張口的
cat.addEventListener("mousedown", function (event) {
  const target = event.target;
  if (target.matches(".cat-img")) {
    target.src = "https://popcat.click/img/op.353767c3.png";
    let countNumber = Number(count.innerText);
    countNumber++;
    count.innerText = countNumber;

    // 數字為10的倍數時，隱藏的字出現，且數字的格式改變
    if (countNumber % 10 === 0) {
      mouse.style.display = "block";
      count.classList.add("pop");
    } else {
      mouse.style.display = "none";
      count.classList.remove("pop");
    }
  }
});

// 當放開滑鼠時，變回閉嘴的樣子，並加上聲音。
cat.addEventListener("mouseup", function (event) {
  cat.src = "https://popcat.click/img/p.1e9d00be.png";
  voice.play();
});