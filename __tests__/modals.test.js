/**
 * @jest-environment jsdom
 */

import { describe, expect, it } from "@jest/globals";
import fs from "fs";
import path from "path";

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

const confirmMock = jest.fn(() => true);
const alertMock = jest.fn();
Object.defineProperty(window, "confirm", { value: confirmMock });
Object.defineProperty(window, "alert", { value: alertMock });

beforeAll(() => {
  // Set up the DOM for testing
  document.documentElement.innerHTML = html.toString();
});

beforeEach(() => {
  const { removeAllProjects } = require("../src/ls");

  removeAllProjects();
});

describe("modals", () => {
  it("should change modal title", () => {
    const { handleChangeModalTitle } = require("../src/modals");
    const modalTitleEl = document.getElementById("modal-title");

    expect(modalTitleEl.innerText).toBeUndefined();
    handleChangeModalTitle("Save project");

    expect(modalTitleEl.innerText).toEqual("Save project");

    handleChangeModalTitle("Load project");
    expect(modalTitleEl.innerText).toEqual("Load project");
  });

  it("should change modal visibility", () => {
    const { handleCloseModal, handleOpenModal } = require("../src/modals");
    const modalEl = document.getElementById("modal");

    handleOpenModal();
    expect(modalEl.style.visibility).toEqual("visible");

    handleCloseModal();
    expect(modalEl.style.visibility).toEqual("hidden");
  });

  it("should handle save modal", () => {
    const { handleSave, handleOpenModal } = require("../src/modals");

    handleOpenModal();
    handleSave(paths);

    const modalEl = document.getElementById("modal");
    const modalTitleEl = document.getElementById("modal-title");
    const modalContentEl = document.getElementById("modal-content");
    const inputEl = document.getElementsByClassName("modal-input")[0];
    const btnEl = document.getElementsByClassName("modal-btn")[0];

    expect(inputEl.value).toEqual("Untitled");
    expect(btnEl.innerText).toEqual("Save");
    expect(modalTitleEl.innerText).toEqual("Save project");
    expect(modalContentEl.children).toHaveLength(2);

    const btnMock = jest.spyOn(btnEl, "click");
    btnEl.click();

    expect(btnMock).toBeCalledTimes(1);
    expect(modalEl.style.visibility).toEqual("hidden");
  });

  it("should handle load modal", () => {
    const { handleLoad, handleSave } = require("../src/modals");
    const modalTitleEl = document.getElementById("modal-title");

    handleLoad(() => {});

    expect(modalTitleEl.innerText).toEqual("Not found projects");

    handleSave(paths);

    const getBtnModalEl = () => document.getElementsByClassName("modal-btn")[0];

    const btnEl = getBtnModalEl();
    btnEl.click();

    handleLoad((project) => expect(project).toEqual(paths));

    const modalListEl = document.getElementsByClassName("modal-load-list")[0];
    expect(modalListEl.children.length).toEqual(1);

    const modalListItemEl =
      document.getElementsByClassName("modal-load-item")[0];
    const btnItemEl = modalListItemEl.children.item(0);
    expect(btnItemEl.innerText).toEqual("Untitled");

    const btnItemMock = jest.spyOn(btnItemEl, "click");
    btnItemEl.click();

    expect(btnItemMock).toBeCalledTimes(1);

    const removeAllBtnEl = getBtnModalEl();
    expect(removeAllBtnEl.innerText).toEqual("Remove all projects");

    const removeAllBtnMock = jest.spyOn(removeAllBtnEl, "click");
    removeAllBtnEl.click();

    expect(removeAllBtnMock).toBeCalledTimes(1);
    expect(confirmMock).toBeCalledWith(
      "You really want to remove all projects"
    );
    expect(alertMock).toBeCalledWith("All projects have been deleted");
  });

  it("should listening click by modalCloser when DOMContentLoaded", () => {
    const { handleOpenModal } = require("../src/modals");
    handleOpenModal();

    const modalCloserEl = document.getElementById("modal-closer");

    const mockFn = jest.fn();

    modalCloserEl.addEventListener("click", mockFn);

    document.addEventListener("DOMContentLoaded", () => {
      modalCloserEl.click();
      expect(mockFn).toHaveBeenCalled();
    });
  });
});
