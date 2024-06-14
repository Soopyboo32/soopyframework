import { html, staticCss, thisClass, useRef } from "../../helpers.js";

let chunkCss = staticCss.named("chapterChunk").css`${thisClass} {
    content-visibility: visible;
    contain-intrinsic-size: auto 0;
}`

export function Chunk(elms = [], chunkSize = 50) {
    const observer = new IntersectionObserver(entries => {
        for (let e of entries) {
            e.target.style.contentVisibility = e.isIntersecting ? "auto" : "hidden";
        }
    });

    let chunks = [[[], useRef().observe(observer)]];
    elms.forEach((c, i) => {
        if (i && i % chunkSize === 0) chunks.push([[], useRef().observe(observer)])
        chunks[chunks.length - 1][0].push(c)
    })

    return html`
		${chunks.map(([chunk, ref]) => html`
			<div ${chunkCss} ${ref}>
				${chunk}
			</div>
		`)}
    `
}
