function showAlert() {
	const audio = new Audio('./wav/intro.wav');
	audio.play();
	alert("ずんだもん!");
}
document.getElementById("alertButton").onclick = function() {
	showAlert();
};