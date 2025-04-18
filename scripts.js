const clickSound = new Audio('/sounds/click.mp3');
clickSound.preload = 'auto';

function isClickable(element) {
  const tag = element.tagName.toLowerCase();
  const type = element.getAttribute('type');
  return (
    element.onclick || 
    element.classList.contains('clickable') || 
    ['button', 'a'].includes(tag) || 
    (tag === 'input' && ['button', 'submit'].includes(type)) || 
    element.hasAttribute('role') && ['button', 'link'].includes(element.getAttribute('role'))
  );
}

document.addEventListener('click', (e) => {
  const target = e.target.closest('a, button, input, [role="button"], [role="link"]');
  if (target && isClickable(target)) {
    clickSound.currentTime = 0;
    clickSound.play();

    if (target.tagName.toLowerCase() === 'a' && target.href) {
      e.preventDefault(); // Stop immediate navigation
      const href = target.href;
      setTimeout(() => {
        window.location.href = href;
      }, 150); // Adjust delay if needed
    }
  }
});