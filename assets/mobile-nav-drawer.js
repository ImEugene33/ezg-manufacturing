(function () {
  if (window.customElements.get('mobile-nav-drawer')) return;

  class MobileNavDrawer extends HTMLElement {
    connectedCallback() {
      this.panel = this.querySelector('.mobile-nav-drawer__panel');
      this.triggerElement = null;

      this.addEventListener('click', (event) => {
        if (event.target.closest('[data-mnd-close]')) {
          event.preventDefault();
          this.closeDrawer();
          return;
        }

        const tabButton = event.target.closest('[data-mnd-tab]');
        if (tabButton) {
          this.switchTab(tabButton);
          return;
        }

        const openButton = event.target.closest('[data-mnd-open]');
        if (openButton) {
          this.openScreen(openButton);
          return;
        }

        const backButton = event.target.closest('[data-mnd-back]');
        if (backButton) {
          this.backToRoot(backButton);
        }
      });

      this.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') this.closeDrawer();
      });
    }

    switchTab(tabButton) {
      const tabs = this.querySelectorAll('[data-mnd-tab]');
      const panels = this.querySelectorAll('[data-mnd-panel]');
      const index = tabButton.dataset.mndTab;

      tabs.forEach((tab) => {
        const isActive = tab === tabButton;
        tab.classList.toggle('is-active', isActive);
        tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
      });
      panels.forEach((panel) => {
        const isActive = panel.dataset.mndPanel === index;
        panel.classList.toggle('is-active', isActive);
        panel.hidden = !isActive;
      });
    }

    openScreen(openButton) {
      const panel = openButton.closest('[data-mnd-panel]');
      if (!panel) return;
      const targetId = openButton.dataset.mndOpen;
      const target = panel.querySelector(`[data-mnd-screen="${targetId}"]`);
      if (!target) return;

      panel.querySelectorAll('.mobile-nav-drawer__screen.is-active').forEach((screen) => {
        screen.classList.remove('is-active');
        screen.hidden = true;
      });
      target.classList.add('is-active');
      target.hidden = false;
      target.scrollTop = 0;
    }

    backToRoot(backButton) {
      const panel = backButton.closest('[data-mnd-panel]');
      if (!panel) return;
      const rootId = `${panel.dataset.mndPanel}-root`;
      const root = panel.querySelector(`[data-mnd-screen="${rootId}"]`);
      if (!root) return;

      panel.querySelectorAll('.mobile-nav-drawer__screen.is-active').forEach((screen) => {
        screen.classList.remove('is-active');
        screen.hidden = true;
      });
      root.classList.add('is-active');
      root.hidden = false;
    }

    openDrawer(triggerElement) {
      this.triggerElement = triggerElement || null;
      this.hidden = false;
      this.setAttribute('aria-hidden', 'false');
      document.documentElement.classList.add('mobile-nav-drawer-open');
      if (this.triggerElement) this.triggerElement.setAttribute('aria-expanded', 'true');

      requestAnimationFrame(() => {
        this.classList.add('is-open');
      });

      const closeButton = this.querySelector('[data-mnd-close]');
      if (closeButton) closeButton.focus({ preventScroll: true });
    }

    closeDrawer() {
      this.classList.remove('is-open');
      this.setAttribute('aria-hidden', 'true');
      document.documentElement.classList.remove('mobile-nav-drawer-open');
      if (this.triggerElement) this.triggerElement.setAttribute('aria-expanded', 'false');

      const onTransitionEnd = () => {
        this.hidden = true;
      };
      if (this.panel) {
        this.panel.addEventListener('transitionend', onTransitionEnd, { once: true });
      } else {
        this.hidden = true;
      }

      if (this.triggerElement) {
        this.triggerElement.focus({ preventScroll: true });
        this.triggerElement = null;
      }
    }
  }

  window.customElements.define('mobile-nav-drawer', MobileNavDrawer);

  document.querySelectorAll('.js-mobile-nav-drawer-trigger').forEach((trigger) => {
    trigger.addEventListener('click', () => {
      const drawer = document.getElementById(trigger.getAttribute('aria-controls'));
      if (drawer) drawer.openDrawer(trigger);
    });
  });
})();
