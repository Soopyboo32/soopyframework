import { html, staticCss, thisClass } from "../../../helpers.js";

let centerCss = staticCss.named("hcenter").css`${thisClass} {
	display: flex;
	justify-content: center;
}`

export function HCenter(content) {
	return html`
		<div ${centerCss}>
			${content}
		</div>
	`
}