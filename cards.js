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

function getValue(card) {
  card = card.trim()
  if (!card || !card.length) return 0
  const value = card.slice(0, card.length - 1)
  if (value == "J") {
    return 11
  }
  if (value == "Q") {
    return 12
  }
  if (value == "K") {
    return 13
  }
  if (value == "A") {
    return 14
  }
  return value
}

function getSame(cards) {
  // defensive code
  if (!cards) return false
  // create a new array call same
  const same = []
  // do this once per every card
  for (let j = 0; j < cards.length; j++) {
    // get a value from one of the cards
    const value = getValue(cards[j])
    // go through each card
    for (let i = 0; i < cards.length; i++) {
      if (i == j) continue
      // when a specific card includes the value from one of the cards...
      if (getValue(cards[i]) == value) {
        // we push it to the new same varible we made at the start of this function
        if (same.includes(cards[i])) {
          continue
        }
        same.push(cards[i])
      }
    }
  }
  // same as an if statement
  // if(same.length == 3){
  // return true
  // }
  return same
}
function haveThreeOfAKind(cards) {
  return getSame(cards).length == 3
}

function havePair(cards) {
  return getSame(cards).length == 2
}

function haveFourOfAKind(cards) {
  const four = getSame(cards)
  if (four.length != 4) return false
  cards = getSame(four.slice(0, 3))
  return cards.length == 3
}

function haveTwoPair(cards) {
  return getSame(cards).length == 4 && !haveFourOfAKind(cards)
}

function haveFullHouse(cards) {
  return getSame(cards).length == 5
}

function haveFlush(cards) {
  if (!cards) return false
  const suit = cards[0].slice(-1)
  for (let card of cards) {
    if (card.slice(-1) != suit) return false
  }
  return true
}

function haveStraight(hand) {
  //strip of suit, sort in ascending order and ensure theu are sequential
  if (!hand) return false
  const filtered = hand
    .map((card) => {
      return getValue(card)
    })
    .sort((a, b) => {
      return a - b
    })
  const len = filtered.length
  return filtered[len - 1] - (len - 1) == filtered[0]
}

function haveStraightFlush(hand) {
  return haveStraight(hand) && haveFlush(hand)
}

function haveRoyalFlush(hand) {
  return haveStraightFlush(hand) && hand.join("").includes("A")
}

function getOffset(cards) {
  const functions = [
    { f: haveRoyalFlush, offset: 100000000000 },
    { f: haveStraightFlush, offset: 10000000000 },
    { f: haveFullHouse, offset: 30000000 },
    { f: haveFlush, offset: 15000000 },
    { f: haveStraight, offset: 14000000 },
    { f: haveTwoPair, offset: 400000 },
  ]
  for (let item of functions) {
    if (item.f(cards)) return item.offset
  }
  return 0
}

function bestHand(game) {
  const list = "2,3,4,5,6,7,8,9,10,J,Q,K,A".split(",")
  for (hand of game) {
    const text = hand.cards.join("")
    let total = 0
    for (i = 0; i < list.length; i++) {
      let count = text.split(list[i]).length - 1
      let value = count && (i + 2) * Math.pow(200, count)
      value += getOffset(hand.cards)
      total += value
    }
    hand.total = total
  }
  return game.sort((a, b) => a.total - b.total)
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
const players = ["Henry", "Hanshika", "Cooper", "Delaney", "Iyaaz", "Cloud"]
const cards = createCards()
const game = dealCards(cards, players, 5)
for (hand of game) {
  document.writeln(JSON.stringify(hand) + "<br> <br>")
}

function sanityTest() {
  const game = []
  game.push({ name: "twoPairhigh", cards: ["A♠", "9♣", "K♣", "A♣", "K♦ "] })
  game.push({ name: "pair", cards: ["2♦ ", "K♦ ", "Q♠", "2♥", "8♦ "] })
  game.push({ name: "straight", cards: ["2♠", "3♦", "4♠", "5♠", "6♠"] })
  game.push({ name: "straighthigh", cards: ["9♠", "10♦", "J♠", "Q♠", "K♠"] })
  game.push({ name: "straightFlush", cards: ["2♠", "3♠", "4♠", "5♠", "6♠"] })
  game.push({
    name: "straightFlushhigh",
    cards: ["9♠", "10♠", "J♠", "Q♠", "K♠"],
  })
  game.push({ name: "royalFlush", cards: ["10♠", "Q♠", "J♠", "A♠", "K♠"] })
  game.push({ name: "pairhigh", cards: ["2♦ ", "K♦ ", "Q♠", "K♥", "8♦ "] })
  game.push({ name: "twoPair", cards: ["2♠", "9♣", "3♣", "2♣", "3♦ "] })
  game.push({ name: "threeOfAKind", cards: ["2♣", "2♥", "2♦", "3♠", "4♠"] })
  game.push({ name: "threeOfAKindhigh", cards: ["A♣", "A♥", "A♦", "K♠", "Q♠"] })
  game.push({ name: "fullHouse", cards: ["3♠", "2♥", "2♠ ", "2♣", "3♥"] })
  game.push({ name: "fullHouse", cards: ["K♠", "A♥", "A♠ ", "A♣", "K♥"] })
  game.push({ name: "fourOfAKind", cards: ["3♦ ", "2♠", "2♥", "2♦ ", "2♣"] })
  game.push({
    name: "fourOfAKindhigh",
    cards: ["K♦ ", "A♠", "A♥", "A♦ ", "A♣"],
  })

  const best = bestHand(game)
  console.log({ best })
  document.writeln(JSON.stringify(best) + "<br> <br>")
}

sanityTest()
