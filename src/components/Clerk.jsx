import { Clerk } from "@clerk/clerk-js"
import {
  For,
  createSignal,
  createEffect,
  onMount,
  children,
  Show,
} from "solid-js"
import {
  Box,
  Card,
  Stack,
  CardContent,
  CardActions,
  Container,
  Button,
  Dialog,
} from "@suid/material"

export const [user, setUser] = createSignal({ unknown: true })
export const [show, setShowPopUp] = createSignal(true)

export function userName() {
  return (
    user().username ||
    user().firstName ||
    user().primaryEmailAddress?.split("@")[0]
  )
}

export function clickClerk() {
  if (user().unknown) document.getElementById("sign-in")?.firstChild?.click()
  else document.getElementById("user-button")?.firstChild?.click()
}

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

export function SignIn(props) {
  onMount(async () => {
    const tmp = new Clerk(clerkPubKey)
    await tmp.load()

    if (!tmp.user) tmp.mountSignIn(document.getElementById("sign-in"))
    else tmp.mountUserButton(document.getElementById("user-button"))
    setUser(tmp?.user || { unknown: true })
    setShowPopUp(!tmp.user)
  })

  return (
    <>
      <div id="user-button"></div>
      <Dialog onClose={() => setShowPopUp(false)} open={show()}>
        <div id="sign-in"></div>
      </Dialog>
    </>
  )
}
