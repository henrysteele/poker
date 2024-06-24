import { createSignal, createEffect } from "solid-js"

export const [selectedIds, setSelectedIds] = createSignal([]) //[id]

export function Selectable (props) {
    const [selected, select] = createSignal(false)

    createEffect(() => {
        select(selectedIds().includes(props.id))
    })

    const sx = {
        transform: "rotate(-15deg)",

    }

    return <div id={props.id} style={selected() ? sx : ""}
        onClick={() => {
            if (selected()) setSelectedIds(selectedIds().filter((id) => id != props.id)) // remove
            else setSelectedIds([...new Set([...selectedIds(), props.id])]) // add
        }}
    >
        {props.children}
    </div>
}