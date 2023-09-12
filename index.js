const loadListButton = document.getElementById("load-list-button");
const loadListDropdown = document.getElementById("load-list-dropdown");
const mainList = document.getElementById("main-list");
const addToMainListInput = document.getElementById("add-to-main-list-input");
const addToMainListForm = document.getElementById("add-to-main-list-form");
const randomDialogue = document.getElementById("random-dialogue");
const randomDrawButton = document.getElementById("random-draw-button");
const randomOutputField = document.getElementById("random-output-field");
const randomSequenceOutputField = document.getElementById("random-sequence-output-field");
const randomSequencePositionInput = document.getElementById("random-sequence-position-input");
const sequenceOutput = document.getElementById("sequence-output");
const randomOutputTextField = document.getElementById("random-output-text-field");
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
const newListButton = document.getElementById("new-list-button");
const themeToggle = document.getElementById("theme-toggle");
const randomView = document.getElementById("random-view");
const openRandomViewButton = document.getElementById("open-random-view-button");
const closeRandomViewButton = document.getElementById("close-random-view-button");
const generateSequenceToggle = document.getElementById("generate-sequence-toggle");
const randomSequenceLengthInput = document.getElementById("random-sequence-length-input");
const randomSequenceDrawButton = document.getElementById("random-sequence-draw-button");
const randomSequenceNextButton = document.getElementById("random-sequence-next-button");
const randomSequencePrevButton = document.getElementById("random-sequence-prev-button");
const randomIncludeSelectList = document.getElementById("random-include-select-list");
const randomIncludeSelectAllCheckbox = document.getElementById("random-include-select-all-checkbox");

const SAVING_PROTOCOL_VERSION = "1.0";

var storageList = { lists: [] };
var currentList = [];
var currentListName = "";
var currentListGUID;
var currentListIndex = "none";
var currentHat;
var currentHatSize;
var workingListCopy;
var currentRandomSelection = [];
var currentRandomSequence = [];
var currentRandomSequencePosition = 0;

init();


function init() {
  initTheme();
  registerDefaultEventListeners();
  loadListDropdown.value = "none";
  loadListButton.disabled = true;
  listNameInput.value = "";
  listEditButton.disabled = true;
  randomTypeSelect.value = "random-hat";
  openRandomViewButton.disabled = true;
  generateSequenceToggle.checked = false;
  randomSequenceLengthInput.value = "1";
  randomSequencePositionInput.value = "";
  parseStorageList();

  //FOR DEVELOPMENT PURPOSES
  doDevSetup();
}

function doDevSetup() {
  loadList(0);
  showRandomView();
}

function registerDefaultEventListeners() {
  addToMainListForm.addEventListener("submit", addToMainListFormSubmitListener);
  addToMainListInput.addEventListener("keyup", addToMainListFormKeyListener)
  loadListButton.addEventListener("click", loadListButtonClickListener);
  loadListDropdown.addEventListener("change", loadListDropdownChangeListener);
  randomDrawButton.addEventListener("click", randomDrawButtonClickListener);
  listNameInput.addEventListener("keyup", listNameInputKeyListener);
  listNameInput.addEventListener("input", listNameInputInputListener);
  saveAbortButton.addEventListener("click", doSaveAbort);
  saveConfirmButton.addEventListener("click", doSaveConfirm);
  listEditButton.addEventListener("click", doEditList);
  editAbortButton.addEventListener("click", doEditAbort);
  editConfirmButton.addEventListener("click", doEditConfirm);
  newListButton.addEventListener("click", createNewList);
  themeToggle.addEventListener("change", toggleTheme);
  openRandomViewButton.addEventListener("click", showRandomView);
  closeRandomViewButton.addEventListener("click", hideRandomView);
  generateSequenceToggle.addEventListener("change", toggleRandomSequenceGeneration);
  randomSequenceDrawButton.addEventListener("click", drawRandomSequence);
  randomSequencePositionInput.addEventListener("keypress", randomSequencePositionInputChanged);
  randomSequencePositionInput.addEventListener("change", randomSequencePositionEntered);
  randomSequenceNextButton.addEventListener("click", randomSequenceNext);
  randomSequencePrevButton.addEventListener("click", randomSequencePrev);
  randomSequenceLengthInput.parentElement.addEventListener("keypress", randomSequenceSubmit);
  randomIncludeSelectAllCheckbox.addEventListener("click", randomIncludeSelectAll)
}

function initTheme() {
  themeToggle.checked = localStorage.theme != "light";
  if (!localStorage.theme) {
    localStorage.theme = "dark";
  }
  setTheme(localStorage.theme);
}

function generateRandomSequence(amount, randomFunction) {
  if (!amount || isNaN(amount)) { return };
  let tempArray = [];
  for (i = 0; i < amount; i++) {
    tempArray.push(randomFunction());
  }
  return tempArray;
}

function drawFromHat() {
  if (!currentHat || currentHatSize != currentRandomSelection.length) {
    currentHat = currentRandomSelection.slice(0);
    currentHatSize = currentRandomSelection.length;
  } else if (!currentRandomSelection) { return }
  let randomNum = randomInt(currentHat.length);
  let randomItem = currentHat[randomNum];
  currentHat.splice(randomNum, 1);
  if (currentHat.length < 1) {
    currentHat = currentRandomSelection.slice(0);
    currentHatSize = currentRandomSelection.length;
  }
  return randomItem;
}


function drawTrueRandom() {
  if (!currentRandomSelection) { return }
  let index = randomInt(currentRandomSelection.length);
  let item = currentRandomSelection[index];
  return item;
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
    if (storageList.lists[i].GUID === UID) {
      return i;
    }
  }
}

function updateRandomSequenceDisplay() {
  if (!currentRandomSequence.length > 0) { return }
  let last;
  let current;
  let next;
  sequenceOutput.childNodes[1].textContent = "";
  sequenceOutput.childNodes[2].textContent = "";
  sequenceOutput.childNodes[3].textContent = "";
  if (currentRandomSequencePosition > 0) {
    last = `${currentRandomSequencePosition}. ${currentRandomSequence[currentRandomSequencePosition - 1]}`
    sequenceOutput.childNodes[1].textContent = last;
  }
  if (currentRandomSequencePosition < currentRandomSequence.length - 1) {
    next = `${currentRandomSequencePosition + 2}. ${currentRandomSequence[currentRandomSequencePosition + 1]}`
    sequenceOutput.childNodes[3].textContent = next;
  }
  current = `${currentRandomSequencePosition + 1}. ${currentRandomSequence[currentRandomSequencePosition]}`
  sequenceOutput.childNodes[2].textContent = current;
  randomSequencePositionInput.value = currentRandomSequencePosition + 1;
}

function saveToLocalStorage(lists) {
  localStorage.savingProtocolVersion = SAVING_PROTOCOL_VERSION;
  localStorage.list = JSON.stringify(lists);
}

function deleteList(listUID) {
  let temp = storageList.lists.slice(0);
  storageList.lists.forEach((e, i) => {
    if (e.GUID === listUID) {
      temp.splice(i);
    }
  })
  return { lists: temp };
}

function save(listUID, name) {
  if (!currentListGUID) {
    currentListGUID = listUID;
  }
  let list = findListIndex(listUID);
  if (list != undefined && !isNaN(list)) {
    storageList.lists[list].items = currentList;
    storageList.lists[list].name = name;
  } else {
    storageList.lists.push({
      GUID: listUID,
      name: listNameInput.value,
      items: currentList
    });
  }
  saveToLocalStorage(storageList);
  let newIndex = findListIndex(currentListGUID);
  if (!isNaN(newIndex) && newIndex != undefined) {
    currentListIndex = newIndex;
  }
  if (currentListGUID) {
    listEditButton.disabled = false;
    openRandomViewButton.disabled = false;
  } else {
    listEditButton.disabled = true;
    openRandomViewButton.disabled = true;
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
  refreshList();

}

function addListViewOption(text, value) {
  if (!text || isNaN(value) || value === undefined) { return };
  let listOption = document.createElement('option');
  let optionText = document.createTextNode(text);
  listOption.value = value;
  listOption.append(optionText);
  loadListDropdown.appendChild(listOption);
}

function refreshList() {
  if (currentListGUID) {
    listEditButton.disabled = false;
    openRandomViewButton.disabled = false;
  } else {
    listEditButton.disabled = true;
    openRandomViewButton.disabled = true;
  }
  loadListDropdown.value = currentListIndex;
  mainList.textContent = '';
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
  let deleteListButton = document.createElement("button");
  deleteItemsIcon.classList.add("bi", "bi-trash-fill");
  deleteItemsButton.classList.add("btn", "btn-danger");
  deleteListButton.classList.add("btn", "btn-warning", "ms-auto", "fixed-width-button-xl");
  deleteListButton.textContent = "Delete list"
  deleteListButton.value = "0";
  editItem.classList.add("d-flex", "p-3");
  deleteSectionSpan.classList.add("d-flex", "ms-auto");
  checkbox.classList.add("form-check-input", "align-self-center", "ms-2");
  checkbox.type = "checkbox";
  checkbox.addEventListener("change", editSelectAll);
  deleteItemsButton.addEventListener("click", editDeleteItems);
  deleteListButton.addEventListener("click", editDeleteList);
  deleteItemsButton.appendChild(deleteItemsIcon);
  deleteSectionSpan.appendChild(deleteItemsButton);
  deleteSectionSpan.appendChild(checkbox);
  editItem.appendChild(deleteListButton);
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
    let item = document.createElement("li");
    item.addEventListener("click", editListItemClickListener)
    itemIndexLabel.classList.add("align-self-center", "me-2", "no-select");
    inputGroup.classList.add("input-group");
    itemNameInput.classList.add("form-control", "rounded");
    itemNameInput.index = i;
    checkbox.classList.add("form-check-input", "rounded", "align-self-center", "ms-2");
    itemNameInput.addEventListener("input", itemNameChange);
    itemIndexLabel.textContent = index;
    checkbox.value = i;
    itemNameInput.value = text;
    itemNameInput.type = "text";
    checkbox.type = "checkbox";
    item.classList.add("list-group-item");
    item.classList.add("edit-list-item-selectable");
    inputGroup.appendChild(itemIndexLabel);
    inputGroup.appendChild(itemNameInput);
    inputGroup.appendChild(checkbox);
    item.appendChild(inputGroup);
    if ((workingListCopy.length - 1) === i) {
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

function createNewList() {
  currentList = [];
  currentListIndex = "none";
  currentListName = "";
  currentListGUID = undefined;
  loadListDropdown.value = "none";
  loadListButton.disabled = true;
  hide(saveAbortButton);
  hide(saveConfirmButton);
  show(listEditButton);
  show(openRandomViewButton);
  refreshList();
  hideRandomView();
}

function parseStorageList() {
  if (localStorage.savingProtocolVersion) {
    console.log(`Loaded from local storage with saving protocol version: ${localStorage.savingProtocolVersion}`)
  } else if (localStorage.list) {
    console.log(`Loaded from local storage with unknown saving protocol version.`);
  } else {
    console.log(`Local storage did not have any lists saved.`);
  }
  populateListDefaults();
  if (localStorage.list) {
    storageList = JSON.parse(localStorage.list);
  } else { return; }
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
  hide(randomView);
  showMainListView();
  currentList = storageList.lists[index].items;
  currentListName = storageList.lists[index].name;
  currentListGUID = storageList.lists[index].GUID;
  currentListIndex = index;
  show(listEditButton);
  show(openRandomViewButton);
  hide(saveConfirmButton);
  hide(saveAbortButton);
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

function doSaveConfirm() {
  if (!currentListGUID || currentListGUID === undefined) {
    currentListGUID = crypto.randomUUID();
  }

  if (listNameInput.value) {
    currentListName = listNameInput.value;
    save(currentListGUID, currentListName);
    listNameInput.value = currentListName;
    listNameInput.dispatchEvent(new Event('input', { bubbles: true }));
  }
}

function doSaveAbort() {
  if (currentListName) {
    listNameInput.value = currentListName;
    listNameInput.dispatchEvent(new Event('input', { bubbles: true }));
  } else {
    listNameInput.value = "";
    listNameInput.dispatchEvent(new Event('input', { bubbles: true }));
  }
}

function editCheckAll(value) {
  if (!workingListCopy) { return };
  editList.childNodes.forEach((e, i) => {
    if (e.childNodes[0].childNodes[2] && e.childNodes[0].childNodes[2].classList.contains("form-check-input")) {
      e.childNodes[0].childNodes[2].checked = value;
    }
  });
}

function hideEditView() {
  hide(editView);
  show(mainListView);
}

function showMainListView() {
  hide(editView);
  show(mainListView);
}

function setTheme(mode) {
  document.getElementById("html-element").setAttribute("data-bs-theme", mode);
}

function toggleTheme() {
  let mode;
  if (themeToggle.checked) {
    mode = "dark";
  } else {
    mode = "light";
  }
  localStorage.theme = mode;
  setTheme(mode);
}

function doEditConfirm() {
  currentList = workingListCopy;
  currentListName = editListNameInput.value;
  workingListCopy = undefined;
  save(currentListGUID, currentListName);
  showMainListView()
  refreshList();
}

function doEditAbort() {
  workingListCopy = undefined;
  showEditView();
}

function doEditList() {
  if (!currentListGUID) { return };
  populateEditView();
  hide(mainListView);
  show(editView);
}

function listNameInputInputListener() {
  if (listNameInput.value != currentListName && listNameInput.value) {
    hide(listEditButton);
    hide(openRandomViewButton);
    show(saveConfirmButton);
    show(saveAbortButton);
  } else {
    show(listEditButton);
    show(openRandomViewButton);
    hide(saveConfirmButton);
    hide(saveAbortButton);
  }
}

function listNameInputKeyListener(ev) {
  if (ev.key === "Enter") {
    doSaveConfirm();
  } else if (ev.key === "Escape") { doSaveAbort() };
}

function randomDrawButtonClickListener() {
  switch (randomTypeSelect.value) {
    case "random-true":
      randomOutputTextField.textContent = drawTrueRandom();
      break;
    case "random-hat":
      randomOutputTextField.textContent = drawFromHat();
      break;
  }
}

function loadListDropdownChangeListener() {
  if (loadListDropdown.value === "none") {
    loadListButton.disabled = true;
  } else {
    loadListButton.disabled = false;
  }
}

function loadListButtonClickListener() {
  loadList();
}

function addToMainListFormKeyListener(ev) {
  if (ev.key === "Escape") {
    addToMainListInput.value = "";
  }
}

function addToMainListFormSubmitListener(e) {
  e.preventDefault();
  addToMainList();
}

function editSelectAll(event) {
  editCheckAll(event.target.checked);
}

function editDeleteItems() {
  let markForDeletion = [];
  editList.childNodes.forEach((e, i) => {
    if (e.classList.contains("edit-list-item-selectable") && e.childNodes[0].childNodes[2].checked) {
      markForDeletion.push(i);
    }
  })
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
  refreshEditList();
}

function itemNameChange(event) {
  workingListCopy[event.target.index] = event.target.value;
}

function editDeleteList(event) {
  let btn = event.target;
  if (btn.value === "0") {
    btn.classList.remove("btn-warning");
    btn.classList.add("btn-danger");
    btn.textContent = "For realsies?"
    btn.value = "1";
    return;
  }
  let newList = deleteList(currentListGUID);
  saveToLocalStorage(newList);
  parseStorageList();
  createNewList();
  showMainListView();
}

function showRandomView() {
  populateRandomItemSelect();
  hide(mainListView);
  show(randomView);
}

function hideRandomView() {
  hide(randomView);
  show(mainListView);
}

function showRandomSequence() {
  hide(randomDrawButton);
  randomTypeSelect.classList.add("rounded-end");
  hide(randomOutputField);
  show(randomSequenceOutputField);
}

function populateRandomItemSelect() {
  currentRandomSelection = currentList.slice(0);
  randomIncludeSelectList.textContent = "";
  randomIncludeSelectAllCheckbox.checked = true;
  currentList.forEach((e, i) => {
    let item = document.createElement("li");
    let index = `${parseInt(i) + 1}.`;
    let text = e;
    let checkbox = document.createElement("input");
    let itemIndexLabel = document.createElement("div");
    let inputGroup = document.createElement("div");
    itemIndexLabel.classList.add("align-self-center", "no-select", "me-2");
    inputGroup.classList.add("input-group", "my-1");
    checkbox.classList.add("form-check-input", "rounded", "align-self-center", "ms-auto");
    checkbox.addEventListener("click", randomIncludeItemClicked)
    itemIndexLabel.textContent = index;
    checkbox.value = i;
    itemLabel = document.createElement("span");
    itemLabel.classList.add("no-select");
    itemLabel.textContent = text;
    checkbox.type = "checkbox";
    checkbox.checked = "true";
    item.classList.add("list-group-item");
    inputGroup.appendChild(itemIndexLabel);
    inputGroup.appendChild(itemLabel);
    inputGroup.appendChild(checkbox);
    item.appendChild(inputGroup);
    if ((currentList.length - 1) === i) {
      item.classList.add("rounded-bottom");
    }
    randomIncludeSelectList.appendChild(item);

  })
}

function hideRandomSequence() {
  hide(randomSequenceOutputField);
  randomTypeSelect.classList.remove("rounded-end");
  show(randomDrawButton);
  show(randomOutputField);
}

function toggleRandomSequenceGeneration(event) {
  let toggle = event.target;
  if (toggle.checked) {
    showRandomSequence();
  } else {
    hideRandomSequence();
  }
}

function drawRandomSequence() {
  let randFunc;
  if (randomTypeSelect.value === "random-true") {
    randFunc = drawTrueRandom;
  } else {
    randFunc = drawFromHat;
  }
  currentRandomSequence = generateRandomSequence(randomSequenceLengthInput.value, randFunc);
  currentRandomSequencePosition = 0;
  randomSequencePositionInput.value = 0;
  updateRandomSequenceDisplay();
}

function randomSequencePositionInputChanged(event) {
  if (isNaN(event.key)) {
    event.preventDefault();
  }
}

function randomSequencePositionEntered(event) {
  let targetIndex = event.target.value - 1;
  if (targetIndex > currentRandomSequence.length - 1 || targetIndex < 0) {
    event.target.value = currentRandomSequencePosition + 1;
  } else {
    currentRandomSequencePosition = targetIndex;
    updateRandomSequenceDisplay();
  }
}

function randomSequenceNext() {
  if (currentRandomSequencePosition < currentRandomSequence.length - 1) {
    currentRandomSequencePosition++;
  }
  updateRandomSequenceDisplay();
}

function randomSequencePrev() {
  if (currentRandomSequencePosition - 1 >= 0) {
    currentRandomSequencePosition--;
  }
  updateRandomSequenceDisplay();
}

function randomSequenceSubmit(event) {
  console.log(event.key)
  if (event.key === "Enter") {
    drawRandomSequence();
  }
}

function randomIncludeSelectAll(el) {
  let value = el.target.checked;
  if (!value) {
    currentRandomSelection = [];
  } else {
    currentRandomSelection = currentList.slice(0);
  }
  randomIncludeSelectList.childNodes.forEach((e) => {
    let checkbox = e.childNodes[0].childNodes[2];
    if (checkbox) {
      checkbox.checked = value;
    }
  })
}

function editListItemClickListener(e) {
  let checkbox;
  console.log(e.target.nodeName)
  if(e.target.nodeName === "div" && !e.target.nodeName.classList.contains("input-group")) {
    checkbox = e.target.parentElement.childNodes[2];
  } else if (e.target.nodeName === "DIV" && e.target.classList.contains("input-group")) {
    checkbox = e.target.childNodes[2];
  } else if (e.target.nodeName === "LI") {
    checkbox = e.target.childNodes[0].childNodes[2];
  } else {
    return;
  }
  checkbox.checked = !checkbox.checked;
}

function randomIncludeItemClicked(e) {
  let index = parseInt(e.target.parentElement.childNodes[0].textContent.split(".")[0]) - 1;
  let value = e.target.checked;
  if (value) {
    currentRandomSelection.splice(index, 0, currentList[index]);
  } else {
    currentRandomSelection.splice(index, 1);
  }
}