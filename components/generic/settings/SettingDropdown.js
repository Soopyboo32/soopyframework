import { html, thisClass, useRef } from "../../../helpers.js";
import { dropdownCss } from "../../../css.js";

let settingDropdownCss = dropdownCss.named("setting-dropdown").css`${thisClass} {
	font-size: 1.1em;
	margin: 0;
	padding: 2px;
	height: unset;
	border-radius: 10px;
}`

export function SettingDropdown(selected, options, updateFn) {
	let dropdownRef = useRef().onChange(asd => {
		let newVal = dropdownRef.getElm().value;
		updateFn(newVal);
	});

	return html`
		<select ${dropdownRef} ${settingDropdownCss}>
			${Object.entries(options).map(([key, value]) => html`
				<option ${selected === key ? "selected" : ""} value="${key}">${value}</option>
			`).join("")}
		</select>
	`;
}
