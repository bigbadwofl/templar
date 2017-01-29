define([
	
], function(
	
) {
	return {
		name: 'tileset',
		source: 'tileset',
		options: {
			pad: 1,
			size: 16
		},
		map: [
			[ 'pathHor', 'pathVer', 'pathTopLeft', 'pathTopRight', 'bg', 'pathRight', 'pathLeft', 'pathMid' ],
			[ 'player', 'dot', 'pathBottomLeft', 'pathBottomRight', 'bg2', 'pathUp', 'pathDown', 'dot2' ],
			[ 'playerMov', 'playerMov2', 'bg3', 'bg4', 'bg5', 'bg6', 'powerup1', 'powerup1anim' ],
			[ 'dot3', 'dot4', 'pacman', 'pacmanright2', 'pacmanright3', 'pacmanleft1', 'pacmanleft2', 'pacmanleft3' ],
			[ 'pacmandown1', 'pacmandown2', 'pacmandown3', 'pacmanup1', 'pacmanup2', 'pacmanup3', 'fplayer', 'fplayerMov' ],
			[ 'fplayerMov2', 'pathTopLeftGrass', 'pathTopRightGrass', 'pathHorGrass', 'pathVerGrass', 'bgSky', 'bgGrass', 'bgGrassShade' ],
			[ 'pathHorBridge', 'pathBottomLeftGrass', 'pathBottomRightGrass', 'bgGrass2', 'bgGrass3', 'bgGrass4', 'playerevil', 'playerevil2' ],
			[ 'playerevil3', 'pathHorTrigger', 'pathVerTrigger', 'pathRightGrass', 'pathLeftGrass', 'pathUpGrass', 'pathDownGrass', 'pathMidGrass' ],
			[ 'lightDot', 'lightDot2', 'lightDot3', 'lightDot4', 'pathHorTriggerGrass', 'pathVerTriggerGrass', 'pathVerBridge', 'fplayerevil' ],
			[ 'fplayerevil2', 'fplayerevil3' ]
		],
		layerMap: [
			[ 'tiles', 'tiles', 'tiles', 'tiles', 'bg', 'tiles', 'tiles', 'tiles' ],
			[ 'mobs', 'doodads', 'tiles', 'tiles', 'bg', 'tiles', 'tiles', 'doodads' ],
			[ 'mobs', 'mobs', 'bg', 'bg', 'bg', 'bg', 'doodads', 'doodads' ],
			[ 'doodads', 'doodads', 'mobs', 'mobs', 'mobs', 'mobs', 'mobs', 'mobs' ],
			[ 'mobs', 'mobs', 'mobs', 'mobs', 'mobs', 'mobs', 'mobs', 'mobs' ],
			[ 'mobs', 'tiles', 'tiles', 'tiles', 'tiles', 'bg', 'bg', 'bg' ],
			[ 'tiles', 'tiles', 'tiles', 'bg', 'bg', 'bg', 'mobs', 'mobs' ],
			[ 'mobs', 'tiles', 'tiles', 'tiles', 'tiles', 'tiles', 'tiles', 'tiles', 'tiles', 'tiles', 'tiles' ],
			[ 'doodads', 'doodads', 'doodads', 'doodads', 'tiles', 'tiles', 'tiles', 'mobs' ],
			[ 'mobs', 'mobs' ]
		]
	};s
});