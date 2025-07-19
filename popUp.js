document.addEventListener("DOMContentLoaded", () => {
  // Get references to the HTML elements we'll be interacting with
  const searchInput = document.getElementById("searchInput");
  const platformFilter = document.getElementById("platformFilter");
  const problemListContainer = document.getElementById("problemList");
  const messageElement = document.getElementById("message");

  const STORAGE_KEYS = [
    "LEETCODE_TRACKER_KEY",
    "CODEFORCES_TRACKER_KEY",
    "ATCODER_TRACKER_KEY",
  ];
  let allProblems = []; // This will hold all problems from all platforms

  const loadProblems = async () => {
    messageElement.textContent = "Loading problems...";
    try {
      const data = await chrome.storage.sync.get(STORAGE_KEYS);
      let combinedProblems = [];
      STORAGE_KEYS.forEach((key) => {
        if (data[key]) {
          combinedProblems = [...combinedProblems, ...data[key]];
        }
      });
      allProblems = combinedProblems.sort((a, b) =>
        a.name.localeCompare(b.name)
      ); // Sort alphabetically
      filterAndRenderProblems();
    } catch (error) {
      messageElement.textContent = "Failed to load problems.";
      console.error("Error loading problems:", error);
    }
  };

  const renderProblems = (problemsToRender) => {
    problemListContainer.innerHTML = ""; // Clear the current list

    if (problemsToRender.length === 0) {
      messageElement.style.display = "block";
      messageElement.textContent = "No problems found. Go solve some!";
    } else {
      messageElement.style.display = "none";
    }

    problemsToRender.forEach((problem) => {
      const platformName = problem.key.split("_")[0].toLowerCase();
      const card = document.createElement("div");
      card.className =
        "problem-card bg-slate-800 p-3 rounded-lg border border-slate-700 hover:border-cyan-500 transition-all duration-200";
      card.innerHTML = `
                <div class="flex justify-between items-start">
                    <a href="${problem.url}" target="_blank" class="font-semibold text-slate-100 hover:text-cyan-400 transition-colors pr-2">${problem.name}</a>
                    <span class="platform-badge platform-${platformName}">${platformName}</span>
                </div>
                <div class="flex justify-end items-center mt-1">
                    <button data-id="${problem.id}" data-key="${problem.key}" class="delete-btn text-slate-500 hover:text-red-500 transition-colors text-xs font-semibold">DELETE</button>
                </div>
            `;
      problemListContainer.appendChild(card);
    });
  };

  const filterAndRenderProblems = () => {
    const searchTerm = searchInput.value.toLowerCase();
    const selectedPlatform = platformFilter.value;

    const filtered = allProblems.filter((p) => {
      const matchesSearch = p.name.toLowerCase().includes(searchTerm);
      const matchesPlatform =
        selectedPlatform === "ALL" || p.key === selectedPlatform;
      return matchesSearch && matchesPlatform;
    });

    renderProblems(filtered);
  };

  const handleDeleteProblem = async (e) => {
    if (!e.target.matches(".delete-btn")) return; // Check if a delete button was clicked

    const problemId = e.target.dataset.id;
    const storageKey = e.target.dataset.key;

    try {
      const data = await chrome.storage.sync.get(storageKey);
      let problems = data[storageKey] || [];
      const updatedProblems = problems.filter((p) => p.id !== problemId);

      await chrome.storage.sync.set({ [storageKey]: updatedProblems });
      console.log(`Problem '${problemId}' removed from '${storageKey}'`);

      // Reload all problems from storage to update the UI
      loadProblems();
    } catch (error) {
      console.error("Error deleting problem:", error);
    }
  };

  searchInput.addEventListener("input", filterAndRenderProblems);
  platformFilter.addEventListener("change", filterAndRenderProblems);
  problemListContainer.addEventListener("click", handleDeleteProblem);

  loadProblems();
});
