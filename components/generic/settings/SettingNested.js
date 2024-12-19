import { html, staticCss, thisClass } from "../../../helpers.js";

let settingsNestedCss = staticCss.named("settings-nested").css`${thisClass} {
	display: flex;
	flex-direction: column;
	gap: 10px;
}`

let settingsNestedInnerCss = staticCss.named("settings-nested-inner").css`${thisClass} {
	margin-left: 20px;
    margin-right: 20px;
}`;

//TODO: add dropdown functionality to this

export function SettingNested(label, contents) {
	return html`
		<div ${settingsNestedCss}>
			${label}<br>
			<div ${settingsNestedInnerCss}>
				${contents}
			</div>
		</div>
	`;
}
