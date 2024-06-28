import { createCards, dealCards, bestHand, getRank } from "./cards"
import { For, createSignal, createEffect, onMount } from "solid-js"
import { Box, Card, Stack, CardContent, CardActions, Container } from "@suid/material"
import { FlipIt, FlipFront, FlipBack } from "./FlipIt"
import { Selectable } from "./Selectable"
import { newCards } from './DrPokerGame'

import config from "./config"


export function DeckOfCards (props) {
    return (
        <Box id="deck" sx={{ width: "70px" }}>

            <div style={{ position: "relative", height: "100px" }}>
                {/* this relative position is causing cards to fly incorrectly

                https://gsap.com/community/forums/topic/31814-layer-divs-on-top-of-each-other-while-maintaining-inline-flow/ */}


                <For each={props.cards}>
                    {(card, i) => {
                        let style
                        if (props.discard) {
                            style = {
                                position: "absolute",
                                transform: `rotate(${-25 + Math.round(Math.random() * 50)}deg)`,
                                top: `${Math.floor(Math.random() * 15)}px`,
                                left: `${Math.floor(Math.random() * 15)}px`
                            }
                        } else {
                            style = {
                                position: "absolute",
                                top: `${Math.min(15, i() * 3)}px`,
                                left: `${Math.min(15, i() * 3)}px`
                            }
                        }
                        return <PlayingCard id={card} style={style} down={!props.discard}></PlayingCard>
                    }}
                </For>
            </div>

        </Box>
    )
}

function toMatrix (list, width) {
    if (!list) return [[]]
    width = width || Math.ceil(Math.sqrt(list.length))
    const matrix = []
    let row = []
    for (let [i, item] of list.entries()) {
        row.push(item)
        if (++i % width == 0) {
            matrix.push(row)
            row = []
        }
    }
    return matrix
}

export function Grid (props) {
    const [rows, setRows] = createSignal([])

    createEffect(() => {
        setRows(toMatrix(props.list))
    })

    return <div id="Grid">
        <Stack direction="column" spacing={1}>
            <For each={rows()}>{(row) => (<>
                <Stack direction="row" spacing={1}>
                    <For each={row}>{(item) => <>
                        {props.render(item)}
                    </>}</For>
                </Stack>
            </>)}
            </For>
        </Stack>
    </div>
}

export function Hand (props) {

    return (
        <div id={props.id || "hand"}>
            <Stack direction="row" spacing={1}>
                <For each={props.cards}>
                    {(id) => <PlayingCard id={id} down={!newCards().includes(id)}></PlayingCard>}
                </For>
            </Stack>
        </div>
    )
}

export function PlayingCard (props) {
    const [style, setStyle] = createSignal("")


    const id = props.id?.trim() || ""
    const value = id.slice(0, id.length - 1)
    const suit = id.slice(-1).toLowerCase()
    const color = config.color[suit]

    createEffect(() => {
        setStyle({ color })
    })


    return (
        <Box >

            <Selectable id={id} style={props.style}>
                <audio src={config?.card?.sounds || "/dist/audio/card-sounds-35956.mp3"}></audio >
                <FlipIt flip={props.down}>
                    <FlipFront>
                        <Card>
                            <div style={style()}>
                                <div>{value}</div>
                                <div
                                    style={{
                                        ...config.style.suit,
                                        "background-image": `url(/dist/cards/${config.suits[suit]}.png)`,
                                    }}
                                ></div>
                            </div>
                        </Card>
                    </FlipFront>
                    <FlipBack>
                        <Card>
                            <div style={{ ...style(), ...config.style.back }}></div>
                        </Card>
                    </FlipBack>
                </FlipIt>
            </Selectable>
        </Box>
    )
}


