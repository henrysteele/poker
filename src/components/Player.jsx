
import { For, createSignal, createEffect, onMount } from "solid-js"
import { Box, Card, Stack, CardContent, CardActions, Container } from "@suid/material"

import { Money } from "./Money"
import config from "./config"

export function Profile (props) {
    const peeps = "blob catwoman dr.strange harleyquinn hulk iceman joker mummy penguin poisonivy riddler scarecrow twoface venom".split(" ")
    const src =
        props.src
            || props.name == "dealer"
            ? "./dist/peeps/dealer.png"
            : `./dist/peeps/${peeps[Math.floor(Math.random() * peeps.length)]}.png`
    const style = {
        ...config.style.profile.image,
        ...props.style,
        background: `url(${src})`,
    }

    return (
        <div>
            <div class="capitalize">{props.name || "anonymous"}</div>
            <div style={style}></div>
        </div>
    )
}

export function Dealer (props) {

    return <Box sx={{ margin: "1em", display: "inline-block" }}>
        <Card sx={{ padding: "1em", width: "fit-content" }}>
            <CardContent>
                <Stack direction="row">
                    <Profile name="dealer" />
                    <Money total={props.total} />
                </Stack>
            </CardContent>
            <CardActions>{props.children} </CardActions>
        </Card>
    </Box>

}

export function Player (props) {

    return <Box sx={{ display: "inline-block", margin: "1em" }}>
        <Card sx={{ width: "fit-content" }}>
            <CardContent>
                <Stack direction="row">
                    <Profile name={props.name} />
                    <Money total={props.total} />
                </Stack>
            </CardContent>
            <CardActions>{props.children} </CardActions>
        </Card>
    </Box>

}

