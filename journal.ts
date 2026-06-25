declare const marked: { parse(md: string): string };
declare const katex: {
  renderToString(tex: string, opts?: { displayMode?: boolean; throwOnError?: boolean }): string;
};

interface Section {
  title: string;
  html: string;
}

interface MathNode {
  tex: string;
  display: boolean;
}

let sections: Section[] = [];
let current = 0;

const pageEl = document.getElementById('page') as HTMLDivElement | null;
const jumpEl = document.getElementById('jump') as HTMLSelectElement | null;
const prevEl = document.getElementById('prev') as HTMLButtonElement | null;
const nextEl = document.getElementById('next') as HTMLButtonElement | null;

// Each HTML page sets `window.MD_FILE` before loading this script.
// Falls back to a default if unset.
const mdFile: string =
  (window as unknown as { MD_FILE?: string }).MD_FILE ?? '2026summerjournal.md';

if (pageEl && jumpEl && prevEl && nextEl) {
  init();
}

function parseWithMath(body: string): string {
  const math: MathNode[] = [];

  const stashed = body
    .replace(/\$\$([\s\S]+?)\$\$/g, (_, m: string) => {
      math.push({ tex: m, display: true });
      return `@@MATH${math.length - 1}@@`;
    })
    .replace(/\$([^\$\n]+?)\$/g, (_, m: string) => {
      math.push({ tex: m, display: false });
      return `@@MATH${math.length - 1}@@`;
    });

  const html = marked.parse(stashed);

  return html.replace(/@@MATH(\d+)@@/g, (_, i: string) => {
    const node = math[Number(i)];
    if (!node) return '';
    return katex.renderToString(node.tex, {
      displayMode: node.display,
      throwOnError: false
    });
  });
}

async function init(): Promise<void> {
  const res = await fetch(mdFile);
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
    jumpEl!.appendChild(opt);
  });

  prevEl!.addEventListener('click', () => { current--; render(); });
  nextEl!.addEventListener('click', () => { current++; render(); });
  jumpEl!.addEventListener('change', e => {
    current = Number((e.target as HTMLSelectElement).value);
    render();
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft' && current > 0) { current--; render(); }
    if (e.key === 'ArrowRight' && current < sections.length - 1) { current++; render(); }
  });

  render();
}

function render(): void {
  if (!pageEl || !jumpEl || !prevEl || !nextEl) return;
  const s = sections[current];
  if (!s) return;

  pageEl.innerHTML = `<h2>${s.title}</h2>${s.html}`;
  jumpEl.value = String(current);
  prevEl.disabled = current === 0;
  nextEl.disabled = current === sections.length - 1;

  const hasList = /<(ul|ol)\b/.test(s.html);
  pageEl.classList.remove('center', 'left');
  pageEl.classList.add('page');

  if (hasList) {
    pageEl.classList.add('center');
  } else {
    const p = pageEl.querySelector('p');
    if (p) {
      const lineHeight = parseFloat(getComputedStyle(p).lineHeight);
      const isOneLine = p.scrollHeight <= lineHeight * 1.5;
      pageEl.classList.add(isOneLine ? 'center' : 'left');
    } else {
      pageEl.classList.add('center');
    }
  }
}