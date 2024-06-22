import { For, createSignal, createEffect, onMount } from "solid-js"
import "./Money.css"

export function Money (props) {
    const [output, setOutput] = createSignal([])

    createEffect(() => {
        let total = Math.round(props.total)
        let out = []

        const denominations = [5000, 1000, 50, 15, 6, 2, 1]
        denominations.forEach((denomination) => {
            const label = "coin coin" + denomination
            const count = Math.floor(total / denomination)
            for (let i = 0; i < Math.min(count, 3); i++) {
                const bottom = Math.random() * 2 + '%'
                const left = (Math.random() * 30) + '%'

                out.push(<div class={label} style={{ bottom, left }}>
                    <img src={`/dist/coins/${denomination}.png`} />
                </div>)
            }
            total = total - count * denomination
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