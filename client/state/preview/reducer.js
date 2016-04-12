/**
 * External dependencies
 */
import assign from 'lodash/assign';

/**
 * Internal dependencies
 */
import * as ActionTypes from 'state/action-types';
import { previewSchema } from './schema';
import { isValidStateWithSchema } from 'state/utils';

const initialState = {};

const siteInitialState = {
	previousCustomizations: [],
	customizations: {},
	isUnsaved: false,
	previewMarkup: '',
};

function siteReducer( newState = siteInitialState, action ) {
	const state = assign( {}, siteInitialState, newState );
	switch ( action.type ) {
		case ActionTypes.PREVIEW_MARKUP_RECEIVE:
			return assign( {}, state, { previewMarkup: action.markup } );
		case ActionTypes.PREVIEW_CUSTOMIZATIONS_CLEAR:
			return assign( {}, state, { isUnsaved: false, customizations: {}, previousCustomizations: [] } );
		case ActionTypes.PREVIEW_CUSTOMIZATIONS_UPDATE:
			return assign( {}, state, {
				isUnsaved: true,
				previousCustomizations: state.previousCustomizations.concat( state.customizations ),
				customizations: assign( {}, state.customizations, action.customizations )
			} );
		case ActionTypes.PREVIEW_CUSTOMIZATIONS_UNDO:
			const undoneCustomizations = state.previousCustomizations.length > 0 ? state.previousCustomizations.slice( -1 )[0] : {};
			return assign( {}, state, {
				isUnsaved: true,
				previousCustomizations: state.previousCustomizations.slice( 0, -1 ),
				customizations: undoneCustomizations,
			} );
		case ActionTypes.PREVIEW_CUSTOMIZATIONS_SAVED:
			return assign( {}, state, { isUnsaved: false } );
	}
	return state;
}

export default function( newState = initialState, action ) {
	const state = assign( {}, initialState, newState );
	switch ( action.type ) {
		case ActionTypes.PREVIEW_MARKUP_RECEIVE:
		case ActionTypes.PREVIEW_CUSTOMIZATIONS_CLEAR:
		case ActionTypes.PREVIEW_CUSTOMIZATIONS_UPDATE:
		case ActionTypes.PREVIEW_CUSTOMIZATIONS_UNDO:
		case ActionTypes.PREVIEW_CUSTOMIZATIONS_SAVED:
			return assign( {}, state, { [ action.siteId ]: siteReducer( state[ action.siteId ], action ) } );
		case ActionTypes.SERIALIZE:
			return state;
		case ActionTypes.DESERIALIZE:
			if ( isValidStateWithSchema( state, previewSchema ) ) {
				return state;
			}
			return initialState;
	}
	return state;
}
