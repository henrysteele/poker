import { createSignal } from "solid-js"

class Solid {
	constructor(accessor) {
		accessor = accessor.length == 2 ? accessor : createSignal(accessor)

		if (
			!(
				accessor.length == 2 &&
				typeof accessor[0] == "function" &&
				typeof accessor[1] == "function"
			)
		)
			accessor = createSignal(accessor)

		this.get = accessor[0]
		this.set = accessor[1]
	}

	get data() {
		return this.get()
	}
	set data(v) {
		this.set(v)
	}
}
