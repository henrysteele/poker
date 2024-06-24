import { createCards, dealCards, bestHand, getRank } from "./cards"
import { For, createSignal, createEffect, onMount } from "solid-js"
import { Box, Card, Stack, CardContent, CardActions, Container } from "@suid/material"
import { FlipIt, FlipFront, FlipBack } from "./FlipIt"
import { Selectable } from "./Selectable"

import config from "./config"


export function DeckOfCards (props) {
    return (
        <Box id="deck" sx={{ width: "70px" }}>
            <div style={{ position: "relative", height: "100px", }}>
                <For each={props.cards}>
                    {(card, i) => {
                        let style
                        if (props.discard) {
                            style = {
                                position: "absolute",
                                transform: `rotate(${-33 + Math.round(Math.random() * 66)}deg)`,
                                top: `${Math.floor(Math.random() * 20)}px`,
                                left: `${Math.floor(Math.random() * 20)}px`
                            }
                        } else {
                            style = {
                                position: "absolute",
                                top: `${Math.min(15, i() * 3)}px`,
                                left: `${Math.min(15, i() * 3)}px`
                            }
                        }
                        return <div style={style}>
                            <PlayingCard id={card} down={!props.discard}></PlayingCard>
                        </div>
                    }}
                </For>
            </div>
        </Box>
    )
}

function toMatrix (list, width) {
    if (!list) return [[]]
    width = width || Math.floor(Math.sqrt(list.length))
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
        <div id="hand">
            <Stack direction="row" spacing={1}>
                <Cards {...props} />
            </Stack>
        </div>
    )
}

export function Cards (props) {
    const [cards, setCards] = createSignal(props.cards)
    return (
        <>
            <For each={cards()}>
                {(card) => <PlayingCard id={card} clickable></PlayingCard>}
            </For>
        </>
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
        <Box>
            <Selectable id={props.id?.trim()}>
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


