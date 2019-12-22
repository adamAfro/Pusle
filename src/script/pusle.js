var Pusle = class {
	constructor(htmlAttr, {
		imageUrl = "https://picsum.photos/256",
		tileWidth = 3, width = 3, unit = "em",
	} = {}) {

		this.tileWidth = tileWidth;
		this.width = width;
		this.unit = unit;
		this.imageUrl = imageUrl;

		this.gridatoinator = Snips.Noder.create("div", htmlAttr);

		this.gridatoinator.style

		this._makeTiles();

		this._randomise();

	}

	get surface() {
		return this.width ** 2;
	}

	moveTile(tile) {

		let neighbours = this.getNeighbours(tile);

		console.log(neighbours);

		let neighbour = (neighbours.up && neighbours.up.classList.contains("realestate")) ? neighbours.up :
			(neighbours.down && neighbours.down.classList.contains("realestate")) ? neighbours.down :
			(neighbours.left && neighbours.left.classList.contains("realestate")) ? neighbours.left :
			(neighbours.right && neighbours.right.classList.contains("realestate")) ? neighbours.right :
			null;

		console.log(neighbour);

		if (neighbour) {

			let top = neighbour.style.top, left = neighbour.style.left;

			neighbour.style.top = tile.style.top;
			neighbour.style.left = tile.style.left;

			tile.style.top = top;
			tile.style.left = left;
		}
	}

	getNeighbours(tile) {

		let neighbours = {};

		for (let target of this.tiles) {

			// TODO optymalizacja

			let direction, isColumn, isRow, isAbove, isUnder, isLeft, isRight;

			isColumn = parseFloat(target.style.left) == parseFloat(tile.style.left);

			isRow = parseFloat(target.style.top) == parseFloat(tile.style.top);

			isAbove = (parseFloat(target.style.top) + this.tileWidth == parseFloat(tile.style.top));

			isUnder = (parseFloat(target.style.top) - this.tileWidth == parseFloat(tile.style.top));

			isLeft = (parseFloat(target.style.left) + this.tileWidth == parseFloat(tile.style.left));

			isRight = (parseFloat(target.style.left) - this.tileWidth == parseFloat(tile.style.left));

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

			this.tiles[index].style.left = (i % this.width) * this.tileWidth + this.unit
			this.tiles[index].style.top = Math.floor(i / this.width) * this.tileWidth + this.unit;
		}
	}

	_makeTiles() {

		this.tiles = [];

		for (let i = 0; i < this.surface; i++) {

			this.tiles[i] = Snips.Noder.create("div", {
				parent: this.gridatoinator,
				classes: "tile",
				styles: {
					"position": 'absolute',
					"width": this.tileWidth + this.unit,
					"height": this.tileWidth + this.unit,
					"background-image": "url(" + this.imageUrl + ")",
					"background-size": this.surface + this.unit,
					"background-position":
						(i % this.width * this.tileWidth) + this.unit + " " +
						(Math.floor(i / this.width) * this.tileWidth) + this.unit
				}
			});

			this.tiles[i].addEventListener("click", () => this.moveTile(this.tiles[i]));
		}

		this.realestate = this.tiles[4]

		this.realestate.classList.add("realestate");
		this.realestate.style.background = "white";
	}
}
