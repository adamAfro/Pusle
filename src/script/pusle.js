/**
 * @namespace
 */
var Pusle = {}

Pusle.events = {
	win: new CustomEvent("puslewon"),
};

Pusle.Game = class {
	constructor(htmlAttr, {
		imageUrl = "https://picsum.photos/256",
		tileWidth = 3, width = 3, unit = "em",
	} = {}) {

		this._tileWidth = tileWidth;
		this._width = width;
		this._unit = unit;
		this._imageUrl = imageUrl;

		htmlAttr.styles = {
			"position": "relative",
			"width": width * tileWidth + unit,
			"height": width * tileWidth + unit,
			"background-size": this._width * this._tileWidth + this._unit,
		}

		this._gridatoinator = Snips.Noder.create("div", htmlAttr);

		this._tiles = [];
		this._realestate;

		this._makeTiles();

		this._randomise();

		this.isWorking = false;
	}

	// turn() {
	//
	// 	this.turnOff() || this.turnOn();
	// }

	turnOn() {

		if (!this.isWorking) {

			for (let i = 0; i < this.surface; i++)
				this._tiles[i]
					.addEventListener("click", () => this._moveTile(this._tiles[i]));

			this.isWorking = true;

			return true;
		} else
			return false;
	}

	// turnOff() {
	//
	// 	if (this.isWorking) {
	//
	// 		for (let i = 0; i < this.surface; i++)
	// 			this._tiles[i]
	// 				.removeEventListener("click", () => this._moveTile(this._tiles[i]));
	//
	// 		this.isWorking = false;
	//
	// 		return true;
	// 	} else
	// 		return false
	// }

	get surface() {
		return this._width ** 2;
	}

	makeWin() {

		console.log("OSZUST");

		this._tiles.forEach((tile) => {

			let targetPosition = tile.style["background-position"].split(/(\s+)/);

			tile.style.left = Math.abs(parseFloat(targetPosition[0])) + this._unit;
			tile.style.top = Math.abs(parseFloat(targetPosition[2])) + this._unit; // [1] == "
			// absolute bo inaczej tło nie działa
		});
	}

	isWon() {

		return this._tiles.every((tile) => {

			let targetPosition = tile.style["background-position"].split(/(\s+)/);

			targetPosition[0] = Math.abs(parseFloat(targetPosition[0]));
			targetPosition[1] = Math.abs(parseFloat(targetPosition[2])); // [1] == "
			// absolute bo inaczej tło nie działa
			targetPosition.splice(2);

			let position = [
				parseFloat(tile.style.left),
				parseFloat(tile.style.top)
			];

			if ((position[0] != targetPosition[0]) || (position[1] != targetPosition[1]))
				return false;
			else
				return true;
		});
	}

	win() {

		// this.turnOff();

		this._tiles.forEach(tile => tile.remove());
		this._tiles = [];

		this._gridatoinator.style["background-image"] = "url(" + this._imageUrl + ")";

		this._gridatoinator.parentNode.dispatchEvent(Pusle.events.win);
	}

	_moveTile(tile) {

		let neighbours = this._getNeighbours(tile);

		let neighbour = (neighbours.up && neighbours.up.classList.contains("realestate")) ? neighbours.up :
			(neighbours.down && neighbours.down.classList.contains("realestate")) ? neighbours.down :
			(neighbours.left && neighbours.left.classList.contains("realestate")) ? neighbours.left :
			(neighbours.right && neighbours.right.classList.contains("realestate")) ? neighbours.right :
			null;

		if (neighbour) {

			let top = neighbour.style.top, left = neighbour.style.left;

			neighbour.style.top = tile.style.top;
			neighbour.style.left = tile.style.left;

			tile.style.top = top;
			tile.style.left = left;

			if (this.isWon())
				this.win();
		}
	}

	_getNeighbours(tile) {

		let neighbours = {};

		for (let target of this._tiles) {

			// TODO optymalizacja

			let direction, isColumn, isRow, isAbove, isUnder, isLeft, isRight;

			isColumn = parseFloat(target.style.left) == parseFloat(tile.style.left);

			isRow = parseFloat(target.style.top) == parseFloat(tile.style.top);

			isAbove = (parseFloat(target.style.top) + this._tileWidth == parseFloat(tile.style.top));

			isUnder = (parseFloat(target.style.top) - this._tileWidth == parseFloat(tile.style.top));

			isLeft = (parseFloat(target.style.left) + this._tileWidth == parseFloat(tile.style.left));

			isRight = (parseFloat(target.style.left) - this._tileWidth == parseFloat(tile.style.left));

			if (isAbove && isColumn)
				direction = "up";
			else if (isUnder && isColumn)
				direction = "down";
			else if (isLeft && isRow)
				direction = "left";
			else if (isRight && isRow)
				direction = "right";

			if (direction)
				neighbours[direction] = target;
		}

		return neighbours;
	}

	_randomise() {

		let used = [];

		for (var i = 0; i < this.surface; i++) {

			let index = 0;

			while (used.includes(index))
				index = Math.floor(Math.random() * this.surface);

			used.push(index);

			this._tiles[index].style.left = (i % this._width) * this._tileWidth + this._unit
			this._tiles[index].style.top = Math.floor(i / this._width) * this._tileWidth + this._unit;
		}
	}

	_makeTiles() {

		for (let i = 0; i < this.surface; i++) {

			this._tiles[i] = Snips.Noder.create("div", {
				parent: this._gridatoinator,
				classes: "tile",
				text: i,
				styles: {
					"position": 'absolute',
					"width": this._tileWidth + this._unit,
					"height": this._tileWidth + this._unit,
					"background-image": "url(" + this._imageUrl + ")",
					"background-size": this._width * this._tileWidth + this._unit,
					"background-position": this._makeBackgroundPosition(i)
				}
			});

			//this._tiles[i].addEventListener("click", () => this._moveTile(this._tiles[i]));
		}

		this._realestate = this._tiles[0]

		this._realestate.classList.add("realestate");
		this._realestate.style["background-image"] = "none";
	}

	_makeBackgroundPosition(i) {
		return "-" + (i % this._width * this._tileWidth) + this._unit + " -" +
		(Math.floor(i / this._width) * this._tileWidth) + this._unit
		// minus bo inaczej tło nie działa
	}
}
