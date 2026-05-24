/**
 * Utility functions used across all apps.
 */

const Utils = {
  /** Generate a unique ID */
  uid() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  },

  /** Format date as YYYY-MM-DD */
  fmtDate(date) {
    const d = new Date(date);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  },

  /** Format date as relative time in Chinese */
  fmtRelative(date) {
    const now = new Date();
    const target = new Date(date);
    const diffMs = target - now;
    const absDiff = Math.abs(diffMs);
    const days = Math.floor(absDiff / 86400000);

    if (diffMs === 0 || absDiff < 60000) return '今天';
    if (absDiff < 3600000) return Math.floor(absDiff / 60000) + '分钟' + (diffMs > 0 ? '后' : '前');
    if (absDiff < 86400000) return Math.floor(absDiff / 3600000) + '小时' + (diffMs > 0 ? '后' : '前');

    if (days === 0) return '今天';
    if (days === 1) return diffMs > 0 ? '明天' : '昨天';
    if (days === 2) return diffMs > 0 ? '后天' : '前天';

    if (diffMs > 0) return days + '天后';
    if (days <= 30) return days + '天前';

    return Utils.fmtDate(date);
  },

  /** Days between two dates */
  daysBetween(date1, date2) {
    const d1 = new Date(date1); d1.setHours(0, 0, 0, 0);
    const d2 = new Date(date2); d2.setHours(0, 0, 0, 0);
    return Math.floor((d2 - d1) / 86400000);
  },

  /** Parse ISO date to local YYYY-MM-DD */
  toDateInput(date) {
    const d = new Date(date);
    return d.getFullYear() + '-' +
      String(d.getMonth() + 1).padStart(2, '0') + '-' +
      String(d.getDate()).padStart(2, '0');
  },

  /** Format number with commas */
  fmtNum(n) {
    return Number(n).toLocaleString('zh-CN');
  },

  /** Format currency in CNY */
  fmtMoney(n) {
    return '¥' + Number(n).toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  },

  /** Clamp a number */
  clamp(val, min, max) {
    return Math.min(Math.max(val, min), max);
  },

  /** Debounce function */
  debounce(fn, delay = 300) {
    let timer;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), delay);
    };
  },

  /** Deep clone via JSON */
  clone(obj) {
    return JSON.parse(JSON.stringify(obj));
  },

  /** Get today's date as YYYY-MM-DD */
  today() {
    return Utils.fmtDate(new Date());
  },

  /** Get start of month */
  startOfMonth(date) {
    const d = new Date(date);
    d.setDate(1);
    return Utils.fmtDate(d);
  },

  /** Get end of month */
  endOfMonth(date) {
    const d = new Date(date);
    d.setMonth(d.getMonth() + 1);
    d.setDate(0);
    return Utils.fmtDate(d);
  },

  /** Get day of week in Chinese */
  dayOfWeek(date) {
    const days = ['日', '一', '二', '三', '四', '五', '六'];
    return '周' + days[new Date(date).getDay()];
  },

  /** Get month name in Chinese */
  monthName(month) {
    return (month + 1) + '月';
  },

  /** Truncate string */
  truncate(str, len = 20) {
    if (!str) return '';
    return str.length > len ? str.slice(0, len) + '...' : str;
  },

  /** Copy text to clipboard */
  async copyToClipboard(text) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand('copy');
      document.body.removeChild(ta);
      return ok;
    }
  },

  /** Parse URL query params */
  getQueryParams() {
    return Object.fromEntries(new URLSearchParams(location.search));
  },

  /** Convert hex color to RGB string */
  hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) return null;
    return `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`;
  },

  /** Generate a gradient background from two colors */
  randomGradient() {
    const hues = [220, 260, 180, 340, 40, 160, 280, 30];
    const h1 = hues[Math.floor(Math.random() * hues.length)];
    const h2 = (h1 + 30 + Math.floor(Math.random() * 60)) % 360;
    return `linear-gradient(135deg, hsl(${h1}, 70%, 55%), hsl(${h2}, 70%, 50%))`;
  }
};
