function Population(){
	this.size = 100;
	this.mutation_rate = 0.1;
}

Population.prototype.initialize = function() {
	this.population = new Array(this.size).fill().map(x=>this.create_individual(Brain.create_random()));
	this.generation = 0;
	this.num_done = 0;
};

Population.prototype.update_all = function (){
	for (const i of this.population){
		this.update_individual(i);
	}
};

Population.prototype.calc_all_fitness = function (){
	for (const i of this.population){
		this.calc_individual_fitness(i);
	}
};

// select with probability fitness/total fitness
Population.prototype._select_individual = function (){
	const x = random();

	let i = 0;
	let p = this._sorted_pop[i].fitness/this._total_fitness;

	while (x > p){
		i++;
		p += this._sorted_pop[i].fitness/this._total_fitness;
	}

	return this._sorted_pop[i];
};

Population.prototype.generate = function (){
	this._sorted_pop = this.population.sort((x,y)=>y.fitness - x.fitness);
	this._total_fitness = this.population.reduce((total, i)=>total+i.fitness, 0);

	let new_pop = new Array(this.size);

	new_pop[0] = this.create_individual(this._sorted_pop[0].dna);
	for (let i=1; i<this.size; i++){
		const i1 = this._select_individual();
		const i2 = this._select_individual();
		const new_member = this.crossover(i1, i2);
		new_pop[i] = new_member;
	}

	this.population = new_pop;
	this.num_done = 0;
	this.generation ++;
};

Population.prototype.crossover = function(i1, i2) {
	const child = this.create_individual(Brain.combine(i1.dna, i2.dna));
	this.mutate(child);
	return child;
};

Population.prototype.mutate = function(individual) {
	individual.dna.mutate(this.mutation_rate);
};

Population.prototype.create_individual = function(dna){
	const individual_color = color(0, 0, 0, 200);
	return {
		dna: dna,
		done: false, fitness: undefined, steps: 0,
		pos: {x:maze.section_size/2, y:maze.section_size/2}, vel: {x:0, y:0}, angle: PI/4,
		length: maze.section_size/2, width: maze.section_size/3,
		color: individual_color,
		draw: function (){
			push();

			translate(this.pos.x, this.pos.y);
			rotate(this.angle);
			strokeWeight(1);

			let alpha = this.color.levels[3];
			fill(this.color);
			noStroke();
			rect(-this.length/2, -this.width/2, this.length, this.width);
			
			pop();
		}
	}
};

Population.prototype.update_individual = function(individual) {
	if (individual.done){
		return;
	}

	// move
	const forward = individual.dna.predict([individual.pos.x, individual.pos.y, individual.angle]);
	if (forward > 0.5){
		individual.vel.x += cos(individual.angle)*0.1;
		individual.vel.y += sin(individual.angle)*0.1;
	}
	individual.angle += 0.1;
	if (individual.angle >= 2*PI){
		individual.angle -= 2*PI;
	}
	individual.pos.x += individual.vel.x;
	individual.pos.y += individual.vel.y;
	individual.vel.x *= 0.99;
	individual.vel.y *= 0.99;


	individual.steps ++;
	if (maze.player_colliding(individual) || individual.steps > 200){
		individual.done = true;
		this.num_done ++;
	}
};


// fitness should be > 0
Population.prototype.calc_individual_fitness = function(individual) {
	if (individual.done){
		individual.fitness = max(10*individual.pos.x + 10*individual.pos.y - 10*maze.section_size, 0);
	} else {
		console.log("uh oh");
	}
};

// feedforward neural network
// two inputs
// one hidden layer of 10 nodes
// output layer of five nodes
function Brain(){
	this.hidden_weights_dim = [3, 3];
	this.hidden_bias_dim = 3;

	this.output_weights_dim = [3, 1];
	this.output_bias_dim = 1;

	this.sigmoid = function (x){
		return 1/(1+exp(-x));
	}
}

Brain.create_random = function(){
	const res = new Brain();

	res.hidden_weights = new Array(res.hidden_weights_dim[0]).fill().map(x=>new Array(res.hidden_weights_dim[1]));
	for (let i=0; i<res.hidden_weights_dim[0]; i++){
		for (let j=0; j<res.hidden_weights_dim[1]; j++){
			res.hidden_weights[i][j] = random()*10 - 5;
		}
	}

	res.hidden_bias = new Array(res.hidden_bias_dim).fill().map(x=>random()*10 - 5);

	res.output_weights = new Array(res.output_weights_dim[0]).fill().map(x=>new Array(res.output_weights_dim[1]));
	for (let i=0; i<res.output_weights_dim[0]; i++){
		for (let j=0; j<res.output_weights_dim[1]; j++){
			res.output_weights[i][j] = random()*10 - 5;
		}
	}

	res.output_bias = new Array(res.output_bias_dim).fill().map(x=>random()*10 - 5);

	return res;
};

Brain.prototype.copy = function(){
	const res = new Brain();

	res.hidden_weights = new Array(res.hidden_weights_dim[0]).fill().map(x=>new Array(res.hidden_weights_dim[1]));
	for (let i=0; i<res.hidden_weights_dim[0]; i++){
		for (let j=0; j<res.hidden_weights_dim[1]; j++){
			res.hidden_weights[i][j] = this.hidden_weights[i][j];
		}
	}

	res.hidden_bias = new Array(res.hidden_bias_dim).fill().map((val, ind)=>this.hidden_bias[ind]);

	res.output_weights = new Array(res.output_weights_dim[0]).fill().map(x=>new Array(res.output_weights_dim[1]));
	for (let i=0; i<res.output_weights_dim[0]; i++){
		for (let j=0; j<res.output_weights_dim[1]; j++){
			res.output_weights[i][j] = this.output_weights[i][j];
		}
	}

	res.output_bias = new Array(res.output_bias_dim).fill().map((val, ind)=>this.output_bias[ind]);

	return res;
};

Brain.combine = function(b1, b2){
	const res = new Brain();

	res.hidden_weights = new Array(res.hidden_weights_dim[0]).fill().map(x=>new Array(res.hidden_weights_dim[1]));
	for (let i=0; i<res.hidden_weights_dim[0]; i++){
		for (let j=0; j<res.hidden_weights_dim[1]; j++){
			res.hidden_weights[i][j] = random() < 0.5 ? b1.hidden_weights[i][j] : b2.hidden_weights[i][j];
		}
	}

	res.hidden_bias = new Array(res.hidden_bias_dim).fill().map((val, ind)=>{
						return random() < 0.5 ? b1.hidden_bias[ind] : b2.hidden_bias[ind];
					});

	res.output_weights = new Array(res.output_weights_dim[0]).fill().map(x=>new Array(res.output_weights_dim[1]));
	for (let i=0; i<res.output_weights_dim[0]; i++){
		for (let j=0; j<res.output_weights_dim[1]; j++){
			res.output_weights[i][j] = random() < 0.5 ? b1.output_weights[i][j] : b2.output_weights[i][j];
		}
	}

	res.output_bias = new Array(res.output_bias_dim).fill().map((val, ind)=>{
						return random() < 0.5 ? b1.output_bias[ind] : b2.output_bias[ind];
					});

	return res;
};

Brain.prototype.mutate = function(rate){
	for (let i=0; i<this.hidden_weights_dim[0]; i++){
		for (let j=0; j<this.hidden_weights_dim[1]; j++){
			if (random() < rate){
				this.hidden_weights[i][j] += random()*10 - 5;
			}
		}
	}

	for (let i=0; i<this.hidden_bias_dim; i++){
		if (random() < rate){
			this.hidden_bias[i] += random()*10 - 5;
		}
	}

	for (let i=0; i<this.output_weights_dim[0]; i++){
		for (let j=0; j<this.output_weights_dim[1]; j++){
			if (random() < rate){
				this.output_weights[i][j] += random()*10 - 5;
			}
		}
	}

	for (let i=0; i<this.output_bias_dim; i++){
		if (random() < rate){
			this.output_bias[i] += random()*10 - 5;
		}
	}

};

Brain.prototype.predict = function(inputs){
	let hidden_layer = multiply_matrices([inputs], this.hidden_weights)[0];
	for (let i=0; i<this.hidden_bias_dim; i++){
		hidden_layer[i] += this.hidden_bias[i];
		hidden_layer[i] = this.sigmoid(hidden_layer[i]);
	}

	let output_layer = multiply_matrices([hidden_layer], this.output_weights)[0];
	for (let i=0; i<this.output_bias_dim; i++){
		output_layer[i] += this.output_bias[i];
		output_layer[i] = this.sigmoid(output_layer[i]);
	}

	return output_layer;
};

function multiply_matrices(A, B){
	let res = new Array(A.length).fill().map(x=>new Array(B[0].length));
	for (let i=0; i<res.length; i++){
		for (let j=0; j<res[0].length; j++){
			let val = 0;
			for (let k=0; k<B.length; k++){
				val += A[i][k]*B[k][j];
			}
			res[i][j] = val;
		}
	}
	return res;
};