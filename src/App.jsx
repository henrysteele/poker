import { createCards, dealCards, bestHand, getRank } from "./cards"
import { For, createSignal, createEffect, onMount } from "solid-js"
import { Box, Card, Stack, CardContent, CardActions, Container } from "@suid/material"
import { FlipIt, FlipFront, FlipBack } from "./FlipIt"
import { Money } from "./Money"
import config from "./config"


function App () {
  const [total, setTotal] = createSignal(0)
  const [cards, setCards] = createSignal(createCards())
  const names = ["Henry", "Dork", "Dumby"]
  const hands = dealCards([...cards()], names)
  getRank(hands[0], hands)


  setInterval(() => {
    setTotal(total() + 11)
  }, 3000)



  return (
    <>
      <Container>

        <Dealer total={total()}>
          <Stack direction="row" spacing={2}>
            <Stack direction="column" spacing={2} >
              <DeckOfCards />
              <DeckOfCards discard={true} />
            </Stack>

            <Grid list={cards().slice(0, 9).map((card) => <PlayingCard text={card} clickable />)} />

          </Stack>
        </Dealer>



        <For each={hands}>
          {(hand) => (
            <>
              <Player name={hand.name} total={total() / 10}>
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
    <div>
      <div class="capitalize">{props.name || "anonymous"}</div>
      <div style={style}></div>
    </div>
  )
}

function Dealer (props) {

  return <Box sx={{ margin: "1em", display: "inline-block" }}>
    <Card sx={{ padding: "1em", width: "fit-content" }}>
      <CardContent>
        <Stack direction="row">
          <Profile name="dealer" />
          <Money total={props.total} />
        </Stack>
      </CardContent>
      <CardActions>{props.children} </CardActions>
    </Card>
  </Box>

}

function Player (props) {

  return <Box sx={{ display: "inline-block" }}>
    <Card sx={{ width: "fit-content" }}>
      <CardContent>
        <Stack direction="row">
          <Profile name={props.name} />
          <Money total={props.total} />
        </Stack>
      </CardContent>
      <CardActions>{props.children} </CardActions>
    </Card>
  </Box>

}

function DeckOfCards (props) {
  const [cards, setCards] = createSignal(props.cards || createCards())
  return (
    <Box sx={{ width: "70px" }}>
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

function toMatrix (list, width) {
  width = width || Math.floor(Math.sqrt(list.length))
  const matrix = []
  let row = []
  for (let [i, item] of list.entries()) {
    row.push(item)
    if (++i % width == 0) {
      matrix.push(row)
      row = []
    }
  }
  return matrix
}

function Grid (props) {
  const [rows, setRows] = createSignal(toMatrix(props.list))

  return <>
    <Stack direction="column" spacing={1}>
      <For each={rows()}>{(row) => (<>
        <Stack direction="row" spacing={1}>
          <For each={row}>{(item) => <>
            {item}
          </>}</For>
        </Stack>
      </>)}
      </For>
    </Stack>
  </>
}

function Hand (props) {
  return (
    <>
      <Stack direction="row" spacing={1}>
        <Cards {...props} />
      </Stack>
    </>
  )
}

function Cards (props) {
  const [cards, setCards] = createSignal(props.cards)
  return (
    <>
      <For each={cards()}>
        {(card) => <PlayingCard text={card} clickable></PlayingCard>}
      </For>
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
    <Box>
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
    </Box>
  )
}

export default App
