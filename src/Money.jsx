import { For, createSignal, createEffect, onMount } from "solid-js"
import "./Money.css"

export function Money (props) {

    const denominations = [5000, 1000, 50, 15, 6, 2, 1]
    const [output, setOutput] = createSignal([])

    createEffect(() => {
        let total = Math.round(props.total)
        let out = []

        denominations.forEach((denominator) => {
            const label = "coin coin" + denominator
            const count = Math.floor(total / denominator)
            for (let i = 0; i < Math.min(count, 5); i++) {
                const bottom = Math.random() * 2 + '%'
                const left = Math.random() * 30 + '%'

                out.push(<div class={label} style={{ bottom, left }}>
                    <img src={`/dist/coins/${denominator}.png`} />
                </div>)
            }
            total -= count * denominator
        })
        setOutput(out)
    })


    return <div>
        <div class="money"> {output} </div>
        <div style={{ "text-align": "center", "font-size": "larger" }}>
            ${new Intl.NumberFormat('en-US').format(Math.round(props.total))}
        </div>
    </div>
}