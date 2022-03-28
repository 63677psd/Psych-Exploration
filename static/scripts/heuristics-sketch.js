let items;
let max_weight;
let algo_total_value;
let heuristic_total_value;
let last_action;
let failed;
let prev_size;

function solve(){
	heuristic_total_value = heuristic_knapsack(items, max_weight);
	algo_total_value = solve_knapsack(items, max_weight);
}

function generate_coords(){
	const algo_in_knapsack = items.filter(i => i.selected);
	const heuristic_in_knapsack = items.filter(i => i.heuristic_selected);

	let x = width/2 - max_weight/2 + 30;
	let y = 50;
	for (const i of heuristic_in_knapsack){
		i.heuristic_x = x;
		i.heuristic_y = y;
		x += i.weight;
	}

	x = width/2 - max_weight/2 + 30;
	y = height - 100;
	for (const i of algo_in_knapsack){
		i.algo_x = x;
		i.algo_y = y;
		x += i.weight;
	}

	x = 50;
	y = 150;
	for (const i of items){
		if (x + i.weight > width*0.9){
			x = 50;
			y += 70;
			if (y >= 150 + 3*70 && failed<20){
				if (last_action == "restart_sketch"){
					restart_sketch();
				} else {
					generate_diff();
				}
				return false;
			}
		}

		i.options_x = x;
		i.options_y = y;

		x += i.weight + 20;
	}

	return true;
}

function restart_sketch(){
	max_weight = width*0.6;
	max_weight -= max_weight%50;

	items = new Array(7);
	for (let i=0; i<7; i++){
		items[i] = {weight: floor(random()*6)*50+100, value: floor(random()*10)+1};
	}

	items.sort((x,y)=>(y.value - x.value));
	items.sort((x,y)=>(y.value/y.weight - x.value/x.weight));

	solve();

	last_action = "restart_sketch";
}

function generate_diff(){
	restart_sketch();
	while (algo_total_value == heuristic_total_value){
		restart_sketch();
	}
	last_action = "generate_diff";
}

function draw_block(x, y, weight, value){
	strokeWeight(2);
	stroke(100);
	fill(0);
	rect(x, y, weight, 50);

	fill(255);
	noStroke();
	textSize(40);
	textAlign(CENTER, CENTER);
	text(value, x + weight/2, y + 25);
}

function setup(){
	const canvas = createCanvas(windowWidth*0.75,500);
	canvas.parent("sketch");

	prev_size = windowWidth*0.75;
	failed = 0;

	generate_diff();
}

function draw(){
	// determine coordinates of each box
	while (!generate_coords()){
		failed++;
		console.log(failed);
	}

	background(200);

	// draw knapsack for heuristic
	strokeWeight(5);
	stroke(100);
	noFill();
	rect(width/2 - max_weight/2 + 30, 50, max_weight, 50);

	fill(0);
	noStroke();
	textSize(50);
	textAlign(LEFT, CENTER);
	text(`= ${heuristic_total_value}`, width/2 + max_weight/2 + 30 + 20, 75);
	textSize(30);
	textAlign(RIGHT, CENTER);
	text("Heuristic:", width/2 - max_weight/2, 75);

	// draw knapsack for algorithm
	strokeWeight(5);
	stroke(100);
	noFill();
	rect(width/2 - max_weight/2 + 30, height-100, max_weight, 50);

	fill(0);
	noStroke();
	textSize(50);
	textAlign(LEFT, CENTER);
	text(`= ${algo_total_value}`, width/2 + max_weight/2 + 30 + 20, height-75);
	textSize(30);
	textAlign(RIGHT, CENTER);
	text("Algorithm:", width/2 - max_weight/2, height-75);

	// draw items
	for (const i of items){
		draw_block(i.options_x, i.options_y, i.weight, i.value);
		if (i.heuristic_selected){
			draw_block(i.heuristic_x, i.heuristic_y, i.weight, i.value);
			fill(200, 220);
			noStroke();
			rect(i.options_x-5, i.options_y-5, i.weight+10, 25+5);
		}
		if (i.selected){
			draw_block(i.algo_x, i.algo_y, i.weight, i.value);
			fill(200, 220);
			noStroke();
			rect(i.options_x-5, i.options_y + 25, i.weight+10, 25+5);
		}

	}
}

function mouseIn(){
	return $("#code-view").attr("aria-hidden")=="true" && (mouseX > 0) && (mouseX < width) && (mouseY > 0) && (mouseY < height);
}



function windowResized(){
	resizeCanvas(windowWidth*0.75, 500);
	if (abs(prev_size - windowWidth*0.75) > 50){
		max_weight = width*0.6;
		max_weight -= max_weight%50;
		prev_size = windowWidth*0.75;
		if (last_action == "restart_sketch"){
			restart_sketch();
		} else {
			generate_diff();
		}
	}
	failed = 0;
}