import { css, html, staticCss, thisClass, useRef } from "../../../helpers.js";
import { colors, getBg } from "../../../css.js";
import { Hover } from "../hover/Hover.js";

let settingHeaderCss = staticCss.named("setting-header").css`${thisClass} {
    display: flex;
    align-items: center;
    justify-content: center;
	font-size: 1.5em;
}`;

export function SettingHeader(title) {
	return html`
		<div ${settingHeaderCss}>${title}</div>
	`;
}