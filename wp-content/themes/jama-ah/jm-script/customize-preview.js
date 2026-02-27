/**
 * Live-update changed settings in real time in the Customizer preview.
 */

( function( $ ) {
	var style = $( '#wm-color-scheme-css' ),
		api = wp.customize;

	if ( ! style.length ) {
		style = $( 'head' ).append( '<style type="text/css" id="wm-color-scheme-css" />' )
		                    .find( '#wm-color-scheme-css' );
	}

	// Site title.
	api( 'blogname', function( value ) {
		value.bind( function( to ) {
			$( '.site-title a' ).text( to );
		} );
	} );

	// Site tagline.
	api( 'blogdescription', function( value ) {
		value.bind( function( to ) {
			$( '.site-description' ).text( to );
		} );
	} );

	// Add custom-background-image body class when background image is added.
	api( 'background_image', function( value ) {
		value.bind( function( to ) {
			$( 'body' ).toggleClass( 'custom-background-image', '' !== to );
		} );
	} );

	// Color Scheme CSS.
	api.bind( 'preview-ready', function() {
		api.preview.bind( 'update-color-scheme-css', function( css ) {
			style.html( css );
		} );
	} );
	wp.customize( 'global_fonts', function( value ) {
        value.bind( function( to ) {
            $( 'body' ).css( 'font-family', to );
        } );
    } );
	wp.customize( 'global_fontsize', function( value ) {
        value.bind( function( to ) {
            $( 'body' ).css( 'font-size', '' + to + 'px' );
        } );
    } );
	wp.customize( 'global_fontweight', function( value ) {
        value.bind( function( to ) {
            $( 'body' ).css( 'font-weight', to );
        } );
    } );
	wp.customize( 'header_style', function( value ) {
        value.bind( function( to ) {
            $( '.wrapper' ).attr( 'id', to );
        } );
    } );
} )( jQuery );




