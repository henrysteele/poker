import $ from "jquery"
import config from "./config"

const $coin = $(`<img height='20px' src="/dist/coins/1.png">`)
const $coinAudio = $(`<audio preload src="/dist/audio/coin.m4a">`)
const $cardAudio = $(`<audio preload src="/dist/audio/card.m4a">`)

export function tossIt(it, from, to, callback, audio, volume = 0.1) {
	if (audio) {
		audio = $(audio).clone()[0]
		audio.volume = volume
		audio.currentTime = 0
		audio.play()
	}

	const speed = config.card?.speed || 400
	const $doc = $("#root")
	const $it = $(it)
	const $clone = $it.clone()
	$it.css("opacity", 0)

	$clone
		.css({ opacity: 1, position: "absolute", ...from })
		.appendTo($doc)
		.animateRotate(360 * 2)
		.animate(to, speed, () => {
			$clone.remove()
			callback?.call()
		})
}

function getMiddleOffset($elem) {
	if (!$elem) return {}
	$elem = $($elem)
	const height = $elem.height()
	const width = $elem.width()
	let { top, left } = $elem.offset()
	top += Math.round(height / 2)
	left += Math.round(width / 2)
	return { top, left }
}

export function tossCoins(amount, fromSelector, toSelector) {
	// animate coin toss
	let time = 0
	const wait = 100

	for (let i = 0; i < Math.min(10, amount); i++) {
		setTimeout(() => {
			tossIt(
				$coin,
				getMiddleOffset(fromSelector),
				getMiddleOffset(toSelector),
				null,
				$coinAudio
			)
		}, time)
		time += wait
	}
}

//---

$.fn.animateRotate = function (angle, duration, easing, complete) {
	return this.each(function () {
		var $elem = $(this)

		$({ deg: 0 }).animate(
			{ deg: angle },
			{
				duration: duration,
				easing: easing,
				step: function (now) {
					$elem.css({
						transform: "rotate(" + now + "deg)",
					})
				},
				complete: complete || $.noop,
			}
		)
	})
}

export function tossCard(fromSelector, toSelector, callback) {
	const $id = $(fromSelector)
	tossIt(
		$id,
		getMiddleOffset(fromSelector),
		getMiddleOffset(toSelector),
		callback,
		$cardAudio
	)
}
