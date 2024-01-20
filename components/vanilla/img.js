import {html, useRef} from "../../helpers.js";

export function Image(url, css) {
    let imageRef = useRef();

    return html.withRef(imageRef)`
		<img src="${url}" ${imageRef} ${css || ""}>
    `
}