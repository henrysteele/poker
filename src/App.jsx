
import { For, createSignal, createEffect, onMount } from "solid-js"
import { Box, Card, Stack, CardContent, CardActions, Container } from "@suid/material"
import AppBar from "./components/AppBar"

import { DrPokerGame } from "./components/DrPokerGame"

function App () {

  return (
    <>
      <AppBar />
      <Container>
        <DrPokerGame />
      </Container>
    </>
  )
}


export default App
