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

import { Money } from "./Money"
import config from "./config"
import {
  setShowingCards,
  players,
  setPlayers,
  pot,
  hands,
  bets,
  wallets,
  activePlayer, status
} from "./DrPokerGame"

export function Profile (props) {
  return (
    <div>
      <div
        style={{
          ...config.style.profile.image,
          ...props.style,
          background: `url(${props.src})`,
          ...(activePlayer() == props.name ? { "box-shadow": "#82a21c 0px 0px 30px" } : {})
        }}
      ></div>
      <div>{status()}</div>
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
    let maxBet = Object.values(bets()).reduce(
      (acc, cur) => Math.max(acc, cur),
      0
    )
    setCall(maxBet - bets()[props.name])
  })

  function onTada () {
    const cards = Object.values(hands()).flat(Infinity)
    setShowingCards(cards)
  }

  const disabled = {
    "pointer-events": "none",
    opacity: 0.5
  }

  return (
    <Box

      id={`player-${props.name}`}
      sx={{
        display: "inline-block", margin: "1em",
        ...(activePlayer() != props.name ? disabled : {})
      }}
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
              <Box sx={{ margin: "1em" }}>{children(props.children)}</Box>
            </Stack>
          </Stack>
        </CardContent>
        <CardActions></CardActions>
      </Card>
    </Box>

  )
}
