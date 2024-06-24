
import { For, createSignal, createEffect, onMount } from "solid-js"
import $ from "jquery"
import config from "./config"

$.fn.animateRotate = function (angle, duration, easing, complete) {
    var args = $.speed(duration, easing, complete);
    var step = args.step;
    return this.each(function (i, e) {
        args.complete = $.proxy(args.complete, e);
        args.step = function (now) {
            $.style(e, 'transform', 'rotate(' + now + 'deg)');
            if (step) return step.apply(e, arguments);
        };

        $({ deg: 0 }).animate({ deg: angle }, args);
    });
};


export function MoveIt (props) {
    let ref

    createEffect(() => {
        if (!props.to) return

        const speed = config.card?.speed || props.speed || 400
        const [top, left] = props.to

        $(ref).css({ position: "absolute" })
            .animateRotate(360)
            .animate({ top, left }, speed)

    })

    return <div ref={ref} >
        {props.children}
    </div>
}