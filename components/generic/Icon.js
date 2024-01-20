import { css, html } from "../../helpers.js";

export function Icon(name, {size, fill = true} = {}) {
	let iconCss = css`
	  font-size: ${size ?? "24px"};
	  font-variation-settings: 'FILL' ${fill ? 1 : 0}, 'wght' 400, 'GRAD' 0, 'opsz' 24;
	`;

	return html`<span class="material-symbols-outlined" ${iconCss}>
        ${name}
    </span>`;
}