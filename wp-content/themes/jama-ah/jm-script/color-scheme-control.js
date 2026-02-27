/* global colorScheme, Color */
/**
 * Add a listener to the Color Scheme control to update other color controls to new values/defaults.
 * Also trigger an update of the Color Scheme CSS when a color is changed.
 */

( function( api ) {
	var cssTemplate = wp.template( 'wm-color-scheme' ),
		colorSchemeKeys = [
			'background_color',
			'jm_color1',
			'jm_color2',
			'jm_color3',
			'jm_color4',
			'jm_color5',
			'jm_color6',
			'jm_color7',
			'jm_color8',
			'jm_color9',
			'jm_color10',
			'jm_color11',
			'jm_color12',
			'jm_color13',
			'jm_color14',
			'jm_color15',
			'jm_color16',
			'jm_color17',
			'jm_color18',
			'jm_color19',
			'jm_color20',
			'jm_color21',
			'jm_color22',
			'jm_color23',
			'jm_color24',
			'jm_color25',
			'jm_color26',
			'jm_color27',
			'jm_color28',
			'jm_color29',
			'jm_color30',
			'jm_color31',
			'jm_color32',
			'jm_color33',
			'jm_color34',
			'jm_color35',
			'jm_color36',
			'jm_color37',
			'jm_color38',
			'jm_color39',
			'jm_color40',
			'jm_color41',
			'jm_color42',
			'jm_color43',
			'jm_color44',
			'jm_color45',
			'jm_color46',
			'jm_color47',
			'jm_color48',
			'jm_color49',
			'jm_color50',
			'jm_color51',
			'jm_color52',
			'jm_color53',
			'jm_color54',
			'jm_color55',
			'jm_color56',
			'jm_color57',
			'jm_color58',
			'jm_color59',
			'jm_color60',
			'jm_color61',
			'jm_color62',
		],
		colorSettings = [
			'background_color',
			'jm_color1',
			'jm_color2',
			'jm_color3',
			'jm_color4',
			'jm_color5',
			'jm_color6',
			'jm_color7',
			'jm_color8',
			'jm_color9',
			'jm_color10',
			'jm_color11',
			'jm_color12',
			'jm_color13',
			'jm_color14',
			'jm_color15',
			'jm_color16',
			'jm_color17',
			'jm_color18',
			'jm_color19',
			'jm_color20',
			'jm_color21',
			'jm_color22',
			'jm_color23',
			'jm_color24',
			'jm_color25',
			'jm_color26',
			'jm_color27',
			'jm_color28',
			'jm_color29',
			'jm_color30',
			'jm_color31',
			'jm_color32',
			'jm_color33',
			'jm_color34',
			'jm_color35',
			'jm_color36',
			'jm_color37',
			'jm_color38',
			'jm_color39',
			'jm_color40',
			'jm_color41',
			'jm_color42',
			'jm_color43',
			'jm_color44',
			'jm_color45',
			'jm_color46',
			'jm_color47',
			'jm_color48',
			'jm_color49',
			'jm_color50',
			'jm_color51',
			'jm_color52',
			'jm_color53',
			'jm_color54',
			'jm_color55',
			'jm_color56',
			'jm_color57',
			'jm_color58',
			'jm_color59',
			'jm_color60',
			'jm_color61',
			'jm_color62',
		];

	api.controlConstructor.select = api.Control.extend( {
		ready: function() {
			if ( 'color_scheme' === this.id ) {
				this.setting.bind( 'change', function( value ) {
					var colors = colorScheme[value].colors;

					// Update Background Color.
					var color = colors[0];
					api( 'background_color' ).set( color );
					api.control( 'background_color' ).container.find( '.color-picker-hex' )
						.data( 'data-default-color', color )
						.wpColorPicker( 'defaultColor', color );

					// Update Page Background Color.
					color = colors[1];
					api( 'jm_color1' ).set( color );
					api.control( 'jm_color1' ).container.find( '.color-picker-hex' )
						.data( 'data-default-color', color )
						.wpColorPicker( 'defaultColor', color );

					// Update Link Color.
					color = colors[2];
					api( 'jm_color2' ).set( color );
					api.control( 'jm_color2' ).container.find( '.color-picker-hex' )
						.data( 'data-default-color', color )
						.wpColorPicker( 'defaultColor', color );

					// Update Main Text Color.
					color = colors[3];
					api( 'jm_color3' ).set( color );
					api.control( 'jm_color3' ).container.find( '.color-picker-hex' )
						.data( 'data-default-color', color )
						.wpColorPicker( 'defaultColor', color );

					// Update Secondary Text Color.
					color = colors[4];
					api( 'jm_color4' ).set( color );
					api.control( 'jm_color4' ).container.find( '.color-picker-hex' )
						.data( 'data-default-color', color )
						.wpColorPicker( 'defaultColor', color );
					
					color = colors[5];
					api( 'jm_color5' ).set( color );
					api.control( 'jm_color5' ).container.find( '.color-picker-hex' )
						.data( 'data-default-color', color )
						.wpColorPicker( 'defaultColor', color );
					color = colors[6];
					api( 'jm_color6' ).set( color );
					api.control( 'jm_color6' ).container.find( '.color-picker-hex' )
						.data( 'data-default-color', color )
						.wpColorPicker( 'defaultColor', color );
						
					color = colors[7];
					api( 'jm_color7' ).set( color );
					api.control( 'jm_color7' ).container.find( '.color-picker-hex' )
						.data( 'data-default-color', color )
						.wpColorPicker( 'defaultColor', color );
					color = colors[8];
					api( 'jm_color8' ).set( color );
					api.control( 'jm_color8' ).container.find( '.color-picker-hex' )
						.data( 'data-default-color', color )
						.wpColorPicker( 'defaultColor', color );
						
					color = colors[9];
					api( 'jm_color9' ).set( color );
					api.control( 'jm_color9' ).container.find( '.color-picker-hex' )
						.data( 'data-default-color', color )
						.wpColorPicker( 'defaultColor', color );
					color = colors[10];
					api( 'jm_color10' ).set( color );
					api.control( 'jm_color10' ).container.find( '.color-picker-hex' )
						.data( 'data-default-color', color )
						.wpColorPicker( 'defaultColor', color );
					color = colors[11];
					api( 'jm_color11' ).set( color );
					api.control( 'jm_color11' ).container.find( '.color-picker-hex' )
						.data( 'data-default-color', color )
						.wpColorPicker( 'defaultColor', color );
					color = colors[12];
					api( 'jm_color12' ).set( color );
					api.control( 'jm_color12' ).container.find( '.color-picker-hex' )
						.data( 'data-default-color', color )
						.wpColorPicker( 'defaultColor', color );
					color = colors[13];
					api( 'jm_color13' ).set( color );
					api.control( 'jm_color13' ).container.find( '.color-picker-hex' )
						.data( 'data-default-color', color )
						.wpColorPicker( 'defaultColor', color );
					color = colors[14];
					api( 'jm_color14' ).set( color );
					api.control( 'jm_color14' ).container.find( '.color-picker-hex' )
						.data( 'data-default-color', color )
						.wpColorPicker( 'defaultColor', color );
					color = colors[15];
					api( 'jm_color15' ).set( color );
					api.control( 'jm_color15' ).container.find( '.color-picker-hex' )
						.data( 'data-default-color', color )
						.wpColorPicker( 'defaultColor', color );
					color = colors[16];
					api( 'jm_color16' ).set( color );
					api.control( 'jm_color16' ).container.find( '.color-picker-hex' )
						.data( 'data-default-color', color )
						.wpColorPicker( 'defaultColor', color );
					color = colors[17];
					api( 'jm_color17' ).set( color );
					api.control( 'jm_color17' ).container.find( '.color-picker-hex' )
						.data( 'data-default-color', color )
						.wpColorPicker( 'defaultColor', color );
					color = colors[18];
					api( 'jm_color18' ).set( color );
					api.control( 'jm_color18' ).container.find( '.color-picker-hex' )
						.data( 'data-default-color', color )
						.wpColorPicker( 'defaultColor', color );
					color = colors[19];
					api( 'jm_color19' ).set( color );
					api.control( 'jm_color19' ).container.find( '.color-picker-hex' )
						.data( 'data-default-color', color )
						.wpColorPicker( 'defaultColor', color );
					color = colors[20];
					api( 'jm_color20' ).set( color );
					api.control( 'jm_color20' ).container.find( '.color-picker-hex' )
						.data( 'data-default-color', color )
						.wpColorPicker( 'defaultColor', color );
					color = colors[21];
					api( 'jm_color21' ).set( color );
					api.control( 'jm_color21' ).container.find( '.color-picker-hex' )
						.data( 'data-default-color', color )
						.wpColorPicker( 'defaultColor', color );
					color = colors[22];
					api( 'jm_color22' ).set( color );
					api.control( 'jm_color22' ).container.find( '.color-picker-hex' )
						.data( 'data-default-color', color )
						.wpColorPicker( 'defaultColor', color );
					color = colors[23];
					api( 'jm_color23' ).set( color );
					api.control( 'jm_color23' ).container.find( '.color-picker-hex' )
						.data( 'data-default-color', color )
						.wpColorPicker( 'defaultColor', color );
					color = colors[24];
					api( 'jm_color24' ).set( color );
					api.control( 'jm_color24' ).container.find( '.color-picker-hex' )
						.data( 'data-default-color', color )
						.wpColorPicker( 'defaultColor', color );
					color = colors[25];
					api( 'jm_color25' ).set( color );
					api.control( 'jm_color25' ).container.find( '.color-picker-hex' )
						.data( 'data-default-color', color )
						.wpColorPicker( 'defaultColor', color );
					color = colors[26];
					api( 'jm_color26' ).set( color );
					api.control( 'jm_color26' ).container.find( '.color-picker-hex' )
						.data( 'data-default-color', color )
						.wpColorPicker( 'defaultColor', color );
					color = colors[27];
					api( 'jm_color27' ).set( color );
					api.control( 'jm_color27' ).container.find( '.color-picker-hex' )
						.data( 'data-default-color', color )
						.wpColorPicker( 'defaultColor', color );
					color = colors[28];
					api( 'jm_color28' ).set( color );
					api.control( 'jm_color28' ).container.find( '.color-picker-hex' )
						.data( 'data-default-color', color )
						.wpColorPicker( 'defaultColor', color );
					color = colors[29];
					api( 'jm_color29' ).set( color );
					api.control( 'jm_color29' ).container.find( '.color-picker-hex' )
						.data( 'data-default-color', color )
						.wpColorPicker( 'defaultColor', color );
					color = colors[30];
					api( 'jm_color30' ).set( color );
					api.control( 'jm_color30' ).container.find( '.color-picker-hex' )
						.data( 'data-default-color', color )
						.wpColorPicker( 'defaultColor', color );
					color = colors[31];
					api( 'jm_color31' ).set( color );
					api.control( 'jm_color31' ).container.find( '.color-picker-hex' )
						.data( 'data-default-color', color )
						.wpColorPicker( 'defaultColor', color );
					color = colors[32];
					api( 'jm_color32' ).set( color );
					api.control( 'jm_color32' ).container.find( '.color-picker-hex' )
						.data( 'data-default-color', color )
						.wpColorPicker( 'defaultColor', color );
					color = colors[33];
					api( 'jm_color33' ).set( color );
					api.control( 'jm_color33' ).container.find( '.color-picker-hex' )
						.data( 'data-default-color', color )
						.wpColorPicker( 'defaultColor', color );
					color = colors[34];
					api( 'jm_color34' ).set( color );
					api.control( 'jm_color34' ).container.find( '.color-picker-hex' )
						.data( 'data-default-color', color )
						.wpColorPicker( 'defaultColor', color );
					color = colors[35];
					api( 'jm_color35' ).set( color );
					api.control( 'jm_color35' ).container.find( '.color-picker-hex' )
						.data( 'data-default-color', color )
						.wpColorPicker( 'defaultColor', color );
					color = colors[36];
					api( 'jm_color36' ).set( color );
					api.control( 'jm_color36' ).container.find( '.color-picker-hex' )
						.data( 'data-default-color', color )
						.wpColorPicker( 'defaultColor', color );
					color = colors[37];
					api( 'jm_color37' ).set( color );
					api.control( 'jm_color37' ).container.find( '.color-picker-hex' )
						.data( 'data-default-color', color )
						.wpColorPicker( 'defaultColor', color );
					color = colors[38];
					api( 'jm_color38' ).set( color );
					api.control( 'jm_color38' ).container.find( '.color-picker-hex' )
						.data( 'data-default-color', color )
						.wpColorPicker( 'defaultColor', color );
					color = colors[39];
					api( 'jm_color39' ).set( color );
					api.control( 'jm_color39' ).container.find( '.color-picker-hex' )
						.data( 'data-default-color', color )
						.wpColorPicker( 'defaultColor', color );
					color = colors[40];
					api( 'jm_color40' ).set( color );
					api.control( 'jm_color40' ).container.find( '.color-picker-hex' )
						.data( 'data-default-color', color )
						.wpColorPicker( 'defaultColor', color );
					color = colors[41];
					api( 'jm_color41' ).set( color );
					api.control( 'jm_color41' ).container.find( '.color-picker-hex' )
						.data( 'data-default-color', color )
						.wpColorPicker( 'defaultColor', color );
					color = colors[42];
					api( 'jm_color42' ).set( color );
					api.control( 'jm_color42' ).container.find( '.color-picker-hex' )
						.data( 'data-default-color', color )
						.wpColorPicker( 'defaultColor', color );
					color = colors[43];
					api( 'jm_color43' ).set( color );
					api.control( 'jm_color43' ).container.find( '.color-picker-hex' )
						.data( 'data-default-color', color )
						.wpColorPicker( 'defaultColor', color );
					color = colors[44];
					api( 'jm_color44' ).set( color );
					api.control( 'jm_color44' ).container.find( '.color-picker-hex' )
						.data( 'data-default-color', color )
						.wpColorPicker( 'defaultColor', color );
					color = colors[45];
					api( 'jm_color45' ).set( color );
					api.control( 'jm_color45' ).container.find( '.color-picker-hex' )
						.data( 'data-default-color', color )
						.wpColorPicker( 'defaultColor', color );
					color = colors[46];
					api( 'jm_color46' ).set( color );
					api.control( 'jm_color46' ).container.find( '.color-picker-hex' )
						.data( 'data-default-color', color )
						.wpColorPicker( 'defaultColor', color );
					color = colors[47];
					api( 'jm_color47' ).set( color );
					api.control( 'jm_color47' ).container.find( '.color-picker-hex' )
						.data( 'data-default-color', color )
						.wpColorPicker( 'defaultColor', color );
					color = colors[48];
					api( 'jm_color48' ).set( color );
					api.control( 'jm_color48' ).container.find( '.color-picker-hex' )
						.data( 'data-default-color', color )
						.wpColorPicker( 'defaultColor', color );
					color = colors[49];
					api( 'jm_color49' ).set( color );
					api.control( 'jm_color49' ).container.find( '.color-picker-hex' )
						.data( 'data-default-color', color )
						.wpColorPicker( 'defaultColor', color );
					color = colors[50];
					api( 'jm_color50' ).set( color );
					api.control( 'jm_color50' ).container.find( '.color-picker-hex' )
						.data( 'data-default-color', color )
						.wpColorPicker( 'defaultColor', color );
					color = colors[51];
					api( 'jm_color51' ).set( color );
					api.control( 'jm_color51' ).container.find( '.color-picker-hex' )
						.data( 'data-default-color', color )
						.wpColorPicker( 'defaultColor', color );
					color = colors[52];
					api( 'jm_color52' ).set( color );
					api.control( 'jm_color52' ).container.find( '.color-picker-hex' )
						.data( 'data-default-color', color )
						.wpColorPicker( 'defaultColor', color );
					color = colors[53];
					api( 'jm_color53' ).set( color );
					api.control( 'jm_color53' ).container.find( '.color-picker-hex' )
						.data( 'data-default-color', color )
						.wpColorPicker( 'defaultColor', color );
					color = colors[54];
					api( 'jm_color54' ).set( color );
					api.control( 'jm_color54' ).container.find( '.color-picker-hex' )
						.data( 'data-default-color', color )
						.wpColorPicker( 'defaultColor', color );
					color = colors[55];
					api( 'jm_color55' ).set( color );
					api.control( 'jm_color55' ).container.find( '.color-picker-hex' )
						.data( 'data-default-color', color )
						.wpColorPicker( 'defaultColor', color );
					color = colors[56];
					api( 'jm_color56' ).set( color );
					api.control( 'jm_color56' ).container.find( '.color-picker-hex' )
						.data( 'data-default-color', color )
						.wpColorPicker( 'defaultColor', color );
					color = colors[57];
					api( 'jm_color57' ).set( color );
					api.control( 'jm_color57' ).container.find( '.color-picker-hex' )
						.data( 'data-default-color', color )
						.wpColorPicker( 'defaultColor', color );
					color = colors[58];
					api( 'jm_color58' ).set( color );
					api.control( 'jm_color58' ).container.find( '.color-picker-hex' )
						.data( 'data-default-color', color )
						.wpColorPicker( 'defaultColor', color );
					color = colors[59];
					api( 'jm_color59' ).set( color );
					api.control( 'jm_color59' ).container.find( '.color-picker-hex' )
						.data( 'data-default-color', color )
						.wpColorPicker( 'defaultColor', color );
					color = colors[60];
					api( 'jm_color60' ).set( color );
					api.control( 'jm_color60' ).container.find( '.color-picker-hex' )
						.data( 'data-default-color', color )
						.wpColorPicker( 'defaultColor', color );
					color = colors[61];
					api( 'jm_color61' ).set( color );
					api.control( 'jm_color61' ).container.find( '.color-picker-hex' )
						.data( 'data-default-color', color )
						.wpColorPicker( 'defaultColor', color );
					color = colors[62];
					api( 'jm_color62' ).set( color );
					api.control( 'jm_color62' ).container.find( '.color-picker-hex' )
						.data( 'data-default-color', color )
						.wpColorPicker( 'defaultColor', color );
				} );
			}
		}
	} );

	// Generate the CSS for the current Color Scheme.
	function updateCSS() {
		var scheme = api( 'color_scheme' )(),
			css,
			colors = _.object( colorSchemeKeys, colorScheme[ scheme ].colors );

		// Merge in color scheme overrides.
		_.each( colorSettings, function( setting ) {
			colors[ setting ] = api( setting )();
		} );

		// Add additional color.
		// jscs:disable
		colors.border_color = Color( colors.main_text_color ).toCSS( 'rgba', 0.2 );
		// jscs:enable

		css = cssTemplate( colors );

		api.previewer.send( 'update-color-scheme-css', css );
	}

	// Update the CSS whenever a color setting is changed.
	_.each( colorSettings, function( setting ) {
		api( setting, function( setting ) {
			setting.bind( updateCSS );
		} );
	} );
} )( wp.customize );




