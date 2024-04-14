import { html, useRef } from "../../../helpers.js";
import { dropdownCss } from "../../../css.js";

export function SettingDropdown(selected, options, updateFn) {
	let dropdownRef = useRef().onChange(asd => {
		let newVal = dropdownRef.getElm().value;
		updateFn(newVal);
	});

	return html`
		<select ${dropdownRef} ${dropdownCss}>
			${Object.entries(options).map(([key, value]) => html`
				<option ${selected === key ? "selected" : ""} value="${key}">${value}</option>
			`).join("")}
		</select>
	`;
}
