const slider = document.querySelector(".slider");
const hexCode = document.querySelector(".hexCode");
let newHexCode = "";
let hex = ["00", "00", "00"];

slider.addEventListener("input", function (event) {
  let target = event.target;
  let inputValue = Number(target.value);
  let valueBox = target.parentElement.children[2];
  valueBox.innerText = inputValue;
  if (target.matches("#rgb-r")) {
    if (inputValue < 16) {
      hex[0] = "0" + inputValue.toString(16);
    } else {
      hex[0] = inputValue.toString(16);
    }
  } else if (target.matches("#rgb-g")) {
    if (inputValue < 16) {
      hex[1] = "0" + inputValue.toString(16);
    } else {
      hex[1] = inputValue.toString(16);
    }
  } else {
    if (inputValue < 16) {
      hex[2] = "0" + inputValue.toString(16);
    } else {
      hex[2] = inputValue.toString(16);
    }
  }

  newHexCode = "#" + hex[0] + hex[1] + hex[2];
  hexCode.innerText = newHexCode;
  document.body.style.backgroundColor = newHexCode;
});