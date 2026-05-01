const THEME = {
  isLgScreen: () => window.innerWidth > 992,
  getTabPane: (el) => {
    return el.closest('.tab-pane');
  },
  getTabPaneTab: (el) => {
    const tabId = THEME.getTabPane(el).getAttribute('aria-labelledby');
    return document.getElementById(tabId).parentElement;
  },
  selectors: {
    invalid: ':invalid, .is-invalid',
  },
  classNames: {
    invalid: 'is-invalid',
    rightAlign: 'd-flex justify-content-end',
  },
};

export default THEME;
