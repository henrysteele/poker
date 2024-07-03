import { For, createSignal, createEffect, onMount } from "solid-js"
import {
    Box,
    Card,
    Stack,
    CardContent,
    CardActions,
    Container,
    Button,
} from "@suid/material"

import { Money } from "./Money"
import config from "./config"
import { setShowingCards, players, setPlayers, pot } from "./DrPokerGame"

export function Profile (props) {
    return (
        <div>
            <div
                style={{
                    ...config.style.profile.image,
                    ...props.style,
                    background: `url(${props.src})`,
                }}
            ></div>
        </div>
    )
}

export function Dealer (props) {
    return (
        <Box id={`dealer`} sx={{ margin: "1em", display: "inline-block" }}>
            <Card sx={{ padding: "1em", width: "fit-content" }}>
                <CardContent>
                    <Stack direction="row">
                        <Profile name="dealer" src="/dist/peeps/dealer.png" />
                        <Money total={props.total} controls={false} />
                    </Stack>
                </CardContent>
                <CardActions>{props.children} </CardActions>
            </Card>
        </Box>
    )
}

export function Player (props) {
    const [call, setCall] = createSignal(0)

    createEffect(() => {
        let maxBet = 0
        for (let player of players()) {
            maxBet = Math.max(maxBet, player.totalBet)
        }
        const player = players().find((player) => {
            return player.name == props.name
        })
        setCall(maxBet - player.totalBet)
        console.log({ player: pot() })
    })


    function onTada () {
        const cards = []
        players().forEach((player) => {
            cards.push(...player.cards)
        })
        setShowingCards(cards)
    }

    return (
        <Box
            id={`player-${props.name}`}
            sx={{ display: "inline-block", margin: "1em" }}
        >
            <Card sx={{ width: "fit-content" }}>
                <CardContent>
                    <Stack direction="row">
                        <Stack direction="column">
                            <Profile name={props.name} src={props.src} />
                            <Button variant="xcontained" onClick={onTada}>
                                💥 tada!
                            </Button>
                        </Stack>
                        <Stack direction="column">
                            <Money total={props.total} call={call()} name={props.name} />
                            <Box sx={{ margin: "1em" }}>{props.children}</Box>
                        </Stack>
                    </Stack>
                </CardContent>
                <CardActions></CardActions>
            </Card>
        </Box>
    )
}
