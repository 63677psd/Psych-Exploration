function Population(){
	this.size = 50;
	this.get_mutation_rate = () => max(0, 0.6 - 0.5*this.generation/500) + 0.01;
}

Population.prototype.initialize = function() {
	this.population = new Array(this.size).fill().map(x=>this.create_individual({
								move:new Array(500).fill().map(x=>random()),
								turn: new Array(500).fill().map(x=>2*random() - 1)
							}));
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
	const new_dna = {
						move:new Array(500).fill().map((val, ind)=>random() < 0.5 ? i1.dna.move[ind] : i2.dna.move[ind]),
						turn: new Array(500).fill().map((val, ind)=>random() < 0.5 ? i1.dna.turn[ind] : i2.dna.turn[ind])
					};
	const child = this.create_individual(new_dna);
	this.mutate(child);
	return child;
};

Population.prototype.mutate = function(individual) {
	const rate = this.get_mutation_rate();
	for (let i=0; i<500; i++){
		if (random() < rate){
			individual.dna.move[i] += random() - 0.5;
		}
		if (random() < rate){
			individual.dna.turn[i] += random() - 0.5;
		}
	}
};

Population.prototype.create_individual = function(dna){
	const individual_color = color(0, 0, 0, 100);
	return {
		dna: dna,
		done: false, fitness: undefined, steps: 0,
		pos: {x:maze.section_size/2, y:maze.section_size/2}, vel: {x:0, y:0}, angle: 0,
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
	const move = individual.dna.move[individual.steps];
	const turn = individual.dna.turn[individual.steps];

	if (move > 0.5){
		individual.vel.x += cos(individual.angle)*0.6;
		individual.vel.y += sin(individual.angle)*0.6;
	}
	if (turn > 0.5){
		individual.angle += 0.1;
	} else if (turn < -0.5){
		individual.angle -= 0.1;
	}
	if (individual.angle >= 2*PI){
		individual.angle -= 2*PI;
	} else if (individual.angle <= -2*PI){
		individual.angle += 2*PI;
	}
	individual.pos.x += individual.vel.x;
	individual.pos.y += individual.vel.y;
	individual.vel.x *= 0.95;
	individual.vel.y *= 0.95;


	individual.steps ++;
	// max(0, individual.pos.x + individual.pos.y - maze.section_size) < individual.steps - 50
	if (maze.player_colliding(individual) || individual.steps > 500){
		individual.done = true;
		this.num_done ++;
	}
};


// fitness should be > 0
Population.prototype.calc_individual_fitness = function(individual) {
	if (individual.done){
		individual.fitness = max(individual.pos.x + individual.pos.y - maze.section_size, 0);
		if (individual.pos.x > maze.section_size*3 && individual.pos.y > maze.section_size*3){
			individual.fitness += individual.vel.x*10000;
			individual.fitness += (500-individual.steps)*100;
		}
	} else {
		console.log("uh oh");
	}
};

