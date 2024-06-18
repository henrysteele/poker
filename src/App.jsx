import { createCards } from "./cards"
import { For } from "solid-js"

function App() {
  return (
    <>
      <Dealer />
      <Player />
    </>
  )
}

function Dealer() {
  return (
    <>
      <div>
        I'm a Dealer!
        <Deck />
      </div>
    </>
  )
}

function Player() {
  return (
    <>
      <div>
        I'm a Player!
        <Hand />
      </div>
    </>
  )
}

function Deck() {
  const cards = createCards()
  return (
    <>
      <div>I'm a Deck! {cards[0]}</div>
      <div class="stack">
        <For each={cards}>{(text) => <Card text={text} />}</For>
      </div>
    </>
  )
}

function Hand() {
  return (
    <>
      <div>I'm a Hand!</div>
    </>
  )
}

function Card(props) {
  return (
    <>
      <div class="card">{props.text}</div>
    </>
  )
}

export default App
