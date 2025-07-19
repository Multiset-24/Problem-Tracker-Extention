// content.js
// Author:Saurav chaurasiya
// Author URI: https://
// Author Github URI: https://github.com/Multiset-24
// Project Repository URI: https://github.com/Multiset-24/Problem-Tracker-Extention
// Description: Handles all the webpage level activities (e.g. manipulating page data, etc.)
// License: MIT
const LC_Key = "LEETCODE_TRACKER_KEY";
const CF_Key = "CODEFORCES_TRACKER_KEY";
const ATCODER_Key = "ATCODER_TRACKER_KEY";

const getAtcoderProblemName = () => {
  const h2Span = document.querySelector(".h2");
  let cleanedHTML = h2Span.innerHTML
    .replace(/<a[^>]*>.*?<\/a>/gi, "")
    .replace(/<button[^>]*>.*?<\/button>/gi, "");
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = cleanedHTML;
  return tempDiv.textContent.trim();
};

function getFromSync(keys) {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get(keys, (result) => {
      if (chrome.runtime.lastError) reject(chrome.runtime.lastError);
      else resolve(result[keys] || []);
    });
  });
}

const getProblemInfo = () => {
  const url = window.location.href;
  const KEY = url.includes("https://leetcode.com/problems/")
    ? LC_Key
    : url.includes("https://atcoder.jp/contests/")
    ? ATCODER_Key
    : CF_Key;
  const problemName =
    KEY == LC_Key
      ? document.getElementsByClassName(
          "no-underline hover:text-blue-s dark:hover:text-dark-blue-s truncate cursor-text whitespace-normal hover:!text-[inherit]"
        )[0].innerText
      : KEY == CF_Key
      ? document.querySelector(".problem-statement .title").innerText
      : getAtcoderProblemName();

  const id = problemName + KEY;

  const toBeProblem = {
    id: id,
    name: problemName,
    key: KEY,
    url: url,
  };
  return { toBeProblem, KEY, id };
};

async function addProblemToTracker() {
  const problemInfo = getProblemInfo();
  const { toBeProblem, KEY, id } = problemInfo;
  const currentProblems = await getFromSync(KEY);
  if (currentProblems.some((problem) => problem.id === id)) {
    alert("Problem already exists in tracker!");
    return;
  }
  const updatedProblems = [...currentProblems, toBeProblem];

  chrome.storage.sync.set({ [KEY]: updatedProblems }, () => {
    console.log("Problem added to tracker:", updatedProblems);
    alert("Problem added to tracker!");
  });
}

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

    newButton.addEventListener("click", () => {
      addProblemToTracker();
      console.log("Track Problem button clicked.");
    });

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

    linkText.addEventListener("click", (event) => {
      const clickedElement = event.target;

      addProblemToTracker();
      console.log("Track Problem button clicked.");
    });

    newButton.appendChild(linkText);
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

    newButton.addEventListener("click", () => {
      addProblemToTracker();
    });

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
  else if (
    url.includes("https://codeforces.com/problemset/problem/") ||
    url.includes("https://codeforces.com/contest/")
  )
    addButtonToCodeforces();
  else if (url.includes("https://atcoder.jp/contests/")) addButtonToAtcoder();
}

window.onload(addButton());
