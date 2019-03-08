const gameList = [{"nameGame" : "game1", "highscore" : 0},{"nameGame" : "game2", "highscore" : 1}]

function render(){
	h1 = document.createElement('h1');
	h1.innerHTML('Choisissez un jeu !');
	div = document.getElementById('div');
	div.appendChild(h1);
	for(i = 0; i < gameList.length(); i++){
		
	}
}
