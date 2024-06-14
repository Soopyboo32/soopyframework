import { Popup } from "../Popup.js";
import { html, staticCss, thisClass, useRef } from "../../../helpers.js";
import { buttonCss, colors, getBg } from "../../../css.js";

let confirmButtonContainerCss = staticCss.named("confirm-button-container").css`${thisClass} {
    width: 100%;
    display: flex;
    justify-content: space-around;
}`;

let confirmPopupButtonCss = buttonCss.named("confirm-popup-button").css`${thisClass} {
    width: 40%;
    justify-content: center;
    font-size: 1.2rem;
	padding: 15px;
}`;
let confirmPopupButtonNoCss = confirmPopupButtonCss.named("confirm-popup-button-no").css`${thisClass} {
    background: transparent !important;
    border: 1px solid ${colors.primary};
}`;

/**
 * @param title {HTML}
 * @param description {HTML}
 * @param noButton {HTML|null}
 * @param yesButton {HTML}
 * @returns {Promise<boolean>}
 */
export function ConfirmPopup(title, description = "", noButton = "No", yesButton = "Yes") {
	return new Promise(resolve => {
		let hasResolved = false;

		Popup(title, (closeFn) => {
			let denyButtonRef = useRef().onClick(() => closeFn());
			let confirmButtonRef = useRef().onClick(() => {
				hasResolved = true;
				closeFn();
				resolve(true);
			});

			return html`
				${description}
				<div ${confirmButtonContainerCss}>
					${noButton !== null ? html`
						<button ${confirmPopupButtonNoCss} ${denyButtonRef}>${noButton}</button>` : ""}
					<button ${confirmPopupButtonCss} ${confirmButtonRef}>${yesButton}</button>
				</div>
			`
		}, () => {
			if (hasResolved) return;
			resolve(false);
		})
	})
}
