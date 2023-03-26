let num_inputs;
let inputs;
let weights;
let bias;
let offset = 0;


function activation(x){
	return 1/(1 + exp(-x));
}

function extremize(x, degree=2){
	const t = 2*(x-0.5);
	return Math.sign(t)*pow(abs(t),1/(2*degree+1))/2 + 0.5;
}

function restart_sketch(){
	num_inputs = 4;
	inputs = new Array(num_inputs).fill(0);
	weights = inputs.map(()=>10*random()-5);
	bias = 10*random()-5;
	offset += 100;
}

function arrow(x1, y1, x2, y2, head_length = 30, head_angle = PI/4){
	const dx = x2-x1;
	const dy = y2-y1;
	const angle = atan2(dy, dx);
	line(x1, y1, x2, y2);
	line(x2, y2, x2 + head_length*cos(angle + PI + head_angle/2), y2 + head_length*sin(angle + PI + head_angle/2));
	line(x2, y2, x2 + head_length*cos(angle + PI - head_angle/2), y2 + head_length*sin(angle + PI - head_angle/2));
}

function setup(){
	const canvas = createCanvas(windowWidth*0.75,500);
	canvas.parent("sketch");

	randomSeed(2);
	noiseSeed(1);

	restart_sketch();
}

function draw(){
	if (mouseIn()){
		inputs = inputs.map((val, ind)=>extremize(noise(mouseX/100 + 10000*(ind + offset), mouseY/100)));
	} else {
		inputs = [1,1,1,1];
	}

	let perceptron_val = inputs.map((val, ind)=>val*weights[ind]).reduce((x,y)=>x+y, bias);
	perceptron_val = activation(perceptron_val);

	background(200);

	stroke(0);
	strokeWeight(2);
	fill(255 - perceptron_val*255);
	ellipse(3*width/5, height/2, 100, 100);
	
	for (let i=0; i<num_inputs; i++){
		const y = height/5 + 3*height/5*i/(num_inputs-1);

		stroke(0);
		strokeWeight(2);
		fill(255 - inputs[i]*255);
		ellipse(width/4, y, 50, 50);

		strokeWeight(abs(weights[i]));
		stroke(0, 100, 0);
		if (weights[i] < 0){
			stroke(100, 0, 0);
		}
		arrow(width/4 + 55, y, 3*width/5 - 100/2 - 5, 2*height/5 + height/5*i/(num_inputs-1));

	}

	strokeWeight(abs(bias));
	stroke(0, 100, 0);
	if (bias < 0){
		stroke(100, 0, 0);
	}
	arrow(3*width/5, height/5 + 50/2 + 5, 3*width/5, height/2 - 100/2 - 15);
}

function mouseIn(){
	return $("#code-view").attr("aria-hidden")=="true" && (mouseX > 0) && (mouseX < width) && (mouseY > 0) && (mouseY < height);
}


function windowResized(){
	resizeCanvas(windowWidth*0.75, 500);
}