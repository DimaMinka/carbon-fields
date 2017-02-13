/**
 * The external dependencies.
 */
import { takeEvery } from 'redux-saga';
import { call, put, select } from 'redux-saga/effects';

/**
 * The internal dependencies.
 */
import { TYPE_NOW_PAGE } from 'lib/constants';
import { getContainerById } from 'containers/selectors';
import { setupContainer, setMeta, setUI } from 'containers/actions';

/**
 * Setup the initial state of the container.
 *
 * @param  {Object} action
 * @return {void}
 */
export function* workerSetupContainer(action) {
	const defaults = {
		has_error: false,
		is_dirty: false,
		is_visible: true,
		classes: [],
	};

	let { containerId, meta, ui } = action.payload;

	ui = {
		...defaults,
		...ui,
	};

	yield put(setMeta({ containerId, meta }));
	yield put(setUI({ containerId, ui }));
}

/**
 * Show or hide the container's metabox.
 *
 * @param  {Object} action
 * @return {void}
 */
export function* workerToggleMetaBoxVisibility(action) {
	const { containerId } = action.payload;
	const container = yield select(getContainerById, containerId);
	const el = yield call([document, document.querySelector], `#${containerId}`);

	if (!el) {
		throw new Error(`Cannot find the metabox for container "${containerId}"`);
	}

	el.style.display = container.ui.is_visible ? 'block' : 'none';
}

/**
 * Start to work.
 *
 * @return {void}
 */
export default function* foreman() {
	const sagas = [
		takeEvery(setupContainer, workerSetupContainer),
	];

	// We don't need this functionality on "Widgets" or "Menus" pages.
	if (window.pagenow === TYPE_NOW_PAGE) {
		sagas.push(takeEvery(setUI, workerToggleMetaBoxVisibility));
	}

	yield sagas;
}
