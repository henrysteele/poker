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
  setWallets,
  activePlayer, status,
  setStatus,
  setPot,
  setActivePlayer
} from "./DrPokerGame"

import { createMap } from "./helpers"

import { getRank } from "./cards"


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
    <Box id={`dealer`} sx={{ margin: "1em", display: "inline-block", float: "left" }}>
      <Card sx={{ padding: "1em", width: "fit-content", userSelect: "none" }}>
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

    function winner () {
      let maxScore = 0
      let winningName = "" 
        for (let name in hands()) {
          const rank = getRank(hands()[name]).score
          if (rank > maxScore) {
            maxScore = rank
            winningName = name
          }
      }
      return winningName
    }

  function onTada () {
    const cards = Object.values(hands()).flat(Infinity)
    setShowingCards(cards)
    setStatus(winner() + " won!")
    setActivePlayer("")
    let temp = structuredClone(wallets()) 
    temp[winner()] += pot()
    setWallets(temp)
    setPot(0)
  }

  const disabled = {
    "pointer-events": "none",
    opacity: 0.5
  }

  return (
    <Box

      id={`player-${props.name.condense()}`}
      sx={{
        display: "inline-block", margin: "1em", userSelect: "none",
        ...(activePlayer() != props.name ? disabled : {})
      }}
    >
      <Card sx={{
        ...{ width: "fit-content" },
        ...(activePlayer() == props.name ? { boxShadow: "0px 2px 1px -1px green, 0px 1px 1px 0px green, 0px 1px 3px 0px green" } : {})
      }}>
        <CardContent>
          <Stack direction="row">
            <Stack direction="column">
              <Profile name={props.name} src={props.src} />
              <Button variant="xcontained" onClick={onTada} disabled={call() != 0}>
                💥 tada!
              </Button>
            </Stack>
            <Stack direction="column">
              <Money total={props.total} call={call()} name={props.name} />
              <Box sx={{ margin: "1em", ...(call() ? disabled : {}) }}>{children(props.children)}</Box>
            </Stack>
          </Stack>
        </CardContent>
        <CardActions></CardActions>
      </Card>
    </Box>

  )
}
