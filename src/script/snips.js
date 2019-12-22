/**
 * @author Adam Jakubczak <adam.jakubczak@protonmail.com>
 *
 * @namespace
 */
var Snips = {};

Snips.getTabWidth = function() {

	return Math.max(
		document.body.scrollWidth,
		document.documentElement.scrollWidth,
		document.body.offsetWidth,
		document.documentElement.offsetWidth,
		document.documentElement.clientWidth
	);
}

Snips.getTabHeight = function() {

	return Math.max(
		document.body.scrollHeight,
		document.documentElement.scrollHeight,
		document.body.offsetHeight,
		document.documentElement.offsetHeight,
		document.documentElement.clientHeight
	);
}

/**
 * Creates nodes
 */
Snips.Noder = class {

	static create(tag = "div", {

		id = null,

		classes = "",
		styles = {},

		html = null,
		text = null,

		previous = null,
		parent = null,
	} = {}) {

		let element = document.createElement(tag);

		if (previous)
			previous.parentElement.insertBefore(element, previous.nextSibling);
		else if (parent)
			parent.appendChild(element);

		if (id)
			element.id = id;

		if (classes) {

			classes = classes.split(" ");
			for (let key in classes)
			element.classList.add(classes[key]);
		}

		for (let key in styles)
			element.style[key] = styles[key];

		if (html)
			element.innerHTML = html;
		else if (text)
			element.innerText = text;

		return element;
	}

	static createAnchor(htmlAttr, {
		href = "#"
	} = {}) {

		let element = this.create("a", htmlAttr);

		element.href = href;

		return element;
	}

	static createInput(htmlAttr, {
		type = "text",

		disabled = false,
		value = null,
		placeholder = null,

		isButton = false,

		scalable = 0,
	} = {}) {

		let tag;

		if (isButton) {

			tag = "button";
		} else {

			tag = "input";

			htmlAttr.html = null;
			htmlAttr.text = null;
		}

		let element = this.create(tag, htmlAttr);

		element.type = type;

		if (disabled)
			element.disabled = true;

		if (value)
			element.value = value;

		if (placeholder)
			element.placeholder = placeholder;

		if (scalable) {

			this.scaleInput(element, scalable);

			element.addEventListener("input", () => this.scaleInput(element, scalable));
		}

		return element;
	}

	static scaleInput(input, min = 5) {

		input.size = (input.value.length >= min) ? input.value.length : min;
	}

}

/**
 * Ajax call
 */
Snips.Call = class {

	static fetch({
		address = null,
		header = "application/x-www-form-urlencoded",
		async = true,
		data = null,
		method = 'POST'
	} = {}) {
		return new Promise((resolve, reject) => {

			let request = new XMLHttpRequest();

			request.open(method.toUpperCase(), address, async);

			request.onload = this.handleResponse;
			request.setRequestHeader("Content-Type", header);

			request.send(this.encode(data));
		});
	}

	handleResponse(request) {

		if (request.status >= 200 && request.status < 300) {

			try {
				resolve({
					json: true,
					data: JSON.parse(request.response),
				});
			} catch (e) {
				resolve({
					json: false,
					data: request.response
				});
			}

		} else {

			reject({
				status: request.status,
				statusText: request.statusText
			});

		}
	}

	encode(data) {

		if (data)
			return Object.keys(data).map(key => key + '=' + data[key]).join('&');
		else
			return null
	}
}
