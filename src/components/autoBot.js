import {
	activePlayerName,
	grid,
	discards,
	showingCards,
	players,
	hands,
	topCard,
} from "./DrPokerGame"
import { selectedIds, setSelectedIds } from "./Selectable"
import { getRank } from "./cards"

let allKnownCards = []
export function autoBot() {
	const pause = 3000

	//update my memory
	allKnownCards = [
		...new Set([
			...grid(),
			...discards(),
			...showingCards(),
			...allKnownCards,
		]),
	].filter((item) => !!item) // filter out undefined, etc.

	const activePlayer = players().find(
		(player) => player.name == activePlayerName()
	)
	if (activePlayer?.bot) {
		const discard = topCard(discards())
		const options = [discard, ...grid()]
		const myCards = hands()[activePlayer.name]

		function tryOptions(options, myCards) {
			let result = [] // return an empty list if it can't improve score

			const myKnownCards = myCards.filter((card) =>
				allKnownCards.includes(card)
			)
			let maxScore = getRank(myKnownCards).score

			if (myKnownCards.length == 5) {
				// try swapping out all options in all positions
				options.forEach((card) => {
					for (let i = 0; i < myKnownCards.length; i++) {
						const newHand = [
							...myKnownCards.slice(0, i),
							card,
							...myKnownCards.slice(i + 1),
						]
						const score = getRank(newHand).score
						if (score > maxScore) {
							maxScore = score
							result = [card, myKnownCards[i]]
						}
					}
				})
			} else {
				// try all options and and swap with the first unknown card
				const myUnknownCards = myCards.filter(
					(card) => !myKnownCards.includes(card)
				)
				options.forEach((card) => {
					const newHand = [...myKnownCards, card]
					const score = getRank(newHand).score
					if (score > maxScore) {
						maxScore = score
						result = [card, myUnknownCards[0]]
					}
				})
			}
			return result // return [] if I can't improve my score
		}

		let result = tryOptions(options, myCards) // see if I can improve my hand with the visible cards first
		if (result.length != 2) {
			result = tryOptions([topCard()], myCards) // try again with topcard
		}
		if (result.length != 2) {
			result = [topCard(), discard] // discard topcard
		}
		setSelectedIds(result)
	}
	setTimeout(autoBot, pause)
}
