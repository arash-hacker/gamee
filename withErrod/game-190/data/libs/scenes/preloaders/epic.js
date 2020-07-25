var preloaderIntro = function(){

	var assets = {
		atlases: [
			{
				name: "logoAtlas",
				json: "libs/scenes/preloaders/epic/atlas.json",
				image: "libs/scenes/preloaders/epic/atlas.png"}
		],
		images: [],
		sounds: [

		],
	}

	var loadingBar = null

	return {
		assets: assets,
		name: "preloaderIntro",
		updateLoadingBar: function(loadedFiles, totalFiles){
			if(loadingBar){
				var loadingStep = loadingBar.width / totalFiles
				loadingBar.topBar.width = loadingStep * loadedFiles
			}
		},

		create: function(event){

			var sceneGroup = game.add.group()

			var logo = sceneGroup.create(game.world.centerX, game.world.centerY, 'logoAtlas', 'logo')
			logo.scale.setTo(0.5, 0.5)
			logo.anchor.setTo(0.5, 0.5)

			var loadingGroup = new Phaser.Group(game)
			sceneGroup.add(loadingGroup)

			var loadingBottom = loadingGroup.create(0, 0, 'logoAtlas', 'loading_bottom')
			loadingBottom.anchor.y = 0.5

			var loadingTop = loadingGroup.create(0, 0, 'logoAtlas', 'loading_top')
			loadingTop.anchor.y = 0.5

			loadingGroup.bottomBar = loadingBottom
			loadingGroup.topBar = loadingTop

			loadingGroup.x = game.world.centerX - loadingGroup.width * 0.5
			loadingGroup.y = (game.world.centerY + logo.height) - loadingGroup.height * 0.5

			loadingBar = loadingGroup
			loadingBar.topBar.width = 0
		},
	}
}()