import {html, useRef} from "../../helpers.js";

export function Image(url, css=undefined) {
    let imageRef = useRef();

    return html.withRef(imageRef)`
		<img src="${url}" ${imageRef} ${css || ""}>
    `
}