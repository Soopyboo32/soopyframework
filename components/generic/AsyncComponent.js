import { html, useRef } from "../../helpers.js";

/**
 * @param component {() => Promise<HTML>}
 * @param loader {undefined | HTML | (() => HTML)}
 * @returns {HTML_EXTENDED}
 */
export function AsyncComponent(component, loader) {
	let spanRef = useRef();
	component().then(v => {
		spanRef.renderInner(v);
	});

	return html`
		<span ${spanRef}>
			${loader ? typeof loader === "function" ? loader() : loader : ""}
		</span>
	`;
}
