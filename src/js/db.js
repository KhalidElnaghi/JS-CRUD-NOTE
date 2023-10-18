"use strict";

import {
  generateId,
  findNotebook,
  findNotebookIndex,
  findNote,
  findNoteIndex,
} from "./utils.js";

let noteDB = {};

const initDB = function () {
  const db = localStorage.getItem("noteDB");
  if (db) {
    noteDB = JSON.parse(db);
  } else {
    noteDB.notebooks = [];
    localStorage.setItem("noteDB", JSON.stringify(noteDB));
  }
};

const readDB = function () {
  noteDB = JSON.parse(localStorage.getItem("noteDB"));
};

const writeDB = function () {
  localStorage.setItem("noteDB", JSON.stringify(noteDB));
};

initDB();

export const db = {
  post: {
    notebooks(name) {
      readDB();
      const notebookData = {
        id: generateId(),
        name,
        notes: [],
      };

      noteDB.notebooks.push(notebookData);

      writeDB();

      return notebookData;
    },
    note(notebookId, object) {
      readDB();
      const notebook = findNotebook(noteDB, notebookId);
      const noteData = {
        id: generateId(),
        notebookId,
        ...object,
        postedOn: new Date().getTime(),
      };

      notebook.notes.unshift(noteData);

      writeDB();
      return noteData;
    },
  },

  get: {
    notebook() {
      readDB();
      return noteDB.notebooks;
    },
    note(notebookId) {
      readDB();
      const notebook = findNotebook(noteDB, notebookId);
      return notebook.notes;
    },
  },

  update: {
    notebook(notebookId, name) {
      readDB();
      const notebook = findNotebook(noteDB, notebookId);
      notebook.name = name;
      writeDB();
      return notebook;
    },
    note(noteId, object) {
      readDB();
      const oldNote = findNote(noteDB, noteId);
      const newNote = Object.assign(oldNote, object);
      writeDB();

      return newNote;
    },
  },

  delete: {
    notebook(notebookId) {
      readDB();
      const notebookIndex = findNotebookIndex(noteDB, notebookId);
      console.log(notebookIndex);
      noteDB.notebooks.splice(notebookIndex, 1);
      writeDB();
    },
    note(notebookId, noteId) {
      readDB();
      const notebook = findNotebook(noteDB, notebookId);
      const noteIndex = findNoteIndex(notebook, noteId);
      notebook.notes.splice(noteIndex, 1);
      writeDB();
      return notebook.notes;
    },
  },
};
