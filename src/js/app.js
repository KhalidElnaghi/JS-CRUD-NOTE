"use strict";

import {
  addEventOnElements,
  getGreetingMsg,
  activeNotebook,
  makeElemEditable,
} from "./utils.js";
import { Tooltip } from "./components/Tooltip.js";
import { db } from "./db.js";
import { client } from "./client.js";
import { NoteModal } from "./components/Modal.js";

const sidebar = document.querySelector("[data-sidebar]");
const sidebarTogglers = document.querySelectorAll("[data-sidebar-toggler]");
const overlay = document.querySelector("[data-sidebar-overlay]");

addEventOnElements(sidebarTogglers, "click", () => {
  sidebar.classList.toggle("active");
  overlay.classList.toggle("active");
});

//! greeting massage
const greetElement = document.querySelector("[data-greeting]");
const currentHour = new Date().getHours();
greetElement.textContent = getGreetingMsg(currentHour);

//! Initialize Tooltip behavior for all DOM elements with a "data-tooltip" attribute.
const tooltipElements = document.querySelectorAll("[data-tooltip]");
tooltipElements.forEach((elem) => {
  Tooltip(elem);
});

//!  Show current date on homepage
const currentDateElement = document.querySelector("[data-current-date]");
currentDateElement.textContent = new Date().toDateString().replace(" ", ",");

//! Notebook create field
const sidebarList = document.querySelector("[data-sidebar-list]");
const addNotebookBtn = document.querySelector("[data-add-notebook]");

const showNotebookField = () => {
  const navItem = document.createElement("div");
  navItem.classList.add("nav-item");
  navItem.innerHTML = `
    <span class="text text-label-large" data-notebook-field></span>
    <button
      class="icon-btn small"
      aria-label="Edit notebook"
      data-tooltip="Edit notebook"
      data-edit-btn
    >
      <span class="material-symbols-rounded" aria-hidden="true">edit</span>
      <div class="state-layer"></div>
    </button>
    <button
      class="icon-btn small"
      aria-label="Delete notebook"
      data-tooltip="Delete notebook"
      data-delete-btn
    >
      <span class="material-symbols-rounded" aria-hidden="true">delete</span>
      <div class="state-layer"></div>
    </button>
    <div class="state-layer"></div>
  `;

  sidebarList.appendChild(navItem);

  const navItemField = navItem.querySelector("[data-notebook-field]");

  activeNotebook.call(navItem);

  makeElemEditable(navItemField);

  navItemField.addEventListener("keydown", createNotebook);
};

addNotebookBtn.addEventListener("click", showNotebookField);

//! create new notebook
const createNotebook = function (event) {
  if (event.key === "Enter") {
    const notebookData = db.post.notebooks(this.textContent || "Untitled");
    this.parentElement.remove();

    client.notebook.create(notebookData);
  }
};

//!render the existed notebooks in the localstorage and ui
const renderExistedNotebook = function () {
  const notebookList = db.get.notebook();

  client.notebook.read(notebookList);
};

renderExistedNotebook();

//! create new note in the notebbok
const noteCreateBtns = document.querySelectorAll("[data-note-create-btn");

addEventOnElements(noteCreateBtns, "click", function () {
  //*   create and open new modal

  const modal = NoteModal();
  modal.open();

  // handle submission of new note to the database and ui
  modal.onSubmit((noteObj) => {
    const activeNotebookId = document.querySelector("[data-notebook].active").dataset
      .notebook;

    const noteData = db.post.note(activeNotebookId, noteObj);

    client.note.create(noteData);

    modal.close();
  });
});

//!render the existed notes in the localstorage and ui
const renderExistedNote = function () {
  const activeNotebookId = document.querySelector("[data-notebook].active").dataset
    .notebook;
  if (activeNotebookId) {
    const noteList = db.get.note(activeNotebookId);

    client.note.read(noteList);
  }
};

renderExistedNote();
