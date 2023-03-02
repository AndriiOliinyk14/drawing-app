/**
 * @jest-environment jsdom
 */

import fs from "fs";
import path from "path";
import { describe, expect, beforeEach } from "@jest/globals";
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

beforeAll(() => {
  // Set up the DOM for testing
  document.documentElement.innerHTML = html.toString();
});

beforeEach(() => {
  const { app } = require("../src/app");

  app.clearAll();
});

describe("application", () => {
  it("should change tool", () => {
    const { app } = require("../src/app");

    const brushEl = document.getElementById("brush");
    const eraserEl = document.getElementById("eraser");

    const brushMockFn = jest.fn();
    const eraserMockFn = jest.fn();

    brushEl.addEventListener("click", brushMockFn);
    brushEl.click();

    expect(brushMockFn).toBeCalled();
    expect(app.parameters.tool).toBe(TOOLS.brush);

    app.changeTool(TOOLS.eraser);

    eraserEl.addEventListener("click", eraserMockFn);
    eraserEl.click();

    expect(eraserMockFn).toBeCalled();
    expect(app.parameters.tool).toBe(TOOLS.eraser);
  });

  it("should get mouse position", () => {
    const { app } = require("../src/app");

    const canvas = document.getElementById("canvas");

    const eventData = {
      clientX: 10,
      clientY: 10,
    };

    expect(app.getMousePos(canvas, eventData)).toEqual({ x: 10, y: 10 });
  });

  it("should render canvas", () => {
    const { app } = require("../src/app");

    app.createCanvas();

    const canvas = document.getElementById("canvas");

    expect(canvas).toBeTruthy();
    expect(canvas.width).toEqual(INITIAL_PARAMETERS.width);
    expect(canvas.height).toEqual(INITIAL_PARAMETERS.height);
  });

  it("should reset to default parameters", () => {
    const { app } = require("../src/app");

    app.changeTool(TOOLS.eraser);

    expect(app.parameters.tool).toEqual(TOOLS.eraser);

    app.resetParameters();

    expect(app.parameters.tool).toEqual(TOOLS.brush);
    expect(app.parameters).toBe(INITIAL_PARAMETERS);
  });

  it("should draw", () => {
    const { app } = require("../src/app");

    app.createCanvas();

    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");

    const eventDataDown = {
      clientX: 10,
      clientY: 10,
    };

    const eventDataMove = {
      clientX: paths[0].x,
      clientY: paths[0].y,
    };

    app.onMouseDown(canvas, eventDataDown);
    app.onMouseMove(canvas, eventDataMove);
    app.onMouseUp();

    expect(paths).toStrictEqual(app.linesArray);
  });

  it("should clear all", () => {
    const { app } = require("../src/app");

    app.createCanvas();

    const canvas = document.getElementById("canvas");

    const eventDataDown = {
      clientX: 10,
      clientY: 10,
    };

    const eventDataMove = {
      clientX: paths[0].x,
      clientY: paths[0].y,
    };

    app.onMouseDown(canvas, eventDataDown);
    app.onMouseMove(canvas, eventDataMove);
    app.onMouseUp();

    expect(paths).toStrictEqual(app.linesArray);
    expect(app.linesArray).toHaveLength(paths.length);

    app.clearAll();

    expect(app.linesArray).toHaveLength(0);
  });

  it("should redraw", () => {
    const { app } = require("../src/app");

    app.createCanvas();

    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");

    app.linesArray = paths;
    app.redraw();

    expect(ctx.moveTo).toBeCalledWith(paths[0].x, paths[0].y);
    expect(app.linesArray).toStrictEqual(paths);
  });

  it("should call save function", () => {
    const { app } = require("../src/app");
    const mockFc = jest.spyOn(app, "save");

    const saveEl = document.getElementById("save");

    saveEl.click();

    expect(mockFc).toBeCalledTimes(1);
  });

  it("should call load function", () => {
    const { app } = require("../src/app");
    const mockFc = jest.spyOn(app, "load");

    const loadEl = document.getElementById("load");

    loadEl.click();

    expect(mockFc).toBeCalledTimes(1);
  });

  it("should call export function", () => {
    const { app } = require("../src/app");
    const mockFc = jest.spyOn(app, "export");

    const exportEl = document.getElementById("export");

    exportEl.click();

    expect(mockFc).toBeCalledTimes(1);
  });
});

describe("DOM Event", () => {
  it("should listening mousedown event", () => {
    const mockFn = jest.fn();

    const canvas = document.getElementById("canvas");

    canvas.addEventListener("mousedown", mockFn);

    const event = new MouseEvent("mousedown", {
      bubbles: true,
      cancelable: true,
      view: window,
    });

    canvas.dispatchEvent(event);

    expect(mockFn).toHaveBeenCalled();
  });

  it("should listening mouseup of canvas event", () => {
    const mockFn = jest.fn();

    const canvas = document.getElementById("canvas");

    canvas.addEventListener("mouseup", mockFn);

    const event = new MouseEvent("mouseup", {
      bubbles: true,
      cancelable: true,
      view: window,
    });

    canvas.dispatchEvent(event);

    expect(mockFn).toHaveBeenCalled();
  });

  it("should listening mouseup of document event", () => {
    const mockFn = jest.fn();

    document.addEventListener("mouseup", mockFn);

    const event = new MouseEvent("mouseup", {
      bubbles: true,
      cancelable: true,
      view: window,
    });

    document.dispatchEvent(event);

    expect(mockFn).toHaveBeenCalled();
  });

  it("should listening mousemove event", () => {
    const mockFn = jest.fn();

    const canvas = document.getElementById("canvas");

    canvas.addEventListener("mousemove", mockFn);

    const event = new MouseEvent("mousemove", {
      bubbles: true,
      cancelable: true,
      view: window,
      clientX: 100,
      clientY: 200,
    });




    canvas.dispatchEvent(event);

    expect(mockFn).toHaveBeenCalled();
  });

  it("should be clicked on clear button", () => {
    const mockFn = jest.fn();

    const button = document.getElementById("clear");

    button.addEventListener("click", mockFn);

    button.click();

    expect(mockFn).toHaveBeenCalled();
  });
});
