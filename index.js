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
const listEditButton = document.getElementById("list-edit-button");
const saveConfirmButton = document.getElementById("save-confirm-button");
const saveAbortButton = document.getElementById("save-abort-button");
const editView = document.getElementById("edit-view");
const editList = document.getElementById("edit-list");
const editConfirmButton = document.getElementById("edit-confirm-button");
const editAbortButton = document.getElementById("edit-abort-button");
const editListNameInput = document.getElementById("edit-list-name-input");
const mainListView = document.getElementById("main-list-view");

var storageList = { lists: [] };
var currentList = [];
var currentListName;
var currentListGUID;
var currentListIndex = "none";
var currentHat;
var workingListCopy;
var markForDeletion = [];

init();


function init() {
  loadListDropdown.value = "none";
  loadListButton.disabled = true;
  listNameInput.value = "";
  listEditButton.disabled = true;
  parseStorageList();
}

function drawFromHat() {
  if (!currentHat) {
    currentHat = currentList.slice(0);
  } else if (!currentList) { return };
  let randomNum = randomInt(currentHat.length);
  let randomItem = currentHat[randomNum];
  currentHat.splice(randomNum, 1);
  if (currentHat.length < 1) {
    currentHat = currentList.slice(0);
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
  if (!name) {
    listNameInput.value = "";
  }

  listNameInput.value = name;
}

function findListIndex(UID) {
  for (var i = 0; i < storageList.lists.length; i++) {
    if (storageList.lists[i].GUID == UID) {
      return i;
    }
  }
}

function save(listUID, name) {
  if (!currentListGUID) {
    currentListGUID = listUID;
  }
  let list = findListIndex(listUID);
  if (list != undefined && list != NaN) {
    storageList.lists[list].items = currentList;
    storageList.lists[list].name = name;
  } else {
    storageList.lists.push({
      GUID: listUID,
      name: listNameInput.value,
      items: currentList
    });
  }
  localStorage.list = JSON.stringify(storageList);
  let newIndex = findListIndex(currentListGUID);
  if (newIndex != NaN && newIndex != undefined) {
    currentListIndex = newIndex;
  }
  if (currentListGUID) {
    listEditButton.disabled = false;
  } else {
    listEditButton.disabled = true;
  }
  parseStorageList();
}

function addToMainList() {
  addListItem(addToMainListInput.value);
  if (currentList) {
    show(randomDialogue);
  }
  if (currentListGUID) {
    save(currentListGUID, currentListName);
  }
  addToMainListInput.value = "";
}

function addListItem(newItem) {
  if (!newItem) { return };
  currentList.push(newItem);
  let listItem = document.createElement('li');
  listItem.classList.add("list-group-item");
  let textNode = document.createTextNode(`${currentList.length}. ${newItem}`);
  listItem.appendChild(textNode);
  mainList.appendChild(listItem);
}

function addListViewOption(text, value) {
  if (!text || value == NaN || value == undefined) { return };
  let listOption = document.createElement('option');
  let optionText = document.createTextNode(text);
  listOption.value = value;
  listOption.append(optionText);
  loadListDropdown.appendChild(listOption);
}

function refreshList() {
  if (currentList.length > 0) {
    listEditButton.disabled = false;
  } else {
    listEditButton.disabled = true;
  }
  loadListDropdown.value = currentListIndex;
  mainList.textContent = '';
  //for (i in currentList) {
  currentList.forEach((e, i) => {
    let text = document.createTextNode(`${parseInt(i) + 1}. ${e}`);
    let item = document.createElement('li');
    item.classList.add("list-group-item");
    item.appendChild(text);
    mainList.appendChild(item);
  })
  setListNameDisplay(currentListName);
}

function createEditItem() {
  let editItem = document.createElement("li");
  let checkbox = document.createElement("input");
  let deleteItemsButton = document.createElement("button");
  let deleteItemsIcon = document.createElement("i");
  let deleteSectionSpan = document.createElement("span");
  deleteItemsIcon.classList.add("bi", "bi-trash-fill");
  deleteItemsButton.classList.add("btn", "btn-danger");
  editItem.classList.add("d-flex", "p-3");
  deleteSectionSpan.classList.add("d-flex", "ms-auto");
  checkbox.classList.add("form-check-input", "align-self-center", "ms-2");
  checkbox.type = "checkbox";
  checkbox.addEventListener("change", editSelectAll);
  deleteItemsButton.addEventListener("click", editDeleteItems);
  deleteItemsButton.appendChild(deleteItemsIcon);
  deleteSectionSpan.appendChild(deleteItemsButton);
  deleteSectionSpan.appendChild(checkbox);
  editItem.appendChild(deleteSectionSpan);
  return editItem;
}

function populateEditView() {
  workingListCopy = currentList.slice(0);
  refreshEditList();
}

function refreshEditList() {
  editList.textContent = "";
  workingListCopy.forEach((e, i) => {
    let index = `${parseInt(i) + 1}.`;
    let text = e;
    let checkbox = document.createElement("input");
    let itemNameInput = document.createElement("input");
    let itemIndexLabel = document.createElement("div");
    let inputGroup = document.createElement("div");
    itemIndexLabel.classList.add("align-self-center", "me-2");
    inputGroup.classList.add("input-group");
    itemNameInput.classList.add("form-control", "rounded");
    itemNameInput.index = i;
    checkbox.classList.add("form-check-input", "rounded", "align-self-center", "ms-2");
    checkbox.addEventListener("change", editSelectSingle);
    itemNameInput.addEventListener("input", itemNameChange);
    itemIndexLabel.textContent = index;
    checkbox.value = i;
    itemNameInput.value = text;
    itemNameInput.type = "text";
    checkbox.type = "checkbox";
    let item = document.createElement("li");
    item.classList.add("list-group-item");
    inputGroup.appendChild(itemIndexLabel);
    inputGroup.appendChild(itemNameInput);
    inputGroup.appendChild(checkbox);
    item.appendChild(inputGroup);
    if ((workingListCopy.length - 1) == i) {
      item.classList.add("rounded-bottom");
    }
    editList.appendChild(item);
  })
  let editItem = createEditItem();
  editList.appendChild(editItem);
  editListNameInput.value = currentListName;
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
  if (!localStorage.list) { return };
  storageList.lists.forEach((e, index) => {
    addListViewOption(e.name, index);
  })
  loadListDropdown.disabled = false;
  loadListDropdown.value = currentListIndex;
}

function loadList(index) {
  if (index === undefined) {
    index = loadListDropdown.value;
  }
  currentList = storageList.lists[index].items;
  currentListName = storageList.lists[index].name;
  currentListGUID = storageList.lists[index].GUID;
  if (currentList.length > 0) { show(randomDialogue) };
  currentListIndex = index;
  refreshList();
}

function hide(element) {
  if (!element) { return };
  element.classList.add("hide");
}

function show(element) {
  if (!element) { return };
  element.classList.remove("hide");
}

function saveConfirm() {
  if (!currentListGUID) {
    currentListGUID = crypto.randomUUID();
  }
  if (listNameInput.value) {
    currentListName = listNameInput.value;
    save(currentListGUID, currentListName);
    listNameInput.value = currentListName;
    listNameInput.dispatchEvent(new Event('input', { bubbles: true }));
  }
}

function saveAbort() {
  if (currentListName) {
    listNameInput.value = currentListName;
    listNameInput.dispatchEvent(new Event('input', { bubbles: true }));
  } else {
    listNameInput.value = "";
    listNameInput.dispatchEvent(new Event('input', { bubbles: true }));
  }
}

function editCheckAll(value) {
  if (!value) {
    markForDeletion = [];
  } else {
    markForDeletion = "all";
  }
  if (!workingListCopy) { return };
  editList.childNodes.forEach((e, i) => {
    if (e.childNodes[0].childNodes[2] && e.childNodes[0].childNodes[2].classList.contains("form-check-input")) {
      e.childNodes[0].childNodes[2].checked = value;
    }
  });
}

// These are all event listeners
editConfirmButton.addEventListener("click", () => {
  currentList = workingListCopy;
  currentListName = editListNameInput.value;
  workingListCopy = undefined;
  save(currentListGUID, currentListName);
  hide(editView);
  show(mainListView);
  refreshList();
});

editAbortButton.addEventListener("click", () => {
  workingListCopy = undefined;
  hide(editView);
  show(mainListView);
});

listEditButton.addEventListener("click", () => {
  if (!currentListGUID) { return };
  populateEditView();
  hide(mainListView);
  show(editView);
});

saveConfirmButton.addEventListener("click", () => {
  saveConfirm();
});

saveAbortButton.addEventListener("click", () => {
  saveAbort();
});

listNameInput.addEventListener("input", () => {
  if (listNameInput.value != currentListName && listNameInput.value) {
    hide(listEditButton);
    show(saveConfirmButton);
    show(saveAbortButton);
  } else {
    show(listEditButton);
    hide(saveConfirmButton);
    hide(saveAbortButton);
  }
});

listNameInput.addEventListener("keyup", (ev) => {
  if (ev.key == "Enter") {
    saveConfirm();
  } else if (ev.key == "Escape") { saveAbort() };
})

randomDrawButton.addEventListener("click", () => {
  show(randomOutputField.parentElement);
  switch (randomTypeSelect.value) {
    case "random-true":
      randomOutputField.textContent = drawTrueRandom();
      break;
    case "random-hat":
      randomOutputField.textContent = drawFromHat();
      break;
  }
});

loadListDropdown.addEventListener("change", () => {
  if (loadListDropdown.value == "none") {
    loadListButton.disabled = true;
  } else {
    loadListButton.disabled = false;
  }
});

loadListButton.addEventListener("click", () => {
  loadList();
});

addToMainListInput.addEventListener("keyup", (ev) => {
  if (ev.key == "Escape") {
    addToMainListInput.value = "";
  }
})

addToMainListForm.addEventListener("submit", (e) => {
  e.preventDefault();
  addToMainList();
});

function editSelectAll(event) {
  editCheckAll(event.target.checked);
}

function editSelectSingle(event) {
  let index = parseInt(event.target.value);
  if (event.target.checked) {
    markForDeletion[index] = index;
  } else {
    markForDeletion[index] = null;
  }
}

function editDeleteItems() {
  if(markForDeletion = "all") {
    workingListCopy = [];
    refreshEditList();
    return;
  }
  tempArray = workingListCopy.slice(0);
  markForDeletion.forEach((e) => {
    if (e != null) {
      tempArray[e] = null;
    }
  })
  workingListCopy = [];
  tempArray.forEach((e) => {
    if (e != null) {
      workingListCopy.push(e);
    }
  })
  markForDeletion = [];
  refreshEditList();
}

function itemNameChange(event) {
  workingListCopy[event.target.index] = event.target.value;
}