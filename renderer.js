const { Ollama } = require("ollama");

const ollama = new Ollama();

const PROMPT_TEMPLATE = `
Fix all typos and casing and punctuation in this text, but preserve all new line characters:

$text

Return only the corrected text, don't include a preamble and do not include any side notes.
`;


document.addEventListener("DOMContentLoaded", async () => {
    console.log("Hello from renderer.js");
    document.getElementById('getDataButton').addEventListener('click', getData);

    try {
        let models = await ollama.list(0);
        console.log("Models fetched:", models.models);
        if(models.models.length === 0) {
            document.getElementById('errorText').textContent = "No models found. Please try again later after installing some.";
            disable();
            return;
        }
        populateSelect(models.models);
        
    } catch (error) {
        document.getElementById('errorText').textContent = "No Models Found or Unable to access Ollama server at default endpoint: " + error;
        disable();
        console.error("Error fetching models:", error);
    }
    
});

function disable() {
    document.getElementById('error').showModal();
    document.getElementById('options').disabled = true;
    document.getElementById('getDataButton').disabled = true;
    document.getElementById('getDataButton').classList.remove('bg-blue-500');
    document.getElementById('getDataButton').classList.add('bg-gray-500');
    document.getElementById('inputText').disabled = true;
    
}

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
    const inputTextArea = document.getElementById('inputText');
    const inputValue = inputTextArea.value.trim();


    if(selectedOption.value === "Select") {
        document.getElementById('error').showModal();
        document.getElementById('errorText').textContent = "Please select a model to get the data from.";
        return;
    }

    if(inputValue.length === 0) {
        document.getElementById('error').showModal();
        document.getElementById('errorText').textContent = "Please enter some text to get the data.";
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
        document.getElementById('error').showModal();
        document.getElementById('errorText').textContent = "Error fetching response:\n" + error;
        console.error("Error fetching response:", error);
    }
}