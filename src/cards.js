const faces = ["♠", "♥", "♣", "♦ "]
const numbers = [2, 3, 4, 5, 6, 7, 8, 9, 10, "J", "Q", "K", "A"]

export function createCards() {
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

function shuffle(cards) {
  const shuffled = []

  while (cards.length) {
    let index = Math.floor(Math.random() * cards.length)
    shuffled.push(cards[index])
    const spliced = cards.splice(index, 1)
    console.log({ cards, spliced, shuffled })
  }
  cards = shuffled
  console.log(Math.random() * 26)
  return cards
}

function dealCards(shuffled, players, count) {
  players = players.map((name) => {
    return { name, cards: [] }
  })
  for (let i = 0; i < players.length; i++) {
    for (let j = 0; j < count; j++) {
      const player = players[i]
      const chosen = shuffled.pop()
      player.cards.push(chosen)
      console.log({ shuffled, players, chosen })
    }
  }
  return players
}
