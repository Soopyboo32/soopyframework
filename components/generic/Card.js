import { css, html, staticCss, thisClass, useRef } from "../../helpers.js";
import { colors, getBg } from "../../css.js";
import { Icon } from "../../../renderer/Icon.js";

let cardCss = staticCss.named("card").css`${thisClass} {
	display: flex;
	flex-direction: column;
	margin: 10px;
	width: min(500px, calc(100% - 40px)); /* will take less than 500px if there is an overflow */
		/*border: 1px solid ${colors.primary_dark};*/
	border-radius: 5px;
	webkit-box-shadow: 10px 10px 10px 0px rgba(0, 0, 0, 0.15);
	-moz-box-shadow: 10px 10px 10px 0px rgba(0, 0, 0, 0.15);
	box-shadow: 10px 10px 10px 0px rgba(0, 0, 0, 0.15);
}`;

let cardTopCss = staticCss.named("cardTop").css`${thisClass} {
	padding: 10px;
	/*background: ${getBg(1)};*/
	border-top-left-radius: 5px;
	border-top-right-radius: 5px;
	border-bottom: 2px solid ${colors.text};
}`
let cardBottomCss = staticCss.named("cardBottom").css`${thisClass} {
	padding: 10px;
	/*background: ${getBg(0)};*/
	border-bottom-left-radius: 5px;
	border-bottom-right-radius: 5px;
	height: 100%;
}`

//TODO: hover anim, more button looks, ect
let arrowCss = staticCss.named("cardArrow").css`${thisClass} {
	/*float: right;*/
	cursor: pointer;
}`

let cardTitleCss = staticCss.named("cardTitle").css`${thisClass} {
	display: flex;
	justify-content: space-between;
	align-items: center;
	flex-wrap: nowrap;
	font-size: 22px;
}`

export function Card(title, contents, height=1, openFn) {
	let cardRef = useRef();
	let ref = useRef().onClick(() => {
		if (!openFn) return;
		openFn();
	});

	return html.withRef(cardRef)`
		<div ${cardCss} ${cardRef}>
			<div ${cardTopCss} data-height="${height+1}">
				<div ${cardTitleCss}>
					${title}
					${openFn ? `<div ${ref} ${arrowCss}>${Icon("arrow_forward")}</div>` : ""}
				</div>
			</div>
			<div ${cardBottomCss} data-height="${height}">
				${contents}
			</div>
		</div>
	`;
}