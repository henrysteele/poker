import { For, createSignal, createEffect, onMount } from "solid-js"
import {
  Box,
  Card,
  Stack,
  CardContent,
  CardActions,
  Container,
  Button,
  ButtonGroup,
} from "@suid/material"
import "./Money.css"
import {
  pot,
  setPot,
  placeBet,
  activePlayerName,
  players,
  wallets,
} from "./DrPokerGame"
import $ from "jquery"
import config from "./config"
import { tossCoins } from "./animations.jquery"
import { createMap } from "./helpers"

export function Money(props) {
  const [output, setOutput] = createSignal([])
  const [total, setTotal] = createSignal(props.total)
  const [bet, setBet] = createSignal(5)
  const [call, setCall] = createSignal(props.call)
  const [showSlider, setShowSlider] = createSignal()
  const [busy, setBusy] = createSignal(false)

  createEffect(() => {
    setTotal(props.total || 0)
  })

  createEffect(() => {
    setCall(props.call || 0)
  })

  createEffect(() => {
    setShowSlider(!(total() < 2 || call() > 0))
  })

  createEffect(() => {
    let value = Math.round(total())
    let out = []

    const denominations = [5000, 1000, 50, 15, 6, 2, 1]
    denominations.forEach((denomination) => {
      const label = "coin coin" + denomination
      const count = Math.floor(value / denomination)

      for (let i = 0; i < Math.min(count, 3); i++) {
        const bottom = Math.random() * 2 + "%"
        const left = 50 - Math.random() * 20 + "%"
        const mirror = Math.random() > 0.5 ? "mirror" : ""
        const src = `/dist/coins/${denomination}.png`

        out.push(
          <div class={label} style={{ bottom, left }}>
            <img class={mirror} src={src} />
          </div>
        )
      }
      value = value - count * denomination
    })
    setOutput(out)
  })

  function onSlide(e) {
    setBet(Math.round(e.target.value)) // ensure it's a number, not a string!
  }

  function findMin() {
    let minWallet = Infinity
    Object.values(wallets()).forEach((wallet) => {
      minWallet = Math.min(minWallet, wallet)
    })
    return minWallet
  }

  function onBet(amount = 0) {
    if (bet() > findMin()) setBet(findMin())
    if (activePlayerName()) {
      setBusy(true)
      amount = Math.max(0, Math.min(amount, total()))
      tossCoins(
        amount,
        `#player-${props.name?.condense()} .money`,
        "#dealer .money",
        () => {
          if (amount > findMin()) amount = findMin()
          setPot(pot() + amount)
          placeBet(props.name, amount)
          setBet(Math.min(amount, Math.round(total() / 2)))

          setBusy(false)
        }
      )
    }
  }

  function onCall() {
    if (call() > findMin()) setCall(findMin())
    onBet(call())
    setCall(0)
  }

  createEffect(() => {
    if (props.name == activePlayerName()) {
      const me = players().find((player) => player.name == activePlayerName())
      if (me?.bot) {
        // automate play
        if (call() > total()) setCall(total())
        onCall()
        setTimeout(() => {
          if (bet() > total()) setBet(total())
          onBet(Math.min(total(), config?.bot?.bet || 5))
        }, 500)
      }
    }
  })

  return (
    <Box>
      {/* dollar amount */}
      <div style={{ "text-align": "center", "font-size": "larger" }}>
        <span class="capitalize">{props.name || "Total "}</span>
        {props.name ? " has " : ""}$
        {new Intl.NumberFormat("en-US").format(Math.round(total()))}
      </div>

      <Button
        variant="x"
        fullWidth
        disabled={busy() || total() == 0}
        onClick={() => {
          if (call() == 0) {
            onBet(bet())
          } else onCall()
        }}
      >
        <Box class="money"> {output()} </Box>
      </Button>

      <Show when={props.controls ?? true}>
        <Box>
          <Button variant="x" disabled={busy() || call() == 0} onClick={onCall}>
            call {call() ? "$" + call() : ""} 😘
          </Button>

          <Button
            variant="x"
            onClick={() => onBet(bet())}
            disabled={busy() || call() > 0 || total() == 0}
          >
            bet ${bet()} 💰
          </Button>

          <Button variant="x">fold 💩</Button>

          {/* slider */}
          <div class={"slidecontainer " + (!showSlider() && "hideSlider")}>
            <input
              type="range"
              min="1"
              max={Math.min(100, total())}
              value={bet()}
              class="slider"
              onInput={onSlide}
              disabled={!showSlider()}
            />
          </div>
        </Box>
      </Show>
    </Box>
  )
}
