import './billboard.scss';
import { __ } from '@wordpress/i18n';
import ChevronLeft from './assets/chevron-left.svg';
import ChevronRight from './assets/chevron-right.svg';
import { useRef, useEffect, useCallback } from 'react';

export default function Billboard( props ) {
	const ref = useRef( null );
	let currentImage = 0;
	const canMove = useRef( true );

	const getItemFromRotatedArray = ( arr, n ) => {
		if ( arr.length === 0 ) {
			return undefined;
		}
		const normalizedIndex =
			( ( n % arr.length ) + arr.length ) % arr.length;
		return arr[ normalizedIndex ];
	};

	const startAnimation = useCallback(
		( animationName, direction ) => {
			if ( ! ref.current ) {
				return;
			}

			const boards = Array.from(
				ref.current.querySelectorAll( '.board' )
			);
			const billboard = ref.current;
			const img1Elements = Array.from(
				billboard.querySelectorAll( '.img-1' )
			);
			const img2Elements = Array.from(
				billboard.querySelectorAll( '.img-2' )
			);
			const img3Elements = Array.from(
				billboard.querySelectorAll( '.img-3' )
			);

			boards.forEach( ( board ) => {
				board.style.animationName = animationName;
				board.style.animationPlayState = 'running';
			} );

			setTimeout(
				() => {
					img1Elements.forEach( ( image ) => {
						image.style.backgroundImage = `url(${ getItemFromRotatedArray(
							props.images,
							currentImage
						) })`;
					} );

					if ( direction === 'left' ) {
						img2Elements.forEach( ( image ) => {
							image.style.backgroundImage = `url(${ getItemFromRotatedArray(
								props.images,
								currentImage + 1
							) })`;
						} );
						img3Elements.forEach( ( image ) => {
							image.style.backgroundImage = `url(${ getItemFromRotatedArray(
								props.images,
								currentImage - 1
							) })`;
						} );
					} else if ( direction === 'right' ) {
						img3Elements.forEach( ( image ) => {
							image.style.backgroundImage = `url(${ getItemFromRotatedArray(
								props.images,
								currentImage - 1
							) })`;
						} );
						img2Elements.forEach( ( image ) => {
							image.style.backgroundImage = `url(${ getItemFromRotatedArray(
								props.images,
								currentImage + 1
							) })`;
						} );
					}

					boards.forEach( ( board ) => {
						board.style.animationPlayState = 'paused';
						board.style.animationName = 'none';
					} );

					canMove.current = true;
				},
				( props.animationSpeed ?? 4000 ) / 3
			);
		},
		[ props, currentImage ]
	);

	const moveLeft = useCallback( () => {
		if ( ! canMove.current ) {
			return;
		}

		currentImage++;
		startAnimation( 'flip', 'left' );
		canMove.current = false;
	}, [ currentImage, startAnimation, canMove ] );

	const moveRight = () => {
		if ( ! canMove.current ) {
			return;
		}

		currentImage--;
		startAnimation( 'flip-reverse', 'right' );
		canMove.current = false;
	};

	const init = useCallback( () => {
		const boards = Array.from( ref.current.querySelectorAll( '.board' ) );
		const billboard = ref.current;
		const width = `${ billboard.offsetWidth }px`;
		const height = props.height.length > 0 ? props.height : '300px';

		billboard.style.setProperty(
			'--animation-speed',
			`${ props.animationSpeed ?? 4000 }ms`
		);
		billboard.style.setProperty( '--width', width );
		billboard.style.setProperty( '--height', height );
		billboard.style.setProperty( '--boards', boards.length );

		const calcOrigin = () => {
			const numerator = -100 * ( Math.sqrt( 3 ) / 4 ) * 0.685 * 6;
			return numerator / props.boardsCount;
		};

		billboard.style.setProperty(
			'--origin',
			`center center ${ calcOrigin() }px`
		);

		boards.forEach( ( board, i ) => {
			board.style.setProperty( '--offset-x', -i / boards.length );
		} );

		// Initialize the images
		const img1Elements = Array.from(
			billboard.querySelectorAll( '.img-1' )
		);
		img1Elements.forEach( ( image ) => {
			image.style.backgroundImage = `url(${ props.images[ 0 ] })`;
		} );

		const img2Elements = Array.from(
			billboard.querySelectorAll( '.img-2' )
		);
		img2Elements.forEach( ( image ) => {
			image.style.backgroundImage = `url(${ props.images[ 1 ] })`;
		} );

		const img3Elements = Array.from(
			billboard.querySelectorAll( '.img-3' )
		);
		img3Elements.forEach( ( image ) => {
			image.style.backgroundImage = `url(${
				props.images[ props.images.length - 1 ]
			})`;
		} );

		boards.forEach( ( board ) => {
			board.style.animationPlayState = 'paused';
		} );

		// Move automatically
		if ( props.moveAutomatically ) {
			setInterval( () => {
				moveLeft();
			}, props.moveAutomaticallyInterval );
		}
	}, [ ref, props, moveLeft ] );

	useEffect( () => {
		if ( ref.current ) {
			init();
		}
	}, [ ref, init ] );

	return (
		<>
			{ props.showNavigation && (
				<div className={ 'navigation' }>
					<button onClick={ moveLeft }>
						<img
							src={ ChevronLeft }
							alt={ __( 'Left', 'billboard-slider' ) }
						/>
					</button>
					<button onClick={ moveRight }>
						<img
							src={ ChevronRight }
							alt={ __( 'Left', 'billboard-slider' ) }
						/>
					</button>
				</div>
			) }

			<div className={ 'billboard' } ref={ ref }>
				{ Array.from( { length: props.boardsCount } ).map(
					( _, index ) => (
						<div key={ index } className={ 'board' }>
							<div className={ 'image img-1' } />
							<div className={ 'image img-2' } />
							<div className={ 'image img-3' } />
						</div>
					)
				) }
			</div>
		</>
	);
}
