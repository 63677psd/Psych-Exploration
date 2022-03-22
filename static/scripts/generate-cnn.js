/*
mnist_train.csv and mnist_test.csv can be downloaded from: https://github.com/pjreddie/mnist-csv-png
*/

async function read_csv(file){
	let res = await fetch(file);
	let text = await res.text();
	let data = text.split("\n");
	data = data.map(line => {
		let arr = line.split(",");
		let label = parseInt(arr.shift());
		return {label: label, data: arr.map(s => parseInt(s))};
	});
	data.pop();
	console.log(file + " loaded");
	return data;
}

function parse_tf(data){
	X = tf.tensor2d(data.map(d => d.data)).reshape([data.length, 28, 28, 1]);
	Y = tf.oneHot(data.map(d => d.label), 10);
	return [X, Y];
}

async function generate_model(){

	let model = tf.sequential();

	
	model.add(tf.layers.conv2d({
		inputShape: [28, 28, 1],
		kernelSize: 5,
		filters: 16,
		strides: 1,
		activation: 'relu'
	}));
	model.add(tf.layers.maxPooling2d({poolSize: [2, 2], strides: [2, 2]}));
	model.add(tf.layers.conv2d({
		kernelSize: 5,
		filters: 32,
		strides: 1,
		activation: 'relu'
	}));
	model.add(tf.layers.maxPooling2d({poolSize: [2, 2], strides: [2, 2]}));
	model.add(tf.layers.flatten());
	model.add(tf.layers.dense({
		units: 50,
		activation: 'relu'
	}));
	model.add(tf.layers.dense({
		units: 10,
		activation: 'softmax'
	}));

	model.compile({
		optimizer: tf.train.adam(),
		loss: 'categoricalCrossentropy',
		metrics: ['accuracy'],
	});

	console.log("model created");

	// load data
	let [train_data, test_data] = await Promise.all([read_csv("/static/assets/mnist_train.csv"), read_csv("/static/assets/mnist_test.csv")]);
	let [train_X, train_Y] = parse_tf(train_data);
	let [test_X, test_Y] = parse_tf(test_data);
	console.log("data loaded");

	// train model
	console.log("beginning training");
	await model.fit(train_X, train_Y, {
		epochs:5,
		validationData:[test_X, test_Y],
		callbacks: {
			onEpochEnd: (epoch, logs) => {console.log(logs)}
		}
	});
	console.log("training complete");

	return model;
}

async function run(){
	let model = await generate_model();
	await model.save("downloads://mnist-model");
}
