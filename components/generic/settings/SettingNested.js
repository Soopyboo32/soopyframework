import { html, staticCss, thisClass } from "../../../helpers.js";

let settingsNestedCss = staticCss.named("settings-nested").css`${thisClass} {
	display: flex;
	flex-direction: column;
	gap: 10px;
}`

//TODO: add dropdown functionality to this

export function SettingNested(label, contents) {
	return html`
		<div ${settingsNestedCss}>
			${label}<br>
			${contents}
		</div>
	`;
}
