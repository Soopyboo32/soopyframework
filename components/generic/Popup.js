import { html, Join, staticCss, thisClass, useRef } from "../../helpers.js";
import { colors, getBg } from "../../css.js";
import { Icon } from "./Icon.js";

let wrapperCss = staticCss.named("popupWrapper").css`{
    ${thisClass} {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: space-evenly;
        flex-wrap: wrap;
        overflow-y: scroll;
        overscroll-behavior: none;
        backdrop-filter: blur(5px);
        z-index: 2;
        animation-name: ${thisClass.animation("fadein")};
        animation-duration: .5s;
    }

    @keyframes ${thisClass.animation("fadein")} {
        0% {
            opacity: 0;
            backdrop-filter: blur(0);
            background-color: rgba(0, 0, 0, 0);
        }
        50% {
            opacity: 1;
        }
        100% {
            backdrop-filter: blur(5px);
            background-color: rgba(0, 0, 0, 0.5);
        }
    }
}`;

let popupCss = staticCss.named("popup").css`${thisClass} {
    margin: 10px;
    width: min(560px, calc(100% - 40px));
}`;
let centeredPopupCss = popupCss.named("centeredPopup").css`${thisClass} {
    display: flex;
    flex-direction: column;
    justify-content: center;
}`;

let popupTopCss = staticCss.named("popupTop").css`${thisClass} {
    padding: 10px;
    background: ${getBg(1)};
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
    border-bottom: 2px solid ${colors.text};
}`;
let popupBottomCss = staticCss.named("popupBottom").css`${thisClass} {
    padding: 10px;
        /*background: ${getBg(0)};*/
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
}`;

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
 * @param content {(close: () => undefined) => HTML}
 * @param onclose {() => any}
 * @param extraContent {() => [HTML, HTML][]}
 */
export function Popup(title, content, onclose = () => 0, extraContent = () => []) {
	let ref = useRef()/*.onRemove(settings.onChange((path, data) => {
		ref.setClass(settings.get().centerPopups ? centeredPopupCss : popupCss);
	}))*/;
	let wrapper = document.createElement("modal");

	let closeFn = () => {
		wrapper.remove();
		onclose();
	};
	let close = useRef().onClick(closeFn);

	let height = 0;

	wrapper.className = wrapperCss.getAllClasses().join(" ");
	wrapper.innerHTML = html.withRef(ref)`
		<div ${/*settings.get().centerPopups ? centeredPopupCss : */popupCss} ${ref}>
			<div ${popupTopCss} data-height="${height + 1}">
				<div ${popupTitleCss}>
					${title}
					${onclose ? html` <div ${close} ${closeCss}>${Icon("close")}</div>` : ""}
				</div>
			</div>
			<div ${popupBottomCss} data-height="${height}">
				${content(closeFn)}
			</div>
			${extraContent().map(([title, content]) => html`
				<br>
				<div ${popupTopCss} data-height="${height + 1}">
					<div ${popupTitleCss}>
						${title}
					</div>
				</div>
				<div ${popupBottomCss} data-height="${height}">
					${content}
				</div>
			`)}
		</div>
	`;

	document.body.appendChild(wrapper);
}

/**
 * @param content {(close: () => undefined) => [HTML, HTML][]}
 * @param onclose {() => any}
 */
export function MultiPopup(content, onclose = () => 0) {
	let ref = useRef()/*.onRemove(settings.onChange((path, data) => {
		ref.setClass(settings.get().centerPopups ? centeredPopupCss : popupCss);
	}))*/;
	let wrapper = document.createElement("modal");

	let closeFn = () => {
		wrapper.remove();
		onclose();
	};
	let close = useRef().onClick(closeFn);

	let height = 0;

	let cards = content(closeFn);

	wrapper.className = wrapperCss.getAllClasses().join(" ");
	wrapper.innerHTML = html.withRef(ref)`
		<div ${/*settings.get().centerPopups ? centeredPopupCss : */popupCss} ${ref}>
			${Join(cards.map(([title, content], index) => html`
				<div ${popupTopCss} data-height="${height + 1}">
					<div ${popupTitleCss}>
						${title}
						${onclose && index===0 ? html` <div ${close} ${closeCss}>${Icon("close")}</div>` : ""}
					</div>
				</div>
				<div ${popupBottomCss} data-height="${height}">
					${content}
				</div>
			`), html`<br>`)}
		</div>
	`;

	document.body.appendChild(wrapper);
}
