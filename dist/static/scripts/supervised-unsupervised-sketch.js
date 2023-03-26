let data;
let data_name;
let kmeans;
let finding = false;
let finding_start;

let _seven_cluster_centers;

let prev_size;

const data_info = {
	"Two Clusters": {
		clusters: 2,
		points: 100,
		gen: ()=>{
			return {x:width/20*randomGaussian() + width/3 + (random()<0.5?1:0)*width/3, y:width/20*randomGaussian() + height/2};
		}
	},
	"Three Clusters": {
		clusters: 3,
		points: 150,
		gen: ()=>{
			const angle = 2*PI*floor(random()*3)/3;
			return {x:width/20*randomGaussian() + width/2 + height/3*cos(angle), y:width/20*randomGaussian() + height/2 + height/3*sin(angle)};
		}
	},
	"Seven Clusters": {
		clusters: 7,
		points: 500,
		gen: ()=>{
			const cluster = floor(random()*7);
			return {x:width/40*randomGaussian() + _seven_cluster_centers[cluster].x, y:width/40*randomGaussian() + _seven_cluster_centers[cluster].y};
		}
	}
}

function find_clusters(){
	kmeans = new KMeans(data, data_info[data_name].clusters);
	kmeans.label_data();
	finding = true;
	finding_start = frameCount;
}

function get_hue(label){
	return label/data_info[data_name].clusters*360;
}

function setup(){
	const canvas = createCanvas(windowWidth*0.75,500);
	canvas.parent("sketch");

	prev_size = windowWidth*0.75;

	randomSeed(7);
	_seven_cluster_centers = new Array(7).fill().map(()=>{return {x:random()*width/2+width/4, y:random()*height/2+height/4}});

	$("#data-select").change(()=>{
		data_name = $("#data-select option:selected").text();

		finding = false;
		data = new Array(data_info[data_name].points).fill().map(()=>data_info[data_name].gen());

	});

	$("#data-select").change();

	rectMode(CENTER);
	colorMode(HSB);
	frameRate(30);
	noStroke();
}

function draw(){
	background(0,0,78);
	
	if (finding){
		if ((frameCount-finding_start)%30 == 29){
			kmeans.update_centroids();
			kmeans.label_data();
		}

		for (const d of data){
			fill(get_hue(d.label), 50, 50);
			ellipse(d.x, d.y, 10, 10);
		}
		
		for (const i in kmeans.centroids){
			fill(get_hue(i), 80, 90);
			rect(kmeans.centroids[i].x, kmeans.centroids[i].y, 10, 10);
		}
	} else {
		for (const d of data){
			fill(0, 0, 0);
			ellipse(d.x, d.y, 10, 10);
		}
	}
}

function mouseIn(){
	return $("#code-view").attr("aria-hidden")=="true" && (mouseX > 0) && (mouseX < width) && (mouseY > 0) && (mouseY < height);
}


function windowResized(){
	resizeCanvas(windowWidth*0.75, 500);
	if (abs(prev_size - windowWidth*0.75) > 50){
		prev_size = windowWidth*0.75;
		$("#data-select").change();
	}
}