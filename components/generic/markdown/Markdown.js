import { html, Join, staticCss, thisClass } from "../../../helpers.js";
import { UnsafeText } from "../UnsafeText.js";
import { colors } from "../../../css.js";
import { Img } from "../../vanilla/img.js";

let titleCss = staticCss.named("titleCss").css`${thisClass} {
    margin-top: 0;
    margin-bottom: 0;
}`
let pCss = staticCss.named("pCss").css`${thisClass} {
    margin-top: 0;
    margin-bottom: 0;
}`
let codeBlockContainerCss = staticCss.named("codeBlockContainer").css`${thisClass} {
    border: 1px solid ${colors.primary};
    border-radius: 5px;
}`
let codeBlockTitleCss = staticCss.named("codeBlockTitle").css`${thisClass} {
    padding: 5px;
    width: calc(100% - 10px);
    border-bottom: 1px solid ${colors.primary};
}`
let codeBlockCodeCss = staticCss.named("codeBlockCode").css`${thisClass} {
    display: block;
    margin: 5px;
}`
let inlineCodeBlockCodeCss = staticCss.named("inlineCodeBlockCode").css`${thisClass} {
    border: 1px solid ${colors.primary};
    border-radius: 5px;
    padding: 2px;
}`

export function Markdown(text, {
	autodetectImagesFrom = [],
	autodetectLinks = true,
	imageUrlReplace = () => {
	}
} = {}) {
	let linksMap = autoDetectLinks(autodetectImagesFrom, autodetectLinks, imageUrlReplace);
	let lines = text.split("\n").map(linksMap);
	lines.reverse();
	let components = [];
	while (lines.length > 0) {
		components.push(parseMarkdownComponent(() => lines.pop(), () => lines[lines.length - 1]));
	}
	return html`
		${components}
	`;
}

function autoDetectLinks(autodetectImagesFrom, autodetectLinks, imageUrlReplace) {
	return text => {
		let basicUrlRegex = /(?<!]\()(?<!\[)(?:(?:https?|ftp|file):\/\/|www\.|ftp\.)(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[-A-Z0-9+&@#\/%=~_|$?!:,.])*(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[A-Z0-9+&@#\/%=~_|$])/igm

		if (autodetectImagesFrom) text = text.replace(basicUrlRegex, match => {
			if (!match.endsWith(".png") && !match.endsWith(".jpg") && !match.endsWith(".gif") && !match.endsWith(".jpeg")) return match;

			for (let site of autodetectImagesFrom) {
				if (match.startsWith(site)) {
					return "![" + match + "](" + imageUrlReplace(match) + ")";
				}
			}

			return match;
		});

		if (autodetectLinks) text = text.replace(basicUrlRegex, "[$&]($&)");

		return text;
	}
}

function parseMarkdownComponent(lineProducer, linePeaker) {
	let line = lineProducer();
	if (line.startsWith("# ")) {
		return html`<h1 ${titleCss}>${parseMarkdownLine(line.replace("# ", ""))}</h1>`
	} else if (line.startsWith("## ")) {
		return html`<h2 ${titleCss}>${parseMarkdownLine(line.replace("## ", ""))}</h2>`
	} else if (line.startsWith("### ")) {
		return html`<h3 ${titleCss}>${parseMarkdownLine(line.replace("### ", ""))}</h3>`
	} else if (line.startsWith("#### ")) {
		return html`<h4 ${titleCss}>${parseMarkdownLine(line.replace("#### ", ""))}</h4>`
	} else if (line.startsWith("##### ")) {
		return html`<h5 ${titleCss}>${parseMarkdownLine(line.replace("##### ", ""))}</h5>`
	} else if (line.startsWith("###### ")) {
		return html`<h6 ${titleCss}>${parseMarkdownLine(line.replace("###### ", ""))}</h6>`
	} else if (line.startsWith("```")) {
		let lang = line.replace("```", "");
		let lines = [];
		while (!(line = lineProducer())?.startsWith("```")) {
			lines.push(line);
		}
		return html`
			<div ${codeBlockContainerCss}>
				${lang ? html`
					<div ${codeBlockTitleCss}>
						${lang}
					</div>` : ""}
				${applyCodeFormatting(lines, lang)}
			</div>
		`;
	}

	let lines = [parseMarkdownLine(line)];
	while (linePeaker() && !isSpecialLine(linePeaker())) {
		lines.push(parseMarkdownLine(lineProducer()));
	}

	//if there's an empty line between 2 special components make sure it still takes a gap
	if (lines.length === 1 && line === "") {
		lines[0] = html`<br>`;
	}

	return html`<p ${pCss}>${Join(lines, html`<br>`)}</p>`
}

function isSpecialLine(line) {
	return line.startsWith("# ")
		|| line.startsWith("## ")
		|| line.startsWith("### ")
		|| line.startsWith("#### ")
		|| line.startsWith("##### ")
		|| line.startsWith("###### ")
		|| line.startsWith("```")
}

function parseMarkdownLine(line) {
	//TODO: links & images
	let isBold = false
	let isItalic = false
	let isBold2 = false
	let isItalic2 = false
	let isCode = false
	let ret = []
	let lastChar = ""
	for (let char of line) {
		if (char === "`") {
			isCode = !isCode;
			if (isCode) {
				if (isBold2) ret.push("</b>")
				if (isItalic2) ret.push("</i>")
				isBold = false;
				isBold2 = false;
				isItalic = false;
				isItalic2 = false;

				ret.push(`<code ${inlineCodeBlockCodeCss}>`);
			} else {
				ret.push("</code>");
			}
			continue;
		}
		if (!isCode && (char === "_" || char === "*")) {
			if (lastChar === "_" || lastChar === "*") {
				isItalic = !isItalic
				isBold = !isBold
				lastChar = "";
				continue;
			}

			isItalic = !isItalic
			lastChar = char;
			continue;
		}

		if (isItalic !== isItalic2) {
			isItalic2 = isItalic;
			if (isItalic) ret.push("<i>")
			else ret.push("</i>")
		}
		if (isBold !== isBold2) {
			isBold2 = isBold
			if (isBold) ret.push("<b>")
			else ret.push("</b>")
		}

		ret.push(UnsafeText(char))

		lastChar = char;
	}
	if (isBold2) ret.push("</b>")
	if (isItalic2) ret.push("</i>")
	if (isCode) {
		ret.push("</code>");
	}
	return html.unsafe(applyLinksImages(ret.join("")));
}

function applyLinksImages(text) {
	let imageRegex = /!\[.*?]\((.*?)\)/g
	let urlRegex = /\[(.*?)]\(.*?\)/g

	return text
		.replace(imageRegex, (match, url) => Img(url, {cssRaw: `max-width: 100%;`}))
		.replace(urlRegex, "<a href='$1' target='_blank'>$1</a>")
}

function applyCodeFormatting(lines, lang) {
	return html`<code ${codeBlockCodeCss}>${Join(lines, html`<br>`)}</code>`
}
