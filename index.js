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
const listSettingsButton = document.getElementById("list-settings-button");
const saveConfirmButton = document.getElementById("save-confirm-button");
const saveAbortButton = document.getElementById("save-abort-button");

var storageList = { lists: [] };
var currentList = [];
var currentListName;
var currentListGUID;
var currentListIndex = "none";
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

function findListIndex(UID) {
  for(var i = 0 ; i < storageList.lists.length ; i++) {
    if(storageList.lists[i].GUID == UID) {
      return i;
    }
  }
}

function save(listUID) {
  if(currentList.length < 1) return;
  let list = findListIndex(listUID);
  if(list != undefined && list != NaN) {
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
  let newIndex = findListIndex(currentListGUID);
  if(newIndex != NaN && newIndex != undefined) {
    currentListIndex = newIndex;
  }
  parseStorageList();
}

function addToMainList() {
  addListItem(addToMainListInput.value);
  if(currentList) {
    randomDialogue.style="";
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
  if (!text || value == NaN || value == undefined) return;
  let listOption = document.createElement('option');
  let optionText = document.createTextNode(text);
  listOption.value = value;
  listOption.append(optionText);
  loadListDropdown.appendChild(listOption);
}

function refreshList() {
  loadListDropdown.value = currentListIndex;
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
  loadListDropdown.value = currentListIndex;
}

function loadList(index) {
  if(index === undefined) {
    index = loadListDropdown.value;
  }
  currentList = storageList.lists[index].items;
  currentListName = storageList.lists[index].name;
  currentListGUID = storageList.lists[index].GUID;
  randomDialogue.style = "";
  currentListIndex = index;
  refreshList();
}


// These are all event listeners
saveConfirmButton.addEventListener("click", () => {
  if(listNameInput.value) {
    currentListName = listNameInput.value;
    save(currentListGUID);
    listNameInput.value = currentListName;
    listNameInput.dispatchEvent(new Event('input', {bubbles:true}));
  }
})

saveAbortButton.addEventListener("click", () => {
  if(currentListName) {
    listNameInput.value = currentListName;
    listNameInput.dispatchEvent(new Event('input', {bubbles:true}));
  } else {
    listNameInput.value = "";
    listNameInput.dispatchEvent(new Event('input', {bubbles:true}));
  }
})

listNameInput.addEventListener("input", () => {
  if(listNameInput.value != currentListName && listNameInput.value) {
    listSettingsButton.style = "display: none;"
    saveConfirmButton.style = "";
    saveAbortButton.style = "";
  } else {
    saveConfirmButton.style = "display: none;"
    saveAbortButton.style = "display: none;"
    listSettingsButton.style = "width: 4em;";
  }
})

randomDrawButton.addEventListener("click", () => {
  randomOutputField.parentElement.style = "height: 4.5em;";
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
