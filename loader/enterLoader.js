import { app } from "../../../../scripts/app.js";
import BluePrints from "./blueprints.js";
import IconRenderer from "./components/public/iconRenderer.js";
function getPage() {
  return document.getElementById("loader_iframe");
}

function loadPage(){
  let page = getPage();
  if(page) return page;
  window.removeEventListener("message", message);
  var realpath = "/cs/loader/index.html";
  const html = `<iframe id="loader_iframe" src="${realpath}" frameborder="0"></iframe>`;
  document.body.insertAdjacentHTML("beforeend", html);
  page = getPage();
  page.style.display = "none";
  let w = page.contentWindow;
  window.addEventListener("message", message);
  // w.focus();
  w.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      w.parent.postMessage({ type: "close_loader_page" }, "*");
    }
  });
}

function callBack() {
  let page = loadPage();
  page.style.display = "block";
  window.CSvm.node = this._node;
  if(!window.CSvm.renderer){
    window.CSvm.renderer = new IconRenderer();
  }
  page.focus();
}

function message(event) {
  if (event.data.type === "close_loader_page") {
    let page = getPage();
    page.style.display = "none";
    // document.body.removeChild(document.getElementById("loader_iframe"));
  }
}

function registerCallBack(node) {
  BluePrints.prototype.CSregister(node, callBack);
}

function styleInit() {
  const style = document.createElement("style");
  style.type = "text/css"; // 已启用 需要更改
  style.innerHTML = `
    iframe {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      z-index: 9999;
      background: #000000;
    }
  `;
  document.head.appendChild(style);
}

const ext = {
  name: "AIGODLIKE.MMM",
  async init(app) {
    loadPage();
    styleInit();
  },
  async setup(app) { },
  async addCustomNodeDefs(defs, app) {
    // Add custom node definitions
    // These definitions will be configured and registered automatically
    // defs is a lookup core nodes, add yours into this
    // console.log("[logging]", "add custom node definitions", "current nodes:", Object.keys(defs));
  },
  async getCustomWidgets(app) {
    // Return custom widget types
    // See ComfyWidgets for widget examples
    // console.log("[logging]", "provide custom widgets");
  },
  async beforeRegisterNodeDef(nodeType, nodeData, app) {
    // Run custom logic before a node definition is registered with the graph
    // console.log("[logging]", "before register node: ", nodeType.comfyClass);
    // This fires for every node definition so only log once
    // applyNodeTranslationDef(nodeType, nodeData);
    // delete ext.beforeRegisterNodeDef;
  },
  async registerCustomNodes(app) {
    // Register any custom node implementations here allowing for more flexability than a custom node def
    // console.log("[logging]", "register custom nodes");
  },
  loadedGraphNode(node, app) {
    // registerCallBack(node);
  },
  nodeCreated(node, app) {
    registerCallBack(node);
  },
};

app.registerExtension(ext);
