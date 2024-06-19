import { createCards } from "./cards"
import { For, createSignal, createEffect } from "solid-js"
import { Box, Card, Stack, CardContent, CardActions } from "@suid/material"
import config from "./config"

function App () {
  return (
    <>
      <Stack direction="row" spacing="1em">
        <Dealer />
        <Player />
      </Stack>
    </>
  )
}



function Profile (props) {

  const src = props.src || `https://randomuser.me/api/portraits/lego/${Math.floor(Math.random() * 10)}.jpg`
  const style = { ...config.style.profile.image, ...props.style, background: `url(${src})` }

  return <>
    <div class="capitalize">{props.name || "anonymous"}</div>
    <div style={style} ></div>
  </>
}

const Dealer = () => <Player name="dealer" />

function Player (props) {
  const actions = props.name == "dealer" ? <DeckOfCards /> : <Hand cards={["A♣", "A♥", "A♦", "K♠", "Q♠"]} />
  return (
    <>
      <Box>
        <Card sx={{ padding: "1em", width: "fit-content" }}>
          <CardContent><Profile name={props.name} /></CardContent>
          <CardActions>{actions} </CardActions>
        </Card>
      </Box>
    </>
  )
}

function DeckOfCards () {
  const cards = createCards()
  return (
    <>

      <div style={config.style.deck}>
        <For each={["", "", ""]}>{(_, i) => {
          const left = i() * 3 + "px"
          const top = i() * 3 + "px"
          const position = "absolute"
          return <div style={{
            ...config.style.back, top, left, position,
            border: "1px solid white",
            "border-radius": "3px",
          }} />
        }
        }</For>
      </div>

    </>
  )
}

function Hand (props) {
  const [cards, setCards] = createSignal(props.cards)
  return (
    <>
      <Stack direction="row" spacing={1}>
        <For each={cards()}>{(card) => <>
          <PlayingCard text={card} clickable></PlayingCard>
        </>}</For>
      </Stack>
    </>
  )
}

let zIndex = 1

function PlayingCard (props) {

  const [down, setDown] = createSignal(props.down)
  const [z, setZ] = createSignal(1)
  const [style, setStyle] = createSignal("")

  const text = props.text?.trim() || ""
  const value = text.slice(0, text.length - 1)
  const suit = text.slice(-1).toLowerCase()
  const color = config.color[suit]

  createEffect(() => {
    setStyle({ ...config.style.card, ...props.style, color, "z-index": z() })
  })


  return (
    <div onClick={() => {
      if (!props.clickable) return
      setDown(!down())
      setZ(++zIndex)
    }}>
      <Card >
        <Show when={!down()} fallback={<div style={{ ...style(), ...config.style.back }}></div>}>
          <div style={style()}>
            <div>{value}</div>
            <div style={{
              ...config.style.suit,
              "background-image": `url(/dist/${config.suits[suit]}.png)`
            }}></div>
          </div>
        </Show>
      </Card>

    </div>
  )
}

export default App
