define([
	
], function(
	
) {
	return {
		name: 'mobs',
		source: 'mobs',
		options: {
			pad: 1,
			size: 16,
			outline: true
		},
		layer: 'mobs',
		map: [
			[ 'player', 'greenGhost', 'pinkGhost', 'pinkSkull', 'greenSkull', 'zombie', 'ghoul', 'necromancer' ],
			[ 'redSkeleton', 'purpleSkeleton', 'skeleton', 'beggarFemale', 'old man', 'monk', 'beggarMale', 'king' ],
			[ 'queen', 'guard1', 'eyeball', 'impHorns', 'imp', 'impRed', 'thief', 'thiefCap' ],
			[ 'thiefMask', 'ogre', 'shaman', 'elemental', 'elementalRed', 'elementalFists', 'priest1', 'priest2' ],
			[ 'guard2', 'priest3', 'blacksmith', 'woman', 'wizard', 'crab', 'cat', 'farmer' ],
			[ 'rat' ]
		]
	};
});