import { html, thisClass, useRef } from "../../../helpers.js";
import { buttonCss} from "../../../css.js";

let settingButtonCss = buttonCss.named("setting-button").css`${thisClass} {
    font-size: 1.1em;
    margin: 0;
    padding: 3px 10px;
    height: unset;
    border-radius: 10px;
}`

let settingButtonFullWidth = settingButtonCss.named("setting-button-full").css`${thisClass} {
    width: 100%;
    display: flex;
    justify-content: center;
}`

export function SettingButton(name, onClick, fullWidth = false) {
	let buttonRef = useRef().onClick(e => {
		onClick();
	});

	return html`
		<button ${buttonRef} ${fullWidth ? settingButtonFullWidth : settingButtonCss}>${name}</button>
	`;
}
