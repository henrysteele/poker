
import { For, createSignal, createEffect, onMount } from "solid-js"
import { Box, Card, Stack, CardContent, CardActions, Container } from "@suid/material"

import { Money } from "./Money"
import config from "./config"

export function Profile (props) {
    return (
        <div>
            <div class="capitalize">{props.name || "anonymous"}</div>
            <div style={{
                ...config.style.profile.image,
                ...props.style,
                background: `url(${props.src})`,
            }}></div>
        </div>
    )
}

export function Dealer (props) {

    return <Box id={`dealer`} sx={{ margin: "1em", display: "inline-block" }}>
        <Card sx={{ padding: "1em", width: "fit-content" }}>
            <CardContent>
                <Stack direction="row">
                    <Profile name="dealer" src="/dist/peeps/dealer.png" />
                    <Money total={props.total} />
                </Stack>
            </CardContent>
            <CardActions>{props.children} </CardActions>
        </Card>
    </Box>

}

export function Player (props) {

    return <Box id={`player-${props.name}`} sx={{ display: "inline-block", margin: "1em" }}>
        <Card sx={{ width: "fit-content" }}>
            <CardContent>
                <Stack direction="row">
                    <Profile name={props.name} src={props.src} />
                    <Money total={props.total} />
                </Stack>
            </CardContent>
            <CardActions>{props.children} </CardActions>
        </Card>
    </Box>

}

