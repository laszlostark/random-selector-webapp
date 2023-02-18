const loadListButton = document.getElementById("load-list-button");
const loadListDropdown = document.getElementById("load-list-dropdown");
const mainList = document.getElementById("main-list");
const addToMainListInput = document.getElementById("add-to-main-list-input");
const addToMainListForm = document.getElementById("add-to-main-list-form");
const randomDialogue = document.getElementById("random-dialogue");
const randomDrawButton = document.getElementById("random-draw-button");
const randomOutputField = document.getElementById("random-output-field");
const randomTypeSelect = document.getElementById("random-type-select");
const listNameInput = document.getElementById("list-name-input");

var storageList = { lists: [] };
var currentList = [];
var currentListName;
var currentListGUID;
var currentHat;

init();


function init() {
  loadListDropdown.value = "none";
  loadListButton.disabled = true;
  listNameInput.value = "";
  parseStorageList();
  currentListGUID = crypto.randomUUID();
}

function drawFromHat() {
  if(!currentHat) {
    currentHat = currentList.slice();
  } else if(!currentList) return;
  let randomNum = randomInt(currentHat.length);
  let randomItem = currentHat[randomNum];
  currentHat.splice(randomNum, 1);
  if(currentHat.length < 1) {
    currentHat = currentList.slice();
  }
  return randomItem;
}


function drawTrueRandom() {
  return currentList[randomInt(currentList.length)];
}

function randomInt(max) {
  return Math.floor(Math.random() * max);
}

function setListNameDisplay(name) {
  if(!name) {
    listNameInput.value = "";
  }
  
  listNameInput.value = name;
}

function save(listUID) {
  if(currentList.length < 1) return;
  let list;
  for(var i = 0 ; i < storageList.lists.length ; i++) {
    if(storageList.lists[i].GUID == listUID) {
      list = i;
      break;
    }
  }
  if(list) {
    storageList.lists[list].items = currentList;
    storageList.lists[list].name = listNameInput.value;
  } else {
    storageList.lists.push({
      GUID: listUID,
      name: listNameInput.value,
      items: currentList
    });
  }
  localStorage.list = JSON.stringify(storageList);
  parseStorageList();
}

function addToMainList() {
  addListItem(addToMainListInput.value);
  if(currentList) {
    randomDialogue.style="display: default;";
  }
  if(currentListName) {
    save(currentListGUID);
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
}

function refreshList() {
  mainList.textContent = '';
  //for (i in currentList) {
  currentList.forEach((e,i) => {
    let text = document.createTextNode(`${parseInt(i) + 1}. ${e}`);
    let item = document.createElement('li');
    item.classList.add("list-group-item");
    item.appendChild(text);
    mainList.appendChild(item);
  })
  setListNameDisplay(currentListName);
}

function populateListDefaults() {
  loadListDropdown.textContent = "";
  let loadOption = document.createElement('option');
  loadOption.disabled = true;
  loadOption.value = "none";
  loadOption.textContent = "Load list..."
  loadListDropdown.appendChild(loadOption);
  loadListDropdown.value = "none";
}

function parseStorageList() {
  if (localStorage.list) {
    storageList = JSON.parse(localStorage.list);
  }
  populateListDefaults();
  if (!localStorage.list) return;
  storageList.lists.forEach((e, index) => {
    addListViewOption(e.name, index);
  })
  loadListDropdown.disabled = false;
}

function loadList(index) {
  if(index === undefined) {
    index = loadListDropdown.value;
  }
  currentList = storageList.lists[index].items;
  currentListName = storageList.lists[index].name;
  currentListGUID = storageList.lists[index].GUID;
  randomDialogue.style = "display: default;";
  refreshList();
}


// These are all event listeners
listNameInput.addEventListener("change", () => {
  if(listNameInput.value) {
    currentListName = listNameInput.value;
  }
})

randomDrawButton.addEventListener("click", () => {
  randomOutputField.parentElement.style = "height: 4.5em; display: default;";
  switch(randomTypeSelect.value) {
    case "random-true":
      randomOutputField.textContent = drawTrueRandom();
      break;
    case "random-hat":
      randomOutputField.textContent = drawFromHat();
      break;
  }
})

loadListDropdown.addEventListener("change", () => {
  if (loadListDropdown.value == "none") {
    loadListButton.disabled = true;
  } else {
    loadListButton.disabled = false;
  }
})

loadListButton.addEventListener("click", () => {
  loadList();
});

addToMainListForm.addEventListener("submit", (e) => {
  e.preventDefault();
  addToMainList();
});
