import MenuIcon from "@suid/icons-material/Menu";
import {
    AppBar,
    Box,
    Button,
    IconButton,
    Toolbar,
    Typography,
} from "@suid/material";
import { SignIn, userName, clickClerk, setShowPopUp, show, user } from "./Clerk"
import { Show } from 'solid-js'

export default function () {
    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{ mr: 2 }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        {/* ❤️ Dr. Poker  ♣️ ♦️ ♠️ */}
                        ❤️ Dr. Poker
                    </Typography>
                    <Show when={user().unknown}>
                        <Button color="inherit" onClick={() => { setShowPopUp(true) }}>🔑 Sign In</Button>
                    </Show>

                    <Button color="inherit" onClick={clickClerk}>
                        <SignIn /> <span style={{ "margin-left": "5px" }}>{userName()}</span>
                    </Button>

                </Toolbar>
            </AppBar>
        </Box>
    );
}
