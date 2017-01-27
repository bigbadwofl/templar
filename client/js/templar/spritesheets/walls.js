define([
	
], function(
	
) {
	return {
		name: 'walls',
		source: 'walls',
		options: {
			pad: 1,
			size: 16
		},
		layer: 'walls',
		map: [
			[ 'ashenStone1', 'ashenStone2', 'ashenStone3', 'ashenStone4', 'rock1', 'rock2', 'corruptedTree1', 'corruptedTree2' ],
			[ 'corruptedTree3', 'corruptedTree4', 'wallDark', 'wallLight', 'wallGold', 'wallWood1', 'infernoTree1', 'infernoTree2' ],
			[ 'infernoTree3', 'infernoTree4', 'forestTree1', 'forestTree2', 'iceTree1', 'iceTree2', 'iceTree3', 'cage' ],
			[ 'brickWall1', 'lockedCage', 'fence', 'purpleWall', 'greenRock1', 'greenRock2', 'wallWood2', 'brickWall2' ]
		]
	};
});