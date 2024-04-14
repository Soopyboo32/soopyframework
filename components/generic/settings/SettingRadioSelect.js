import { generateId, html, staticCss, thisClass, useRef } from "../../../helpers.js";
import { colors, dropdownCss, getBg } from "../../../css.js";

let radioCss = staticCss.named("radio-container").css`{
	${thisClass} {
		position: relative;
		border-radius: 10px;
		border: 1px solid ${colors.grey};
		padding: 3px;
	}

	${thisClass} > input[type="radio"] {
		display: none;
	}

	${thisClass} > label {
		display: inline-block;
		margin: 5px;
		-webkit-user-select: none; /* Safari */
		-ms-user-select: none; /* IE 10 and IE 11 */
		user-select: none; /* Standard syntax */
	}
}`;

let selectedHighlightCss = staticCss.named("selected-highlight").css`${thisClass} {
	transition: .2s;
	z-index: -1;
	position: absolute;
	background-color: ${colors.grey};
	border-radius: 10px;
	border: 1px solid ${colors.primary_dark};
	top: 3px;
	bottom: 3px;
}`;

export function SettingRadioSelect(selected, options, updateFn) {
	let radioName = generateId();
	let selectedHighlightRef = useRef();
	let labels = {};

	function updateHighlightLoc() {
		let selectedLabel = labels[selected];

		selectedHighlightRef.getElm().style.width = (selectedLabel.getElm().offsetWidth + 9) + "px";
		selectedHighlightRef.getElm().style.left = (selectedLabel.getElm().offsetLeft - 5) + "px";
	}

	setTimeout(() => {
		updateHighlightLoc();
	});

	return html`
		<div ${radioCss}>
			<div ${selectedHighlightRef} ${selectedHighlightCss}></div>
			${Object.entries(options).map(([key, value]) => {
				let labelRef = useRef().onClick(() => {
					updateFn(key);
					selected = key;
					updateHighlightLoc();
				});

				labels[key] = labelRef;

				return html`
					<input type="radio" ${selected === key ? "checked" : ""} name="${radioName}" id="${key}"
						   value="${key}">
					<label for="${key}" ${labelRef}>${value}</label>
				`;
			}).join("")}
		</div>
	`;
}
