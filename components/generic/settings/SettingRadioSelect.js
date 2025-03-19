import { css, generateId, html, staticCss, thisClass, useRef } from "../../../helpers.js";
import { colors, dropdownCss, getBg } from "../../../css.js";

let radioCss = staticCss.named("radio-container").css`{
	${thisClass} {
		position: relative;
		justify-content: space-evenly;
		border-radius: 10px;
		border: 1px solid ${colors.grey};
		padding: 3px;
		z-index: 0;
		display: flex;
		gap: 10px;
	}

	${thisClass} > input[type="radio"] {
		display: none;
	}

	${thisClass} > label {
		margin: 5px;
        border: 1px solid transparent;
        border-radius: 5px;
		-webkit-user-select: none; /* Safari */
		-ms-user-select: none; /* IE 10 and IE 11 */
		user-select: none; /* Standard syntax */
		transition: 0.1s;
	}
	
    ${thisClass} > label:hover {
        border: 1px dashed ${colors.grey};
    }
	
	${thisClass} > input[type="radio"]:not(:checked) + label {
		cursor: pointer;
	}
}`;

let selectedHighlightCss = staticCss.named("selected-highlight").css`${thisClass} {
	transition: .2s;
	z-index: -1;
	position: absolute;
	background-color: ${colors.grey};
	border-radius: 10px;
	border: 1px solid ${colors.primary_dark};
	/*top: 3px;*/
	/*bottom: 3px;*/
}`;

export function SettingRadioSelect(selected, options, updateFn, {allowWrap = false} = {}) {
	let radioName = generateId();
	let selectedHighlightRef = useRef();
	let labels = {};

	function updateHighlightLoc() {
		let selectedLabel = labels[selected];

		selectedHighlightRef.getElm().style.top = (selectedLabel.getElm().offsetTop - 5) + "px";
		selectedHighlightRef.getElm().style.left = (selectedLabel.getElm().offsetLeft - 5) + "px";
		selectedHighlightRef.getElm().style.height = (selectedLabel.getElm().offsetHeight + 9) + "px";
		selectedHighlightRef.getElm().style.width = (selectedLabel.getElm().offsetWidth + 9) + "px";
	}

	setTimeout(() => {
		updateHighlightLoc();
	});

	return html`
		<div ${radioCss} ${css`
			${allowWrap ? `flex-wrap: wrap;` : ""}
		`}>
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
			})}
		</div>
	`;
}
