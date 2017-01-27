define([

], function(

) {
	return {
		size: null,
		walkability: null,
		fCost: [],
		spt: [],
		frontier: [],
		target: null,
		init: function(walkability) {
			this.walkability = walkability;
			this.size = {
				x: this.walkability.length,
				y: this.walkability[0].length
			};
		},
		randomPosition: function() {
			while (true) {
				var x = _.randInt(this.size.x - 1);
				var y = _.randInt(this.size.y - 1);

				if (this.walkability[x][y]) {
					return {
						x: x * 16,
						y: y * 16
					};
				}
			}
		},
		setPath: function(from, to, furthest) {
			var distance = 0;

			if (!to) {
				to = this.randomPosition();
			}

			this.setTarget(to);
			this.calcF(from, to);

			this.spt = [];
			this.frontier = [];

			//Get the ID of the actor's tile
			var source = this.getIDDiv(from.x, from.y);

			//This is where our path starts
			this.spt.push({
				id: source
			});
			//Add left, right, top and bottom tiles as options for next steps
			this.addNeighbors(source, this.frontier);

			var nextID = -1;
			var parent = null;

			//While we have options left
			while (this.frontier.length > 0) {
				//First node in frontier will always be the closest to the target
				if (furthest) {
					nextID = this.frontier[this.frontier.length - 1];
					this.frontier = [];
				}
				else {
					nextID = this.frontier[0];
					this.frontier.splice(0, 1);
				}
				
				//Find out how we got to this node (previous step)
				parent = this.findParent(nextID);
				this.spt.push({
					id: nextID,
					parent: parent
				});
				//Add left, right, top and bottom tiles as options for next steps
				this.addNeighbors(nextID);

				//If we're close enough, break
				if (furthest) {
					if (_.randInt(0, 10) == 0)
						break;
				} else {
					if (this.fCost[nextID] <= distance)
						break;
				}

				if (this.spt.length > 100) {
					return [];
				}
			}

			return this.rebuildPath();
		},
		addNeighbors: function(id, front) {
			var v = this.getCoordinatesFromID(id);

			if (v.y > 0)
				this.addFrontier(v.x, v.y - 1);
			if (v.x > 0)
				this.addFrontier(v.x - 1, v.y);
			if (v.y < (this.size.y - 1))
				this.addFrontier(v.x, v.y + 1);
			if (v.x < (this.size.x - 1))
				this.addFrontier(v.x + 1, v.y);
		},
		addFrontier: function(x, y) {
			var valid = this.walkability[x][y];

			if (valid) {
				var index = this.getID(x, y);
				var found = false;
				var f = 0;
				var inserted = false;

				var thisF = this.fCost[index];

				for (var i = 0; i < this.frontier.length; i++) {
					var t = this.getCoordinatesFromID(this.frontier[i]);
					f = this.fCost[this.frontier[i]];

					if (this.frontier[i] == index)
						break;

					if (f > thisF) {
						if ((i < this.frontier.length - 1) && (this.frontier[i + 1] == index))
							break;

						if (this.findParentHelper(index) == null) {
							this.frontier.splice(i, 0, index);
							inserted = true;
							break;
						}
					}
				}

				if ((this.frontier.length == 0) || (!inserted)) {
					if (this.findParentHelper(index) == null)
						this.frontier.push(index);
				}
			}
		},
		calcF: function(from, to) {
			this.fCost = [];

			var tf = 0;
			var f = 0;

			var tv = this.getCoordinatesFromTarget();

			for (var i = 0; i < this.size.x; i++) {
				tf = Math.pow(tv.x - i, 2);
				for (var j = 0; j < this.size.y; j++) {
					f = tf + Math.pow(tv.y - j, 2);
					this.fCost.push(f);
				}
			}
		},
		setTarget: function(target) {
			this.target = {
				x: ~~(target.x / 16),
				y: ~~(target.y / 16)
			};
			this.calcF();
		},
		findParent: function(id) {
			var tempID = -1;
			var result = null;

			var v = this.getCoordinatesFromID(id);

			//Left
			if (v.x > 0) {
				tempID = ((v.x - 1) * this.size.y) + v.y;
				result = this.findParentHelper(tempID);
				if (result != null)
					return result;
			}
			//Right
			if (v.x < (this.size.x - 1)) {
				tempID = ((v.x + 1) * this.size.y) + v.y;
				result = this.findParentHelper(tempID);
				if (result != null)
					return result;
			}
			//Top
			if (v.y > 0) {
				tempID = (v.x * this.size.y) + v.y - 1;
				result = this.findParentHelper(tempID);
				if (result != null)
					return result;
			}
			//Bottom
			if (v.y < (this.size.y - 1)) {
				tempID = (v.x * this.size.y) + v.y + 1;
				result = this.findParentHelper(tempID);
				if (result != null)
					return result;
			}

			//No parent found
			return null;
		},
		findParentHelper: function(id) {
			for (var i = 0; i < this.spt.length; i++) {
				if (this.spt[i].id == id)
					return this.spt[i];
			}

			return null;
		},
		rebuildPath: function() {
			var path = [];

			var tempNode = this.spt[this.spt.length - 1];

			while (tempNode != null) {
				var pos = this.getCoordinatesFromID(tempNode.id);
				path.push(pos);
				tempNode = tempNode.parent;
			}

			return path;
		},
		getID: function(x, y) {
			return ((x * this.size.y) + y);
		},
		getIDDiv: function(x, y) {
			return ((~~(x / 16) * this.size.y) + ~~(y / 16));
		},
		getCoordinatesFromTarget: function() {
			return {
				x: this.target.x,
				y: this.target.y
			};
		},
		getCoordinatesFromID: function(id) {
			var v = {
				x: 0,
				y: 0
			};
			v.x = parseInt(id / this.size.y);
			v.y = parseInt(id - (v.x * this.size.y));

			return v;
		}
	};
});