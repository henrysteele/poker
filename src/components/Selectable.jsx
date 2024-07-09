import { createSignal, createEffect, children } from "solid-js"
import { showingCards, deck, topCard, grid, discards } from './DrPokerGame'

export const [selectedIds, setSelectedIds] = createSignal([]) //[id]

export function Selectable (props) {
    const [selected, select] = createSignal(false)
    const [selectable, setSelectable] = createSignal(false)
    const [sx, setSx] = createSignal({})

    createEffect(() => {
        select(selectedIds().includes(props.id))
    })

    createEffect(() => {
        const id = props.id

        if (selectedIds().length == 1) {
            const selected = selectedIds()[0]
            const selectedIsDiscarded = grid().includes(selected) || discards().includes(selected)
            const iAmDiscarded = grid().includes(id) || discards().includes(id)
            if (iAmDiscarded && selectedIsDiscarded) {
                setSelectable(false)
                return
            }
        }

        setSelectable(id != topCard() || id == topCard() && selectedIds().length == 0)
    })

    createEffect(() => {
        const id = props.id // trigger on id
        const temp = {
            ...props.style,
            ...(selected() ? { transform: "rotate(-15deg)" } : {}),
            cursor: selectable() ? "grab" : "not-allowed"
        }
        setSx(temp)
    })


    function onClick () {
        const id = props.id
        if (!selectable()) return
        if (selected()) {
            setSelectedIds(selectedIds().filter((sid) => sid != id)) // remove
        } else if (selectable()) {
            setSelectedIds([...new Set([...selectedIds(), id])]) // add
        }
    }



    return <div id={props.id} style={sx()} onClick={onClick} >
        {children(props.children)}
    </div>
}