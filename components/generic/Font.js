import { css, html } from "../../helpers.js";

/**
 * @param font {string}
 * @param elms {HTML}
 * @returns {HTML}
 */
export function Font(font, elms) {
	return html`
		<span ${css`
			font-family: ${font};
		`}>
			${elms}
		</span>
	`;
}