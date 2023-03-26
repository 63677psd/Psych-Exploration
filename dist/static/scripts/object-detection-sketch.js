let model;
let model_loaded = false;
let predictions = [];

let video = {width:0,height:0};

let showing_webcam = false;
let webcam_loaded = false;

const image_links = {
	Brady: "assets/static/assets/brady.jpg",
	City: "assets/static/assets/city.jpg",
	Family: "assets/static/assets/family.jpg",
	Office: "assets/static/assets/office.jpg",
	People: "assets/static/assets/people.png"
};
let images = {};
let showing_image = "Brady";

function get_image(){
	if (webcam_loaded){
		return document.getElementById("video");
	} else {
		return document.getElementById("img-"+showing_image);
	}
}

function create_video(){
	webcam_loaded = false;
	video = createCapture(VIDEO);
	video.id("video");
	video.hide();
	$("#video").on("loadeddata", ()=>{webcam_loaded=true})
}

function create_image(name, url){
	images[name] = createImg(url)
	images[name].id("img-"+name);
	images[name].hide();
}

async function load_model(){
	$("#load-model").text("Loading...");
	$("#load-model").prop("disabled", true);
	model = await cocoSsd.load();
	model_loaded = true;
	$("#load-model").remove();
	$("#input-select").css("display", "block");

	$("#input-select").change(()=>{
		predictions = [];
		if (showing_webcam){
			video.remove();
		}
		showing_webcam = false;
		const new_input = $("#input-select option:selected").text();
		if (new_input == "Webcam"){
			showing_webcam = true;
			create_video();
		} else {
			showing_image = new_input;
		}
	});
}

function setup(){
	const canvas = createCanvas(windowWidth*0.75,500);
	canvas.parent("sketch");

	for (const name in image_links){
		create_image(name, image_links[name]);
	}

	frameRate(30);
	textAlign(CENTER, CENTER);
}

function draw(){
	const offset_x = showing_webcam ? (width - video.width)/2 : (width - images[showing_image].width)/2;
	const offset_y = showing_webcam ? (height - video.height)/2 : (height - images[showing_image].height)/2;

	if (frameCount % 6 == 0){
		if (model_loaded){
			if (showing_webcam){
				if (webcam_loaded){
					model.detect(document.getElementById("video")).then(preds => {
						predictions = preds;
					});
				} else {
					predictions = [];
				}
			} else {
				model.detect(document.getElementById("img-"+showing_image)).then(preds => {
					predictions = preds;
				});
			}
		}
	}

	background(255);

	push();
	scale(-1, 1);
	translate(-width, 0);
	if (showing_webcam){
		if (webcam_loaded){
			image(video, offset_x, offset_y);
		}
	} else {
		image(images[showing_image], offset_x, offset_y)
	}
	pop();

	if (showing_webcam & !webcam_loaded){
		noStroke();
		fill(0);
		textSize(70);
		text("Loading Webcam...", width/2, height/2);
	}

	for (const p of predictions){
		const box = p.bbox;
		const c = color(0,255,0,floor(255*p.score))

		noFill();
		stroke(c);
		strokeWeight(5);
		rect(width - (box[0] + offset_x) - box[2], box[1] + offset_y, box[2], box[3]);

		fill(c);
		noStroke();
		textSize(30);
		text(`${p.class}`, width - (box[0] + box[2]/2 + offset_x), box[1]-20+offset_y);
	}
}

function mouseIn(){
	return $("#code-view").attr("aria-hidden")=="true" && (mouseX > 0) && (mouseX < width) && (mouseY > 0) && (mouseY < height);
}



function windowResized(){
	resizeCanvas(windowWidth*0.75, 500);
}