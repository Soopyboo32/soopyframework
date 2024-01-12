import { html, staticCss, thisClass, useRef } from "../../helpers.js";
import { colors, getBg } from "../../css.js";
import { Icon } from "../../../renderer/Icon.js";

let wrapperCss = staticCss.named("popupWrapper").css`${thisClass} {
	position: fixed;
	top: 0;
	left: 0;
	width: 100vw;
	height: 100vh;
	background-color: rgba(0,0,0,0.5);
	display: flex;
	justify-content: space-evenly;
	flex-wrap: wrap;
	overflow-y: scroll;
	overscroll-behavior: none;
	backdrop-filter: blur(2px);
}`

let popupCss = staticCss.named("popup").css`${thisClass} {
	margin: 10px;
	width: min(560px, calc(100% - 40px)); 
	/*border: 1px solid ${colors.primary_dark};*/
}`;

let popupTopCss = staticCss.named("popupTop").css`${thisClass} {
	padding: 10px;
	// background: ${getBg(1)};
	border-top-left-radius: 5px;
	border-top-right-radius: 5px;
	border-bottom: 2px solid ${colors.text};
}`
let popupBottomCss = staticCss.named("popupBottom").css`${thisClass} {
	padding: 10px;
	/*background: ${getBg(0)};*/
	border-bottom-left-radius: 5px;
	border-bottom-right-radius: 5px;
}`

//TODO: hover anim, more button looks, ect
let closeCss = staticCss.named("popupClose").css`${thisClass} {
	/*float: right;*/
	cursor: pointer;
}`;

let popupTitleCss = staticCss.named("popupTitle").css`${thisClass} {
	display: flex;
	justify-content: space-between;
	align-items: center;
	flex-wrap: nowrap;
	font-size: 22px;
}`;

/**
 * @param title {string}
 * @param content {(close: () => undefined) => string}
 * @param onclose {() => any}
 */
export function Popup(title, content, onclose = () => 0) {
	let wrapper = document.createElement("modal");

	let closeFn = () => {
		wrapper.remove();
		onclose();
	};
	let close = useRef().onClick(closeFn);

	let height = 0;

	wrapper.className = wrapperCss.getAllClasses().join(" ");
	wrapper.innerHTML = html`
		<div ${popupCss}>
			<div ${popupTopCss} data-height="${height+1}">
				<div ${popupTitleCss}>
					${title}
					${onclose ? `<div ${close} ${closeCss}>${Icon("close")}</div>` : ""}
				</div>
			</div>
			<div ${popupBottomCss} data-height="${height}">
				${content(closeFn)}
			</div>
		</div>
	`;

	document.body.appendChild(wrapper);
}