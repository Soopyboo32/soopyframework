import { html, staticCss, thisClass } from "../../../helpers.js";

let settingsListCss = staticCss.named("settings-list").css`${thisClass} {
	display: flex;
	flex-direction: column;
	gap: 10px;
}`

export function SettingList(...settings) {
	return html`
		<div ${settingsListCss}>
			${settings}
		</div>
	`;
}
