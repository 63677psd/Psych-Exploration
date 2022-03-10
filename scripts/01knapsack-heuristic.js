function heuristic_knapsack(items, max_weight){
	// assume items is sorted by decreasing value/weight
	// this is done after the items are generated
	let value = 0;
	let weight = 0;
	for (const i of items){
		i.heuristic_selected = false;
		if (weight + i.weight <= max_weight){
			i.heuristic_selected = true;
			value += i.value;
			weight += i.weight;
		}
	}
	return value;
}