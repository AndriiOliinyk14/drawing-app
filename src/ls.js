import { LS_KEY } from "./const.js";

export const saveProject = (name, item) => {
  const prevImages = localStorage.getItem(LS_KEY)
    ? JSON.parse(localStorage.getItem(LS_KEY))
    : {};

  if (prevImages && Object.keys(prevImages).includes(name)) {
    alert("This name already exists, please enter another name");
    return false;
  }

  localStorage.setItem(LS_KEY, JSON.stringify({ ...prevImages, [name]: item }));

  return true;
};

export const loadProjects = () => {
  return localStorage.getItem(LS_KEY)
    ? JSON.parse(localStorage.getItem(LS_KEY))
    : {};
};

export const loadProject = (item) => {
  const images = loadProjects();

  if (images[item]) {
    return images[item];
  } else {
    alert("Project not found");
  }
};

export const removeAllProjects = () => {
  localStorage.removeItem(LS_KEY);
};
