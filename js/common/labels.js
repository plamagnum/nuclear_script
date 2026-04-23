import { CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js';

export function ensureLabelStyles() {
  if (document.getElementById('shared-label-styles')) {
    return;
  }

  const style = document.createElement('style');
  style.id = 'shared-label-styles';
  style.textContent = `
    .label {
      padding: 4px 8px;
      border-radius: 8px;
      background: rgba(0,0,0,.55);
      color: #fff;
      font: 13px/1.2 system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
      border: 1px solid rgba(255,255,255,.16);
      white-space: nowrap;
      pointer-events: none;
      backdrop-filter: blur(6px);
    }
    .label small { opacity: 0.8; font-size: 11px; }
  `;
  document.head.appendChild(style);
}

export function createLabel(html) {
  ensureLabelStyles();
  const div = document.createElement('div');
  div.className = 'label';
  div.innerHTML = html;
  return new CSS2DObject(div);
}

export function addLabels(parent, labels) {
  return labels.map(({ html, position }) => {
    const label = createLabel(html);
    label.position.set(...position);
    parent.add(label);
    return label;
  });
}
