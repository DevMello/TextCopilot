const { Ollama } = require("ollama");

/**
 * This file is loaded via the <script> tag in the index.html file and will
 * be executed in the renderer process for that window. No Node.js APIs are
 * available in this process because `nodeIntegration` is turned off and
 * `contextIsolation` is turned on. Use the contextBridge API in `preload.js`
 * to expose Node.js functionality from the main process.
 */
const ollama = new Ollama();

let models = [];

document.addEventListener("DOMContentLoaded", async () => {
    console.log("Hello from renderer.js");
    models = await ollama.list();
    console.log(await ollama.list());
});


function populateSelect(models) {

    const selectElement = document.querySelector('.select');
  

    selectElement.innerHTML = '';
  
    const initialOption = document.createElement('option');
    initialOption.disabled = true;
    initialOption.selected = true;
    initialOption.textContent = 'Select';
    selectElement.appendChild(initialOption);
  
    models.forEach(model => {
      const option = document.createElement('option');
      option.value = model.name;
      option.textContent = model.name; 
      selectElement.appendChild(option);
    });
  }
  