import { Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx';

interface InheritedStyles {
    textAlign?: string;
    fontWeight?: string;
    fontStyle?: string;
    textDecoration?: string;
    fontSize?: string;
}

export function getAlignment(textAlign?: string) {
    if (textAlign === 'center') return AlignmentType.CENTER;
    if (textAlign === 'right') return AlignmentType.RIGHT;
    if (textAlign === 'justify') return AlignmentType.JUSTIFIED;
    if (textAlign === 'left') return AlignmentType.LEFT;
    return undefined;
}

export function parseChildren(node: Node, styles: InheritedStyles): TextRun[] {
    const runs: TextRun[] = [];

    if (node.nodeType === Node.TEXT_NODE) {
        if (node.textContent) {
            const parent = node.parentElement;
            const isHeading = parent?.tagName.startsWith('H');
            const hLevel = isHeading ? parseInt(parent!.tagName.substring(1)) : 0;

            let fontSize = 24; // 12pt default
            if (hLevel === 1) fontSize = 36; // 18pt
            else if (hLevel === 2) fontSize = 32; // 16pt
            else if (hLevel === 3) fontSize = 28; // 14pt

            runs.push(new TextRun({
                text: node.textContent,
                font: "Calibri",
                size: fontSize,
                bold: styles.fontWeight === 'bold' || isHeading,
                italics: styles.fontStyle === 'italic',
                underline: styles.textDecoration === 'underline' ? { type: "single" } : undefined,
            }));
        }
        return runs;
    }

    if (node.nodeType !== Node.ELEMENT_NODE) {
        return [];
    }

    const element = node as HTMLElement;
    if (element.tagName === 'BR') {
        return [new TextRun({ break: 1 })];
    }

    const currentStyles: InheritedStyles = {
        textAlign: element.style.textAlign || styles.textAlign,
        fontWeight: (element.tagName === 'STRONG' || element.tagName === 'B' || element.style?.fontWeight === 'bold') ? 'bold' : styles.fontWeight,
        fontStyle: (element.tagName === 'EM' || element.tagName === 'I' || element.style?.fontStyle === 'italic') ? 'italic' : styles.fontStyle,
        textDecoration: (element.tagName === 'U' || element.style?.textDecoration === 'underline') ? 'underline' : styles.textDecoration,
    };

    element.childNodes.forEach(child => {
        const childRuns = parseChildren(child, currentStyles);
        runs.push(...childRuns);
    });

    return runs;
}

export function processNode(node: Node, styles: InheritedStyles): Paragraph[] {
    if (node.nodeType === Node.TEXT_NODE) {
        if (node.textContent?.trim()) {
            return [new Paragraph({
                children: parseChildren(node, styles),
                alignment: getAlignment(styles.textAlign)
            })];
        }
        return [];
    }

    if (node.nodeType !== Node.ELEMENT_NODE) {
        return [];
    }

    const element = node as HTMLElement;
    const tagName = element.tagName.toUpperCase();

    const currentStyles: InheritedStyles = {
        textAlign: element.style.textAlign || styles.textAlign,
        fontWeight: element.style.fontWeight || styles.fontWeight,
        fontSize: element.style.fontSize || styles.fontSize,
    };

    if (tagName === 'TABLE') {
        const flattenedContent: Paragraph[] = [];
        const processChildren = (parent: Node) => {
            Array.from(parent.childNodes).forEach(child => {
                const nodeName = child.nodeName;
                if (nodeName === 'TR') {
                    Array.from(child.childNodes).forEach(td => {
                        if (td.nodeName === 'TD' || td.nodeName === 'TH') {
                            const cellStyles = { ...currentStyles, textAlign: (td as HTMLElement).style.textAlign || 'left' };
                            const cellChildren = Array.from(td.childNodes).flatMap(n => processNode(n, cellStyles));
                            flattenedContent.push(...cellChildren);
                        }
                    });
                } else if (['TBODY', 'THEAD', 'TFOOT'].includes(nodeName)) {
                    processChildren(child);
                }
            });
        };

        processChildren(element);
        return flattenedContent;
    } else if (['DIV', 'SECTION', 'ARTICLE', 'HEADER', 'FOOTER'].includes(tagName)) {
        return Array.from(element.childNodes).flatMap(n => processNode(n, currentStyles));
    } else if (tagName === 'P') {
        return [new Paragraph({
            children: parseChildren(element, currentStyles),
            spacing: { before: 120, after: 120, line: 360 }, // 1.5 line spacing
            alignment: getAlignment(element.style.textAlign || styles.textAlign) || AlignmentType.JUSTIFIED
        })];
    } else if (tagName.startsWith('H')) {
        const level = parseInt(tagName.substring(1));
        const headingLevel = level === 1 ? HeadingLevel.HEADING_1 :
            level === 2 ? HeadingLevel.HEADING_2 :
                level === 3 ? HeadingLevel.HEADING_3 :
                    level === 4 ? HeadingLevel.HEADING_4 :
                        level === 5 ? HeadingLevel.HEADING_5 : HeadingLevel.HEADING_6;

        return [new Paragraph({
            children: parseChildren(element, { ...currentStyles, fontWeight: 'bold' }),
            heading: headingLevel,
            spacing: { before: level === 1 ? 800 : 400, after: level === 1 ? 400 : 200 },
            alignment: getAlignment(element.style.textAlign || styles.textAlign) || (level === 1 ? AlignmentType.CENTER : AlignmentType.LEFT)
        })];
    } else if (tagName === 'UL' || tagName === 'OL') {
        return Array.from(element.childNodes).flatMap(li => {
            if (li.nodeName === 'LI') {
                return [new Paragraph({
                    children: parseChildren(li, currentStyles),
                    bullet: { level: 0 },
                    spacing: { before: 100, after: 100, line: 360 }
                })];
            }
            return [];
        });
    } else if (tagName === 'BR') {
        return [new Paragraph({ spacing: { after: 200 } })];
    } else {
        const runs = parseChildren(element, currentStyles);
        if (runs.length > 0) {
            return [new Paragraph({
                children: runs,
                spacing: { after: 200 },
                alignment: getAlignment(styles.textAlign)
            })];
        }
    }
    return [];
}

export function parseHtmlToDocx(html: string) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    return Array.from(doc.body.childNodes).flatMap(node => processNode(node, {}));
}
