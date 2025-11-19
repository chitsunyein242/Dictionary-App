let userInput = document.querySelector(".search input");
let ul = document.querySelector("ul");
let infoText = document.querySelector(".info-text");
let audio;

function showUsers(data) {
        let last_phonetic = data[0].phonetics.length - 1;
        let last_meaning = data[0].meanings.length - 1;
        let last_defitions = data[0].meanings[last_meaning].definitions.length - 1;

        ul.style.display = "block";
        audio = new Audio(`${data[0].phonetics[last_phonetic].audio}`);

        document.querySelector(".details p").innerText = data[0].word;
        document.querySelector(
            ".details span"
        ).innerText = `${data[0].meanings[last_meaning].partOfSpeech} ${data[0].phonetics[last_phonetic].text}`;
        document.querySelector(".meaning span").innerText =
            data[0].meanings[last_meaning].definitions[last_defitions].definition;

        let example =
            data[0].meanings[last_meaning].definitions[last_defitions].example;

        if (example == undefined) {
            document.querySelector(".example").style.display = "none";
        } else {
            document.querySelector(".example").style.display = "block";
            document.querySelector(".example span").innerText = example;
        }

        let synonyms = data[0].meanings[last_meaning].synonyms[0];
        let synonyms_length = data[0].meanings[last_meaning].synonyms.length;

        if (synonyms == undefined) {
            document.querySelector(".synonyms").style.display = "none";
        } else {
            document.querySelector(".synonyms").style.display = "block";
            document.querySelector(".synonyms .list").innerHTML = "";
            for (let i = 0; i < synonyms_length; i++) {
            let items = `<span onclick="search_synonyms('${data[0].meanings[last_meaning].synonyms[i]}')">${data[0].meanings[last_meaning].synonyms[i]}</span>`;
            document
                .querySelector(".synonyms .list")
                .insertAdjacentHTML("beforeend", items);
            }
        }
}

function showWords(result, word) {
  if (result.title) {
    infoText.style.color = "red";
    infoText.innerHTML = `Can't Search <b>word`;
  } else {
    userInput.blur();
    infoText.style.color = "green";
    userInput.value = "";
    infoText.innerText = `Searched ${word}`;
    infoText.style.marginBottom = "10px"
    showUsers(result);
  }
}

ul.style.display = "none";
function searchWord(word) {
    ul.style.display = "none";
  infoText.style.color = "#000";
  infoText.innerText = `Searching ${word}`;
  fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
    .then((res) => res.json())
    .then((result) => showWords(result, word))
    .catch((error) => {
      fetch(`http://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
        .then((res) => res.json())
        .then((result) => console.log(result))
        .catch((finalError) => {
          console.error("All attempts failed:", finalError);
          infoText.innerText = "Network error. Please try again.";
        });
    });
}
userInput.addEventListener("keyup", (e) => {
  if (e.key == "Enter" && e.target.value) {
    searchWord(e.target.value);
  }
});

userInput.addEventListener("focus", () => {
  ul.style.display = "none";
  infoText.style.color = "#9a9a9a";
  infoText.innerText =
    "Type any existing word and press enter to get meaning, example, synonyms, etc.";
});

document.querySelector(".fa-volume-up").addEventListener("click",()=>{
    audio.play();
})

function search_synonyms(key){
    searchWord(key)
}
