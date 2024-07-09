import { For, createSignal, createEffect, onMount, children } from "solid-js"
import {
    Box,
    Card,
    Stack,
    CardContent,
    CardActions,
    Container,
    Button
} from "@suid/material"
import $ from "jquery"
import config from "./config"
import { createCards, bestHand, getRank } from "./cards"
import { selectedIds, setSelectedIds } from "./Selectable"
import { Player, Dealer } from "./Player"
import { PlayingCard, DeckOfCards, Discards, Grid, Hand } from "./PlayingCards"
import { tossCard } from "./animations.jquery"

export const [deck, setDeck] = createSignal([]) //[ id, ... ]
export const [discards, setDiscards] = createSignal([]) // [ id, ...]
export const [players, setPlayers] = createSignal([]) // [ { name, cards: [] }, ...]
export const [grid, setGrid] = createSignal([]) // [id x 9]
export const [pot, setPot] = createSignal(0)
export const [hands, setHands] = createSignal({})
export const [wallets, setWallets] = createSignal({})
export const [bets, setBets] = createSignal({})

export const [showingCards, setShowingCards] = createSignal([]) // [id]

export function topCard () {
    const len = deck().length
    return deck()[len - 1]
}


/**
 *
 * refresh, deal, nextplayer, bet
 */

function swapSignals (a, b, accessors) {
    const [get, set] = accessors
    const original = JSON.stringify(get())
    const temp = b.split("").join("**")
    const replaced = original
        .replaceAll(a, temp)
        .replaceAll(b, a)
        .replaceAll(temp, b)
    if (original != replaced) {
        set(JSON.parse(replaced))
        return true
    }
    return false
}

function swapAll (list) {
    const accessors = [
        [deck, setDeck],
        [discards, setDiscards],
        [hands, setHands],
        [grid, setGrid],
    ]
    accessors.forEach((access) => {
        const len = list.length
        // swap 1&2 then 2&3, etc.
        for (let i = 0; i < len - 1; i++) {
            swapSignals(list[i], list[i + 1], access)
        }
        // swap last with the first
        if (len > 2) {
            swapSignals(list[len - 1], list[0], access)
        }
    })

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
    if (i == len - 1)
        tossCard("#" + list[list.length - 1], "#" + list[0], callback)
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

    function createMap (attributes, value = "") {
        const tmp = {}
        attributes.forEach(attr => { tmp[attr] = structuredClone(value) })
        return tmp
    }

    function init () {
        const avatars = config.profilenames
        const names = props.names || ["Henry", "Dork", "Dumby"]

        setPlayers(names.map((name, i) => {
            const src = `/dist/peeps/${avatars[i]}.png`
            return { name, src }
        }))
        setHands(createMap(names, []))
        setWallets(createMap(names, config.freemoney || 1000))
        setBets(createMap(names, 0))
        setGrid([])
        setDiscards([])
        setDeck(createCards())
    }

    onMount(init)

    function onDeal () {
        init()
        const cards = structuredClone(deck())
        const nine = [...grid()]
        const wait = 200
        let time = 0

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
        const names = players().map(player => player.name)
        for (let i = 0; i < 5; i++) {
            names.forEach((name) => {
                setTimeout(() => {
                    const id = cards.pop()
                    tossCard("#" + id, `#${name}-hand`, () => {
                        const clone = structuredClone(hands())
                        clone[name].push(id)
                        setHands(clone)
                    })
                }, time)
                time += wait
            })
        }

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
    }

    // exchange cards
    createEffect(() => {
        const ids = [...selectedIds()]
        const otherCard = ids.filter(card => card != topCard())[0]

        if (ids.length == 2) {

            console.log({ selected: ids })

            // deck should only show top card and 5 fake cards underneath
            // you can only select the deck if selectedIds.length == 0
            // it flips and then you cannot unselect it

            if (ids.includes(topCard())) {

                tossCard("#" + topCard, "#" + otherCard, () => {
                    tossCard("#" + otherCard, "#discards", () => {
                        swapCards([topCard, otherCard])
                        setDeck(deck) // remove otherCard from deck
                        setDiscards([...discards(), otherCard]) // put otherCard in discards
                    })
                    setSelectedIds([])
                })

                // setTimeout(() => {
                //     setShowingCards(showingCards().filter(card => !card != topCard))
                // }, 3000)

            } else {
                // swap two cards
                tossCards(ids, () => {
                    swapAll(ids)
                    setSelectedIds([])
                })
            }
            // }
            //
        }
    })

    return (
        <div>
            <Box>
                <Button onClick={onDeal}>deal cards</Button>
            </Box>

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
                        <Player name={player.name} total={wallets()[player.name]} src={player.src}>
                            <Hand id={`${player.name}-hand`} cards={hands()[player.name]} />
                        </Player>
                    </>
                )}
            </For>

            {children(props.children)}
        </div>
    )
}

