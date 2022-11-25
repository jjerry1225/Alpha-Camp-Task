const GAME_STATE = {
  FirstCardAwaits: "FirstCardAwaits",
  SecondCardAwaits: "SecondCardAwaits",
  CardMatchFailed: "CardMatchFailed",
  CardMatched: "CardMatched",
  Gamefinished: "Gamefinished"
};

const Symbols = [
  "https://assets-lighthouse.alphacamp.co/uploads/image/file/17989/__.png", // 黑桃
  "https://assets-lighthouse.alphacamp.co/uploads/image/file/17992/heart.png", // 愛心
  "https://assets-lighthouse.alphacamp.co/uploads/image/file/17991/diamonds.png", // 方塊
  "https://assets-lighthouse.alphacamp.co/uploads/image/file/17988/__.png" // 梅花
];

// 原本的寫法：
// const view = {
//   displayCards: function displayCards() { ...  }
// }
// => 當物件的屬性與函式/變數名稱相同時，可以省略不寫
const view = {
  getCardContent(index) {
    const number = this.transformNumber((index % 13) + 1);
    const symbol = Symbols[Math.floor(index / 13)];
    return `
      <p>${number}</p>
      <img src="${symbol}" alt="">
      <p>${number}</p>
      `;
  },

  getCardElement(index) {
    return `<div data-index="${index}" class="card back"> </div>`;
  },

  transformNumber(number) {
    switch (number) {
      case 1:
        return "A";
      case 11:
        return "J";
      case 12:
        return "Q";
      case 13:
        return "K";
      default:
        return number;
    }
  },

  displayCards(indexes) {
    const rootElement = document.querySelector("#cards");
    rootElement.innerHTML = indexes
      .map((index) => this.getCardElement(index))
      .join("");
  },

  //加入...展延運算子後，會從陣列中的參數一個一個取出來跑函式。
  flipCards(...cards) {
    cards.map((card) => {
      //如果是背面，則回傳正面
      if (card.classList.contains("back")) {
        card.classList.remove("back");
        card.innerHTML = this.getCardContent(Number(card.dataset.index));
        return;
      }

      //如果是正面，則回傳背面
      card.classList.add("back");
      card.innerHTML = null;
    });
  },

  pairCards(...cards) {
    cards.map((card) => {
      card.classList.add("paired");
    });
  },

  renderScore(score) {
    document.querySelector(".score").textContent = `Score:${score}`;
  },

  renderTriedTimes(times) {
    document.querySelector(
      ".tried"
    ).textContent = `You've tried: ${times} times`;
  },

  appendWrongAnimation(...cards) {
    cards.map((card) => {
      card.classList.add("wrong");
      card.addEventListener(
        "animationend",
        (event) => {
          card.classList.remove("wrong");
        },
        {
          once: true
        }
      );
    });
  },

  showGameFinished() {
    const div = document.createElement("div");
    div.classList.add("completed");
    div.innerHTML = `<p>Complete!</p>
      <p>Score: ${model.score}</p>
      <p>You've tried: ${model.triedTimes} times</p>`;

    const header = document.querySelector("#header");
    header.before(div);
  }
};

const utility = {
  getRandomNumberArray(count) {
    const number = Array.from(Array(count).keys());

    for (let index = number.length - 1; index > 0; index--) {
      let randomIndex = Math.floor(Math.random() * (index + 1));
      [number[index], number[randomIndex]] = [
        number[randomIndex],
        number[index]
      ];
    }

    return number;
  }
};

const model = {
  revealedCards: [],

  isRevealedCardsMatched() {
    return (
      this.revealedCards[0].dataset.index % 13 ===
      this.revealedCards[1].dataset.index % 13
    );
  },

  score: 0,

  triedTimes: 0
};

const controller = {
  currentState: GAME_STATE.FirstCardAwaits,

  generateCards() {
    view.displayCards(utility.getRandomNumberArray(52));
  },

  //根據不同的遊戲狀態做出不同的行為
  dispatchCardAction(card) {
    if (!card.classList.contains("back")) {
      return;
    }

    switch (this.currentState) {
      case GAME_STATE.FirstCardAwaits:
        view.flipCards(card);
        model.revealedCards.push(card);
        this.currentState = GAME_STATE.SecondCardAwaits;
        break;

      case GAME_STATE.SecondCardAwaits:
        view.renderTriedTimes(++model.triedTimes);
        view.flipCards(card);
        model.revealedCards.push(card);

        if (model.isRevealedCardsMatched()) {
          //配對正確
          view.renderScore((model.score += 10));
          this.currentState = GAME_STATE.CardMatched;
          view.pairCards(...model.revealedCards);
          model.revealedCards = [];
          if (model.score === 260) {
            console.log("showGameFinished");
            this.currentState = GAME_STATE.GameFinished;
            view.showGameFinished(); // 加在這裡
            return;
          }
          this.currentState = GAME_STATE.FirstCardAwaits;
        } else {
          //配對失敗
          this.currentState = GAME_STATE.CardMatchFailed;
          view.appendWrongAnimation(...model.revealedCards);
          setTimeout(this.resetCards, 1000);
        }
        break;
    }

    console.log("current state:", this.currentState);
    console.log("flipcards:", model.revealedCards);
  },

  resetCards() {
    view.flipCards(...model.revealedCards);
    model.revealedCards = [];
    controller.currentState = GAME_STATE.FirstCardAwaits;
  }
};

controller.generateCards();

//document.querySelectorAll('.card')產生的結果為Node list(array.like)，故不能用map()，需使用forEach。
document.querySelectorAll(".card").forEach((card) => {
  card.addEventListener("click", (event) => {
    controller.dispatchCardAction(card);
  });
});