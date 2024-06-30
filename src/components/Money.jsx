import { For, createSignal, createEffect, onMount } from "solid-js"
import { Box, Card, Stack, CardContent, CardActions, Container, Button, ButtonGroup } from "@suid/material"
import "./Money.css"
import { pot, setPot } from "./DrPokerGame"

export function Money (props) {
    const [output, setOutput] = createSignal([])
    const [total, setTotal] = createSignal(props.total)
    const [bet, setBet] = createSignal(5)

    createEffect(() => {
        setTotal(props.total)
    })

    createEffect(() => {
        let value = Math.round(total())
        let out = []

        const denominations = [5000, 1000, 50, 15, 6, 2, 1]
        denominations.forEach((denomination) => {
            const label = "coin coin" + denomination
            const count = Math.floor(value / denomination)

            for (let i = 0; i < Math.min(count, 3); i++) {
                const bottom = Math.random() * 2 + '%'
                const left = (Math.random() * 30) + '%'
                const mirror = Math.random() > .5 ? "mirror" : ""
                const src = `/dist/coins/${denomination}.png`

                out.push(<div class={label} style={{ bottom, left }}>
                    <img class={mirror} src={src} />
                </div>)
            }
            value = value - count * denomination
        })
        setOutput(out)
    })


    function onSlide (e) {
        setBet(e.target.value)
    }

    function onBet () {
        setPot(pot() + bet())
        setTotal(total() - bet())
        setBet(Math.min(bet(), Math.round(total() / 2)))
        console.log({ onBet: bet(), pot: pot(), total: total() })
    }


    return <div>

        {/* dollar amount */}
        <div style={{ "text-align": "center", "font-size": "larger" }} >
            <span class="capitalize">{props.name || "Total "}</span>
            {props.name ? " has " : ""}
            ${new Intl.NumberFormat('en-US').format(Math.round(total()))}
        </div>
        <div class="money"> {output} </div>

        <Show when={props.controls ?? true}>
            <Button variant="x">call 😘</Button>
            <Button variant="x" onClick={onBet}>bet ${bet()} 💰</Button>
            <Button variant="x">fold 💩</Button>

            {/* slider */}
            <div class="slidecontainer">
                <input type="range" min="1" max={total()} value={bet()} class="slider" onInput={onSlide} />
            </div>
        </Show>
    </div>
}