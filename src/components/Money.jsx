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
import { pot, setPot, placeBet } from "./DrPokerGame"
import $ from "jquery"
import config from "./config"
import { tossCoins } from "./animations.jquery"

export function Money (props) {
    const [output, setOutput] = createSignal([])
    const [total, setTotal] = createSignal(props.total)
    const [bet, setBet] = createSignal(5)
    const [call, setCall] = createSignal(props.call)

    createEffect(() => {
        setTotal(props.total || 0)
        setCall(props.call || 0)
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
                const left = Math.random() * 30 + "%"
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

    function onSlide (e) {
        setBet(Math.round(e.target.value)) // ensure it's a number, not a string!
    }

    function onBet (amount = 0) {
        setPot(pot() + amount)
        setTotal(total() - amount)
        setBet(Math.min(amount, Math.round(total() / 2)))
        // todo adjust player's totalBet

        tossCoins(amount, `#player-${props.name} .money`, "#dealer .money")

        console.log({ onBet: amount, pot: pot(), total: total() })
    }

    function onCall () {
        console.log({ clicked: "clicked", bet: bet() })
        onBet(call())
        setCall(0)
    }

    return (
        <div>
            {/* dollar amount */}
            <div style={{ "text-align": "center", "font-size": "larger" }}>
                <span class="capitalize">{props.name || "Total "}</span>
                {props.name ? " has " : ""}$
                {new Intl.NumberFormat("en-US").format(Math.round(total()))}
            </div>
            <div class="money"> {output} </div>

            <Show when={props.controls ?? true}>
                <Button variant="x" onClick={onCall}>
                    call ${call()} 😘
                </Button>
                <Button variant="x" onClick={() => onBet(bet())}>
                    bet ${bet()} 💰
                </Button>
                <Button variant="x">fold 💩</Button>

                {/* slider */}
                <div class="slidecontainer">
                    <input
                        type="range"
                        min="1"
                        max={total()}
                        value={bet()}
                        class="slider"
                        onInput={onSlide}
                    />
                </div>
            </Show>
        </div>
    )
}
