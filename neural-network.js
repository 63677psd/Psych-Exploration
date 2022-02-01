function matrixMultNaive(A,B){
	
}

function matrixMultGPU(A,B){
	
}

function matrixMultMathJS(A,B){
	
}

// if you figure out c++ things you could also implement one with that

// time matrix*matrix on square matrix
function timeMatrixMult(func, size, iter){
	// performance.now() gives the time
	// generate matrices
	// loop through iter iterations
	// 		multiply the matrices
	// get the time again
	
	// test this and the next method with each of the multiplication methods
	// there could be a different better one for matrices and vectors also depending on the size
}

// time matrix*vector with square matrix
function timeVectorMult(func, size, iter){
	
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