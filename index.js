const faces = ["♠", "♥", "♣", "♦ "]
const numbers = [2, 3, 4, 5, 6, 7, 8, 9, 10, "J", "Q", "K", "A"]

function shuffle(cards) {
  const shuffled = []

  while (cards.length) {
    index = Math.floor(Math.random() * cards.length)
    shuffled.push(cards[index])
    const spliced = cards.splice(index, 1)
    console.log({ cards, spliced, shuffled })
  }
  cards = shuffled
  console.log(Math.random() * 26)
  return cards
}

function dealCards(shuffled) {
  const players = [
    "Henry",
    "Hanshika",
    "Cooper",
    "Delaney",
    "Iyaaz",
    "Cloud",
  ].map((name) => {
    return { name, cardsChosen: [] }
  })
  for (let i = 0; i < players.length; i++) {
    for (let j = 0; j < 5; j++) {
      const player = players[i]
      const chosen = shuffled.pop()
      player.cardsChosen.push(chosen)
      console.log({ shuffled, players, chosen })
    }
  }
  return players
}

function createCards() {
  let cards = []
  for (let i = 0; i < faces.length; i++) {
    for (let j = 0; j < numbers.length; j++) {
      let card = numbers[j] + faces[i]
      cards.push(card)
    }
  }
  cards = shuffle(cards)
  return cards
}

const game = dealCards(createCards())
for (hand of game) {
  document.writeln(JSON.stringify(hand))
}
const input = document.getElementById("input")
const divPossibleWords = document.getElementById("possibleWords")

function updatePossibleWords(text) {
  const list = listofwords.filter((word) => word.includes(text))

  divPossibleWords.innerHTML = ""
  if (list.length == 0) {
    divPossibleWords.innerHTML = "There are no possible words!"
  }

  for (let i = 0; i < list.length && i < 10; i++) {
    let possibleWord = list[i]
    divPossibleWords.innerHTML += possibleWord + "<br>"
    // console.log({ possibleWord })
  }
}

function checkText(text) {
  const list = text.split(" ")
  const badWords = []
  for (let word of list) {
    word = word.split(/[’']/)[0].replace(/[^\w]$/, "")
    if (!listofwords.includes(word.toLowerCase())) {
      badWords.push(word)
    }
  }
  // console.log({ badWords, list, text })
}

function checkSpelling(e) {
  e.stopPropagation()
  const text = e.srcElement.innerText
  const correct = listofwords.includes(text.toLowerCase())
  const styles = ["default", "error"]
  const style = styles[correct ? 0 : 1]
  input.setAttribute("class", style)
  updatePossibleWords(text)
  // console.log({ oninput: e, text, correct, style, styles })
  checkText(input.innerText)
}
input.oninput = checkSpelling
