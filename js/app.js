/* ==========================================================================
   app.js — rendering + behaviour. Content lives in data.js.
   ========================================================================== */
(function () {
  "use strict";

  const $  = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  /* ---------------------------------------------------------- icon set -- */
  const ICON = {
    home:   '<svg viewBox="0 0 24 24"><path d="M12 3l9 8h-3v10h-5v-6H11v6H6V11H3z"/></svg>',
    work:   '<svg viewBox="0 0 24 24"><path d="M10 4h4a2 2 0 012 2v1h4a2 2 0 012 2v9a2 2 0 01-2 2H4a2 2 0 01-2-2V9a2 2 0 012-2h4V6a2 2 0 012-2zm0 3h4V6h-4v1z"/></svg>',
    skills: '<svg viewBox="0 0 24 24"><path d="M12 2l2.6 6.5L21 9.8l-4.7 4.3 1.3 6.4L12 17.2 6.4 20.5l1.3-6.4L3 9.8l6.4-1.3z"/></svg>',
    code:   '<svg viewBox="0 0 24 24"><path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6zm5.2 0l4.6-4.6L14.6 7.4 16 6l6 6-6 6z"/></svg>',
    mail:   '<svg viewBox="0 0 24 24"><path d="M3 5h18a1 1 0 011 1v12a1 1 0 01-1 1H3a1 1 0 01-1-1V6a1 1 0 011-1zm9 8l8-5H4z"/></svg>',
    cert:   '<svg viewBox="0 0 24 24"><path d="M12 2a6 6 0 016 6 6 6 0 01-3 5.2V22l-3-2-3 2v-8.8A6 6 0 016 8a6 6 0 016-6z"/></svg>',
    star:   '<svg viewBox="0 0 24 24"><path d="M12 2l2.6 6.5L21 9.8l-4.7 4.3 1.3 6.4L12 17.2 6.4 20.5l1.3-6.4L3 9.8l6.4-1.3z"/></svg>',
    quote:  '<svg viewBox="0 0 24 24"><path d="M7 7h5v5H9.5c0 2 .9 3 2.5 3v3c-3.5 0-5-2.4-5-6zm10 0h5v5h-2.5c0 2 .9 3 2.5 3v3c-3.5 0-5-2.4-5-6z"/></svg>',
    cap:    '<svg viewBox="0 0 24 24"><path d="M12 3l11 6-11 6L1 9zm-6 9.7l6 3.3 6-3.3V17c0 1.7-2.7 3-6 3s-6-1.3-6-3z"/></svg>',
    user:   '<svg viewBox="0 0 24 24"><path d="M12 12a5 5 0 100-10 5 5 0 000 10zm0 2c-5 0-9 2.7-9 6v2h18v-2c0-3.3-4-6-9-6z"/></svg>',
    eye:    '<svg viewBox="0 0 24 24"><path d="M12 5C6.5 5 2.3 8.6 1 12c1.3 3.4 5.5 7 11 7s9.7-3.6 11-7c-1.3-3.4-5.5-7-11-7zm0 11a4 4 0 110-8 4 4 0 010 8z"/></svg>',
    sound:  '<svg viewBox="0 0 24 24"><path d="M4 9h4l5-4v14l-5-4H4zm12.5 3a4 4 0 00-2-3.5v7A4 4 0 0016.5 12z"/></svg>',
    muted:  '<svg viewBox="0 0 24 24"><path d="M4 9h4l5-4v14l-5-4H4zm14.6 3l2.2-2.2-1.4-1.4L17.2 10.6 15 8.4 13.6 9.8l2.2 2.2-2.2 2.2 1.4 1.4 2.2-2.2 2.2 2.2 1.4-1.4z"/></svg>'
  };

  const AV_ICON = { recruiter: ICON.user, developer: ICON.code, stalker: ICON.eye };

  /* ============================================================= INTRO == */
  function playIntro() {
    const host = $("#introName");
    [...DATA.brand].forEach((ch, i) => {
      const s = document.createElement("span");
      s.textContent = ch;
      s.style.animationDelay = (i * 0.075) + "s";
      host.appendChild(s);
    });

    const dwell = 300 + DATA.brand.length * 75 + 1350;
    setTimeout(() => {
      $("#intro").classList.add("done");
      setTimeout(() => { $("#intro").hidden = true; }, 900);
      openGate();
    }, dwell);
  }

  /* ============================================================== GATE == */
  function openGate() {
    $("#gateLogo").textContent = DATA.brand;
    $("#appLogo").textContent  = DATA.brand;

    const list = $("#gateList");
    list.innerHTML = DATA.profiles.map((p) => `
      <li>
        <button data-profile="${p.id}">
          <span class="av ${p.avatarClass}">${AV_ICON[p.id] || ICON.user}</span>
          <span class="nm">${esc(p.name)}</span>
        </button>
      </li>`).join("");

    list.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-profile]");
      if (btn) enterApp(btn.dataset.profile);
    });

    $("#gate").hidden = false;
  }

  function backToGate() {
    stopVideo();
    clearTimeout(gateTimer);          // cancel a pending "hide gate" from enterApp
    $("#app").hidden = true;
    const g = $("#gate");
    g.hidden = false;
    g.classList.remove("leaving");
    window.scrollTo(0, 0);
  }

  /* =============================================================== APP == */
  let profile = null, gateTimer = null;

  function enterApp(id) {
    profile = DATA.profiles.find((p) => p.id === id) || DATA.profiles[0];

    const gate = $("#gate");
    gate.classList.add("leaving");
    clearTimeout(gateTimer);
    gateTimer = setTimeout(() => { gate.hidden = true; }, 450);

    renderHero();
    renderRows();
    renderHire();
    $("#app").hidden = false;
    window.scrollTo(0, 0);
    mountVideo();
  }

  function renderHero() {
    $("#heroTitle").textContent   = profile.title;
    $("#heroTagline").textContent = profile.tagline;
    $("#heroDesc").textContent    = profile.description;

    $("#heroMeta").innerHTML = profile.meta
      .map((m, i) => {
        const cls = /%\s*match/i.test(m) ? ' class="match"' : "";
        return (i ? "<i></i>" : "") + `<span${cls}>${esc(m)}</span>`;
      }).join("");

    $("#currentAvatar").className = "av " + profile.avatarClass;
    $("#currentAvatar").innerHTML = AV_ICON[profile.id] || ICON.user;

    $("#btnResume").href = DATA.resumeUrl;
    $("#tbResume").href  = DATA.resumeUrl;

    $("#heroPoster").style.backgroundImage =
      `url(https://i.ytimg.com/vi/${profile.video.id}/maxresdefault.jpg)`;

    $$(".ic").forEach((el) => { el.innerHTML = ICON[el.dataset.i] || ""; });
    $("#btnSound").innerHTML = ICON.muted;
  }

  /* ---------------------------------------------------------- the rows -- */
  function rowsFor() {
    const P = profile.id;

    const top = {
      anchor: "professional",
      title: profile.rowTitle,
      cards: [
        { key: "experience",      label: "Experience",      sub: "2 roles · ML + Data Science", art: "g1", icon: ICON.work,  rank: 1, badge: "NEW" },
        { key: "projects",        label: "Projects",        sub: "Built from scratch",         art: "g2", icon: ICON.code,  rank: 2 },
        { key: "skills",          label: "Skills",          sub: "5 categories",               art: "g3", icon: ICON.skills,rank: 3 },
        { key: "certificates",    label: "Certificates",    sub: DATA.certificates.length + " certifications", art: "g4", icon: ICON.cert, rank: 4 },
        { key: "recommendations", label: "Recommendations", sub: "Strengths & references",     art: "g5", icon: ICON.quote, rank: 5 }
      ]
    };

    const projectRow = {
      anchor: "projects",
      title: P === "stalker" ? "Things He Built Instead of Sleeping" : "Projects",
      cards: DATA.projects.map((p, i) => ({
        key: "project:" + i,
        label: p.name.split("—")[0].trim(),
        sub: p.stack.join(" · "),
        art: "g" + ((i % 6) + 2),
        icon: ICON.code
      }))
    };

    const skillRow = {
      anchor: "skills",
      title: P === "recruiter" ? "Because You Viewed: Machine Learning Engineers"
           : P === "developer" ? "More Like This: The Stack"
           : "Trending in Lodz",
      cards: DATA.skills.map((g, i) => ({
        key: "skillgroup:" + i,
        label: g.group,
        sub: g.items.slice(0, 3).join(", "),
        art: "g" + ((i % 6) + 1),
        icon: ICON.skills
      }))
    };

    const second = {
      title: P === "stalker" ? "Off the Clock" : "Continue Watching",
      cards: [
        { key: "education",  label: "Education",  sub: DATA.education.school,       art: "g2", icon: ICON.cap },
        { key: "thesis",     label: "Thesis",     sub: "Time-series defect detection", art: "g1", icon: ICON.skills },
        { key: "interests",  label: "Interests",  sub: DATA.interests.join(" · "),  art: "g6", icon: ICON.star },
        { key: "volunteering", label: "Volunteering", sub: "No Hate Foundation",    art: "g3", icon: ICON.user }
      ]
    };

    return [top, projectRow, skillRow, second];
  }

  function renderRows() {
    $("#rows").innerHTML = rowsFor().map((row) => `
      <section class="row"${row.anchor ? ` id="${row.anchor}"` : ""}>
        <h2 class="row-title">${esc(row.title)}</h2>
        <div class="row-scroller">
          <button class="arrow left"  aria-label="Scroll left">&#10094;</button>
          <div class="row-track">
            ${row.cards.map((c) => `
              <button class="card" data-open="${esc(c.key)}">
                <span class="card-art ${c.art}">${c.icon}</span>
                ${c.rank ? `<span class="card-rank">${c.rank}</span>` : ""}
                ${c.badge ? `<span class="card-new">${esc(c.badge)}</span>` : ""}
                <span class="card-label">
                  <h3>${esc(c.label)}</h3>
                  <p>${esc(c.sub)}</p>
                </span>
              </button>`).join("")}
          </div>
          <button class="arrow right" aria-label="Scroll right">&#10095;</button>
        </div>
      </section>`).join("");

    $$(".row-scroller").forEach((sc) => {
      const track = $(".row-track", sc);
      $(".arrow.left", sc).addEventListener("click", () => track.scrollBy({ left: -track.clientWidth * 0.8 }));
      $(".arrow.right", sc).addEventListener("click", () => track.scrollBy({ left:  track.clientWidth * 0.8 }));
    });

  }

  /* ---------------------------------------------------------- hire me --- */
  function renderHire() {
    $("#hireName").textContent = DATA.fullName;
    $("#hireLine").textContent =
      "Open to machine learning and data science roles. Graduating October 2026, " +
      "currently interning in Barcelona. The fastest way to reach me is email.";

    $("#hireActions").innerHTML = `
      <a class="ha-primary" href="mailto:${esc(DATA.email)}">Email Me</a>
      <a class="ha-ghost" href="${esc(DATA.links.linkedin)}" target="_blank" rel="noopener">LinkedIn</a>
      <a class="ha-ghost" href="${esc(DATA.links.github)}" target="_blank" rel="noopener">GitHub</a>
      <a class="ha-ghost" href="${esc(DATA.links.leetcode)}" target="_blank" rel="noopener">LeetCode</a>
      <a class="ha-ghost" href="${esc(DATA.resumeUrl)}" target="_blank" rel="noopener">Download CV</a>`;

    $("#hireFacts").innerHTML = `
      <dl class="fact"><dt>Based in</dt><dd>${esc(DATA.location)}</dd></dl>
      <dl class="fact"><dt>Email</dt><dd><a href="mailto:${esc(DATA.email)}">${esc(DATA.email)}</a></dd></dl>
      <dl class="fact"><dt>Phone</dt><dd>${esc(DATA.phone)}</dd></dl>
      <dl class="fact"><dt>Status</dt><dd><span class="live">CURRENTLY INTERNING</span></dd></dl>`;

    $("#footText").textContent = `${DATA.fullName} · ${DATA.location} · ${DATA.email}`;
  }

  /* ============================================================ MODAL === */
  const VIEWS = {
    experience: () => ({
      title: "Experience",
      sub: "2 roles · Machine Learning & Statistical Data Science",
      body: DATA.experience.map((j) => `
        <div class="job">
          <div class="job-head">
            <h4>${esc(j.role)}</h4><span class="co">${esc(j.company)}</span>
            ${j.current ? '<span class="live">NOW PLAYING</span>' : ""}
          </div>
          <p class="job-sub">${esc(j.period)} · ${esc(j.location)}</p>
          <ul>${j.points.map((p) => `<li>${esc(p)}</li>`).join("")}</ul>
          <div>${j.stack.map((s) => `<span class="pill">${esc(s)}</span>`).join("")}</div>
        </div>`).join("")
    }),

    projects: () => ({
      title: "Projects",
      sub: "Neural networks implemented from first principles",
      body: DATA.projects.map((p) => `
        <div class="proj">
          <h4>${esc(p.name)}</h4>
          <p>${esc(p.blurb)}</p>
          <div>${p.stack.map((s) => `<span class="pill">${esc(s)}</span>`).join("")}</div>
          <p style="margin-top:12px"><a href="${esc(p.url)}" target="_blank" rel="noopener">View on GitHub →</a></p>
        </div>`).join("")
    }),

    skills: () => ({
      title: "Skills",
      sub: "5 categories",
      body: DATA.skills.map((g) => `
        <div class="skillgrp">
          <h4>${esc(g.group)}</h4>
          <div>${g.items.map((i) => `<span class="pill">${esc(i)}</span>`).join("")}</div>
        </div>`).join("")
    }),

    certificates: () => ({
      title: "Certificates",
      sub: DATA.certificates.length + " certifications",
      body: DATA.certificates.map((c) => `
        <div class="certrow"><strong>${esc(c.name)}</strong><span>${esc(c.issuer)}</span></div>`).join("")
    }),

    recommendations: () => ({
      title: "Recommendations",
      sub: "What people say",
      body: (DATA.recommendations.length
        ? DATA.recommendations.map((r) => `
            <div class="quote">
              <p>“${esc(r.quote)}”</p>
              <footer>— ${esc(r.author)}, ${esc(r.role)}</footer>
            </div>`).join("")
        : `<p class="empty">No written recommendations added yet — add them in
             <code>js/data.js</code> under <code>recommendations</code>.
             In the meantime, here's what colleagues consistently point to:</p>
           <div style="margin-top:18px">
             ${DATA.strengths.map((s) => `<span class="pill on">${esc(s)}</span>`).join("")}
           </div>`)
    }),

    education: () => ({
      title: "Education",
      sub: DATA.education.school,
      body: `
        <div class="job">
          <div class="job-head"><h4>${esc(DATA.education.degree)}</h4>
            <span class="co">${esc(DATA.education.school)}</span></div>
          <p class="job-sub">${esc(DATA.education.period)} · ${esc(DATA.education.location)}</p>
          <p style="color:#d4d4d4;line-height:1.6;margin-bottom:14px">
            <strong>Thesis:</strong> ${esc(DATA.education.thesis)}</p>
          <h4 style="font-size:.78rem;letter-spacing:.14em;text-transform:uppercase;color:#808080;margin-bottom:9px">
            Relevant coursework</h4>
          <div>${DATA.education.coursework.map((c) => `<span class="pill">${esc(c)}</span>`).join("")}</div>
        </div>`
    }),

    thesis: () => ({
      title: "Thesis",
      sub: DATA.education.school + " · " + DATA.education.period,
      body: `<p style="color:#d8d8d8;line-height:1.7;font-size:1.02rem">${esc(DATA.education.thesis)}</p>
             <div style="margin-top:18px">
               ${["Deep Learning", "Time-Series", "Anomaly Detection", "Manufacturing"]
                 .map((t) => `<span class="pill on">${esc(t)}</span>`).join("")}
             </div>`
    }),

    interests: () => ({
      title: "Interests",
      sub: "Outside the terminal",
      body: `<div>${DATA.interests.map((i) => `<span class="pill on">${esc(i)}</span>`).join("")}</div>
             <p class="empty" style="margin-top:18px">
               Two hobbies, one theme: pattern recognition under time pressure.</p>`
    }),

    volunteering: () => ({
      title: "Volunteering",
      sub: "No Hate Foundation",
      body: `<ul style="margin-left:18px;color:#dcdcdc;line-height:1.8">
               ${DATA.volunteering.map((v) => `<li>${esc(v)}</li>`).join("")}
             </ul>`
    }),

    profileinfo: () => ({
      title: profile.title,
      sub: profile.tagline,
      body: `<p style="color:#d8d8d8;line-height:1.7;font-size:1.02rem">${esc(profile.description)}</p>
             <div style="margin-top:20px">
               ${profile.badges.map((b) => `<span class="pill on">${esc(b)}</span>`).join("")}
             </div>`
    })
  };

  function openModal(key) {
    let view;
    if (key.startsWith("skillgroup:")) {
      const g = DATA.skills[+key.split(":")[1]];
      view = { title: g.group, sub: g.items.length + " skills",
               body: `<div>${g.items.map((i) => `<span class="pill on">${esc(i)}</span>`).join("")}</div>` };
    } else if (key.startsWith("project:")) {
      const p = DATA.projects[+key.split(":")[1]];
      view = {
        title: p.name.split("—")[0].trim(),
        sub: p.stack.join(" · "),
        body: `<p style="color:#d8d8d8;line-height:1.7;font-size:1.02rem">${esc(p.blurb)}</p>
               <div style="margin-top:18px">${p.stack.map((s) => `<span class="pill on">${esc(s)}</span>`).join("")}</div>
               <p style="margin-top:20px"><a class="proj-link" href="${esc(p.url)}" target="_blank" rel="noopener"
                  style="color:#e50914;font-weight:600">View on GitHub →</a></p>`
      };
    } else {
      view = (VIEWS[key] || VIEWS.profileinfo)();
    }

    $("#modalTitle").textContent = view.title;
    $("#modalSub").textContent   = view.sub;
    $("#modalBody").innerHTML    = view.body;
    $("#modal").hidden = false;
    document.body.classList.add("locked");
  }

  function closeModal() {
    $("#modal").hidden = true;
    document.body.classList.remove("locked");
  }

  /* ============================================================ VIDEO === */
  /* Priority: local assets/video/<profile>.mp4  →  YouTube embed  →  poster */

  let ytPlayer = null, ytTimer = null, localVideo = null, muted = true;

  function mountVideo() {
    stopVideo();
    const src = `assets/video/${profile.id}.mp4`;
    fetch(src, { method: "HEAD" })
      .then((r) => {
        const ok = r.ok && !/text\/html/i.test(r.headers.get("content-type") || "");
        ok ? useLocal(src) : useYouTube();
      })
      .catch(useYouTube);
  }

  function useLocal(src) {
    const v = document.createElement("video");
    v.src = src; v.muted = true; v.loop = true; v.autoplay = true;
    v.playsInline = true; v.setAttribute("playsinline", "");
    v.addEventListener("error", useYouTube, { once: true });
    $("#heroVideo").innerHTML = "";
    $("#heroVideo").appendChild(v);
    localVideo = v;
    v.play().catch(() => showPoster());
  }

  function useYouTube() {
    if (!window.YT || !window.YT.Player) {
      window.onYouTubeIframeAPIReady = useYouTube;
      setTimeout(() => { if (!ytPlayer && !localVideo) showPoster(); }, 4000);
      return;
    }
    const { id, start, end } = profile.video;
    const mount = document.createElement("div");
    $("#heroVideo").innerHTML = "";
    $("#heroVideo").appendChild(mount);

    ytPlayer = new YT.Player(mount, {
      videoId: id,
      playerVars: {
        autoplay: 1, mute: 1, controls: 0, start, end,
        modestbranding: 1, rel: 0, playsinline: 1,
        disablekb: 1, fs: 0, iv_load_policy: 3
      },
      events: {
        onReady: (e) => { e.target.mute(); e.target.playVideo(); hidePoster(); },
        onError: showPoster,
        onStateChange: (e) => {
          if (e.data === YT.PlayerState.PLAYING) {
            hidePoster();
            clearInterval(ytTimer);
            // loop only the requested clip window
            ytTimer = setInterval(() => {
              if (!ytPlayer || !ytPlayer.getCurrentTime) return;
              if (ytPlayer.getCurrentTime() >= end - 0.35) ytPlayer.seekTo(start, true);
            }, 250);
          }
          if (e.data === YT.PlayerState.ENDED) ytPlayer.seekTo(start, true);
        }
      }
    });
  }

  function showPoster() { $("#heroPoster").classList.add("show"); }
  function hidePoster() { $("#heroPoster").classList.remove("show"); }

  function stopVideo() {
    clearInterval(ytTimer); ytTimer = null;
    if (ytPlayer && ytPlayer.destroy) { try { ytPlayer.destroy(); } catch (e) {} }
    ytPlayer = null; localVideo = null;
    $("#heroVideo").innerHTML = "";
    hidePoster();
  }

  function toggleSound() {
    muted = !muted;
    if (localVideo) localVideo.muted = muted;
    if (ytPlayer) muted ? ytPlayer.mute() : ytPlayer.unMute();
    $("#btnSound").innerHTML = muted ? ICON.muted : ICON.sound;
  }

  function replay() {
    if (localVideo) { localVideo.currentTime = 0; localVideo.play(); }
    else if (ytPlayer && ytPlayer.seekTo) { ytPlayer.seekTo(profile.video.start, true); ytPlayer.playVideo(); }
  }

  /* ============================================================= GLUE === */
  function wire() {
    // delegated once — rows re-render on every profile switch
    $("#rows").addEventListener("click", (e) => {
      const c = e.target.closest("[data-open]");
      if (c) openModal(c.dataset.open);
    });

    $("#btnMore").addEventListener("click", () => openModal("profileinfo"));
    $("#btnSound").addEventListener("click", toggleSound);
    $("#btnReplay").addEventListener("click", replay);
    $("#switchProfile").addEventListener("click", backToGate);

    $("#modal").addEventListener("click", (e) => { if (e.target.closest("[data-close]")) closeModal(); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeModal(); });

    // topbar goes solid on scroll
    addEventListener("scroll", () => {
      $("#topbar").classList.toggle("solid", scrollY > 80);
    }, { passive: true });

    // sidebar: Hire Me and Home are plain anchors; the rest may not exist
    // until rows render, so resolve lazily.
    $("#sidebar").addEventListener("click", (e) => {
      const a = e.target.closest("[data-nav]");
      if (!a) return;
      const target = document.getElementById(a.dataset.nav);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      $$("#sidebar a").forEach((x) => x.classList.toggle("active", x === a));
    });

    // scroll-spy
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        $$("#sidebar a").forEach((a) =>
          a.classList.toggle("active", a.dataset.nav === en.target.id));
      });
    }, { rootMargin: "-45% 0px -50% 0px" });

    new MutationObserver(() => {
      ["home", "professional", "skills", "projects", "hire"].forEach((id) => {
        const el = document.getElementById(id);
        if (el && !el.dataset.spied) { el.dataset.spied = "1"; spy.observe(el); }
      });
    }).observe(document.body, { childList: true, subtree: true });
  }

  /* -------------------------------------------------------------- boot -- */
  document.addEventListener("DOMContentLoaded", () => {
    wire();
    // Skip the intro on repeat visits within the same tab session.
    if (sessionStorage.getItem("introSeen")) {
      $("#intro").hidden = true;
      openGate();
    } else {
      sessionStorage.setItem("introSeen", "1");
      playIntro();
    }
  });
})();
