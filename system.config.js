System.config({
		map: {
			"rxjs": "node_modules/rxjs",
			"@angular": "node_modules/@angular",
			"app": "dist/app",
		},
		paths: {
			"bows": "node_modules/bows/dist/bows.min.js",	
		},
		packages: {
			"@angular/core": {
				main: "index"
			},
			"@angular/compiler": {
				main: "index"
			},
			"@angular/common": {
				main: "index"
			},
			"@angular/platform-browser": {
				main: "index"
			},
			"@angular/platform-browser-dynamic": {
				main: "index"
			},
			"@angular/http": {
            main: "index"
      },
			"@angular/router": {
					main: "index"
			},
			"rxjs": {
						main: "Rx"
			},
			"app": {
            main: "main"
      },
		}
  });
