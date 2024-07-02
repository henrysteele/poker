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

export function getRank(hand) {
	if (!hand?.length) return 0

	const mapsuits = {
		"♠": "S",
		"♥": "H",
		"♣": "C",
		"♦": "D",
		S: "S",
		H: "H",
		C: "C",
		D: "D",
	}

	let cards = hand.map((card) => ({
		rank: card.slice(0, -1).toUpperCase().replace("10", "T"),
		suit: mapsuits[card.slice(-1).toUpperCase()],
	}))

	// Helper functions
	const isFlush = () => new Set(cards.map((c) => c.suit)).size === 1

	const isStraight = () => {
		const ranks = "23456789TJQKA"
		const handRanks = cards
			.map((c) => ranks.indexOf(c.rank))
			.sort((a, b) => a - b)
		return handRanks.every(
			(rank, i) => i === 0 || rank === handRanks[i - 1] + 1
		)
	}

	const rankCounts = {}
	// cards = ["2S", "3S", "9S", "JS", "JH"].map((card) => ({
	// 	rank: card.slice(0, -1),
	// 	suit: card.slice(-1),
	// }))

	for (const card of cards) {
		let tmp = rankCounts[card.rank] || 0
		rankCounts[card.rank] = tmp + 1
	}

	const values = Object.values(rankCounts)
	const keys = Object.keys(rankCounts)

	// debugger

	// Rank determination (with scoring and hand type mapping)
	const ranks = "23456789TJQKA"
	const suits = "CDHS"
	let score = 0
	let type = "none"

	if (isFlush() && isStraight()) {
		score = 9000 + ranks.indexOf(cards[0].rank)
		type = hand.join("").includes("A")
			? "royal straight flush"
			: "straight flush"
	} else if (values.includes(4)) {
		score =
			8000 + ranks.indexOf(keys.find((rank) => rankCounts[rank] === 4))
		type = "4kind"
	} else if (values.includes(3) && values.includes(2)) {
		score =
			7000 + ranks.indexOf(keys.find((rank) => rankCounts[rank] === 3))
		type = "fullhouse"
	} else if (isFlush()) {
		score =
			6000 +
			cards.reduce((acc, card) => acc + ranks.indexOf(card.rank), 0)
		type = "flush"
	} else if (isStraight()) {
		score = 5000 + ranks.indexOf(cards[0].rank)
		type = "straight"
	} else if (values.includes(3)) {
		score =
			4000 + ranks.indexOf(keys.find((rank) => rankCounts[rank] === 3))
		type = "3kind"
	} else if (values.filter((count) => count === 2).length === 2) {
		const pairs = keys
			.filter((rank) => rankCounts[rank] === 2)
			.sort((a, b) => ranks.indexOf(b) - ranks.indexOf(a))
		score = 3000 + ranks.indexOf(pairs[0]) * 100 + ranks.indexOf(pairs[1])
		type = "2pair"
	} else if (values.includes(2)) {
		score =
			2000 + ranks.indexOf(keys.find((rank) => rankCounts[rank] === 2))
		type = "1pair"
	} else {
		score = cards.reduce((acc, card) => acc + ranks.indexOf(card.rank), 0)
	}

	// Add kicker values for tie-breakers (with suit ranking)
	const remainingCards = cards
		.filter((card) => rankCounts[card.rank] === 1)
		.sort((a, b) => {
			const rankDiff = ranks.indexOf(b.rank) - ranks.indexOf(a.rank)
			if (rankDiff !== 0) return rankDiff // Sort by rank first
			return suits.indexOf(b.suit) - suits.indexOf(a.suit) // Then by suit if rank is the same
		})

	for (let i = 0; i < remainingCards.length; i++) {
		score += ranks.indexOf(remainingCards[i].rank) * Math.pow(0.15, i + 1)
		score += suits.indexOf(remainingCards[i].suit) * Math.pow(0.015, i + 1) // Add suit value with lower weight
	}

	return { hand, score, type }
}

export function bestHand(hands) {
	for (let hand of hands) {
		hand.rank = getRank(hand.cards)
	}
	return hands.sort((a, b) => a.rank - b.rank)
}

function generateAllPokerHands() {
	const suits = ["S", "H", "D", "C"]
	const ranks = "23456789TJQKA"
	const cards = []
	const allHands = []

	// Generate all individual cards
	for (const suit of suits) {
		for (const rank of ranks) {
			cards.push(rank + suit)
		}
	}

	// Efficiently generate combinations using recursion
	function generateCombinations(currentHand, remainingCards) {
		if (currentHand.length === 5) {
			allHands.push(currentHand)
			return
		}

		for (let i = 0; i < remainingCards.length; i++) {
			generateCombinations(
				currentHand.concat(remainingCards[i]),
				remainingCards.slice(i + 1)
			)
		}
	}

	generateCombinations([], cards)
	return allHands
}

// Sanity Test
function runSanityTest() {
	const allHands = generateAllPokerHands().map((hand) => getRank(hand))

	const names =
		"royal straight flush fullhouse 4kind 3kind 2pair 1pair none".split(" ")
	const hands = {}
	names.forEach((name) => {
		hands[name] = allHands.filter((hand) => hand.type.includes(name))
	})
	const twoPair = hands["2pair"].sort((a, b) => a.score - b.score)
	const len = twoPair.length
	const comps = [twoPair[0], twoPair[Math.round(len / 2)], twoPair[len - 1]]
	console.log({
		sanityTest:
			comps[0].score < comps[1].score && comps[1].score < comps[2].score,
		allHands,
		hands,
		twoPair,
		comps,
	})

	const a = getRank("TH,TD,9H,9D,2S".split(","))
	const b = getRank("JH,JD,3H,3D,2S".split(","))

	console.log({ "2pairTest": a.score < b.score, a, b })
}

// runSanityTest()
