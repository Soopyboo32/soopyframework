import {css, html, useRef} from "../../helpers.js";

/**
 * @param font {string}
 * @param elms {HTML}
 * @returns {HTML}
 */
export function Font(font, elms) {
	let ref = useRef();

	return html.withRef(ref)`
		<span ${css`
			font-family: ${font};
		`}>
			${elms}
		</span>
	`;
}