let model;
let model_loaded = false;
let input1, input2;

async function load_model(){
	$("#load-model").text("Loading...");
	$("#load-model").prop("disabled", true);
	model = await use.load();
	model_loaded = true;
	$("#load-model").remove();
	$(".enable-when-loaded").prop("disabled", false);
}

async function get_similarity(){
	$("#similarity").text("");
	$("#compare").prop("disabled", true).text("Calculating...");
	const embeddings = await model.embed([$("#sentence-1").val(), $("#sentence-2").val()]);
	const dot = tf.dot(embeddings,embeddings.transpose()).dataSync()[1];

	$("#similarity").text(`Similarity: ${Math.round(dot*100)/100}`);
	$("#compare").prop("disabled", false).text("Compare");
}

$(()=>{
	const parent = $("#sketch").parent();
	$("#sketch").append($("<div id='sim' class='col'></div>"));
	
	$("#sim").css({
		background: "rgb(200,200,200)",
		width: "90%",
		height: "500px"
	})
		.append($('<input id="sentence-1" type="text" class="form-control enable-when-loaded" placeholder="Sentence 1">').css({
			position: "relative",
			top: "50px",
			left: "25%",
			width: "50%"
		}).prop("disabled", true))
		.append($('<input id="sentence-2" type="text" class="form-control enable-when-loaded" placeholder="Sentence 2">').css({
			position: "relative",
			top: "100px",
			left: "25%",
			width: "50%"
		}).prop("disabled", true))
		.append($('<button id="compare" class="btn btn-primary enable-when-loaded">Compare</button>').css({
			position: "relative",
			top: "150px",
			left: "40%",
			width: "20%"
		}).prop("disabled", true))
		.append($('<h2 id="similarity"><h2>').css({
			position: "relative",
			top: "250px",
			"text-align": "center"
		}));

	$("#sentence-1").val("How old are you?");
	$("#sentence-2").val("What is your age?");

	$("#compare").click(()=>{
		get_similarity();
	});
});