import { For, createSignal, createEffect, onMount, children } from "solid-js"
import {
  Box,
  Card,
  Stack,
  CardContent,
  CardActions,
  Container,
  Button,
} from "@suid/material"
import $ from "jquery"
import config from "./config"
import { createCards, bestHand, getRank } from "./cards"
import { selectedIds, setSelectedIds } from "./Selectable"
import { Player, Dealer } from "./Player"
import { PlayingCard, DeckOfCards, Discards, Grid, Hand } from "./PlayingCards"
import { tossCard, tossCoins } from "./animations.jquery"
import { createMap } from "./helpers"
import { user } from "./Clerk"

export const [deck, setDeck] = createSignal([]) //[ id, ... ]
export const [discards, setDiscards] = createSignal([]) // [ id, ...]
export const [players, setPlayers] = createSignal([]) // [ { name, cards: [] }, ...]
export const [grid, setGrid] = createSignal([]) // [id x 9]
export const [pot, setPot] = createSignal(0)
export const [hands, setHands] = createSignal({})
export const [wallets, setWallets] = createSignal({})
export const [bets, setBets] = createSignal({})
export const [activePlayerName, setActivePlayer] = createSignal("dealer")
export const [status, setStatus] = createSignal("Click the deck to deal")
export const [knownCards, setKnownCards] = createSignal([])

export const [showingCards, setShowingCards] = createSignal([]) // [id]

export function topCard (cards = deck()) {
  return cards.slice(-1)[0]
}

// everywhere cards can live
const accessors = [
  [deck, setDeck],
  [discards, setDiscards],
  [hands, setHands],
  [grid, setGrid],
]

function replaceCards (a, b) {
  accessors.forEach((access) => {
    const json = JSON.stringify(access[0]())
    access[1](JSON.parse(json.replace(a, b)))
  })
}

function swapCards (a, b) {
  const temp = a.split("").join("**")
  let all = JSON.stringify(accessors.map((access) => access[0]()))
  all = all.replace(a, temp)
  all = all.replace(b, a)
  all = all.replace(temp, b)
  const data = JSON.parse(all)
  const setters = accessors.map((access) => access[1])
  for (let i = 0; i < setters.length; i++) {
    setters[i](data[i])
  }
}

function tossCards (list, callback, i = 0) {
  // list can have 2 or more cards, cards will be tossed forward

  const len = list.length
  if (len < 2) return

  if (i < len - 1) {
    const id = list[i]
    const to = list[i + 1]
    tossCard("#" + id, "#" + list[i + 1], () => {
      tossCards(list, callback, i + 1)
    })
  }

  if (i == len - 1) {
    const lastStop = list[len - 1]
    if (!"♠♥♣♦".includes(lastStop.slice(-1))) {
      // not a card, don't animate, just callback
      callback?.call()
      return
    } else {
      tossCard("#" + lastStop, "#" + list[0], callback)
    }
  }
}

function delay (time) {
  return new Promise((resolve) => setTimeout(resolve, time))
}

export function placeBet (name, amount) {
  let tmp = structuredClone(bets())
  tmp[name] += amount
  setBets(tmp)
  tmp = structuredClone(wallets())
  tmp[name] = Math.max(0, tmp[name] - amount)
  setWallets(tmp)
}

export function DrPokerGame (props) {
  function reset () {
    const names = players().map((player) => player.name)
    setSelectedIds([])
    setShowingCards([])
    setHands(createMap(names, []))
    setGrid([])
    setDiscards([])
    setDeck(createCards())
    setActivePlayer(names[0])
  }

  function init (names) {
    const list = user().unknown
      ? []
      : [
        { name: user().username, src: user().imageUrl },
        { name: "Botman", src: "/dist/peeps/batman.png", bot: true },
      ]

    setPlayers(list)
    names = players().map((player) => player.name)
    setWallets(createMap(names, config.freemoney || 1000))
    setBets(createMap(names, 0))
    reset()
  }

  onMount(init)

  createEffect(() => {
    user() // trigger
    init()
  })

  function addToWallet (name, amount) {
    const tmp = structuredClone(wallets())
    tmp[name] += amount
    setWallets(tmp)
  }

  function onDeal () {
    reset()

    const cards = structuredClone(deck())
    const nine = [...grid()]
    const wait = 200
    let time = 0

    const names = players().map((player) => player.name)

    setSelectedIds([])
    setShowingCards([])
    setHands(createMap(names, []))
    setBets(createMap(names, 0))
    setGrid([])
    setDiscards([])
    setDeck(createCards())

    setDiscards([cards.pop()])

    //  deal 9 cards to the grid
    for (let i = 0; i < 9 - grid().length; i++) {
      setTimeout(() => {
        const id = cards.pop()
        tossCard("#" + id, `#Grid`, () => {
          nine.push(id)
          setGrid([...nine])
        })
      }, time)
      time += wait
    }

    // deal 5 cards per player

    for (let i = 0; i < 5; i++) {
      names.forEach((name) => {
        setTimeout(() => {
          const id = cards.pop()
          tossCard("#" + id, `#${name?.condense()}-hand`, () => {
            const clone = structuredClone(hands())
            clone[name].push(id)
            setHands(clone)
          })
        }, time)
        time += wait
      })
    }

    setActivePlayer(names[0])

    setTimeout(() => {
      setDeck([])
      setDeck(cards)
      const list = []
      players().forEach((player) => {
        list.push(hands()[player.name][0])
      })
      setShowingCards(list)
    }, time)

    setTimeout(() => {
      setShowingCards([])
    }, 20000)
    const playerNames = Object.keys(wallets())
    console.log({ names: playerNames })
    setStatus("Ante Up!")
    setTimeout(() => {
      playerNames.forEach((name) => {
        tossCoins(
          1,
          `#player-${name?.condense()} .money`,
          "#dealer .money",
          () => {
            addToWallet(name, -1)
            setPot(pot() + 1)
          }
        )
      })
    }, 4500)
    setStatus(`It's ${activePlayerName()}'s turn`)
  }

  // deal when clicked on deck and there's no grid
  createEffect(() => {
    if (
      grid().length == 0 && // haven't dealt yet
      selectedIds().includes(topCard())
    ) {
      onDeal()
    }
  })

  function nextPlayer () {
    // next player
    const names = players().map((player) => player.name)
    let i = names.indexOf(activePlayerName()) + 1
    if (i == names.length) i = 0

    setActivePlayer(names[i])
    setStatus(`It's ${activePlayerName()}'s turn`)
  }

  // exchange cards
  createEffect(() => {
    let ids = [...selectedIds()]
    if (ids.length == 2) {
      if (ids.includes(topCard())) {
        const otherCard = ids.filter((card) => card != topCard())[0]
        const otherIsDiscarded = discards().includes(otherCard)
        const cards = [...deck()] // clone the deck
        const top = cards.pop() // remove topCard from deck
        const list = [top, otherCard, "discards"]
        setSelectedIds((ids = [])) // important since this effect is called twice
        tossCards(list, () => {
          if (otherIsDiscarded) {
            setDiscards([...discards(), top]) // put top in discards
          } else {
            replaceCards(otherCard, top)
            setDiscards([...discards(), otherCard]) // put otherCard in discards
          }
          setDeck(cards) // remove top from deck
          nextPlayer()
        })

        setTimeout(() => {
          setShowingCards(showingCards().filter((card) => !card != topCard))
        }, 3000)
      } else {
        // swap two cards
        const temp = [...ids]
        const hand = hands()[activePlayerName()]
        const intersection = ids.filter((x) => hand.includes(x))
        const endOfTurn = intersection.length != 2 // cards are both in the hand, so turn continues

        setSelectedIds((ids = [])) // important since this effect is called twice
        tossCards(temp, () => {
          swapCards(...temp)
          endOfTurn && nextPlayer()
        })
      }
    }
  })

  function getValue (value) {
    if (value == "J") {
      return 11
    } else if (value == "Q") {
      return 12
    } else if (value == "K") {
      return 13
    } else if (value == "A") {
      return 14
    }
    return parseInt(value)
  }

  function smartBot () {
    if (!hands()["Botman"] || Object.values(hands()["Botman"]).length == 0)
      return
    const botCards = hands()["Botman"].map((card) =>
      card.slice(0, card.length - 1)
    )
    const choices = [...grid().flat(), discards()[0]].map((card) =>
      card.slice(0, card.length - 1)
    )
    let matches = choices.filter((card) => botCards.includes(card))
    if (matches.length == 0) {
      matches = choices
    }
    const sorted = matches.sort((a, b) => a - b)
    let best = sorted[matches.length - 1]
    console.log({ smartBot: botCards, choices, matches, best, sorted })
    const withSuit = [...grid().flat(), discards()[0]]
    for (let card of withSuit) {
      if (card.includes(best)) {
        best = card
        return best
      }
    }
    return best
  }

  function inHand () {
    const hand = hands()["Botman"].sort((a, b) => a - b)
    if (hand[0] != smartBot()) {
      let choose = hand[0]
      return choose
    } else if (hand[1] != smartBot()) {
      choose = hand[1]
      return choose
    } else if (hand[2] != smartBot()) {
      choose = hand[2]
      return choose
    } else if (hand[3] != smartBot()) {
      choose = hand[3]
      return choose
    } else if (hand[4] != smartBot()) {
      choose = hand[4]
      return choose
    }
  }



  let allKnownCards = []
  function autoBot () {
    const pause = 3000

    //update my memory
    allKnownCards = [... new Set(
      [...grid(), ...discards(), ...showingCards(), ...allKnownCards]
    )].filter(item => !!item) // filter out undefined, etc.

    const activePlayer = players().find((player) => player.name == activePlayerName())
    if (activePlayer?.bot) {
      const discard = discards()[discards().length - 1]
      const options = [discard, ...grid()]
      const myCards = hands()[activePlayer.name]

      function tryOptions (options, myCards) {
        let result = [] // return an empty list if it can't improve score

        const myKnownCards = myCards.filter(card => allKnownCards.includes(card))
        let maxScore = getRank(myKnownCards).score

        if (myKnownCards.length == 5) {
          // try swapping out all options in all positions
          options.forEach(card => {
            for (let i = 0; i < myKnownCards.length; i++) {
              const newHand = [...myKnownCards.slice(0, i), card, ...myKnownCards.slice(i + 1)]
              const score = getRank(newHand).score
              if (score > maxScore) {
                maxScore = score
                result = [card, myKnownCards[i]]
              }
            }
          })
        } else {
          // try all options and and swap with the first unknown card
          const myUnknownCards = myCards.filter(card => !myKnownCards.includes(card))
          options.forEach(card => {
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
      } if (result.length != 2) {
        result = [topCard(), discard] // discard topcard
      }
      setSelectedIds(result)
    }
    setTimeout(autoBot, pause)
  }

  // automate play
  autoBot()

  return (
    <div>
      <Stack direction="row" spacing={2}>
        <Button onClick={onDeal}>deal cards</Button>
      </Stack>

      <Dealer total={pot()}>
        <Stack direction="row" spacing={2}>
          <Stack direction="column" spacing={2}>
            <DeckOfCards cards={deck()} />
            <Discards cards={discards()} />
          </Stack>
          <Grid
            list={grid()}
            render={(id) => <PlayingCard id={id} down={false} />}
          />
        </Stack>
      </Dealer>

      <For each={players()}>
        {(player) => (
          <>
            <Player
              name={player.name}
              total={wallets()[player.name]}
              src={player.src}
            >
              <Hand
                id={`${player?.name?.condense()}-hand`}
                cards={hands()[player.name]}
              />
            </Player>
          </>
        )}
      </For>

      {children(props.children)}
    </div>
  )
}
