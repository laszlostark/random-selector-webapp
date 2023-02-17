const loadListButton = document.getElementById("load-list-button");
const loadListDropdown = document.getElementById("load-list-dropdown");
const mainList = document.getElementById("main-list");
const addToMainListButton = document.getElementById("add-to-main-list-button");
const addToMainListInput = document.getElementById("add-to-main-list-input");
const addToMainListForm = document.getElementById("add-to-main-list-form");
const saveAsDropdown = document.getElementById("save-as-dropdown");
const saveAsInput = document.getElementById("save-as-input");
const saveAsButton = document.getElementById("save-as-button");
const saveAsForm = document.getElementById("save-as-form");
const randomDialogue = document.getElementById("random-dialogue");
const randomDrawButton = document.getElementById("random-draw-button");
const randomOutputField = document.getElementById("random-output-field");

var storageList = { lists: [] };
var currentList = [];
var currentListName;
var currentHat;

init();


function init() {
  saveAsDropdown.value = "none";
  loadListDropdown.value = "none";
  loadListButton.disabled = true;
  parseStorageList();
}

function drawFromHat() {
  if(!currentHat) {
    currentHat = currentList.slice().shuffleArray();
  } else if(!currentList) return;
  let randomItem = currentHat.shift();
  if(currentHat.length < 1) {
    currentHat = currentList.slice().shuffleArray();
  }
  return randomItem;
}

const shuffleArray = array => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
}


function drawTrueRandom() {
  return currentList[randomInt(currentList.length)];
}

function randomInt(max) {
  return Math.floor(Math.random() * max);
}

function saveAs() {
  if (saveAsButton.classList.contains("btn-danger")) {
    saveAsButton.classList.remove("btn-danger");
    saveAsButton.classList.add("btn-outline-primary");
    storageList.lists[saveAsDropdown.value].items = currentList;
    localStorage.list = JSON.stringify(storageList);
    saveAsDropdown.value = "none";
  }

  switch (saveAsDropdown.value) {
    case "none":
      break;
    case "new":
      if (saveAsInput) {
        storageList.lists.push({
          "name": saveAsInput.value,
          "items": currentList
        });
        currentListName = saveAsInput.value;
        saveAsInput.value = "";
        saveAsInput.disabled = true;
        saveAsDropdown.value = "none";
        localStorage.list = JSON.stringify(storageList);
        parseStorageList();
      }
      break;
    default:
      saveAsButton.classList.remove("btn-outline-primary");
      saveAsButton.classList.add("btn-danger");
  }
}

function addToMainList() {
  addListItem(addToMainListInput.value);
  if(currentList) {
    randomDialogue.style="";
  }
  addToMainListInput.value = "";
}

function addListItem(newItem) {
  if (!newItem) return;
  currentList.push(newItem);
  let listItem = document.createElement('li');
  listItem.classList.add("list-group-item");
  let textNode = document.createTextNode(`${currentList.length}. ${newItem}`);
  listItem.appendChild(textNode);
  mainList.appendChild(listItem);
}

function addListViewOption(text, value) {
  if (!text || !value) return;
  let listOption = document.createElement('option');
  let optionText = document.createTextNode(text);
  listOption.value = value;
  listOption.append(optionText);
  loadListDropdown.appendChild(listOption);
  saveAsDropdown.appendChild(listOption.cloneNode(true));
}

function refreshList() {
  mainList.textContent = '';
  for (i in currentList) {
    let text = document.createTextNode(`${parseInt(i) + 1}. ${currentList[i]}`);
    let item = document.createElement('li');
    item.classList.add("list-group-item");
    item.appendChild(text);
    mainList.appendChild(item);
  }
}

function populateListDefaults() {
  loadListDropdown.textContent = "";
  saveAsDropdown.textContent = "";
  let loadOption = document.createElement('option');
  let saveOptionDefault = document.createElement('option');
  let saveOptionNew = document.createElement('option');
  loadOption.disabled = true;
  saveOptionDefault.disabled = true;
  loadOption.value = "none";
  saveOptionDefault.value = "none";
  saveOptionNew.value = "new";
  loadOption.textContent = "Load list..."
  saveOptionDefault.textContent = "Save as..."
  saveOptionNew.textContent = "New list..."
  saveAsDropdown.appendChild(saveOptionDefault);
  saveAsDropdown.appendChild(saveOptionNew);
  saveAsDropdown.value = "none";
  loadListDropdown.appendChild(loadOption);
  loadListDropdown.value = "none";
  saveAsInput.style = "display: none;"
}

function parseStorageList() {
  if (localStorage.list) {
    storageList = JSON.parse(localStorage.list);
  }
  populateListDefaults();
  if (!localStorage.list) return;
  for (i in storageList.lists) {
    addListViewOption(storageList.lists[i].name, i);
  }
  loadListDropdown.disabled = false;
}

// These are all event listeners
mainList.addEventListener("change", () => {
  alert("test");
})

randomDrawButton.addEventListener("click", () => {

})

loadListDropdown.addEventListener("change", () => {
  if (loadListDropdown.value == "none") {
    loadListButton.disabled = true;
  } else {
    loadListButton.disabled = false;
  }
})

saveAsDropdown.addEventListener("change", () => {
  if (saveAsButton.classList.contains("btn-danger")) {
    saveAsButton.classList.remove("btn-danger");
    saveAsButton.classList.add("btn-outline-primary");
  }

  if (saveAsDropdown.value == "new") {
    saveAsInput.style = ""
    saveAsButton.disabled = false;
  } else {
    saveAsInput.style = "display: none"
  }
})

saveAsForm.addEventListener("submit", (e) => {
  e.preventDefault();
  saveAs();

});

loadListButton.addEventListener("click", () => {
  currentList = storageList.lists[loadListDropdown.value].items;
  currentListName = storageList.lists[loadListDropdown.value].name;
  refreshList();
});

addToMainListForm.addEventListener("submit", (e) => {
  e.preventDefault();
  addToMainList();
});
