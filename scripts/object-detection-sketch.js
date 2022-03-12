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

	if (frameCount%100 == 0){
		cocoSsd.load().then(model => {
			const img = document.getElementById("video");
			model.detect(img).then(preds => {
			  predictions = preds;
			});
		});
	}

	background(255);

	image(video, offset_x, offset_y);

	for (const p of predictions){
		const box = p.bbox;
		const c = color(0,255,0,floor(255*p.score))

		noFill();
		stroke(c);
		strokeWeight(5);
		rect(box[0] + offset_x, box[1] + offset_y, box[2], box[3]);

		fill(c);
		noStroke();
		textSize(30);
		textAlign(CENTER, CENTER);
		text(`${p.class}`, box[0] + box[2]/2 + offset_x, box[1]+15+offset_y);
	}
}

function mouseIn(){
	return $("#code-view").attr("aria-hidden")=="true" && (mouseX > 0) && (mouseX < width) && (mouseY > 0) && (mouseY < height);
}



function windowResized(){
	resizeCanvas(windowWidth*0.75, 500);
}