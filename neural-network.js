// me testing adding a comment

function Neural_Network(arr){
	this.layer_sizes = arr.slice();
	this.weights = [];
	this.biases = [];
}


function setup(){
	const canvas = createCanvas(windowWidth*0.75,500);
	canvas.parent("sketch");
}

function draw(){
	background(200);
}

function mouseIn(){
	return (mouseX > 0) && (mouseX < width) && (mouseY > 0) && (mouseY < height);
}

function windowResized(){
	resizeCanvas(windowWidth*0.75, 500);
}