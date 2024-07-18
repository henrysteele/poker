export default {
  profilenames: (
    "catwoman dr.strange harleyquinn hulk iceman joker mummy" +
    " penguin poisonivy riddler scarecrow twoface venom blob"
  ).split(" "),

  suits: {
    "♠": "spades",
    "♥": "hearts",
    "♣": "clubs",
    "♦": "diamonds",
    s: "spades",
    h: "hearts",
    c: "clubs",
    d: "diamonds",
  },
  color: {
    "♠": "black",
    "♥": "red",
    "♣": "black",
    "♦": "red",
    s: "black",
    h: "red",
    c: "black",
    d: "red",
  },
  style: {
    card: {
      width: "40px",
      height: "60px",
      "border-radius": "3px",
      background: "white",
      "backface-visibility": "hidden",
    },
    suit: {
      height: "40px",
      width: "40px",
      "background-size": "cover",
      "background-image": `url(/dist/cards/spades.png)`,
    },
    back: {
      width: "40px",
      height: "60px",
      // transform: "rotateY(180deg)",
      // transition: "transform 0.5s",
      background: "white",
      "background-image": "url(/dist/cards/bicycle.back.png)",
      "background-size": "cover",
      "background-color": "white",
      "backface-visibility": "hidden",
    },
    deck: {
      position: "relative",
      display: "inline-block",
      "user-select": "none",
      height: "100px",
    },
    profile: {
      image: {
        "border-radius": "50%",
        background: `url()`,
        width: "75px",
        height: "90px",
        "background-size": "cover",
        "box-shadow": "0 0 15px rgba(0, 0, 0, .5)",
        margin: "1em",
      },
    },
  },
}
