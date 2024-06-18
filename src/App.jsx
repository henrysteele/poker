import { createCards } from "./cards"
import { For, createSignal, createEffect } from "solid-js"

function App () {
  return (
    <>
      <Dealer />
      <Player />
    </>
  )
}

function Dealer () {
  return (
    <>
      <div>
        I'm a Dealer!
        <Deck />
      </div>
    </>
  )
}

function Player () {
  return (
    <>
      <div>
        I'm a Player!
        <Hand />
      </div>
    </>
  )
}

function Deck () {
  const cards = createCards()
  return (
    <>

      <div class="stack">
        <For each={["", "", ""]}>{(_, i) => {
          const left = i() * 3 + "px"
          const top = i() * 3 + "px"
          return <Card down={true} style={{ top, left }} />
        }
        }</For>
      </div>

      <div class="stack">
        <For each={cards}>{(text) => {
          const top = Math.random() * 30 + "vh"
          const left = Math.random() * 70 + "vw"
          const rotate = -33 + Math.random() * 66 + "deg"
          return <Card text={text} down={Math.round(Math.random() - .3)} style={{ top, left, rotate }} />
        }
        }</For>
      </div>
    </>
  )
}

function Hand () {
  return (
    <>
      <div>I'm a Hand!</div>
    </>
  )
}

let zIndex = 1

function Card (props) {

  const [down, setDown] = createSignal(props.down)
  const [toss, setToss] = createSignal(true)
  const [z, setZ] = createSignal(1)
  const [style, setStyle] = createSignal("")

  // const faces = "♠♥♣♦"
  const text = props.text?.trim() || ""
  const value = text.slice(0, text.length - 1)
  const suit = text.slice(-1)
  const color = "♥♦".includes(suit) ? "red" : "black"

  createEffect(() => {
    setStyle({ ...props.style, color, "z-index": z() })
  })


  return (
    <div onClick={() => {
      setDown(!down())
      setToss(false)
      setZ(++zIndex)
    }}>
      <div class={`card ${toss() && "toss"} ${down() && "down"}`} style={style()}>
        <div class="content">
          <div class="front">
            <div class="value">{value}</div>
            <div class="suit">{suit}</div>
          </div>
          <div class="back down"></div>
        </div>
      </div>

    </div>
  )
}

export default App
