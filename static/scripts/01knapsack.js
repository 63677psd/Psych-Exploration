function solve_knapsack(items, max_weight){
	const memo = {};
	const result = knapsack_helper(items, items.length, max_weight, memo);

	// backtrack hash table to find which items are used
	let items_contained = new Array(items.length).fill(false);
	let num_items = items.length;
	let weight = max_weight;
	while (num_items > 0 && weight > 0){
		const sub_res = memo[`${num_items}-${weight}`];
		if (sub_res.use_last_item){
			items_contained[num_items - 1] = true;
			weight -= items[num_items - 1].weight;
		}
		num_items--;
	}

	for (let i=0; i<items.length; i++){
		const item = items[i];
		item.selected = items_contained[i];
	}

	return result.total_value;
}

function knapsack_helper(items, num_items, weight, memo){
	const key = `${num_items}-${weight}`;
	if (!memo.hasOwnProperty(key)){
		if (num_items == 0){
			// no items for the knapsack
			memo[key] = {total_value: 0, use_last_item: false};
		} else {

			const current_item = items[num_items - 1];

			// possibility of not using item
			const recurse_not_using_item = knapsack_helper(items, num_items - 1, weight, memo);
			const not_using_item = {
				total_value: recurse_not_using_item.total_value,
				use_last_item: false
			};
			
			if (current_item.weight > weight){
				// can't fit the last item in the knapsack
				memo[key] = not_using_item;
			} else {
				// can fit the last item in the knapsack

				// possibility of using item
				const recurse_using_item = knapsack_helper(items, num_items - 1, weight - current_item.weight, memo);
				const using_item = {
					total_value: recurse_using_item.total_value + current_item.value,
					use_last_item: true
				};


				// find best possibility
				const should_use_item = using_item.total_value > not_using_item.total_value;
				memo[key] = should_use_item ? using_item : not_using_item;

			}
		}
	}
	return memo[key];
}