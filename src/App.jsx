import { createCards, dealCards, bestHand, getRank } from "./cards"
import { For, createSignal, createEffect, onMount } from "solid-js"
import { Box, Card, Stack, CardContent, CardActions } from "@suid/material"
import { FlipIt, FlipFront, FlipBack } from "./FlipIt"
import config from "./config"

function App () {
  const names = ["Henry", "Dork", "Dumby"]
  const cards = createCards()
  const hands = dealCards(cards, names)
  getRank(hands[0], hands)
  return (
    <>
      <Stack direction="row" spacing="1em">
        <Dealer />
        <For each={hands}>
          {(hand) => (
            <>
              <Player name={hand.name} cards={hand.cards} />
            </>
          )}
        </For>
      </Stack>
    </>
  )
}

function Profile (props) {
  const peeps = "blob catwoman dr.strange harleyquinn hulk iceman joker mummy penguin poisonivy riddler scarecrow twoface venom".split(" ")
  const src =
    props.src
      || props.name == "dealer"
      ? "./dist/peeps/dealer.png"
      : `./dist/peeps/${peeps[Math.floor(Math.random() * peeps.length)]}.png`
  const style = {
    ...config.style.profile.image,
    ...props.style,
    background: `url(${src})`,
  }

  return (
    <>
      <div class="capitalize">{props.name || "anonymous"}</div>
      <div style={style}></div>
    </>
  )
}

const Dealer = () => <Player name="dealer" />

function Player (props) {
  const actions =
    props.name == "dealer" ? <DeckOfCards /> : <Hand cards={props.cards} />
  return (
    <>
      <Box>
        <Card sx={{ padding: "1em", width: "fit-content" }}>
          <CardContent>
            <Profile name={props.name} />
          </CardContent>
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
        <For each={["", "", ""]}>
          {(_, i) => {
            const left = i() * 3 + "px"
            const top = i() * 3 + "px"
            const position = "absolute"
            return (
              <div
                style={{
                  ...config.style.back,
                  top,
                  left,
                  position,
                  border: "1px solid white",
                  "border-radius": "3px",
                }}
              />
            )
          }}
        </For>
      </div>
    </>
  )
}

function Hand (props) {
  const [cards, setCards] = createSignal(props.cards)
  return (
    <>
      <Stack direction="row" spacing={1}>
        <For each={cards()}>
          {(card) => (
            <>
              <PlayingCard text={card} clickable></PlayingCard>
            </>
          )}
        </For>
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
    setStyle({ color, "z-index": z() })
  })

  onMount(() => {
    setTimeout(() => {
      setDown(true)
    }, 5000 + Math.random() * 5000)
  })

  return (
    <div
      onClick={() => {
        if (!props.clickable) return
        setDown(!down())
        setZ(++zIndex)
      }}
    >
      <FlipIt flip={down()}>
        <FlipFront>
          <Card>
            <div style={style()}>
              <div>{value}</div>
              <div
                style={{
                  ...config.style.suit,
                  "background-image": `url(/dist/${config.suits[suit]}.png)`,
                }}
              ></div>
            </div>
          </Card>
        </FlipFront>
        <FlipBack>
          <Card>
            <div style={{ ...style(), ...config.style.back }}></div>
          </Card>
        </FlipBack>
      </FlipIt>
    </div>
  )
}

export default App
