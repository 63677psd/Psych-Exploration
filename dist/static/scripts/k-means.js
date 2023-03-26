/*
data should be in the format:
[{x:<x>, y:<y>}, {x:<x>, y:<y>}, ...]
*/

function KMeans(data, num_clusters){
	this.data = data;
	this.n = num_clusters;
	this.centroids = new Array(this.n).fill().map(()=>{
		let data = this.data[floor(random()*this.data.length)];
		return {x:data.x, y:data.y};
	});
}

KMeans.prototype.label_data = function (){
	for (const d of data){
		const dist_to_centroids = this.centroids.map(c=>dist(d.x, d.y, c.x, c.y));
		d.label = KMeans._argmin(dist_to_centroids);
	}
}

// the data should be labeled first
KMeans.prototype.update_centroids = function(){
	this.centroids = this.centroids.map((c, i) => {
		let filtered_data = this.data.filter(d=>d.label == i);
		let total_pos = filtered_data.reduce((old, d) => {return {x:old.x+d.x, y:old.y+d.y}});
		return {x:total_pos.x/filtered_data.length, y:total_pos.y/filtered_data.length};
	});
};

KMeans._argmin = function(arr){
	let min_index = 0;
	let min_val = arr[0];
	for (let i=1; i<arr.length; i++){
		let new_val = arr[i];
		if (min_val < new_val){
			continue
		} else if (min_val == new_val){
			if (random() < 0.5){
				continue
			}
		}

		min_index = i;
		min_val = new_val;
	}

	return min_index;
};