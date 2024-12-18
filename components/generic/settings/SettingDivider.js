import { css, html, staticCss, thisClass, useRef } from "../../../helpers.js";
import { colors, getBg } from "../../../css.js";
import { Hover } from "../hover/Hover.js";

let settingDividerCss = staticCss.named("setting-divider").css`${thisClass} {
    background-color: white;
	height: 1px;
	margin: 5px 0;
}`;

export function SettingDivider() {
	return html`
		<div ${settingDividerCss}></div>
	`;
}