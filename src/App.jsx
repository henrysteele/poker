import { createCards, dealCards, bestHand, getRank } from "./components/cards"
import { For, createSignal, createEffect, onMount } from "solid-js"
import { Box, Card, Stack, CardContent, CardActions, Container } from "@suid/material"

import { Player, Dealer } from "./components/Player"
import { PlayingCard, DeckOfCards, Grid, Hand } from "./components/PlayingCards"

function App () {
  const [total, setTotal] = createSignal(0)
  const [cards, setCards] = createSignal(createCards())
  const names = ["Henry", "Dork", "Dumby"]
  const hands = dealCards([...cards()], names)
  getRank(hands[0], hands)


  setInterval(() => {
    setTotal(total() + 11)
  }, 30)



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


export default App
