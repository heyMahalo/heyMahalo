(function () {
  'use strict';

  var root = document.documentElement;
  var navItems = Array.prototype.slice.call(document.querySelectorAll('.nav-link'));
  var mobileItems = Array.prototype.slice.call(document.querySelectorAll('.mobile-menu button'));
  var sectionIds = {
    'about me': 'about-me',
    education: 'education',
    experience: 'internships',
    projects: 'projects',
    skills: 'skills',
    honors: 'honors'
  };
  var sections = navItems
    .map(function (item) { return document.getElementById(sectionIds[item.textContent.trim().toLowerCase()]); })
    .filter(Boolean);
  var themeButton = document.querySelector('.theme-toggle');
  var menuButton = document.querySelector('.mobile-toggle');
  var menu = document.querySelector('.mobile-menu');
  var topButton = document.querySelector('.back-to-top');
  var progressBar = document.querySelector('.progress-bar');

  var sunIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2"></path><path d="M12 20v2"></path><path d="m4.93 4.93 1.41 1.41"></path><path d="m17.66 17.66 1.41 1.41"></path><path d="M2 12h2"></path><path d="M20 12h2"></path><path d="m6.34 17.66-1.41 1.41"></path><path d="m19.07 4.93-1.41 1.41"></path></svg>';
  var moonIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path></svg>';
  var menuIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 5h16"></path><path d="M4 12h16"></path><path d="M4 19h16"></path></svg>';
  var closeIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>';

  function setTheme(theme) {
    root.dataset.theme = theme;
    if (themeButton) {
      var nextLabel = theme === 'dark' ? '切换到浅色模式' : '切换到深色模式';
      themeButton.setAttribute('aria-label', nextLabel);
      themeButton.setAttribute('title', nextLabel);
      themeButton.innerHTML = theme === 'dark' ? moonIcon : sunIcon;
    }
    try { localStorage.setItem('resume-theme', theme); } catch (_) {}
  }

  var initialTheme = 'light';
  try {
    var savedTheme = localStorage.getItem('resume-theme');
    if (savedTheme === 'dark' || savedTheme === 'light') initialTheme = savedTheme;
    else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) initialTheme = 'dark';
  } catch (_) {}
  setTheme(initialTheme);

  function goTo(id) {
    var target = document.getElementById(id);
    if (target) {
      var top = target.getBoundingClientRect().top + (window.scrollY || document.documentElement.scrollTop) - 74;
      window.scrollTo({ top: top, behavior: 'smooth' });
    }
    if (menu) menu.classList.remove('open');
    if (menuButton) {
      menuButton.classList.remove('open');
      menuButton.setAttribute('aria-expanded', 'false');
      menuButton.innerHTML = menuIcon;
    }
  }

  navItems.forEach(function (item, index) {
    item.addEventListener('click', function () { goTo(sections[index].id); });
  });
  mobileItems.forEach(function (item, index) {
    item.addEventListener('click', function () { goTo(sections[index].id); });
  });
  var brand = document.querySelector('.nav-brand');
  if (brand) brand.addEventListener('click', function () { goTo('about-me'); });
  if (themeButton) themeButton.addEventListener('click', function () {
    setTheme(root.dataset.theme === 'dark' ? 'light' : 'dark');
  });
  if (menuButton) menuButton.addEventListener('click', function () {
    var open = menuButton.classList.toggle('open');
    if (menu) menu.classList.toggle('open', open);
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? '关闭菜单' : '打开菜单');
    menuButton.innerHTML = open ? closeIcon : menuIcon;
  });

  function updateScrollState() {
    var scrollTop = window.scrollY || document.documentElement.scrollTop;
    var scrollable = document.documentElement.scrollHeight - window.innerHeight;
    if (progressBar) progressBar.style.width = (scrollable > 0 ? Math.min(100, (scrollTop / scrollable) * 100) : 0) + '%';
    if (topButton) topButton.classList.toggle('show', scrollTop > 520);
  }
  window.addEventListener('scroll', updateScrollState, { passive: true });
  updateScrollState();
  if (topButton) topButton.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });

  if ('IntersectionObserver' in window) {
    function updateActiveSection() {
      var marker = 128;
      var current = sections[0] ? sections[0].id : 'about-me';
      sections.forEach(function (section) {
        if (section.getBoundingClientRect().top <= marker) current = section.id;
      });
      navItems.forEach(function (item) {
        item.classList.toggle('active', sectionIds[item.textContent.trim().toLowerCase()] === current);
      });
    }
    updateActiveSection();
    window.addEventListener('scroll', updateActiveSection, { passive: true });
    window.addEventListener('resize', updateActiveSection);
    var revealObserver = new IntersectionObserver(function (entries, observer) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
      });
    }, { threshold: 0.08 });
    document.querySelectorAll('.reveal').forEach(function (item) { revealObserver.observe(item); });
  } else {
    document.querySelectorAll('.reveal').forEach(function (item) { item.classList.add('visible'); });
  }
})();
