String.prototype.condense = function (value = "", regx = /[^\w]+/g) {
	return this.replaceAll(regx, value)
}

export function createMap(listOfAttributes, value = "") {
	const tmp = {}
	listOfAttributes.forEach((attr) => {
		if (typeof attr != "string") return
		tmp[attr] = structuredClone(value)
	})
	console.log({ createMap: tmp })
	return tmp
}
