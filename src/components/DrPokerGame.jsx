import { For, createSignal, createEffect, onMount } from "solid-js"
import { Box, Card, Stack, CardContent, CardActions, Container, Button } from "@suid/material"
import $ from "jquery"
import config from "./config"
import { createCards, bestHand, getRank } from "./cards"
import { selectedIds, setSelectedIds } from "./Selectable"
import { Player, Dealer } from "./Player"
import { PlayingCard, DeckOfCards, Grid, Hand } from "./PlayingCards"

export const [deck, setDeck] = createSignal([]) //[ id, ... ]
export const [discards, setDiscards] = createSignal([]) // [ id, ...]
export const [players, setPlayers] = createSignal([]) // [ { name, cards: [] }, ...]
export const [grid, setGrid] = createSignal([]) // [id x 9]
export const [pot, setPot] = createSignal(0)

export const [showingCards, setShowingCards] = createSignal([]) // [id]


/**
 *
 * refresh, deal, nextplayer, bet
 */


function swapSignals (a, b, accessors) {
    const [get, set] = accessors
    const original = JSON.stringify(get())
    const temp = b.split("").join('**')
    const replaced = original.replaceAll(a, temp).replaceAll(b, a).replaceAll(temp, b)
    if (original != replaced) {
        set(JSON.parse(replaced))
        return true
    }
    return false
}

function swapAll (a, b) {
    const accessors = [[deck, setDeck], [discards, setDiscards], [players, setPlayers], [grid, setGrid]]
    accessors.forEach((access) => swapSignals(a, b, access))
}

function tossCards (list, callback, i = 0) {
    // list can have 2 or more cards, cards will be tossed forward

    const len = list.length
    if (len < 2) return

    if (i < len - 1) {
        const id = list[i]
        const pos = $('#' + list[i + 1]).offset()
        toss(id, pos, () => {
            tossCards(list, callback, i + 1)
        })
    }
    if (i == len - 1) toss(list[list.length - 1], $('#' + list[0]).offset(), callback)
}

function swapCards (list, callback) {
    const $source = $('#' + list[0])
    const $target = $('#' + list[1])

    toss(list[0], $target.offset())
    toss(list[1], $source.offset(), callback)
}

function delay (time) {
    return new Promise(resolve => setTimeout(resolve, time));
}



export function DrPokerGame (props) {

    function init () {
        const cards = createCards()
        const names = props.names || ["Henry", "Dork", "Dumby"]
        const peeps = config.profilenames
        const people = names.map((name, i) => {
            const src = `/dist/peeps/${peeps[i]}.png`
            return { name, src, cards: [], money: 1000 }
        })
        setPlayers(structuredClone(people))
        setGrid([])
        setDiscards([])
        setDeck(cards)
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
                const pos = $(`#Grid`).offset()
                pos.top += 100; pos.left += 50
                toss(id, pos, () => {
                    nine.push(id)
                    setGrid([...nine])
                })

            }, time)
            time += wait
        }

        // deal 5 cards per player
        const peeps = structuredClone(players())
        for (let i = 0; i < 5; i++) {
            peeps.forEach(player => {
                setTimeout(() => {
                    const id = cards.pop()
                    const pos = $(`#${player.name}-hand`).offset()
                    pos.top -= 20; pos.left += 200
                    toss(id, pos, () => {
                        player.cards.push(id)
                        setPlayers(structuredClone(peeps))
                    })
                }, time)
                time += wait
            })
        }

        setTimeout(() => {
            setDeck([])
            setDeck(cards)
            const list = []
            peeps.forEach(player => {
                list.push(player.cards[0])
            })
            setShowingCards(list)
        }, time)


        setTimeout(() => {
            setShowingCards([])
        }, 20000)
    }




    setInterval(() => {
        setPot(pot() + 11)
    }, 300)

    createEffect(() => {
        const ids = selectedIds()
        if (ids.length == 2) {
            console.log({ selected: ids })

            tossCards(ids, () => {
                swapAll(...ids)
                setSelectedIds([])
            })
        }
    })


    return (<div>

        <Box>
            <Button onClick={onDeal}>deal cards</Button>
        </Box>
        <Dealer total={pot()}>

            <Stack direction="row" spacing={2}>
                <Stack direction="column" spacing={2} >
                    <DeckOfCards cards={deck()} />
                    <DeckOfCards cards={discards()} discard />
                </Stack>
                <Grid list={grid()} render={(id) => <PlayingCard id={id} down={false} />} />
            </Stack>
        </Dealer>



        <For each={players()}>
            {(player) => (
                <>
                    <Player name={player.name} total={player.money} src={player.src} >
                        <Hand id={`${player.name}-hand`} cards={player.cards} />
                    </Player>
                </>
            )}
        </For>

        {props.children}

    </div>)

}


//---

$.fn.animateRotate = function (angle, duration, easing, complete) {
    return this.each(function () {
        var $elem = $(this);

        $({ deg: 0 }).animate({ deg: angle }, {
            duration: duration,
            easing: easing,
            step: function (now) {
                $elem.css({
                    transform: 'rotate(' + now + 'deg)'
                });
            },
            complete: complete || $.noop
        });
    });
};


function toss (id, pos, callback) {
    //const snd = document.getElementById("card-sounds")
    const $doc = $('#root')
    const $id = $('#' + id)
    const snd = $id.find('audio')[0]
    const $clone = $id.clone()
    $id.css('opacity', 0)

    if (snd) {
        snd.volume = 0.1
        snd.play()
    }

    const speed = config.card?.speed || 400
    $clone
        .css({ position: "absolute", ...$id.offset() })
        .appendTo($doc)
        .animateRotate(360 * 2)
        .animate(pos, speed,
            () => {
                $clone.remove()
                callback && callback()
            }
        )
}