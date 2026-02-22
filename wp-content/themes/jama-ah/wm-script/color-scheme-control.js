/* global colorScheme, Color */
/**
 * Add a listener to the Color Scheme control to update other color controls to new values/defaults.
 * Also trigger an update of the Color Scheme CSS when a color is changed.
 */

( function( api ) {
	var cssTemplate = wp.template( 'wm-color-scheme' ),
		colorSchemeKeys = [
			'background_color',
			'wm_color1',
			'wm_color2',
			'wm_color3',
			'wm_color4',
			'wm_color5',
			'wm_color6',
			'wm_color7',
			'wm_color8',
			'wm_color9',
			'wm_color10',
			'wm_color11',
			'wm_color12',
			'wm_color13',
			'wm_color14',
			'wm_color15',
			'wm_color16',
			'wm_color17',
			'wm_color18',
			'wm_color19',
			'wm_color20',
			'wm_color21',
			'wm_color22',
			'wm_color23',
			'wm_color24',
			'wm_color25',
			'wm_color26',
			'wm_color27',
			'wm_color28',
			'wm_color29',
			'wm_color30',
			'wm_color31',
			'wm_color32',
			'wm_color33',
			'wm_color34',
			'wm_color35',
			'wm_color36',
			'wm_color37',
			'wm_color38',
			'wm_color39',
			'wm_color40',
			'wm_color41',
			'wm_color42',
			'wm_color43',
			'wm_color44',
			'wm_color45',
			'wm_color46',
			'wm_color47',
			'wm_color48',
			'wm_color49',
			'wm_color50',
			'wm_color51',
			'wm_color52',
			'wm_color53',
			'wm_color54',
			'wm_color55',
			'wm_color56',
			'wm_color57',
			'wm_color58',
			'wm_color59',
			'wm_color60',
			'wm_color61',
			'wm_color62',
		],
		colorSettings = [
			'background_color',
			'wm_color1',
			'wm_color2',
			'wm_color3',
			'wm_color4',
			'wm_color5',
			'wm_color6',
			'wm_color7',
			'wm_color8',
			'wm_color9',
			'wm_color10',
			'wm_color11',
			'wm_color12',
			'wm_color13',
			'wm_color14',
			'wm_color15',
			'wm_color16',
			'wm_color17',
			'wm_color18',
			'wm_color19',
			'wm_color20',
			'wm_color21',
			'wm_color22',
			'wm_color23',
			'wm_color24',
			'wm_color25',
			'wm_color26',
			'wm_color27',
			'wm_color28',
			'wm_color29',
			'wm_color30',
			'wm_color31',
			'wm_color32',
			'wm_color33',
			'wm_color34',
			'wm_color35',
			'wm_color36',
			'wm_color37',
			'wm_color38',
			'wm_color39',
			'wm_color40',
			'wm_color41',
			'wm_color42',
			'wm_color43',
			'wm_color44',
			'wm_color45',
			'wm_color46',
			'wm_color47',
			'wm_color48',
			'wm_color49',
			'wm_color50',
			'wm_color51',
			'wm_color52',
			'wm_color53',
			'wm_color54',
			'wm_color55',
			'wm_color56',
			'wm_color57',
			'wm_color58',
			'wm_color59',
			'wm_color60',
			'wm_color61',
			'wm_color62',
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
					api( 'wm_color1' ).set( color );
					api.control( 'wm_color1' ).container.find( '.color-picker-hex' )
						.data( 'data-default-color', color )
						.wpColorPicker( 'defaultColor', color );

					// Update Link Color.
					color = colors[2];
					api( 'wm_color2' ).set( color );
					api.control( 'wm_color2' ).container.find( '.color-picker-hex' )
						.data( 'data-default-color', color )
						.wpColorPicker( 'defaultColor', color );

					// Update Main Text Color.
					color = colors[3];
					api( 'wm_color3' ).set( color );
					api.control( 'wm_color3' ).container.find( '.color-picker-hex' )
						.data( 'data-default-color', color )
						.wpColorPicker( 'defaultColor', color );

					// Update Secondary Text Color.
					color = colors[4];
					api( 'wm_color4' ).set( color );
					api.control( 'wm_color4' ).container.find( '.color-picker-hex' )
						.data( 'data-default-color', color )
						.wpColorPicker( 'defaultColor', color );
					
					color = colors[5];
					api( 'wm_color5' ).set( color );
					api.control( 'wm_color5' ).container.find( '.color-picker-hex' )
						.data( 'data-default-color', color )
						.wpColorPicker( 'defaultColor', color );
					color = colors[6];
					api( 'wm_color6' ).set( color );
					api.control( 'wm_color6' ).container.find( '.color-picker-hex' )
						.data( 'data-default-color', color )
						.wpColorPicker( 'defaultColor', color );
						
					color = colors[7];
					api( 'wm_color7' ).set( color );
					api.control( 'wm_color7' ).container.find( '.color-picker-hex' )
						.data( 'data-default-color', color )
						.wpColorPicker( 'defaultColor', color );
					color = colors[8];
					api( 'wm_color8' ).set( color );
					api.control( 'wm_color8' ).container.find( '.color-picker-hex' )
						.data( 'data-default-color', color )
						.wpColorPicker( 'defaultColor', color );
						
					color = colors[9];
					api( 'wm_color9' ).set( color );
					api.control( 'wm_color9' ).container.find( '.color-picker-hex' )
						.data( 'data-default-color', color )
						.wpColorPicker( 'defaultColor', color );
					color = colors[10];
					api( 'wm_color10' ).set( color );
					api.control( 'wm_color10' ).container.find( '.color-picker-hex' )
						.data( 'data-default-color', color )
						.wpColorPicker( 'defaultColor', color );
					color = colors[11];
					api( 'wm_color11' ).set( color );
					api.control( 'wm_color11' ).container.find( '.color-picker-hex' )
						.data( 'data-default-color', color )
						.wpColorPicker( 'defaultColor', color );
					color = colors[12];
					api( 'wm_color12' ).set( color );
					api.control( 'wm_color12' ).container.find( '.color-picker-hex' )
						.data( 'data-default-color', color )
						.wpColorPicker( 'defaultColor', color );
					color = colors[13];
					api( 'wm_color13' ).set( color );
					api.control( 'wm_color13' ).container.find( '.color-picker-hex' )
						.data( 'data-default-color', color )
						.wpColorPicker( 'defaultColor', color );
					color = colors[14];
					api( 'wm_color14' ).set( color );
					api.control( 'wm_color14' ).container.find( '.color-picker-hex' )
						.data( 'data-default-color', color )
						.wpColorPicker( 'defaultColor', color );
					color = colors[15];
					api( 'wm_color15' ).set( color );
					api.control( 'wm_color15' ).container.find( '.color-picker-hex' )
						.data( 'data-default-color', color )
						.wpColorPicker( 'defaultColor', color );
					color = colors[16];
					api( 'wm_color16' ).set( color );
					api.control( 'wm_color16' ).container.find( '.color-picker-hex' )
						.data( 'data-default-color', color )
						.wpColorPicker( 'defaultColor', color );
					color = colors[17];
					api( 'wm_color17' ).set( color );
					api.control( 'wm_color17' ).container.find( '.color-picker-hex' )
						.data( 'data-default-color', color )
						.wpColorPicker( 'defaultColor', color );
					color = colors[18];
					api( 'wm_color18' ).set( color );
					api.control( 'wm_color18' ).container.find( '.color-picker-hex' )
						.data( 'data-default-color', color )
						.wpColorPicker( 'defaultColor', color );
					color = colors[19];
					api( 'wm_color19' ).set( color );
					api.control( 'wm_color19' ).container.find( '.color-picker-hex' )
						.data( 'data-default-color', color )
						.wpColorPicker( 'defaultColor', color );
					color = colors[20];
					api( 'wm_color20' ).set( color );
					api.control( 'wm_color20' ).container.find( '.color-picker-hex' )
						.data( 'data-default-color', color )
						.wpColorPicker( 'defaultColor', color );
					color = colors[21];
					api( 'wm_color21' ).set( color );
					api.control( 'wm_color21' ).container.find( '.color-picker-hex' )
						.data( 'data-default-color', color )
						.wpColorPicker( 'defaultColor', color );
					color = colors[22];
					api( 'wm_color22' ).set( color );
					api.control( 'wm_color22' ).container.find( '.color-picker-hex' )
						.data( 'data-default-color', color )
						.wpColorPicker( 'defaultColor', color );
					color = colors[23];
					api( 'wm_color23' ).set( color );
					api.control( 'wm_color23' ).container.find( '.color-picker-hex' )
						.data( 'data-default-color', color )
						.wpColorPicker( 'defaultColor', color );
					color = colors[24];
					api( 'wm_color24' ).set( color );
					api.control( 'wm_color24' ).container.find( '.color-picker-hex' )
						.data( 'data-default-color', color )
						.wpColorPicker( 'defaultColor', color );
					color = colors[25];
					api( 'wm_color25' ).set( color );
					api.control( 'wm_color25' ).container.find( '.color-picker-hex' )
						.data( 'data-default-color', color )
						.wpColorPicker( 'defaultColor', color );
					color = colors[26];
					api( 'wm_color26' ).set( color );
					api.control( 'wm_color26' ).container.find( '.color-picker-hex' )
						.data( 'data-default-color', color )
						.wpColorPicker( 'defaultColor', color );
					color = colors[27];
					api( 'wm_color27' ).set( color );
					api.control( 'wm_color27' ).container.find( '.color-picker-hex' )
						.data( 'data-default-color', color )
						.wpColorPicker( 'defaultColor', color );
					color = colors[28];
					api( 'wm_color28' ).set( color );
					api.control( 'wm_color28' ).container.find( '.color-picker-hex' )
						.data( 'data-default-color', color )
						.wpColorPicker( 'defaultColor', color );
					color = colors[29];
					api( 'wm_color29' ).set( color );
					api.control( 'wm_color29' ).container.find( '.color-picker-hex' )
						.data( 'data-default-color', color )
						.wpColorPicker( 'defaultColor', color );
					color = colors[30];
					api( 'wm_color30' ).set( color );
					api.control( 'wm_color30' ).container.find( '.color-picker-hex' )
						.data( 'data-default-color', color )
						.wpColorPicker( 'defaultColor', color );
					color = colors[31];
					api( 'wm_color31' ).set( color );
					api.control( 'wm_color31' ).container.find( '.color-picker-hex' )
						.data( 'data-default-color', color )
						.wpColorPicker( 'defaultColor', color );
					color = colors[32];
					api( 'wm_color32' ).set( color );
					api.control( 'wm_color32' ).container.find( '.color-picker-hex' )
						.data( 'data-default-color', color )
						.wpColorPicker( 'defaultColor', color );
					color = colors[33];
					api( 'wm_color33' ).set( color );
					api.control( 'wm_color33' ).container.find( '.color-picker-hex' )
						.data( 'data-default-color', color )
						.wpColorPicker( 'defaultColor', color );
					color = colors[34];
					api( 'wm_color34' ).set( color );
					api.control( 'wm_color34' ).container.find( '.color-picker-hex' )
						.data( 'data-default-color', color )
						.wpColorPicker( 'defaultColor', color );
					color = colors[35];
					api( 'wm_color35' ).set( color );
					api.control( 'wm_color35' ).container.find( '.color-picker-hex' )
						.data( 'data-default-color', color )
						.wpColorPicker( 'defaultColor', color );
					color = colors[36];
					api( 'wm_color36' ).set( color );
					api.control( 'wm_color36' ).container.find( '.color-picker-hex' )
						.data( 'data-default-color', color )
						.wpColorPicker( 'defaultColor', color );
					color = colors[37];
					api( 'wm_color37' ).set( color );
					api.control( 'wm_color37' ).container.find( '.color-picker-hex' )
						.data( 'data-default-color', color )
						.wpColorPicker( 'defaultColor', color );
					color = colors[38];
					api( 'wm_color38' ).set( color );
					api.control( 'wm_color38' ).container.find( '.color-picker-hex' )
						.data( 'data-default-color', color )
						.wpColorPicker( 'defaultColor', color );
					color = colors[39];
					api( 'wm_color39' ).set( color );
					api.control( 'wm_color39' ).container.find( '.color-picker-hex' )
						.data( 'data-default-color', color )
						.wpColorPicker( 'defaultColor', color );
					color = colors[40];
					api( 'wm_color40' ).set( color );
					api.control( 'wm_color40' ).container.find( '.color-picker-hex' )
						.data( 'data-default-color', color )
						.wpColorPicker( 'defaultColor', color );
					color = colors[41];
					api( 'wm_color41' ).set( color );
					api.control( 'wm_color41' ).container.find( '.color-picker-hex' )
						.data( 'data-default-color', color )
						.wpColorPicker( 'defaultColor', color );
					color = colors[42];
					api( 'wm_color42' ).set( color );
					api.control( 'wm_color42' ).container.find( '.color-picker-hex' )
						.data( 'data-default-color', color )
						.wpColorPicker( 'defaultColor', color );
					color = colors[43];
					api( 'wm_color43' ).set( color );
					api.control( 'wm_color43' ).container.find( '.color-picker-hex' )
						.data( 'data-default-color', color )
						.wpColorPicker( 'defaultColor', color );
					color = colors[44];
					api( 'wm_color44' ).set( color );
					api.control( 'wm_color44' ).container.find( '.color-picker-hex' )
						.data( 'data-default-color', color )
						.wpColorPicker( 'defaultColor', color );
					color = colors[45];
					api( 'wm_color45' ).set( color );
					api.control( 'wm_color45' ).container.find( '.color-picker-hex' )
						.data( 'data-default-color', color )
						.wpColorPicker( 'defaultColor', color );
					color = colors[46];
					api( 'wm_color46' ).set( color );
					api.control( 'wm_color46' ).container.find( '.color-picker-hex' )
						.data( 'data-default-color', color )
						.wpColorPicker( 'defaultColor', color );
					color = colors[47];
					api( 'wm_color47' ).set( color );
					api.control( 'wm_color47' ).container.find( '.color-picker-hex' )
						.data( 'data-default-color', color )
						.wpColorPicker( 'defaultColor', color );
					color = colors[48];
					api( 'wm_color48' ).set( color );
					api.control( 'wm_color48' ).container.find( '.color-picker-hex' )
						.data( 'data-default-color', color )
						.wpColorPicker( 'defaultColor', color );
					color = colors[49];
					api( 'wm_color49' ).set( color );
					api.control( 'wm_color49' ).container.find( '.color-picker-hex' )
						.data( 'data-default-color', color )
						.wpColorPicker( 'defaultColor', color );
					color = colors[50];
					api( 'wm_color50' ).set( color );
					api.control( 'wm_color50' ).container.find( '.color-picker-hex' )
						.data( 'data-default-color', color )
						.wpColorPicker( 'defaultColor', color );
					color = colors[51];
					api( 'wm_color51' ).set( color );
					api.control( 'wm_color51' ).container.find( '.color-picker-hex' )
						.data( 'data-default-color', color )
						.wpColorPicker( 'defaultColor', color );
					color = colors[52];
					api( 'wm_color52' ).set( color );
					api.control( 'wm_color52' ).container.find( '.color-picker-hex' )
						.data( 'data-default-color', color )
						.wpColorPicker( 'defaultColor', color );
					color = colors[53];
					api( 'wm_color53' ).set( color );
					api.control( 'wm_color53' ).container.find( '.color-picker-hex' )
						.data( 'data-default-color', color )
						.wpColorPicker( 'defaultColor', color );
					color = colors[54];
					api( 'wm_color54' ).set( color );
					api.control( 'wm_color54' ).container.find( '.color-picker-hex' )
						.data( 'data-default-color', color )
						.wpColorPicker( 'defaultColor', color );
					color = colors[55];
					api( 'wm_color55' ).set( color );
					api.control( 'wm_color55' ).container.find( '.color-picker-hex' )
						.data( 'data-default-color', color )
						.wpColorPicker( 'defaultColor', color );
					color = colors[56];
					api( 'wm_color56' ).set( color );
					api.control( 'wm_color56' ).container.find( '.color-picker-hex' )
						.data( 'data-default-color', color )
						.wpColorPicker( 'defaultColor', color );
					color = colors[57];
					api( 'wm_color57' ).set( color );
					api.control( 'wm_color57' ).container.find( '.color-picker-hex' )
						.data( 'data-default-color', color )
						.wpColorPicker( 'defaultColor', color );
					color = colors[58];
					api( 'wm_color58' ).set( color );
					api.control( 'wm_color58' ).container.find( '.color-picker-hex' )
						.data( 'data-default-color', color )
						.wpColorPicker( 'defaultColor', color );
					color = colors[59];
					api( 'wm_color59' ).set( color );
					api.control( 'wm_color59' ).container.find( '.color-picker-hex' )
						.data( 'data-default-color', color )
						.wpColorPicker( 'defaultColor', color );
					color = colors[60];
					api( 'wm_color60' ).set( color );
					api.control( 'wm_color60' ).container.find( '.color-picker-hex' )
						.data( 'data-default-color', color )
						.wpColorPicker( 'defaultColor', color );
					color = colors[61];
					api( 'wm_color61' ).set( color );
					api.control( 'wm_color61' ).container.find( '.color-picker-hex' )
						.data( 'data-default-color', color )
						.wpColorPicker( 'defaultColor', color );
					color = colors[62];
					api( 'wm_color62' ).set( color );
					api.control( 'wm_color62' ).container.find( '.color-picker-hex' )
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
