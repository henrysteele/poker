
import { For, createSignal, createEffect, onMount } from "solid-js"
import "./MoveIt.css"

export function MoveIt (props) {
    let ref
    const [style, setStyle] = createSignal("")

    createEffect(() => {
        if (!props.to) return

        const top = props.to.top;
        const left = props.to.left;
        const position = "absolute"
        const transition = "left 2s ease, top 2s ease"

        ref.animate({ top, left, position, transition }, { duration: 2000 })
    })


    return <div class={"moveit"} ref={ref} >
        {props.children}
    </div>
}