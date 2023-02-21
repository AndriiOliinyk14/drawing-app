/**
 * @jest-environment jsdom
 */

import fs from "fs";
import path from "path";
import { describe, expect, test, beforeEach, jest } from "@jest/globals";
import { TOOLS, INITIAL_PARAMETERS } from "../src/const";

const html = fs.readFileSync(path.resolve(__dirname, "../index.html"), "utf8");

beforeAll(() => {
  // Set up the DOM for testing
  document.documentElement.innerHTML = html.toString();
});

it("should change tool", () => {
  const { app } = require("../src/app");

  app.changeTool(TOOLS.brush);

  expect(app.parameters.tool).toBe(TOOLS.brush);

  app.changeTool(TOOLS.eraser);

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

  //fix it

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

  const mock = [
    { x: 30, y: 40, size: 10, color: "#E71818", tool: "BRUSH" },
    {
      x: undefined,
      y: undefined,
      size: undefined,
      color: undefined,
      tool: undefined,
    },
  ];

  const eventDataDown = {
    clientX: 10,
    clientY: 10,
  };

  const eventDataMove = {
    clientX: mock[0].x,
    clientY: mock[0].y,
  };

  app.onMouseDown(canvas, eventDataDown);
  app.onMouseMove(canvas, eventDataMove);
  app.onMouseUp();

  expect(mock).toStrictEqual(app.linesArray);
  //check canvas
});
