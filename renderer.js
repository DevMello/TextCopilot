const { Ollama } = require("ollama");

const ollama = new Ollama();
let models = [];



const PROMPT_TEMPLATE = `
Fix all typos and casing and punctuation in this text, but preserve all new line characters:

$text

Return only the corrected text, don't include a preamble and do not include any side notes.
`;


document.addEventListener("DOMContentLoaded", async () => {
    console.log("Hello from renderer.js");

    try {
        models = await ollama.list();
        console.log("Models fetched:", models.models);
        populateSelect(models.models);
    } catch (error) {
        console.error("Error fetching models:", error);
    }

    const getDataButton = document.getElementById('getDataButton');
    getDataButton.addEventListener('click', getData);
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

async function getData() {
    const selectElement = document.querySelector('.select');
    const selectedOption = selectElement.options[selectElement.selectedIndex];
    if (selectedOption) {
        console.log("Selected option:", selectedOption.value);
        
    } else {
        console.log("No option selected.");
    }

    const inputTextArea = document.getElementById('inputText');
    const inputValue = inputTextArea.value.trim();

    console.log("Input Value:", inputValue);

    if(selectedOption.value === "Select") {
        console.log("No model selected");
        return;
    }

    const oldValue = inputTextArea.value;
    inputTextArea.value = "";

    try {
        const response = await ollama.chat({model: selectedOption.value, messages: [{role: 'user', content: PROMPT_TEMPLATE.replace("$text", inputValue)}], stream: true, keep_alive: "5m"});
        for await (const part of response) {
            process.stdout.write(part.message.content)
            inputTextArea.value += part.message.content;
          }
    } catch (error) {
        inputTextArea.value = oldValue;
        console.error("Error fetching response:", error);
    }
}