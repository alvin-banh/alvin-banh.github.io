let sections = [];
let current = 0;
const pageEl = document.getElementById('page');
const jumpEl = document.getElementById('jump');
const prevEl = document.getElementById('prev');
const nextEl = document.getElementById('next');
if (pageEl && jumpEl && prevEl && nextEl) {
    init();
}
function parseWithMath(body) {
    const math = [];
    const stashed = body
        .replace(/\$\$([\s\S]+?)\$\$/g, (_, m) => {
        math.push({ tex: m, display: true });
        return `@@MATH${math.length - 1}@@`;
    })
        .replace(/\$([^\$\n]+?)\$/g, (_, m) => {
        math.push({ tex: m, display: false });
        return `@@MATH${math.length - 1}@@`;
    });
    const html = marked.parse(stashed);
    return html.replace(/@@MATH(\d+)@@/g, (_, i) => {
        const node = math[Number(i)];
        if (!node)
            return '';
        return katex.renderToString(node.tex, {
            displayMode: node.display,
            throwOnError: false
        });
    });
}
async function init() {
    const res = await fetch('2026summerjournal.md');
    const md = await res.text();
    const parts = md.split(/(?=^## )/m).filter(s => s.trim());
    sections = parts.map(chunk => {
        const titleMatch = chunk.match(/^## (.+)/);
        const title = titleMatch?.[1]?.trim() ?? 'Untitled';
        const body = chunk.replace(/^## .+\n?/, '');
        return {
            title,
            html: parseWithMath(body)
        };
    });
    sections.forEach((s, i) => {
        const opt = document.createElement('option');
        opt.value = String(i);
        opt.textContent = s.title;
        jumpEl.appendChild(opt);
    });
    prevEl.addEventListener('click', () => { current--; render(); });
    nextEl.addEventListener('click', () => { current++; render(); });
    jumpEl.addEventListener('change', e => {
        current = Number(e.target.value);
        render();
    });
    document.addEventListener('keydown', e => {
        if (e.key === 'ArrowLeft' && current > 0) {
            current--;
            render();
        }
        if (e.key === 'ArrowRight' && current < sections.length - 1) {
            current++;
            render();
        }
    });
    render();
}
function render() {
    if (!pageEl || !jumpEl || !prevEl || !nextEl)
        return;
    const s = sections[current];
    if (!s)
        return;
    pageEl.innerHTML = `<h2>${s.title}</h2>${s.html}`;
    jumpEl.value = String(current);
    prevEl.disabled = current === 0;
    nextEl.disabled = current === sections.length - 1;
    const hasList = /<(ul|ol)\b/.test(s.html);
    pageEl.classList.remove('center', 'left');
    pageEl.classList.add('page');
    if (hasList) {
        pageEl.classList.add('center');
    }
    else {
        const p = pageEl.querySelector('p');
        if (p) {
            const lineHeight = parseFloat(getComputedStyle(p).lineHeight);
            const isOneLine = p.scrollHeight <= lineHeight * 1.5;
            pageEl.classList.add(isOneLine ? 'center' : 'left');
        }
        else {
            pageEl.classList.add('center');
        }
    }
}
export {};
//# sourceMappingURL=journal.js.map