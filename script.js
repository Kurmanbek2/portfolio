// ===== Мобильное меню (три линии) =====
const burger = document.getElementById('burger');
const menu = document.getElementById('menu');
 
function closeMenu() {
  menu.classList.remove('is-open');
  burger.setAttribute('aria-expanded', 'false');
  burger.setAttribute('aria-label', 'Открыть меню');
}
 
burger.addEventListener('click', () => {
  const open = menu.classList.toggle('is-open');
  burger.setAttribute('aria-expanded', open);
  burger.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
});
 
// закрываем меню: по клику на пункт, по Escape и по клику вне меню
menu.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
document.addEventListener('click', e => {
  if (!menu.contains(e.target) && !burger.contains(e.target)) closeMenu();
});
 
// ===== Кнопка «Наверх» (справа снизу) =====
const toTop = document.getElementById('to-top');
 
function updateToTop() {
  toTop.classList.toggle('is-visible', window.scrollY > 400);
}
window.addEventListener('scroll', updateToTop, { passive: true });
updateToTop();
 
toTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});
 
// ===== Светлая / тёмная тема (слева снизу) =====
const themeBtn = document.getElementById('theme-toggle');
const root = document.documentElement;
 
function applyTheme(theme) {
  root.setAttribute('data-theme', theme);
  themeBtn.setAttribute(
    'aria-label',
    theme === 'dark' ? 'Включить светлую тему' : 'Включить тёмную тему'
  );
}
 
applyTheme(root.getAttribute('data-theme') === 'light' ? 'light' : 'dark');
 
themeBtn.addEventListener('click', () => {
  const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  applyTheme(next);
  try { localStorage.setItem('theme', next); } catch (e) {}
});
 
// ===== Звёзды в отзывах =====
// <span class="stars" data-rating="4"></span>  →  ★★★★☆ 4/5
document.querySelectorAll('.stars').forEach(el => {
  const rating = Number(el.dataset.rating) || 0;
  for (let i = 1; i <= 5; i++) {
    const s = document.createElement('span');
    s.className = 'star' + (i > rating ? ' star--off' : '');
    s.textContent = '★';
    el.appendChild(s);
  }
  const label = document.createElement('span');
  label.className = 'stars__label';
  label.textContent = el.dataset.label || `${rating}/5`;
  el.appendChild(label);
});
 
// ===== Форма обратной связи =====
const form = document.getElementById('contact-form');
const statusEl = document.getElementById('form-status');
 
const rules = {
  email: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || 'Введите корректную почту',
  phone: v => v === '' || /^[+\d][\d\s()-]{6,}$/.test(v) || 'Введите корректный номер',
  message: v => v.trim().length >= 5 || 'Сообщение слишком короткое'
};
 
function validateField(name) {
  const input = form.elements[name];
  const result = rules[name](input.value.trim());
  const errorEl = form.querySelector(`.form__error[data-for="${name}"]`);
  const ok = result === true;
  input.classList.toggle('is-invalid', !ok);
  errorEl.textContent = ok ? '' : result;
  return ok;
}
 
Object.keys(rules).forEach(name =>
  form.elements[name].addEventListener('blur', () => validateField(name))
);
 
form.addEventListener('submit', async e => {
  e.preventDefault();
  statusEl.className = 'form__status';
  statusEl.textContent = '';
 
  const allValid = Object.keys(rules).map(validateField).every(Boolean);
  if (!allValid) return;
 
  const data = Object.fromEntries(new FormData(form));
 
  try {
    // Сейчас это имитация отправки.
    // Чтобы получать письма по-настоящему, зарегистрируйся на formspree.io,
    // получи ссылку вида https://formspree.io/f/xxxxxxx и раскомментируй:
    //
    // const res = await fetch('https://formspree.io/f/xxxxxxx', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    //   body: JSON.stringify(data)
    // });
    // if (!res.ok) throw new Error('Ошибка отправки');
 
    await new Promise(r => setTimeout(r, 600));
    console.log('Данные формы:', data);
 
    statusEl.textContent = 'Спасибо! Сообщение отправлено.';
    statusEl.classList.add('is-success');
    form.reset();
  } catch (err) {
    statusEl.textContent = 'Не удалось отправить. Попробуйте позже.';
    statusEl.classList.add('is-error');
  }
});