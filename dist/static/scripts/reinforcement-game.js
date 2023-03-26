function Game(){
	this.size = 5;
	this.end_positions = [
		{r:2, c:1, reward:5},
		{r:1, c:3, reward:10},
		{r:3, c:4, reward:25}
	];

	this.finished = false;
	this.total_reward = 0;
	this.state = {r:0, c:0};
}

// assumes (state, action) is legal
Game.prototype.calc_state = function(action) {
	const res = {state: {r: this.state.r + action.r, c: this.state.c + action.c}, reward: 0};
	for (const p of this.end_positions){
		if (res.state.r == p.r && res.state.c == p.c){
			res.reward += p.reward;
		}
	}
	//res.reward--;

	return res;
};

// assumes action is legal
Game.prototype.update = function(action){
	const {state:new_state, reward} = this.calc_state(action);
	this.state = new_state;
	this.total_reward += reward;

	if (this.is_finished()){
		this.finished = true;
	}
};


Game.prototype.is_finished = function() {
	for (const p of this.end_positions){
		if (this.state.r == p.r && this.state.c == p.c){
			return true;
		}
	}
	return false;
};

Game.prototype.get_possible_actions = function() {
	let res = [];
	if (this._in_grid(this.state.r + 1, this.state.c)){
		res.push({r:1, c:0});
	}
	if (this._in_grid(this.state.r - 1, this.state.c)){
		res.push({r:-1, c:0});
	}
	if (this._in_grid(this.state.r, this.state.c + 1)){
		res.push({r:0, c:1});
	}
	if (this._in_grid(this.state.r, this.state.c - 1)){
		res.push({r:0, c:-1});
	}
	return res;
};

Game.prototype.reset = function() {
	this.state = {r:0, c:0};
	this.total_reward = 0;
	this.finished = false;
};

Game.prototype._in_grid = function(r, c) {
	return r>=0 && r<this.size && c>=0 && c<this.size;
};