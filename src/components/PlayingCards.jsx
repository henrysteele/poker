import { createCards, dealCards, bestHand, getRank } from "./cards"
import { For, createSignal, createEffect, onMount } from "solid-js"
import { Box, Card, Stack, CardContent, CardActions, Container } from "@suid/material"
import { FlipIt, FlipFront, FlipBack } from "./FlipIt"
import { MoveIt } from "./MoveIt"
import config from "./config"



export function DeckOfCards (props) {
    const [cards, setCards] = createSignal(props.cards || createCards())
    return (
        <Box sx={{ width: "70px" }}>
            <div style={{ position: "relative", height: "100px", }}>
                <For each={cards()}>
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
                            <PlayingCard text={card} down={!props.discard}></PlayingCard>
                        </div>
                    }}
                </For>
            </div>
        </Box>
    )
}

function toMatrix (list, width) {
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
    const [rows, setRows] = createSignal(toMatrix(props.list))

    return <>
        <Stack direction="column" spacing={1}>
            <For each={rows()}>{(row) => (<>
                <Stack direction="row" spacing={1}>
                    <For each={row}>{(item) => <>
                        {item}
                    </>}</For>
                </Stack>
            </>)}
            </For>
        </Stack>
    </>
}

export function Hand (props) {
    return (
        <>
            <Stack direction="row" spacing={1}>
                <Cards {...props} />
            </Stack>
        </>
    )
}

export function Cards (props) {
    const [cards, setCards] = createSignal(props.cards)
    return (
        <>
            <For each={cards()}>
                {(card) => <PlayingCard text={card} clickable></PlayingCard>}
            </For>
        </>
    )
}

let zIndex = 1

export function PlayingCard (props) {
    const [down, setDown] = createSignal(props.down)
    const [z, setZ] = createSignal(props.zindex || 1)
    const [style, setStyle] = createSignal("")
    const [pos, setPos] = createSignal()

    const text = props.text?.trim() || ""
    const value = text.slice(0, text.length - 1)
    const suit = text.slice(-1).toLowerCase()
    const color = config.color[suit]


    createEffect(() => {
        setStyle({ color, "z-index": z() })
    })

    return (
        <Box>
            <div
                onClick={() => {
                    if (!props.clickable) return

                    setDown(!down())
                    setZ(++zIndex)

                    const top = Math.round(Math.random() * 100) + "px"
                    const left = Math.round(Math.random() * 100) + "px"
                    setPos({ top, left })
                }}
            >
                <MoveIt to={pos()}>
                    <FlipIt flip={down()}>
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
                </MoveIt>
            </div>
        </Box>
    )
}


