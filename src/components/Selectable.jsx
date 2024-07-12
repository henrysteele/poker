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
        const iAmTopCard = id == topCard()

        if (selectedIds().includes(id)) {  // you can always unselect, unless it's topcard
            setSelectable(id != topCard())
            return
        } else if (selectedIds().length == 0 && iAmTopCard) {
            setSelectable(true)
            return
        } else if (selectedIds().length == 1) {
            const selected = selectedIds()[0]
            const selectedIsDiscarded = grid().includes(selected) || discards().includes(selected)
            const iAmDiscarded = grid().includes(id) || discards().includes(id)

            // can't swap with the deck or other discards
            if (iAmTopCard || iAmDiscarded && selectedIsDiscarded) {
                setSelectable(false)
                return
            }
        }
        // else
        setSelectable(!iAmTopCard) // topcard can only be the first selected
    })

    createEffect(() => {
        const id = props.id // trigger on id
        const temp = {
            ...props.style,
            ...(selected() ? { transform: "rotate(-15deg)" } : {}),
            ...(selected() && discards().includes(id) ? { top: "-10px" } : {}),
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