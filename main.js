/* ============================================
   MAIN JS
============================================ */
document.addEventListener("DOMContentLoaded", () => {

  /* ============================================
     NAVIGATOR SUB BOLD
  ============================================ */
  const subNavLinks = document.querySelectorAll('.sub-nav a');
  if (subNavLinks.length) {
    subNavLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        subNavLinks.forEach(l => l.classList.remove('active'));
        e.currentTarget.classList.add('active');
      });
    });
  }

  /* ============================================
     NAV LOGO MOBILE
  ============================================ */
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.mobile-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => nav.classList.toggle('open'));

    nav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => nav.classList.remove('open'));
    });
  }

   /* ============================================
      LANDING / LOTTIE SCROLL
   ============================================ */
   const hero = document.getElementById("hero-animation");
   const scrollArea = document.querySelector(".hero");
   
   if (hero && scrollArea && typeof lottie !== "undefined") {
   
     // Use root-relative path so it works on any page
     const animation = lottie.loadAnimation({
       container: hero,
       renderer: "svg",
       loop: false,
       autoplay: false,
       path: "hero-animation.json"  // ← root-relative
     });
   
     animation.addEventListener("DOMLoaded", () => {
       animation.goToAndStop(0, true);
   
       window.addEventListener("scroll", () => {
         const rect = scrollArea.getBoundingClientRect();
         if (rect.bottom < 0 || rect.top > window.innerHeight) return;
         if (rect.top >= 0) {
           animation.goToAndStop(0, true);
           return;
         }
         const scrollProgress = -rect.top / rect.height;
         const progress = Math.min(Math.max(scrollProgress, 0), 1);
         animation.goToAndStop(progress * animation.totalFrames, true);
       });
     });
   }


  /* ============================================
     ACCESS CONTROL
  ============================================ */
  const mainContent = document.getElementById("main-content");
  const accessDenied = document.getElementById("access-denied");
  if (mainContent && accessDenied) {
    const validTokens = { "TSx26": true, "Portfolio": true };
    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get("access");

    if (accessToken && validTokens[accessToken]) {
      sessionStorage.setItem("hasAccess", "true");
    }

    const hasAccess = sessionStorage.getItem("hasAccess") === "true";
    if (!hasAccess) {
      mainContent.style.display = "none";
      accessDenied.style.display = "block";
    } else {
      mainContent.style.display = "block";
      accessDenied.style.display = "none";
    }
  }

  /* ============================================
     DARK MODE
  ============================================ */
  const themeToggle = document.getElementById("theme-toggle");
  const root = document.documentElement;
  if (themeToggle) {
    const savedTheme = localStorage.getItem("theme");
    const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

    if (savedTheme) {
      root.dataset.theme = savedTheme;
      themeToggle.checked = savedTheme === "dark";
    } else if (systemDark) {
      root.dataset.theme = "dark";
      themeToggle.checked = true;
    }

    themeToggle.addEventListener("change", () => {
      const theme = themeToggle.checked ? "dark" : "light";
      root.dataset.theme = theme;
      localStorage.setItem("theme", theme);
    });
  }

  /* ============================================
     LANGUAGE SYSTEM
  ============================================ */
  const langButtons = document.querySelectorAll("[data-lang-btn]");
  const langElements = document.querySelectorAll("[data-lang]");
  if (langButtons.length && langElements.length) {
    function setLanguage(lang) {
      langElements.forEach(el => {
        el.style.display = el.dataset.lang === lang ? "inline" : "none";
      });
      langButtons.forEach(btn => {
        btn.classList.toggle("active", btn.dataset.langBtn === lang);
      });
      localStorage.setItem("language", lang);
    }

    const savedLang = localStorage.getItem("language") || "de";
    setLanguage(savedLang);

    langButtons.forEach(btn => {
      btn.addEventListener("click", () => setLanguage(btn.dataset.langBtn));
    });
  }

  /* ============================================
     HOVER IMAGE ROTATION
  ============================================ */
  document.querySelectorAll('.portfolio-item.hover-rotate').forEach(item => {
    const images = item.querySelectorAll('img');
    if (images.length <= 1) return;

    let index = 0, interval = null;
    const showImage = i => images.forEach((img, idx) => img.style.opacity = idx === i ? '1' : '0');
    showImage(0);

    const startRotation = () => {
      if (interval) return;
      interval = setInterval(() => {
        index = (index + 1) % images.length;
        showImage(index);
      }, 1000);
    };

    const stopRotation = () => {
      clearInterval(interval);
      interval = null;
      index = 0;
      showImage(0);
    };

    item.addEventListener('mouseenter', startRotation);
    item.addEventListener('mouseleave', stopRotation);
  });

  /* ============================================
     HOVER IMAGE SWAP
  ============================================ */
  document.querySelectorAll('.portfolio-item.hover-swap').forEach(item => {
    const images = item.querySelectorAll('img');
    if (images.length < 2) return;

    item.addEventListener('mouseenter', () => {
      images[0].style.opacity = '0';
      images[1].style.opacity = '1';
    });
    item.addEventListener('mouseleave', () => {
      images[0].style.opacity = '1';
      images[1].style.opacity = '0';
    });
  });

  /* ============================================
     LINE FADE
  ============================================ */
  const lines = document.querySelectorAll('.line');
  if (lines.length) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        entry.target.style.animation = entry.isIntersecting ? 'draw 2s forwards' : 'none';
      });
    });
    lines.forEach(line => observer.observe(line));
  }

  /* ============================================
     MOTION VIDEO HOVER
  ============================================ */
  document.querySelectorAll('.hover-video').forEach(video => {
    const parent = video.parentElement;
    if (!parent) return;
    parent.addEventListener('mouseenter', () => video.play());
    parent.addEventListener('mouseleave', () => { video.pause(); video.currentTime = 0; });
  });

  /* ============================================
     CENTERING OF CAT LOGO
  ============================================ */
  const catPath = document.getElementById('cat-path');
  if (catPath) {
    const g = catPath.parentNode;
    const bbox = catPath.getBBox();
    const centerX = 191;
    const centerY = 195;
    const offsetX = centerX - (bbox.x + bbox.width / 2);
    const offsetY = centerY - (bbox.y + bbox.height / 2);
    g.setAttribute("transform", `translate(${offsetX}, ${offsetY}) scale(1.1)`);
  }

});
