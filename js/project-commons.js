// href click animation inside the document
document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', () => {
        const target = document.querySelector(link.getAttribute('href'));
        if (!target) return;

        target.classList.remove('highlighted');
        void target.offsetWidth;
        target.classList.add('highlighted');

        target.addEventListener('mouseleave', () => {
            target.classList.remove('highlighted');
        }, { once: true });
    });
});


// 'Back to top' button

const btn = document.querySelector('.floating-btn');
const article = document.querySelector('article');

function updateBtn() {
    const articleBottom = article.getBoundingClientRect().bottom;
    const windowHeight = window.innerHeight;

    if (articleBottom <= windowHeight) {
        btn.style.position = 'absolute';
        btn.style.top = `${article.offsetHeight - btn.offsetHeight - 32}px`;
        btn.style.transform = 'none';
    } else {
        btn.style.position = 'fixed';
        btn.style.top = '95%';
        btn.style.transform = 'translateY(-50%)';
    }
}

window.addEventListener('scroll', updateBtn);
updateBtn();

// Zoom

document.addEventListener('click', function(e) {
    const media = e.target.closest('[data-zoomable]');
    if (!media) return;

    // Prevent multiple zooms
    if (document.querySelector('.simple-zoom-overlay')) return;

    // Create overlay
    const overlay = document.createElement('div');
    overlay.className = 'fixed inset-0 bg-black/80 z-[9999] flex justify-center items-center ' +
        'cursor-zoom-out opacity-0 transition-opacity duration-250 ease-in-out';

    // Clone media
    const clone = media.cloneNode(true);
    const isTransparent = media.hasAttribute('data-transparent');
    clone.className = `max-w-[80%] max-h-[80%] shadow-2xl bg-zinc-900 ${isTransparent ? 'bg-zinc-900 p-6' : ''}`;
    clone.removeAttribute('data-zoomable');

    overlay.appendChild(clone);
    document.body.appendChild(overlay);

    // Disable scrolling
    document.body.style.overflow = 'hidden';

    // Fade in overlay
    requestAnimationFrame(() => {
        overlay.style.opacity = '1';
    });

    function closeZoom() {
        overlay.style.opacity = '0';
        document.body.style.overflow = '';
        setTimeout(() => overlay.remove(), 250);
        document.removeEventListener('keydown', onKey);
    }

    function onKey(e) {
        if (e.key === 'Escape') closeZoom();
    }

    overlay.addEventListener('click', closeZoom);
    document.addEventListener('keydown', onKey);
});
