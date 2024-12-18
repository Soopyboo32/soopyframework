import { css, html, useRef } from "../../helpers.js";

let fixedCss = css;

export function Img(url, {
	css = undefined,
	cssRaw = undefined,
	lazyLoad = true,
	fadeIfLoaded = false,
	width = undefined,
	height = undefined,
	draggable = undefined,
} = {}) {
	let imageRef = useRef();

	let image = new Image();
	image.src = url;
	let cached = image.complete;

	let shouldFade = fadeIfLoaded || !cached;

	return html.withRef(imageRef)`
		<img
            src="${url}"
            ${imageRef}
            ${css || ""}
            ${shouldFade ? fixedCss`
                transition: opacity 0.5s;
                opacity: 0;
                ${cssRaw}
            ` : cssRaw}
            ${width ? `width=${width}` : ""}
            ${height ? `height=${height}` : ""}
            ${lazyLoad ? `loading="lazy"` : ""}
            ${draggable !== undefined ? `draggable="${draggable}"` : ""}
            ${shouldFade ? `onload="setTimeout(()=>this.style.opacity=1)"` : ""}
		>
    `;
}