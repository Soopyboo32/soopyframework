import {css, html, staticCss, thisClass, useRef} from "../../helpers.js";

let tableCss = staticCss.named("table").css`${thisClass} {
	width: 100%;
}`;

/**
 * @param options {{centeredElms: boolean?, rightElms: boolean?}}
 * @param headerElms {HTML[]}
 * @param rows {...HTML[][]}
 * @returns {HTML}
 */
export function Table(options, headerElms, ...rows) {
	let ref = useRef();

	return html.withRef(ref)`
		<table ${ref} ${tableCss} ${css`
			${options.centeredElms ? "text-align: center;" : ""}
			${options.rightElms ? "text-align: right;" : ""}
			${options.centeredElms || options.rightElms ? "font-family: 'Open Sans', sans-serif;" : ""}
		`}>
			<tr>
				${headerElms.map(e => html`
					<th>${e}</th>`).join("")}
			</tr>
			${rows.map(row => html`
				<tr>
					${row.map(r => html`
						<td>${r}</td>`).join("")}
				</tr>`).join("")}
		</table>
	`;
}