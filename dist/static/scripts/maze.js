/* This file was taken and modified from another of my projects */

// information about directions
const PAIRS = {N:"S", S:"N", W:"E", E:"W"};
const DIR_LOOKUP = {N:{dr:-1, dc:0}, S:{dr:1, dc:0}, E:{dr:0, dc:1}, W:{dr:0, dc:-1}};

function Maze(){
	// number of subsections of the maze
	this.size = 4;

	// size (in pixels) of each section
	// the game is a square of size 100 x 100
	this.section_size = height*0.9/4;

	this.wall_width = 6;

	// set up cells
	this.cells = [];
	for (let i=0; i<this.size; i++){
		let row = [];
		for (let j=0; j<this.size; j++){
			row.push({N:true, E:true, S:true, W:true, visited:false});
		}
		this.cells.push(row);
	}

	// create the maze
	this._traverse(0,0);

	// remove random walls to create possible loops
	let row = 2;
	let col = 2;
	let dir = "S";
	let d = DIR_LOOKUP[dir];
	this.cells[row][col][dir] = false;
	this.cells[row + d.dr][col + d.dc][PAIRS[dir]] = false;

	
	// create 2d array of empty 1d arrays
	this.shapes = new Array(this.size);
	for (let i=0; i<this.size; i++){
		this.shapes[i] = new Array(this.size);
		for (let j=0; j<this.size; j++){
			this.shapes[i][j] = new Array;
		}
	}

	// populate 2d array with shapes
	let prev_shapes = {};
	for (let i=0; i<this.size; i++){
		for (let j=0; j<this.size; j++){
			for (const dir in DIR_LOOKUP){
				if (!this.cells[i][j][dir]){
					continue;
				}
				let shapes_in_wall = this._get_wall_shapes(i, j, dir);
				for (const shape of shapes_in_wall){
					// if two shapes are the same, use the same one everywhere
					// allows === checks between shapes in the maze
					if (!prev_shapes.hasOwnProperty(shape.id)){
						prev_shapes[shape.id] = shape;
					}
					const current_shape = prev_shapes[shape.id];
					this.shapes[i][j].push(current_shape);
				}
			}
		}
	}
}

// traverse the cells and knock down walls to create the maze
Maze.prototype._traverse = function (start_row, start_col){
	this.cells[start_row][start_col].visited = true;

	let stack = [{row:start_row, col:start_col}];

	while (stack.length > 0){
		const pos = stack[stack.length - 1];

		const neighbor = this._random_neighbor(pos.row, pos.col);

		if (neighbor===null){
			// backtrack if there are no unvisited neighbors
			stack.pop();
		} else {
			// set neighbor to visited and knock down walls
			this.cells[neighbor.row][neighbor.col].visited = true;

			this.cells[pos.row][pos.col][neighbor.dir] = false;
			this.cells[neighbor.row][neighbor.col][PAIRS[neighbor.dir]] = false;

			stack.push(neighbor);

		}
	}
};

// return a random neighbor that hasn't been visited yet or null if there are none
Maze.prototype._random_neighbor = function (row, col){
	let neighbors = [];

	// make list of possible unvisited neighbors
	for (const dir in DIR_LOOKUP){
		const d = DIR_LOOKUP[dir];
		if (row+d.dr>=0 && row+d.dr<this.size && col+d.dc>=0 && col+d.dc<this.size){
			if (!this.cells[row+d.dr][col+d.dc].visited){
				neighbors.push({dir:dir, row:row+d.dr, col:col+d.dc});
			}
		}
	}

	if (neighbors.length == 0){
		return null;
	}

	// return a random neighbor from list of possibilities
	return neighbors[floor(random()*neighbors.length)];

};

// returns the wall that is the same on the other side
Maze.prototype.get_same_wall = function (row, col, dir){
	const d = DIR_LOOKUP[dir];
	if (row+d.dr>=0 && row+d.dr<this.size && col+d.dc>=0 && col+d.dc<this.size){
		return {row:row+d.dr, col:col+d.dc, dir:PAIRS[dir]};
	} else {
		return null;
	}
}

// draw the maze
Maze.prototype.draw = function (){
	strokeWeight(this.wall_width);
	stroke(80,80,80);

	for (let row=0; row<this.size; row++){
		for (let col=0; col<this.size; col++){

			const cell = this.cells[row][col];
			
			// we only need to draw north and west to avoid repeats
			if (cell.N){
				line(this.section_size*col, this.section_size*row, this.section_size*col + this.section_size, this.section_size*row);
			}
			if (cell.W){
				line(this.section_size*col, this.section_size*row, this.section_size*col, this.section_size*row + this.section_size);
			}
		}
	}

	// draw the outside border
	stroke(0);
	line(0,0,this.section_size*this.size,0);
	line(0,0,0,this.section_size*this.size);
	line(this.section_size*this.size,0,this.section_size*this.size,this.section_size*this.size);
	line(0,this.section_size*this.size,this.section_size*this.size,this.section_size*this.size);
};

// get the position of the center of a cell
Maze.prototype.get_center_pos = function(row, col){
	return {x: col*this.section_size + this.section_size/2, y: row*this.section_size + this.section_size/2}
}

// get the cell that contains the position (x, y)
Maze.prototype.get_cell = function (x, y){
	return {row:floor(y/this.section_size), col:floor(x/this.section_size)};
}


// get a list of all possible shapes in a block of cells
Maze.prototype._get_shapes_in_block = function (min_row, min_col, max_row, max_col){
	let shapes = [];
	let prev_shapes = {};
	for (let i=max(min_row,0); i<=min(max_row,this.size-1); i++){
		for (let j=max(min_col,0); j<=min(max_col,this.size-1); j++){
			for (let shape of this.shapes[i][j]){
				if (!prev_shapes.hasOwnProperty(shape.id)){
					prev_shapes[shape.id] = 0;
					shapes.push(shape);
				}
			}
		}
	}
	return shapes;
};

// get an array of all shapes in the maze a rectangle could possibly be touching
// also works for a circle (using a bounding box)
Maze.prototype.rect_possible_intersect_shapes = function (rectangle){
	const min_cell = this.get_cell(rectangle.x - this.wall_width/2, rectangle.y - this.wall_width/2);
	const max_cell = this.get_cell(rectangle.x + rectangle.width + this.wall_width/2, rectangle.y + rectangle.height + this.wall_width/2);

	return this._get_shapes_in_block(min_cell.row, min_cell.col, max_cell.row, max_cell.col);
};

// a wall is made up of a rectangle with two circles on the ends
Maze.prototype._get_wall_shapes = function (row, col, dir){
	const cell_center = {x: this.section_size*col + this.section_size/2, y: this.section_size*row + this.section_size/2};
	
	const shape_center = {x: cell_center.x + DIR_LOOKUP[dir].dc*this.section_size/2, y: cell_center.y + DIR_LOOKUP[dir].dr*this.section_size/2};

	const orientation = (dir == "N" || dir == "S")?"horizontal":"vertical";
	const is_horizontal = orientation == "horizontal";

	let shapes = [
		{
			type: "rectangle",
			x: shape_center.x - (is_horizontal?this.section_size/2:this.wall_width/2),
			y: shape_center.y - (is_horizontal?this.wall_width/2:this.section_size/2),
			width: (is_horizontal?this.section_size:this.wall_width),
			height: (is_horizontal?this.wall_width:this.section_size),
			orientation: orientation
		},
		{
			type: "circle",
			x: shape_center.x - (is_horizontal?this.section_size/2:0),
			y: shape_center.y - (is_horizontal?0:this.section_size/2),
			r: this.wall_width/2
		},
		{
			type: "circle",
			x: shape_center.x + (is_horizontal?this.section_size/2:0) ,
			y: shape_center.y + (is_horizontal?0:this.section_size/2) ,
			r: this.wall_width/2
		}
	];

	// assign ids to all shapes
	for (const s of shapes){
		s.id = this._get_shape_id(s);
	}

	return shapes;
};

// generate an id for a given shape
Maze.prototype._get_shape_id = function (shape){
	if (shape.type=="rectangle"){
		return "rectangle " + floor(shape.x) + " " + floor(shape.y) + " " + floor(shape.width) + " " + floor(shape.height);
	} else if (shape.type=="circle"){
		return "circle " + floor(shape.x) + " " + floor(shape.y) + " " + floor(shape.r);
	}
	console.log("Uh Oh");
};



Maze.prototype.player_colliding = function (player){

	// find the walls that need to be checked for collisions
	const player_points = [
		{x: player.pos.x + cos(player.angle)*player.length/2 - sin(player.angle)*player.width/2, y: player.pos.y + sin(player.angle)*player.length/2 + cos(player.angle)*player.width/2},
		{x: player.pos.x + cos(player.angle)*player.length/2 + sin(player.angle)*player.width/2, y: player.pos.y + sin(player.angle)*player.length/2 - cos(player.angle)*player.width/2},
		{x: player.pos.x - cos(player.angle)*player.length/2 - sin(player.angle)*player.width/2, y: player.pos.y - sin(player.angle)*player.length/2 + cos(player.angle)*player.width/2},
		{x: player.pos.x - cos(player.angle)*player.length/2 + sin(player.angle)*player.width/2, y: player.pos.y - sin(player.angle)*player.length/2 - cos(player.angle)*player.width/2}
	];
	const x_interval = _project_to_interval(player_points, {x:1,y:0});
	const y_interval = _project_to_interval(player_points, {x:0,y:1});
	const bounding_box = {x:x_interval.start, y:y_interval.start, width:x_interval.end-x_interval.start, height:y_interval.end-y_interval.start};

	// find the shapes that need to be checked for collisions
	const shapes_to_check = this.rect_possible_intersect_shapes(bounding_box);

	const player_shape = {center_x: player.pos.x, center_y: player.pos.y, length: player.length, width: player.width, angle: player.angle};
	
	// check collision on each of the shapes
	for (const s of shapes_to_check){
		let collision;
		if (s.type == "rectangle"){
			collision = check_rot_rectangle_rectangle_collision(player_shape, s);
		} else {
			collision = check_rot_rectangle_circle_collision(player_shape, s);
		}
		if (collision){
			return true;
		}
	}

	return false;

};

// small positive value used to avoid floating point error
const EPSILON = 0.01;

/*
Generic collision checks
*/


// collision information with 1d interval and a 1d interval
// for use in SAT

// i1 = {start:<min of interval>, end:<max of interval>}; <-- this will be moved to resolve collision
// i1 = {start:<min of interval>, end:<max of interval>};
function interval_interval_collision(i1, i2){
	const first = i1.start<i2.start ? i1 : i2;
	const second = first===i1 ? i2 : i1;

	return first.end > second.start + EPSILON;
}

// project a set of points to an interval (the points are the vertices of a convex polygon)

// points = [{x:<x pos>, y:<y:pos>}, {x:<x pos>, y:<y:pos>}, ...];
// vector = {x:<x component>, y:<y component>}; <-- normalized
function _project_to_interval(points, vector){
	const interval_pos = points.map(p=>p.x*vector.x + p.y*vector.y);
	return {start:min(interval_pos), end:max(interval_pos)};
}


// collision information with a rotated rectangle and a rectangle
// uses SAT

// r1 = {center_x:<center x>, center_y:<center y>, length:<length>, width:<width>, angle:<angle of rotation>};
// r2 = {x:<top-left x>, y:<top-left y>, width:<width>, height:<height>};
function check_rot_rectangle_rectangle_collision(r1, r2){

	const r1_points = [
		{x: r1.center_x + cos(r1.angle)*r1.length/2 - sin(r1.angle)*r1.width/2, y: r1.center_y + sin(r1.angle)*r1.length/2 + cos(r1.angle)*r1.width/2},
		{x: r1.center_x + cos(r1.angle)*r1.length/2 + sin(r1.angle)*r1.width/2, y: r1.center_y + sin(r1.angle)*r1.length/2 - cos(r1.angle)*r1.width/2},
		{x: r1.center_x - cos(r1.angle)*r1.length/2 - sin(r1.angle)*r1.width/2, y: r1.center_y - sin(r1.angle)*r1.length/2 + cos(r1.angle)*r1.width/2},
		{x: r1.center_x - cos(r1.angle)*r1.length/2 + sin(r1.angle)*r1.width/2, y: r1.center_y - sin(r1.angle)*r1.length/2 - cos(r1.angle)*r1.width/2}
	];

	const r2_points = [
		{x: r2.x, y:r2.y},
		{x: r2.x + r2.width, y:r2.y},
		{x: r2.x, y:r2.y + r2.height},
		{x: r2.x + r2.width, y:r2.y + r2.height}
	];

	// each axis the shapes need to be projected onto
	const vectors = [
		{x: 1, y: 0},
		{x: 0, y: 1},
		{x: cos(r1.angle), y: sin(r1.angle)},
		{x: -sin(r1.angle), y: cos(r1.angle)}
	];

	for (const v of vectors){
		const r1_interval = _project_to_interval(r1_points, v);
		const r2_interval = _project_to_interval(r2_points, v);

		if (!interval_interval_collision(r1_interval, r2_interval)){
			return false;
		}
	}
	return true;
}


// only check if a rotated rectangle and a circle are colliding

// r = {center_x:<center x>, center_y:<center y>, length:<length>, width:<width>, angle: <angle of rotation>};
// c = {x:<center x>, y:<center y>, r:<radius>};
function check_rot_rectangle_circle_collision(r, c){

	// transform shapes so the rectangle is not rotated
	const rel_c_x = c.x - r.center_x;
	const rel_c_y = c.y - r.center_y;

	const transformed_c_x = cos(r.angle)*rel_c_x + sin(r.angle)*rel_c_y;
	const transformed_c_y = -sin(r.angle)*rel_c_x + cos(r.angle)*rel_c_y;

	// quick check to avoid SAT if there is no intersection
	const x_center_dist = abs(transformed_c_x);
	const y_center_dist = abs(transformed_c_y);
	if (x_center_dist + EPSILON >= c.r + r.length/2 || y_center_dist + EPSILON >= c.r + r.width/2){
		return false;
	}  else if (x_center_dist + EPSILON < r.length/2 || y_center_dist + EPSILON < r.width/2) {
		return true;
	}
	
	return (x_center_dist-r.length/2)*(x_center_dist-r.length/2) + (y_center_dist-r.width/2)*(y_center_dist-r.width/2) + EPSILON < c.r*c.r;
}