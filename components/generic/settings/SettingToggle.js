import { html, staticCss, thisClass, useRef } from "../../../helpers.js";
import { colors } from "../../../css.js";

let toggleCss = staticCss.named("toggle").css`{
	/* The switch - the box around the slider */

	${thisClass} {
		position: relative;
		display: inline-block;
		width: 3em;
		height: 1.5em;
	}

	/* Hide default HTML checkbox */

	${thisClass} input {
		opacity: 0;
		width: 0;
		height: 0;
	}

	/* The slider */

	${thisClass} > span {
		position: absolute;
		cursor: pointer;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: ${colors.grey};
		-webkit-transition: .4s;
		transition: .4s;
		border-radius: 1em;
	}

	${thisClass} > span:before {
		position: absolute;
		content: "";
		height: calc(100% - 10px);
		aspect-ratio: 1;
		left: 5px;
		bottom: 5px;
		background-color: white;
		-webkit-transition: .2s;
		transition: .2s;
		border-radius: 50%;
	}

	${thisClass} > input:checked + span {
		background-color: ${colors.primary_dark};
	}

	${thisClass} > input:focus + span {
		box-shadow: 0 0 5px ${colors.primary};
	}

	${thisClass} > input:checked + span:before {
		left: 4px;
		bottom: 4px;
		height: calc(100% - 8px);
		-webkit-transform: translateX(calc(3em - (1.5em - 8px) - 8px));
		-ms-transform: translateX(calc(3em - (1.5em - 8px) - 8px));
		transform: translateX(calc(3em - (1.5em - 8px) - 8px));
	}
}`;

export function SettingToggle(enabled, updateFn) {
	let checkboxRef = useRef().onChange(asd => {
		let newVal = checkboxRef.getElm().checked;
		updateFn(newVal);
	});

	return html`
		<label ${toggleCss}>
			<input type="checkbox" ${enabled ? "checked" : ""} ${checkboxRef}>
			<span></span>
		</label>
	`;
}
