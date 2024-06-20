import "./Flipit.css"

//You can see full tutorial here
// https://dev.to/mugas/flip-cards-with-javascript-2ad0
// https://www.ricardomoreira.io/blog/2020-06-15-flip-cards-with-javascript


export function FlipIt (props) {
    return <>
        <section class="cards">
            <div class={`cards__single ${props.flip ? " flip " : ""}`}>
                {props.children}
            </div>
        </section>
    </>
}

export function FlipFront (props) {
    return <>
        <div class="cards__front">
            {props.children}
        </div>
    </>
}

export function FlipBack (props) {
    return <>
        <div class="cards__back">
            {props.children}
        </div>
    </>
}
