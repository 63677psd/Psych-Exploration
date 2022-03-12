let orbs = [{x:250, y:250, r:25, vy:0}];
let falling = false;

function setup(){
	const canvas = createCanvas(windowWidth*0.75,500);
	canvas.parent("sketch");

	fill(0);
}

function draw(){
	if (orbs.length==0){
		falling = false;
	}

	background(200);
	let to_delete = [];
	for (let i=0; i<orbs.length; i++){
		orb = orbs[i];
		if (orb.y > height + orb.r){
			to_delete.push(i);
		} else {
			if (falling){
				orb.vy += 1;
			}
			orb.y += orb.vy;
			text("Finn", orb.x, orb.y);
		}
	}

	let new_orbs = [];
	for (let i=0; i<orbs.length; i++){
		if (to_delete.indexOf(i) == -1){
			new_orbs.push(orbs[i]);
		}
	}
	orbs = new_orbs;
}

function windowResized(){
	resizeCanvas(windowWidth*0.75, 500);
}

function mouseClicked(){
	if (mouseIn()){
		const r = random()*30+10;
		orbs.push({x:mouseX, y:mouseY, r:r, vy:0});
	}
}

function mouseIn(){
	return $("#code-view").attr("aria-hidden")=="true" && (mouseX > 0) && (mouseX < width) && (mouseY > 0) && (mouseY < height);
}

function fall(){
	falling = true;
}