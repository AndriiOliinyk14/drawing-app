/**
 * @jest-environment jsdom
 */

import fs from "fs";
import path from "path";
import { describe, expect, test, beforeEach, jest } from "@jest/globals";
import { TOOLS, INITIAL_PARAMETERS } from "../src/const";

const html = fs.readFileSync(path.resolve(__dirname, "../index.html"), "utf8");

const paths = [
  { x: 30, y: 40, size: 10, color: "#E71818", tool: "BRUSH" },
  {
    x: undefined,
    y: undefined,
    size: undefined,
    color: undefined,
    tool: undefined,
  },
];

const localStorageMock = (function () {
  let store = {};

  return {
    getItem(key) {
      return store[key];
    },

    setItem(key, value) {
      store[key] = value;
    },

    clear() {
      store = {};
    },

    removeItem(key) {
      delete store[key];
    },

    getAll() {
      return store;
    },
  };
})();

const alertMock = jest.fn();

beforeAll(() => {
  // Set up the DOM for testing
  document.documentElement.innerHTML = html.toString();
});

beforeEach(() => {
  const { app } = require("../src/app");

  app.clearAll();

  Object.defineProperty(window, "localStorage", { value: localStorageMock });
  Object.defineProperty(window, "alert", { value: alertMock });

  localStorage.clear();
});

describe("local storage", () => {
  it("should save project", () => {
    const { saveProject, loadProjects } = require("../src/ls");

    saveProject("image", paths);

    const projects = loadProjects();

    expect(projects).toEqual({
      image: paths,
    });

    saveProject("image", paths);

    expect(alertMock).toBeCalledWith(
      "This name already exists, please enter another name"
    );
  });

  it("should load project by name", () => {
    const { saveProject, loadProject } = require("../src/ls");

    expect(loadProject("image")).toBeUndefined();

    saveProject("image", paths);

    expect(loadProject("image")).toEqual(paths);
  });

  it("should remove all projects", () => {
    const {
      saveProject,
      loadProject,
      removeAllProjects,
    } = require("../src/ls");

    saveProject("image", paths);

    expect(loadProject("image")).toEqual(paths);

    removeAllProjects();

    expect(loadProject("image")).toBeUndefined();
  });
});
