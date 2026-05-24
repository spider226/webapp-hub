/**
 * Reusable UI components.
 * All components return DOM elements or control objects.
 */

const UI = {
  /** Show a toast notification */
  toast(message, type = 'info', duration = 2500) {
    let container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const el = document.createElement('div');
    el.className = 'toast toast-' + type;
    el.textContent = message;
    container.appendChild(el);

    setTimeout(() => {
      el.style.opacity = '0';
      el.style.transition = 'opacity 0.3s';
      setTimeout(() => el.remove(), 300);
    }, duration);
  },

  /** Show a bottom-sheet modal */
  modal({ title, content, onClose }) {
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';

    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content';
    modalContent.innerHTML = `
      <div class="modal-handle"></div>
      ${title ? '<div class="modal-title">' + title + '</div>' : ''}
      <div class="modal-body"></div>
    `;

    const body = modalContent.querySelector('.modal-body');
    if (typeof content === 'string') {
      body.innerHTML = content;
    } else if (content instanceof HTMLElement) {
      body.appendChild(content);
    }

    overlay.appendChild(modalContent);

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        overlay.remove();
        if (onClose) onClose();
      }
    });

    document.body.appendChild(overlay);

    return {
      close() {
        overlay.remove();
        if (onClose) onClose();
      },
      getBody() { return body; },
      getOverlay() { return overlay; }
    };
  },

  /** Show a confirmation dialog */
  confirm({ title, message, confirmText = '确认', cancelText = '取消', danger = false }) {
    return new Promise((resolve) => {
      const m = UI.modal({
        title,
        content: `
          <p style="color:var(--color-text-secondary);margin-bottom:20px">${message}</p>
          <div style="display:flex;gap:10px">
            <button class="btn btn-secondary btn-block" data-action="cancel">${cancelText}</button>
            <button class="btn ${danger ? 'btn-danger' : 'btn-primary'} btn-block" data-action="confirm">${confirmText}</button>
          </div>
        `
      });

      m.getBody().addEventListener('click', (e) => {
        const action = e.target.closest('button')?.dataset.action;
        if (action === 'confirm') { m.close(); resolve(true); }
        if (action === 'cancel') { m.close(); resolve(false); }
      });
    });
  },

  /** Render an empty state */
  emptyState({ icon, title, description, actionText, onAction }) {
    const div = document.createElement('div');
    div.className = 'empty-state';
    div.innerHTML = `
      ${icon || '<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>'}
      <h3>${title || '暂无数据'}</h3>
      ${description ? '<p>' + description + '</p>' : ''}
      ${actionText ? '<button class="btn btn-primary btn-sm empty-action">' + actionText + '</button>' : ''}
    `;

    if (actionText && onAction) {
      div.querySelector('.empty-action').addEventListener('click', onAction);
    }

    return div;
  },

  /** Create a loading spinner */
  loadingSpinner(text = '加载中...') {
    const div = document.createElement('div');
    div.className = 'empty-state';
    div.innerHTML = `
      <svg style="animation:spin 1s linear infinite;width:40px;height:40px;color:var(--color-primary)" xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
      <p style="color:var(--color-text-secondary)">${text}</p>
    `;
    return div;
  },

  /** Render a card */
  card({ title, subtitle, body, footer, className }) {
    const div = document.createElement('div');
    div.className = 'card' + (className ? ' ' + className : '');

    let html = '';
    if (title) {
      html += '<div class="card-header">';
      html += '<span class="card-title">' + title + '</span>';
      if (subtitle) html += '<span class="text-xs text-secondary">' + subtitle + '</span>';
      html += '</div>';
    }
    if (body) html += body;
    div.innerHTML = html;

    if (footer) {
      const footerDiv = document.createElement('div');
      footerDiv.style.cssText = 'margin-top:12px;padding-top:12px;border-top:1px solid var(--color-border)';
      if (typeof footer === 'string') footerDiv.innerHTML = footer;
      else footerDiv.appendChild(footer);
      div.appendChild(footerDiv);
    }

    return div;
  },

  /** Render tabs */
  tabs({ items, active, onChange }) {
    const div = document.createElement('div');
    div.className = 'tabs';

    items.forEach((item, i) => {
      const btn = document.createElement('button');
      btn.className = 'tab' + (i === active ? ' active' : '');
      btn.textContent = item;
      btn.addEventListener('click', () => {
        div.querySelectorAll('.tab').forEach((t, j) => t.classList.toggle('active', j === i));
        if (onChange) onChange(i, item);
      });
      div.appendChild(btn);
    });

    return div;
  },

  /** Render a stat card */
  statCard({ value, label, color }) {
    const div = document.createElement('div');
    div.className = 'stat-card';
    div.innerHTML = `
      <div class="stat-value" style="${color ? 'color:' + color : ''}">${value}</div>
      <div class="stat-label">${label}</div>
    `;
    return div;
  },

  /** Render a progress bar */
  progressBar(percent, options = {}) {
    const { showLabel = true, className = '' } = options;
    const div = document.createElement('div');
    div.style.cssText = 'margin-bottom:12px';
    div.innerHTML = `
      ${showLabel ? '<div style="display:flex;justify-content:space-between;margin-bottom:4px;font-size:0.8rem"><span>' + (options.label || '') + '</span><span style="color:var(--color-text-secondary)">' + percent + '%</span></div>' : ''}
      <div class="progress-bar">
        <div class="progress-fill ${className}" style="width:${percent}%"></div>
      </div>
    `;
    return div;
  },

  /** Render a tag */
  tag(text, type = '') {
    const span = document.createElement('span');
    span.className = 'tag' + (type ? ' tag-' + type : '');
    span.textContent = text;
    return span;
  },

  /** Show image/color picker using native input */
  colorPicker(value, onChange) {
    const input = document.createElement('input');
    input.type = 'color';
    input.value = value || '#6366f1';
    input.style.cssText = 'width:40px;height:40px;border:none;border-radius:50%;cursor:pointer;padding:0';
    input.addEventListener('input', () => onChange(input.value));
    return input;
  },

  /** Create a swipeable list item with delete */
  swipeItem({ content, onDelete }) {
    const wrapper = document.createElement('div');
    wrapper.style.cssText = 'position:relative;overflow:hidden;margin-bottom:1px';

    const item = document.createElement('div');
    item.className = 'list-item';
    item.style.cssText = 'position:relative;z-index:2;background:var(--color-surface);transition:transform 0.2s';
    if (typeof content === 'string') item.innerHTML = content;
    else item.appendChild(content);

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'btn btn-danger btn-sm';
    deleteBtn.textContent = '删除';
    deleteBtn.style.cssText = 'position:absolute;right:12px;top:50%;transform:translateY(-50%);z-index:1';

    let startX = 0, currentX = 0;
    item.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; });
    item.addEventListener('touchmove', (e) => {
      currentX = e.touches[0].clientX - startX;
      if (currentX < 0) item.style.transform = 'translateX(' + Math.max(currentX, -80) + 'px)';
    });
    item.addEventListener('touchend', () => {
      if (currentX < -40) item.style.transform = 'translateX(-80px)';
      else item.style.transform = 'translateX(0)';
      currentX = 0;
    });

    deleteBtn.addEventListener('click', () => {
      wrapper.style.transition = 'all 0.3s';
      wrapper.style.maxHeight = wrapper.offsetHeight + 'px';
      requestAnimationFrame(() => {
        wrapper.style.maxHeight = '0';
        wrapper.style.opacity = '0';
        setTimeout(() => wrapper.remove(), 300);
      });
      if (onDelete) onDelete();
    });

    wrapper.appendChild(deleteBtn);
    wrapper.appendChild(item);
    return wrapper;
  },

  /** Make an element draggable for reordering (touch + mouse) */
  makeDraggable(container, onReorder) {
    let dragEl = null;
    let dragIndex = -1;

    container.addEventListener('dragstart', (e) => {
      dragEl = e.target.closest('[draggable="true"]');
      if (!dragEl) return;
      dragIndex = Array.from(container.children).indexOf(dragEl);
      dragEl.style.opacity = '0.5';
    });

    container.addEventListener('dragend', (e) => {
      if (dragEl) dragEl.style.opacity = '1';
      dragEl = null;
    });

    container.addEventListener('dragover', (e) => {
      e.preventDefault();
      const target = e.target.closest('[draggable="true"]');
      if (!target || target === dragEl) return;
      const targetIndex = Array.from(container.children).indexOf(target);
      if (targetIndex > dragIndex) {
        container.insertBefore(dragEl, target.nextSibling);
      } else {
        container.insertBefore(dragEl, target);
      }
      dragIndex = targetIndex;
      if (onReorder) onReorder();
    });
  }
};
