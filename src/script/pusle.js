var Pusle = class {
	constructor(containero) {

		this.tileWidth = 3;
		this.width = 3;
		this.height = 3;
		this.unit = "em";

		this.gridatoinator = Snips.Noder.create("div", {
			parent: containero,
			classes: "grid"
		});

		this._makeTiles();

		this._randomise();

	}

	get surface() {
		return this.width * this.height;
	}

	moveTile(tile) {

		console.log(this.getNeighbours(tile));
	}

	getNeighbours(tile) {

		let neighbours = {};

		for (let i = 0; i < this.tiles.length; i++) {

			let direction;
			let isColumn, isRow, isAbove, isUnder, isLeft, isRight;

			isColumn = parseFloat(this.tiles[i].style.left) == parseFloat(tile.style.left);

			isRow = parseFloat(this.tiles[i].style.top) == parseFloat(tile.style.top);

			isAbove = (parseFloat(this.tiles[i].style.top) + parseFloat(this.tileWidth)
				== parseFloat(tile.style.top));

			isUnder = (parseFloat(this.tiles[i].style.top) - parseFloat(this.tileWidth)
				== parseFloat(tile.style.top));

			isLeft = (parseFloat(this.tiles[i].style.left) + parseFloat(this.tileWidth)
				== parseFloat(tile.style.left));

			isRight = (parseFloat(this.tiles[i].style.left) - parseFloat(this.tileWidth)
				== parseFloat(tile.style.left));

			if (isAbove && isColumn)
				direction = "up";
			else if (isUnder && isColumn)
				direction = "down";
			else if (isLeft && isRow)
				direction = "left";
			else if (isRight && isRow)
				direction = "right";

			if (direction)
				neighbours[direction] = this.tiles[i];
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
			this.tiles[index].style.top = Math.floor(i / this.height) * this.tileWidth + this.unit;
		}
	}

	_makeTiles() {

		this.tiles = [];

		for (let i = 0; i < this.surface; i++) {

			this.tiles[i] = Snips.Noder.create("div", {
				parent: this.gridatoinator,
				classes: "tile",
			});

			this.tiles[i].addEventListener("click", () => this.moveTile(this.tiles[i]));
		}

		this.realestate = this.tiles[4].classList.add("realestate");
	}
}
