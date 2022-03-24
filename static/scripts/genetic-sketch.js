let maze;
let population;
let go = true;

function setup(){
	const canvas = createCanvas(windowWidth*0.75,500);
	canvas.parent("sketch");

	maze = new Maze();

	population = new Population();
	population.initialize();

	frameRate(30);
}

function draw(){
	translate((width-height)/2,0.1*height/2);
	background(200);
	for (const individual of population.population){
		population.update_individual(individual);
		individual.draw();
	}
	maze.draw();

	if (population.num_done == population.size){
		population.calc_all_fitness();
		population.generate();
		for (let i=0; i<100; i++){
			while (population.num_done < population.size){
				population.update_all();
			}
			population.calc_all_fitness();
			population.generate();
		}
	}

}

function mouseIn(){
	return $("#code-view").attr("aria-hidden")=="true" && (mouseX > 0) && (mouseX < width) && (mouseY > 0) && (mouseY < height);
}

function windowResized(){
	resizeCanvas(windowWidth*0.75, 500);
}