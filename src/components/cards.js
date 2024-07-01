const faces = "♠♥♣♦".split("")
const numbers = "2,3,4,5,6,7,8,9,10,J,Q,K,A".split(",")

export function createCards() {
	let cards = []
	for (let i = 0; i < faces.length; i++) {
		for (let j = 0; j < numbers.length; j++) {
			let card = numbers[j] + faces[i]
			cards.push(card)
		}
	}
	return shuffle(cards)
}

export function shuffle(cards) {
	cards = [...cards]
	const shuffled = []
	while (cards.length) {
		let index = Math.floor(Math.random() * cards.length)
		shuffled.push(cards[index])
		const spliced = cards.splice(index, 1)
	}
	return shuffled
}

export function dealCards(cards, players, count = 5) {
	const shuffled = shuffle(cards)
	players = players.map((name) => {
		return { name, cards: [] }
	})
	for (let i = 0; i < players.length; i++) {
		for (let j = 0; j < count; j++) {
			const player = players[i]
			const chosen = shuffled.pop()
			player.cards.push(chosen)
		}
	}
	return players
}

function getValue(card) {
	card = card.trim()
	if (!card?.length) return 0
	const value = card.slice(0, card.length - 1).toUpperCase()
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
	return parseInt(value)
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
	if (!cards?.length) return false
	const suit = cards[0].slice(-1)
	for (let card of cards) {
		if (card.slice(-1) != suit) return false
	}
	return true
}

function haveStraight(cards) {
	//strip of suit, sort in ascending order and ensure theu are sequential
	if (!cards?.length) return false
	const filtered = cards
		.map((card) => {
			return getValue(card)
		})
		.sort((a, b) => {
			return a - b
		})
	const len = filtered.length
	return filtered[len - 1] - (len - 1) == filtered[0]
}

function haveStraightFlush(cards) {
	return haveStraight(cards) && haveFlush(cards)
}

function haveRoyalFlush(cards) {
	return haveStraightFlush(cards) && cards.join("").includes("A")
}
function getOffset(cards) {
	const functions = [
		{ f: haveRoyalFlush, offset: 100000 },
		{ f: haveStraightFlush, offset: 84000 },
		{ f: haveFourOfAKind, offset: 52000 },
		{ f: haveFullHouse, offset: 32000 },
		{ f: haveFlush, offset: 20000 },
		{ f: haveStraight, offset: 12000 },
		{ f: haveThreeOfAKind, offset: 8000 },
		{ f: haveTwoPair, offset: 4000 },
		{ f: havePair, offset: 1000 },
	]
	for (let item of functions) {
		if (item.f(cards)) return item.offset
	}
	return 0
}

export function getRank(cards) {
	const list = "2,3,4,5,6,7,8,9,10,J,Q,K,A".split(",")
	const text = cards.join("")
	let total = 0
	for (let i = 0; i < list.length; i++) {
		let count = text.split(list[i]).length - 1
		let value = count && (i + 2) * Math.pow(2, count)
		value += getOffset(cards)
		total += value
	}
	return total
}

export function bestHand(hands) {
	for (let hand of hands) {
		hand.rank = getRank(hand.cards)
	}
	return hands.sort((a, b) => a.rank - b.rank)
}

function sanityTest() {
	const ordered = []

	ordered.push({ name: "nopair", cards: ["2♦ ", "3♦ ", "4♠", "7♥", "5♦ "] })
	ordered.push({
		name: "nopairhigh",
		cards: ["9♦ ", "J♦ ", "Q♠", "K♥", "A♦ "],
	})
	ordered.push({ name: "pair", cards: ["2♦ ", "3♦ ", "4♠", "2♥", "5♦ "] })
	ordered.push({ name: "pairhigh", cards: ["A♦ ", "K♦ ", "A♠", "Q♥", "J♦ "] })

	ordered.push({ name: "twoPair", cards: ["2♠", "4♣", "3♣", "2♣", "3♦ "] })
	ordered.push({
		name: "twoPairMed",
		cards: ["10♠", "10♣", "9♣", "2♣", "9♦ "],
	})
	ordered.push({
		name: "twoPairMedHigh",
		cards: ["J♠", "J♣", "3♣", "2♣", "3♦ "],
	})

	ordered.push({
		name: "twoPairHigh",
		cards: ["A♠", "Q♣", "K♣", "A♣", "K♦ "],
	})
	ordered.push({
		name: "threeOfAKind",
		cards: ["2♣", "2♥", "2♦", "3♠", "4♠"],
	})
	ordered.push({
		name: "threeOfAKindhigh",
		cards: ["A♣", "A♥", "A♦", "K♠", "Q♠"],
	})

	ordered.push({ name: "straight", cards: ["2♠", "3♦", "4♠", "5♠", "6♠"] })
	ordered.push({
		name: "straighthigh",
		cards: ["9♠", "10♦", "J♠", "Q♠", "K♠"],
	})
	ordered.push({ name: "flush", cards: ["2♠", "3♠", "4♠", "5♠", "7♠"] })
	ordered.push({ name: "flushhigh", cards: ["9♠", "J♠", "Q♠", "K♠", "A♠"] })

	ordered.push({ name: "fullHouse", cards: ["3♠", "2♥", "2♠ ", "2♣", "3♥"] })
	ordered.push({
		name: "fullHousehigh",
		cards: ["K♠", "A♥", "A♠ ", "A♣", "K♥"],
	})
	ordered.push({
		name: "fourOfAKind",
		cards: ["3♦ ", "2♠", "2♥", "2♦ ", "2♣"],
	})
	ordered.push({
		name: "fourOfAKindhigh",
		cards: ["K♦ ", "A♠", "A♥", "A♦ ", "A♣"],
	})
	ordered.push({
		name: "straightFlush",
		cards: ["2♠", "3♠", "4♠", "5♠", "6♠"],
	})
	ordered.push({
		name: "straightFlushhigh",
		cards: ["9♠", "10♠", "J♠", "Q♠", "K♠"],
	})
	ordered.push({ name: "royalFlush", cards: ["10♠", "Q♠", "J♠", "A♠", "K♠"] })

	const sorted = bestHand(shuffle(ordered))
	const pass = JSON.stringify(ordered) == JSON.stringify(sorted)
	console.log({ sanityTest: pass, ordered, sorted })
}

sanityTest()
