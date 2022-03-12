let video;
let predictions = [];

function setup(){
	const canvas = createCanvas(windowWidth*0.75,500);
	canvas.parent("sketch");

	video = createCapture(VIDEO);
	video.id("video");
	video.hide();
}

function draw(){
	const offset_x = (width - video.width)/2
	const offset_y = (height - video.height)/2

	cocoSsd.load().then(model => {
		const img = document.getElementById("video");
		model.detect(img).then(preds => {
		  predictions = preds;
		});
	});

	background(255);

	image(video, offset_x, offset_y);

	for (const p of predictions){
		const box = p.bbox;
		noFill();
		stroke(0,255,0);
		strokeWeight(5);
		rect(box[0] + offset_x, box[1] + offset_y, box[2], box[3]);

		text();
	}
}

function mouseIn(){
	return $("#code-view").attr("aria-hidden")=="true" && (mouseX > 0) && (mouseX < width) && (mouseY > 0) && (mouseY < height);
}



function windowResized(){
	resizeCanvas(windowWidth*0.75, 500);
}