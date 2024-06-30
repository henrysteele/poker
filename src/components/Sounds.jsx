import { For, createSignal, createEffect, onMount } from "solid-js"
import $ from "jquery"


// the following enables overlapping sounds from the same src path, default is 5 concurrent sounds
// the sound files must be queued up in advance using <Audio src={} />


const elements = {}

export function play (src) {
    if (!elements[src]) {
        elements[src] = $(`audio[src='${src}']`)
    }
    const $list = elements[src]
    for (let i = 0; i < $list.length; i++) {
        if (!$list[i].paused) continue // skip ones that are currently playing
        $list[i].play()
    }
}

export function Audio (props) {
    return <div id={props.id}>
        <For each={new Array(props.count || 5)}>{
            () => <audio src={props.src} ></audio>
        }</For>
    </div>
}
