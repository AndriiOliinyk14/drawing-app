import { saveProject, loadProjects, removeAllProjects } from "./ls.js";

const modal = document.getElementById("modal");
const modalTitle = document.getElementById("modal-title");
const modalContent = document.getElementById("modal-content");
const modalCloser = document.getElementById("modal-closer");

export const handleChangeModalTitle = (value) => {
  modalTitle.innerText = value;
};

export const handleOpenModal = (value) => {
  modal.style.visibility = "visible";
};

export const handleCloseModal = () => {
  modal.style.visibility = "hidden";
};

const handleClearModalContent = () => {
  modalContent.replaceChildren();
};

export const handleSave = (data) => {
  handleClearModalContent();
  const inputEl = document.createElement("input");
  const btnEl = document.createElement("button");

  inputEl.value = "Untitled";
  inputEl.className = "modal-input";

  btnEl.className = "modal-btn";
  btnEl.innerText = "Save";

  handleOpenModal();
  handleChangeModalTitle("Save project");

  const content = [inputEl, btnEl];

  modalContent.replaceChildren(...content);

  btnEl.addEventListener("click", () => {
    const name = inputEl.value.trim();

    if (saveProject(name, data)) {
      handleCloseModal();
    }
  });
};

export const handleLoad = (callback) => {
  handleClearModalContent();
  handleOpenModal();
  handleChangeModalTitle("Projects");

  let projects = loadProjects();

  const listContainer = document.createElement("ul");
  const removeAllBtn = document.createElement("button");

  removeAllBtn.innerText = "Remove all projects";
  removeAllBtn.className = "modal-btn";
  listContainer.className = "modal-load-list";

  if (!Object.keys(projects).length) {
    handleChangeModalTitle("Not found projects");
    return;
  }

  const renderList = () => {
    const items = Object.keys(projects).map((key) => {
      const li = document.createElement("li");
      li.className = "modal-load-item";
      const btn = document.createElement("button");

      btn.addEventListener("click", () => {
        callback(projects[key]);
        handleCloseModal();
      });

      btn.innerText = key;
      li.replaceChildren(btn);
      return li;
    });

    listContainer.replaceChildren(...items);
  };

  removeAllBtn.addEventListener("click", () => {
    if (window.confirm("You really want to remove all projects")) {
      removeAllProjects();
      alert("All projects have been deleted");
      handleCloseModal();
    }
  });

  renderList();

  modalContent.append(...[listContainer, removeAllBtn]);
};

document.addEventListener("DOMContentLoaded", () => {
  modalCloser.addEventListener("click", handleCloseModal);
});
