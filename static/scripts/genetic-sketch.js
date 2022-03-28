let maze;
let population;
let should_evolve_100;
let started = false;
let w;

function start(){
	started = true;
	$("#start").remove();
	$(".tools").css("display", "block");
}

function restart_sketch(){
	randomSeed(1);

	maze = new Maze();

	population = new Population();
	population.initialize();

	should_evolve_100 = false;
}

function evolve_100(){
	should_evolve_100 = true;
}

function setup(){
	const canvas = createCanvas(windowWidth*0.75,500);
	canvas.parent("sketch");

	frameRate(30);

	textAlign(LEFT, TOP);
	
	textSize(30);
	w = textWidth("Generation: 99999");

	restart_sketch();
}

function draw(){
	background(200);

	fill(0);
	noStroke();
	text(`Generation: ${population.generation}`, 25, 50);

	translate(max((width-height)/2, w + 25),0.1*height/2);
	for (const individual of population.population){
		if (started){
			population.update_individual(individual);
		}
		individual.draw();
	}
	maze.draw();

	
	if (population.num_done == population.size){
		population.calc_all_fitness();
		population.generate();
		for (let i=0; i<19; i++){
			while (population.num_done < population.size){
				population.update_all();
			}
			population.calc_all_fitness();
			population.generate();
		}
	}

	if (should_evolve_100){
		for (let i=0; i<100; i++){
			while (population.num_done < population.size){
				population.update_all();
			}
			population.calc_all_fitness();
			population.generate();
		}
		should_evolve_100 = false;
	}

}

function mouseIn(){
	return $("#code-view").attr("aria-hidden")=="true" && (mouseX > 0) && (mouseX < width) && (mouseY > 0) && (mouseY < height);
}

function windowResized(){
	resizeCanvas(windowWidth*0.75, 500);
}