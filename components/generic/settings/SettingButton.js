import { html, thisClass, useRef } from "../../../helpers.js";
import { buttonCss} from "../../../css.js";

let settingButtonCss = buttonCss.named("setting-button").css`${thisClass} {
    font-size: 1.1em;
    margin: 0;
    padding: 3px 10px;
    height: unset;
    width: 100%;
    display: flex;
    justify-content: center;
    border-radius: 10px;
}`

export function SettingButton(name, onClick) {
	let buttonRef = useRef().onClick(e => {
		onClick();
	});

	return html`
		<button ${buttonRef} ${settingButtonCss}>${name}</button>
	`;
}
