import { createCards, dealCards, bestHand, getRank } from "./cards"
import { For, createSignal, createEffect, onMount } from "solid-js"
import { Box, Card, Stack, CardContent, CardActions, Container } from "@suid/material"
import { FlipIt, FlipFront, FlipBack } from "./FlipIt"
import { Money } from "./Money"
import config from "./config"


function App () {
  const [total, setTotal] = createSignal(0)
  const names = ["Henry", "Dork", "Dumby"]
  const cards = createCards()
  const hands = dealCards(cards, names)
  getRank(hands[0], hands)


  setInterval(() => {
    setTotal(total() + Math.random() * 100)
  }, 500)

  return (
    <>
      <Container>

        <Dealer>
          <Money total={total()} />
          <Stack direction="row" spacing={1}>
            <DeckOfCards />
            <DeckOfCards discard={true} />
          </Stack>
          <Stack direction="row" spacing={1}>
            <Hand cards={"2♠,3♥,4♣,5♦,6♣".split(",")} />
            <Hand cards={"A♠,A♥,A♣,K♦,K♠".split(",")} />
          </Stack>

        </Dealer>

        <For each={hands}>
          {(hand) => (
            <>
              <Player name={hand.name}>
                <Hand cards={hand.cards} />
              </Player>
            </>
          )}
        </For>
      </Container>
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

const Dealer = (props) => <Player name="dealer" >{props.children}</Player>

function Player (props) {

  return <Box sx={{ margin: "1em", display: "inline-block" }}>
    <Card sx={{ padding: "1em", width: "fit-content" }}>
      <CardContent>
        <Profile name={props.name} />
      </CardContent>
      <CardActions>{props.children} </CardActions>
    </Card>
  </Box>

}

function DeckOfCards (props) {
  const [cards, setCards] = createSignal(props.cards || createCards())
  return (
    <Box>
      <div style={{ position: "relative", height: "100px", }}>
        <For each={cards()}>
          {(card, i) => {
            let style
            if (props.discard) {
              style = {
                position: "absolute",
                transform: `rotate(${-33 + Math.round(Math.random() * 66)}deg)`,
                top: `${Math.floor(Math.random() * 20)}px`,
                left: `${Math.floor(Math.random() * 20)}px`
              }
            } else {
              style = {
                position: "absolute",
                top: `${Math.min(15, i() * 3)}px`,
                left: `${Math.min(15, i() * 3)}px`
              }
            }
            return <div style={style}>
              <PlayingCard text={card} down={!props.discard}></PlayingCard>
            </div>
          }}
        </For>
      </div>
    </Box>
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
      setDown(props.down ?? true)
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
                  "background-image": `url(/dist/cards/${config.suits[suit]}.png)`,
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
