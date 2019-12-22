var Pusle = class {
	constructor(containero) {

		this.gridatoinator = Snips.Noder.create("div", {
			parent: containero,
			classes: "grid"
		});

		this._makeTiles();

		this._randomise();

	}

	_randomise() {

		let used = [];

		for (var i = 0; i < 9; i++) {

			let index = 0;

			while (used.includes(index))
				index = Math.floor(Math.random() * 9);

			used.push(index);

			this.tiles[index].style.left = (i % 3 * 3) + "em"
			this.tiles[index].style.top = Math.floor(i / 3) * 3 + "em";

			console.log(index);
		}
	}

	_makeTiles() {

		this.tiles = [];

		for (var i = 0; i < 9; i++) {
			this.tiles[i] = Snips.Noder.create("div", {
				parent: this.gridatoinator,
				classes: "tile",
			});
		}

		this.realestate = this.tiles[4].classList.add("realestate");
	}
}
