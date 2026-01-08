const input = document.getElementById("wordInput");
const searchBtn = document.getElementById("searchBtn");
const resultDiv = document.getElementById("result");
const errorDiv = document.getElementById("error");
searchBtn.addEventListener("click", searchWord);
input.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
        searchWord();
    }
});
function searchWord() {
    const word = input.value.trim();
    resultDiv.innerHTML = "";
    errorDiv.textContent = "";
    if (word === "") {
        alert("Please enter a word");
        return;
    }
    fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
        .then(response => {
            if (!response.ok) {
                throw new Error("Word not found");
            }
            return response.json();
        })
        .then(data => {
            const entry = data[0];
            const meaning = entry.meanings[0];
            const definition = meaning.definitions[0];
            const example = definition.example || "Example not available";
            const phonetic = entry.phonetic || "Not available";
            let audioSrc = "";
            if (entry.phonetics) {
                const audioObj = entry.phonetics.find(p => p.audio);
                if (audioObj) {
                    audioSrc = audioObj.audio;
                }
            }
            resultDiv.innerHTML = `
                <h3>${entry.word}</h3>
                <div class="phonetic">${phonetic}</div>
                <div class="info">
                    <p><span>Part of Speech:</span> ${meaning.partOfSpeech}</p>
                    <p><span>Meaning:</span> ${definition.definition}</p>
                    <p><span>Example:</span> ${example}</p>
                </div>
            `;
            if (audioSrc) {
                const audio = new Audio(audioSrc);
                const audioButton = document.createElement("button");
                audioButton.textContent = "Hear Pronunciation";
                audioButton.className = "audio-btn";
                audioButton.onclick = () => audio.play();
                resultDiv.appendChild(audioButton);
            }
        })
        .catch(() => {
            errorDiv.textContent = "Word not found. Please try another word.";
        });
}