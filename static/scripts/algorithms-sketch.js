let items;
let max_weight;
let total_value;
let total_weight;
let items_in_knapsack;

function solve(){
	total_value = solve_knapsack(items, max_weight);
	total_weight = items.reduce((acc, i)=>acc + (i.selected ? i.weight : 0), 0);
	items_in_knapsack = items.reduce((acc, i)=>acc + (i.selected ? 1 : 0), 0);

	const items_tmp = items;
	items = [];
	let num_selected = 0;
	for (let i=0; i<items_tmp.length; i++){
		const item = items_tmp[i];
		if (item.selected){
			items.splice(num_selected, 0, item);
			num_selected++;
		} else {
			items.push(item);
		}
	}
}

function generate_coords(){
	const in_knapsack = items.filter(i => i.selected);
	const not_in_knapsack = items.filter(i => !i.selected);

	let x = width/2 - max_weight/2 - 30;
	let y = 50;
	for (const i of in_knapsack){
		i.x = x;
		i.y = y;
		x += i.weight;
	}

	x = 50;
	y = 150;
	for (const i of not_in_knapsack){
		if (x + i.weight > width*0.9){
			x = 50;
			y += 70;
		}

		i.x = x;
		i.y = y;

		x += i.weight + 20;
	}
}

function restart_sketch(){
	max_weight = width*0.7;
	max_weight -= max_weight%50;

	items = new Array(10);
	for (let i=0; i<10; i++){
		items[i] = {weight: floor(random()*8)*50+50, value: floor(random()*10)+1, selected: false};
	}

	total_value = 0;
	total_weight = 0;
	items_in_knapsack = 0;
}

function setup(){
	const canvas = createCanvas(windowWidth*0.75,500);
	canvas.parent("sketch");

	restart_sketch();
}

function draw(){
	// determine coordinates of each box
	generate_coords();

	background(200);

	// draw knapsack
	strokeWeight(5);
	stroke(100);
	noFill();
	rect(width/2 - max_weight/2 - 30, 50, max_weight, 50);

	fill(0);
	noStroke();
	textSize(50);
	textAlign(LEFT, CENTER);
	text(`= ${total_value}`, width/2 + max_weight/2 - 30 + 20, 75);

	// draw items
	for (const i of items){
		const highlight = mouse_in_rect(i.x, i.y, i.weight, 50);

		strokeWeight(2);
		stroke(highlight ? 0 : 100);
		fill(highlight ? 100 : 0);
		rect(i.x, i.y, i.weight, 50);

		fill(highlight ? 0 : 255);
		noStroke();
		textSize(40);
		textAlign(CENTER, CENTER);
		text(i.value, i.x + i.weight/2, i.y + 25);

	}
}

function mouseIn(){
	return $("#code-view").attr("aria-hidden")=="true" && (mouseX > 0) && (mouseX < width) && (mouseY > 0) && (mouseY < height);
}

function mouse_in_rect(x, y, width, height){
	return mouseIn() && mouseX >= x && mouseX < x + width && mouseY >= y && mouseY < y + height;
}

function mouseClicked(){
	for (let i=0; i<items.length; i++){
		const item = items[i];
		if (mouse_in_rect(item.x, item.y, item.weight, 50)){
			if (item.selected){
				item.selected = false;
				total_value -= item.value;
				total_weight -= item.weight;
				items_in_knapsack--;

				items.splice(i, 1);
				items.push(item);
			} else if (total_weight + item.weight <= max_weight){
				item.selected = true;
				total_value += item.value;
				total_weight += item.weight;
				items_in_knapsack++;

				items.splice(i, 1);
				items.splice(items_in_knapsack-1, 0, item);
			}
			return;
		}
	}
}



function windowResized(){
	resizeCanvas(windowWidth*0.75, 500);
}