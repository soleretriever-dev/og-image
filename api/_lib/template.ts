
import { readFileSync } from 'fs';
import marked from 'marked';
import { sanitizeHtml } from './sanitizer';
import { ParsedRequest } from './types';
const twemoji = require('twemoji');
const twOptions = { folder: 'svg', ext: '.svg' };
const emojify = (text: string) => twemoji.parse(text, twOptions);
const bold = readFileSync(`${__dirname}/../_fonts/GT-America-Expanded-Bold.woff2`).toString('base64');

function getCss() {
    return `
      @font-face {
        font-family: 'GT America Expanded Bold';
        font-style:  normal;
        font-weight: bold;
        src: url(data:font/woff2;charset=utf-8;base64,${bold}) format('woff2');
    }

    body {
        background: white;
        height: 100vh;
        display: flex;
        text-align: center;
        align-items: center;
        justify-content: center;
        position: relative;
    }

    .logo-wrapper {
        display: flex;
        margin-top: 36px;
        align-items: center;
        align-content: center;
        justify-content: center;
        justify-items: center;
    }

    .small-spacer {
        margin: 64px;
    }

    .spacer {
        margin: 72px;
    }

    .shoe {
        margin-top: 32px;
    }
    
    .heading {
        font-family: 'GT America Expanded Bold', sans-serif;
        font-size: 4vw;
        width: 90vw;
        left: 0;
        z-index: -1;
        top: 0;
        right: 0;
        position: absolute;
        margin-left: 64px;
        margin-right: 64px;
        margin-top: 48px;
        font-style: normal;
        line-height: 1.6;
    }`;
}

export function getHtml(parsedReq: ParsedRequest) {
    const { text, md, images, widths, heights } = parsedReq;
    return `<!DOCTYPE html>
    <html>
    <meta charset="utf-8">
    <title>Generated Image</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <script type="text/javascript" src="https://soleretriever.s3.amazonaws.com/adaptive.js"></script>
    <style>
        ${getCss()}
    </style>
    <body class="imgWrap">
            <div class="heading">${emojify(
        md ? marked(text) : sanitizeHtml(text)
    )}
            </div>
                ${images.map((img, i) =>
        getImage(img, widths[i], heights[i])
    ).join('')}
        <footer>
            <script type="text/javascript">
                AdaptiveBackgrounds({normalizeTextColor: true});
            </script>
        </footer>
    </body>
</html>`;
}

function getImage(src: string, width = '875', height = '625') {
    return `<img
        class="shoe"
        alt="Generated Image"
        data-adaptive-background="1"
        crossorigin="anonymous"
        src="${sanitizeHtml(src)}"
        width="${sanitizeHtml(width)}"
        height="${sanitizeHtml(height)}"
    />`
}
