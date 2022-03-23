let action, V, game;
let prev_pos, pos;
const gamma = 0.9;
const lr = 0.1;
const explore_rate = 0.3;

function update_player(explore_rate){
	V[game.state.r][game.state.c] = V[game.state.r][game.state.c]*(1-lr) + lr*expected_V(game);
    let action = choose_action(game, explore_rate);
    game.update(action);
}

function expected_V(game){
	let best_val = -Infinity;

	for (const action of game.get_possible_actions()){
		const {state:new_state, reward} = game.calc_state(action);
		const val = reward + gamma*V[new_state.r][new_state.c];
		if (val > best_val){
			best_val = val;
		}
	}

	return best_val;
}

function choose_action(game, explore_rate){
	const possible_actions = game.get_possible_actions();
	if (random() < explore_rate){
		return possible_actions[floor(random()*possible_actions.length)];
	}

	let best_action;
	let best_val = -Infinity;

	for (const action of possible_actions){
		const {state:new_state, reward} = game.calc_state(action);
		const val = reward + gamma*V[new_state.r][new_state.c];
		if (val > best_val){
			best_action = action;
			best_val = val;
		}
	}

	return best_action;
}

function switch_mode(){
	if (action == "train"){
		action = "test";
		$("#train-test").text("Train");
		prev_pos = {r:0, c:0};
		pos = {r:0, c:0};
	} else {
		action = "train";
		$("#train-test").text("Test");
	}
	game.reset();
}

function restart_sketch(){
	action = "none";

	V = new Array(5).fill().map(x=>new Array(5).fill(0));

	game = new Game();

	pos = {r: 0, c: 0};
}

function setup(){
	const canvas = createCanvas(windowWidth*0.75,500);
	canvas.parent("sketch");

	restart_sketch();

	colorMode(HSB);

	textAlign(CENTER, CENTER);
	textSize(20);

	frameRate(30);
}

function draw(){
	if (action == "train"){
		for (let i=0; i<100; i++){
			update_player(explore_rate);
			if (game.finished){
				game.reset();
			}
			pos = {r: game.state.r, c: game.state.c};
		}
	} else if (action == "test"){
		if (abs(pos.r - game.state.r) < 0.01 && abs(pos.c - game.state.c) < 0.01){
			if (game.finished){
						game.reset();
						pos = {r:0, c:0};
			}
			prev_pos = {r:game.state.r, c:game.state.c};
			update_player(0);
		}
		pos = {r:pos.r + 0.1*(game.state.r - prev_pos.r), c:pos.c + 0.1*(game.state.c - prev_pos.c)};
	}

	background(0, 0, 200/255*100);

	const side = min(0.9*width, 0.9*height);

	for (let i=0; i<game.size; i++){
		for (let j=0; j<game.size; j++){
			const x = width/2 - side/2 + j*side/game.size;
			const y = height/2 - side/2 + i*side/game.size;
			
			strokeWeight(3);
			stroke(0, 0, 0);
			noFill();
			rect(x, y, side/game.size, side/game.size);

			noStroke();
			fill(0, 0, 0);
			text(round(V[i][j], 2), x + side/game.size/2, y + side/game.size/2);
		}
	}

	for (const p of game.end_positions){
			const x = width/2 - side/2 + p.c*side/game.size;
			const y = height/2 - side/2 + p.r*side/game.size;
			strokeWeight(3);
			stroke(0, 0, 0);
			fill(131, p.reward/25*100, 200/255*100);
			rect(x, y, side/game.size, side/game.size);

			noStroke();
			fill(0, 0, 0);
			text(p.reward, x + side/game.size/2, y + side/game.size/2);
	}

	const x = width/2 - side/2 + pos.c*side/game.size + side/game.size/2;
	const y = height/2 - side/2 + pos.r*side/game.size + side/game.size/2;
	noStroke();
	fill(0,80,100,0.5);
	ellipse(x, y, side/game.size/2, side/game.size/2);
}

function windowResized(){
	resizeCanvas(windowWidth*0.75, 500);
}

function mouseIn(){
	return $("#code-view").attr("aria-hidden")=="true" && (mouseX > 0) && (mouseX < width) && (mouseY > 0) && (mouseY < height);
}
