import { TOOLS, INITIAL_PARAMETERS } from "./const.js";
import { handleLoad, handleSave } from "./modals.js";

const canvas = document.getElementById("canvas");

const saveEl = document.getElementById("save");
const loadEl = document.getElementById("load");
const exportEl = document.getElementById("export");
const eraserEl = document.getElementById("eraser");
const brushEl = document.getElementById("brush");
const clearEl = document.getElementById("clear");
const sizeEl = document.getElementById("size");
const colorEl = document.getElementById("color");
const widthEl = document.getElementById("width");
const heightEl = document.getElementById("height");

const ctx = canvas.getContext("2d");

widthEl.value = INITIAL_PARAMETERS.width;
heightEl.value = INITIAL_PARAMETERS.height;
sizeEl.value = INITIAL_PARAMETERS.size;
colorEl.value = INITIAL_PARAMETERS.color;
brushEl.classList.add("selected");

export const app = {
  linesArray: [],

  parameters: {
    width: widthEl.value,
    height: heightEl.value,
    isMouseDown: false,
    size: sizeEl.value,
    color: colorEl.value,
    background: "#ffffff",
    lineCap: "round",
    lineJoin: "round",
    tool: TOOLS.brush,
  },

  changeTool(tool) {
    this.parameters.tool = tool;

    const handleRemoveSelectedClass = (el) => {
      el.classList.remove("selected");
    };

    if (tool === TOOLS.brush) {
      handleRemoveSelectedClass(eraserEl);
      brushEl.classList.add("selected");
    } else {
      handleRemoveSelectedClass(brushEl);
      eraserEl.classList.add("selected");
    }
  },

  getMousePos(canvas, evt) {
    const rect = canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top,
    };
  },

  createCanvas() {
    canvas.height = this.parameters.height;
    canvas.width = this.parameters.width;
    ctx.fillStyle = this.parameters.background;
    ctx.imageSmoothingEnabled = true;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  },

  redraw() {
    this.linesArray.forEach((line, idx) => {
      ctx.beginPath();
      ctx.moveTo(line.x, line.y);
      ctx.lineWidth = line.size;
      ctx.lineCap = this.parameters.lineCap;
      ctx.lineJoin = this.parameters.lineJoin;
      ctx.strokeStyle =
        line.tool === TOOLS.brush ? line.color : this.parameters.background;
      ctx.lineTo(this.linesArray[idx + 1]?.x, this.linesArray[idx + 1]?.y);
      ctx.stroke();
    });
  },

  resetParameters() {
    this.parameters = INITIAL_PARAMETERS;
  },

  clearAll() {
    this.linesArray = [];
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  },

  onMouseDown(canvas, evt) {
    const mousePos = this.getMousePos(canvas, evt);
    this.parameters.isMouseDown = true;
    const currentPosition = this.getMousePos(canvas, evt);
    ctx.beginPath();
    ctx.moveTo(currentPosition.x, currentPosition.y);
    ctx.lineWidth = this.parameters.size;
    ctx.lineCap = this.parameters.lineCap;
    ctx.lineJoin = this.parameters.lineJoin;
    ctx.strokeStyle =
      this.parameters.tool === TOOLS.brush
        ? this.parameters.color
        : this.parameters.background;
  },

  onMouseMove(canvas, evt) {
    if (this.parameters.isMouseDown) {
      const currentPosition = this.getMousePos(canvas, evt);
      ctx.lineTo(currentPosition.x, currentPosition.y);
      ctx.stroke();
      this.store(
        currentPosition.x,
        currentPosition.y,
        this.parameters.size,
        this.parameters.color,
        this.parameters.tool
      );
    }
  },

  onMouseUp() {
    this.parameters.isMouseDown = false;
    this.store();
  },

  store(x, y, s, c, t) {
    const line = {
      x,
      y,
      size: s,
      color: c,
      tool: t,
    };

    this.linesArray.push(line);
  },

  save() {
    handleSave({
      lines: this.linesArray,
      size: { width: this.parameters.width, height: this.parameters.height },
    });
  },

  load() {
    const handleLoading = ({ lines, size }) => {
      this.parameters.width = size.width;
      this.parameters.height = size.height;
      this.clearAll();
      this.linesArray = lines;
      this.createCanvas();
      this.redraw();
    };

    handleLoad(handleLoading);
  },

  export() {
    const img = canvas.toDataURL("image/png");
    exportEl.download = "image.png";
    exportEl.href = img;
  },
};

canvas.addEventListener("mousedown", function (evt) {
  app.onMouseDown(canvas, evt);
});

canvas.addEventListener("mousemove", function (evt) {
  app.onMouseMove(canvas, evt);
});

canvas.addEventListener("mouseup", function () {
  app.onMouseUp();
});

document.addEventListener("mouseup", function () {
  app.onMouseUp();
});

eraserEl.addEventListener("click", function () {
  app.changeTool(TOOLS.eraser);
});

brushEl.addEventListener("click", function () {
  app.changeTool(TOOLS.brush);
});

clearEl.addEventListener("click", function () {
  app.clearAll();
});

saveEl.addEventListener("click", function () {
  app.save();
});

loadEl.addEventListener("click", function () {
  app.load();
});

exportEl.addEventListener("click", function () {
  app.export();
});

sizeEl.addEventListener("change", function (evt) {
  app.parameters.size = evt.target.value;
});

colorEl.addEventListener("change", function (evt) {
  app.parameters.color = evt.target.value;
});

widthEl.addEventListener("change", function (evt) {
  app.parameters.width = evt.target.value;
  app.createCanvas();
  app.redraw();
});

heightEl.addEventListener("change", function (evt) {
  app.parameters.height = evt.target.value;
  app.createCanvas();
  app.redraw();
});
