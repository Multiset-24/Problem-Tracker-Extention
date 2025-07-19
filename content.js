// content.js
// Author:
// Author URI: https://
// Author Github URI: https://www.github.com/
// Project Repository URI: https://github.com/
// Description: Handles all the webpage level activities (e.g. manipulating page data, etc.)
// License: MIT

const addButtonToLeetcode = () => {
  const placeHolder = document.getElementsByClassName(
    "relative inline-flex items-center justify-center text-caption px-2 py-1 gap-1 rounded-full bg-fill-secondary cursor-pointer transition-colors hover:bg-fill-primary hover:text-text-primary text-sd-secondary-foreground hover:opacity-80"
  )[0]?.parentElement;

  if (placeHolder) {
    console.log("Found placeholder:", placeHolder);

    const newButton = document.createElement("div");
    newButton.textContent = "Track Problem";
    newButton.classList.add(
      "relative",
      "inline-flex",
      "items-center",
      "justify-center",
      "text-caption",
      "px-2",
      "py-1",
      "gap-1",
      "rounded-full",
      "bg-fill-secondary",
      "cursor-pointer",
      "transition-colors",
      "hover:bg-fill-primary",
      "hover:text-text-primary",
      "text-sd-secondary-foreground",
      "hover:opacity-80",
      "text-red-500"
    );

    newButton.classList.add("problem-tracker-add-button");

    newButton.addEventListener("click", () => {});

    placeHolder.appendChild(newButton);
  }
};
const addButtonToCodeforces = () => {
  const placeHolder = document.getElementsByClassName(
    "second-level-menu-list"
  )[0];

  if (placeHolder) {
    console.log("Found Codeforces placeholder (UL):", placeHolder);

    const newButton = document.createElement("li");
    const linkText = document.createElement("a");
    linkText.textContent = "Track Problem";
    linkText.href = "#";
    newButton.appendChild(linkText);

    linkText.addEventListener("click", (event) => {});

    placeHolder.appendChild(newButton);
    console.log("Track Problem button added to Codeforces page.");
  }
};
const addButtonToAtcoder = () => {
  const problemTitleSpan = document.querySelector("div.col-sm-12 > span.h2");

  if (problemTitleSpan) {
    console.log("Found AtCoder problem title span:", problemTitleSpan);

    const newButton = document.createElement("button");
    newButton.textContent = "Track Problem";

    newButton.classList.add(
      "problem-tracker-atcoder-button",
      "atcoder-problem-tag-mimic"
    );

    newButton.setAttribute("data-platform", "atcoder");

    newButton.addEventListener("click", () => {});

    problemTitleSpan.appendChild(newButton);
    console.log("Track Problem button added to AtCoder page.");
  }
};
if (!document.getElementById("problem-tracker-atcoder-styles")) {
  const style = document.createElement("style");
  style.id = "problem-tracker-atcoder-styles";
  style.textContent = style.textContent = `
    .problem-tracker-atcoder-button {
        padding: 5px 10px;
        font-size: 12px;
        line-height: 1.5;
        border-radius: 2px;
        color: #333;
        background-color: #fff;
        border-color: #ccc;
        display: inline-block;
        margin-bottom: 0;
        font-weight: normal;
        text-align: center;
        vertical-align: middle;
        -ms-touch-action: manipulation;
        touch-action: manipulation;
        cursor: pointer;
        background-image: none;
        border: 1px solid transparent;
        white-space: nowrap;
        border: 1px solid #d0d0d0; 
        padding: 5px 12px; 
        font-family: 'Lato', sans-serif; 
    }

    .atcoder-problem-tag-mimic:hover {
        background-color: #f7f7f7; /* Slightly darker white/lighter grey on hover */
        border-color: #c0c0c0; /* Slightly darker border on hover */
        box-shadow: 0 1px 3px rgba(0,0,0,0.1); /* Slightly more prominent shadow on hover */
    }
`;
  document.head.appendChild(style);
}

function addButton() {
  const url = window.location.href;

  if (url.includes("https://leetcode.com/problems/")) addButtonToLeetcode();
  else if (url.includes("https://codeforces.com/problemset/problem/"))addButtonToCodeforces();
  else if (url.includes("https://atcoder.jp/contests/")) addButtonToAtcoder();
}
addButton();
