import { html, useRef } from "../../helpers.js";

export function UnsafeText(text) {
	let ref = useRef();

	setTimeout(() => {
		if (ref.getElm()) {
			ref.getElm().innerText = text;
		}
	});

	return html`<span ${ref}></span>`;
}