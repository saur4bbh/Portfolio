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
  /* Bold, solid, single-color glyphs in the same visual language Netflix's
     own product uses (thick simple shapes, no fine detail, reads at 20px). */
  const ICON = {
    home:   '<svg viewBox="0 0 24 24"><path d="M12 2.6L2 11h3v10h5.2v-6.4h3.6V21H19V11h3z"/></svg>',
    work:   '<svg viewBox="0 0 24 24"><path d="M9 4.5h6a2 2 0 012 2V8h2.5a1.5 1.5 0 011.5 1.5v9a1.5 1.5 0 01-1.5 1.5h-15A1.5 1.5 0 013 18.5v-9A1.5 1.5 0 014.5 8H7V6.5a2 2 0 012-2zM9 8h6V6.5H9V8zm-1.5 5.2h9v-2h-9v2z"/></svg>',
    skills: '<svg viewBox="0 0 24 24"><path d="M4 20V10.5h3.4V20H4zm6.3 0V4h3.4v16h-3.4zM16.6 20v-8.6H20V20h-3.4z"/></svg>',
    code:   '<svg viewBox="0 0 24 24"><path d="M8.6 17.4L3.2 12l5.4-5.4L10.4 8l-3.6 4 3.6 4-1.8 1.4zm6.8 0L13.6 16l3.6-4-3.6-4 1.8-1.4L20.8 12l-5.4 5.4z"/></svg>',
    mail:   '<svg viewBox="0 0 24 24"><path d="M3 6a1.5 1.5 0 011.5-1.5h15A1.5 1.5 0 0121 6v12a1.5 1.5 0 01-1.5 1.5h-15A1.5 1.5 0 013 18V6zm2 .3V7.9l7 5 7-5V6.3l-7 5-7-5z"/></svg>',
    cert:   '<svg viewBox="0 0 24 24"><path d="M12 2.2a5.8 5.8 0 015.8 5.8 5.8 5.8 0 01-3 5.1V22l-2.8-1.9L9.2 22v-8.9a5.8 5.8 0 01-3-5.1A5.8 5.8 0 0112 2.2zm0 2.4a3.4 3.4 0 100 6.8 3.4 3.4 0 000-6.8z"/></svg>',
    star:   '<svg viewBox="0 0 24 24"><path d="M12 2.3l2.9 6.6 7.1.7-5.4 4.8 1.6 7-6.2-3.7-6.2 3.7 1.6-7-5.4-4.8 7.1-.7z"/></svg>',
    quote:  '<svg viewBox="0 0 24 24"><path d="M6.5 6.5h6v6.2c0 3.6-2 6-5.4 6.8l-.8-1.8c2-.6 3.1-1.8 3.3-3.4H6.5v-7.8zm9 0h6v6.2c0 3.6-2 6-5.4 6.8l-.8-1.8c2-.6 3.1-1.8 3.3-3.4h-3.1v-7.8z"/></svg>',
    cap:    '<svg viewBox="0 0 24 24"><path d="M12 3L1.5 8.4 12 13.8l8.5-4.4V13h1.7V8.4L12 3zM5.3 11.6v4.2c0 2 3 3.6 6.7 3.6s6.7-1.6 6.7-3.6v-4.2L12 15.9l-6.7-4.3z"/></svg>',
    user:   '<svg viewBox="0 0 24 24"><path d="M12 12.4a5.2 5.2 0 100-10.4 5.2 5.2 0 000 10.4zm0 2.2c-5.2 0-9.4 2.8-9.4 6.3V22h18.8v-1.1c0-3.5-4.2-6.3-9.4-6.3z"/></svg>',
    eye:    '<svg viewBox="0 0 24 24"><path d="M12 4.8C6.3 4.8 2 8.7 1 12c1 3.3 5.3 7.2 11 7.2S21 15.3 22 12c-1-3.3-5.3-7.2-10-7.2zm0 12a4.8 4.8 0 110-9.6 4.8 4.8 0 010 9.6zm0-2.2a2.6 2.6 0 100-5.2 2.6 2.6 0 000 5.2z"/></svg>',
    sound:  '<svg viewBox="0 0 24 24"><path d="M4 9.5h3.6L13 5.2v13.6l-5.4-4.3H4zM15.6 8.4a5 5 0 010 7.2l-1.3-1.3a3.2 3.2 0 000-4.6zm2.6-2.6a8.7 8.7 0 010 12.4l-1.3-1.3a6.9 6.9 0 000-9.8z"/></svg>',
    muted:  '<svg viewBox="0 0 24 24"><path d="M4 9.5h3.6L13 5.2v13.6l-5.4-4.3H4zm14.7-1.2l1.4 1.4-2.3 2.3 2.3 2.3-1.4 1.4-2.3-2.3-2.3 2.3-1.4-1.4 2.3-2.3-2.3-2.3 1.4-1.4 2.3 2.3z"/></svg>',
    swap:   '<svg viewBox="0 0 24 24"><path d="M7 4.2l4 4-4 4-1.4-1.4L7.2 9H2V7h5.2L5.6 5.6 7 4.2zM17 20l-4-4 4-4 1.4 1.4L16.8 15H22v2h-5.2l1.6 1.6L17 20z"/></svg>',
    chev:   '<svg viewBox="0 0 24 24"><path d="M9 6l6 6-6 6-1.4-1.4L12.2 12 7.6 7.4z"/></svg>'
  };

  const AV_ICON = { recruiter: ICON.user, developer: ICON.code, stalker: ICON.eye };

  /* ============================================================= INTRO == */
  /* Netflix wordmark arch. Measured off the real logo: the cap-line is
     essentially flat and the baseline curves UP toward the centre, with the
     middle letters only ~10% shorter than the outer ones. Quadratic curve,
     not linear. Both intro layers use this so they superimpose exactly. */
  function archTransform(i, mid) {
    const t = Math.abs(i - mid) / mid;              // 0 centre → 1 edges
    const scaleY = 0.90 + 0.10 * (t * t);           // 0.90 middle → 1.00 ends
    const skew = ((i - mid) / mid) * -1.2;          // cylinder-wrap lean
    return `scaleY(${scaleY.toFixed(3)}) skewX(${skew.toFixed(2)}deg)`;
  }

  /** Build one arched wordmark layer. Strand layer gets staggered fill
      animation; the solid layer is static and simply fades in later. */
  function buildWordmark(host, brand, stagger) {
    const mid = (brand.length - 1) / 2 || 1;
    host.innerHTML = "";
    [...brand].forEach((ch, i) => {
      const outer = document.createElement("span");
      outer.className = "ltr";
      outer.style.transform = archTransform(i, mid);

      const inner = document.createElement("span");
      inner.className = "ltr-in";
      inner.textContent = ch;
      // the light reaches each letter a beat apart, left to right
      if (stagger) inner.style.animationDelay = (i * 0.055).toFixed(3) + "s";

      outer.appendChild(inner);
      host.appendChild(outer);
    });
  }

  function playIntro() {
    const brand = DATA.brand;
    const n = brand.length;

    buildWordmark($("#introStrandText"), brand, true);   // light-strand layer
    buildWordmark($("#introName"), brand, false);        // solid layer

    // the last letter's strand sweep (1.05s) finishes here
    const sweepEndMs = (n - 1) * 55 + 1050;
    // the mark resolves from strands to solid, with the bloom on the same frame
    const resolveAtMs = sweepEndMs - 120;
    // hold on the finished wordmark, then fade through to the profile gate
    const dwellMs = resolveAtMs + 420 + 700;

    setTimeout(() => {
      $("#intro").classList.add("resolve");
      $("#introFlash").classList.add("play");
    }, resolveAtMs);

    setTimeout(() => {
      $("#intro").classList.add("done");
      setTimeout(() => { $("#intro").hidden = true; }, 900);
      openGate();
    }, dwellMs);
  }

  /* ============================================================== GATE == */
  function openGate() {
    // Netflix shows the full wordmark only on the splash; every other screen
    // gets the single-letter mark. Same idea: "SAURABH" intro → "S" everywhere.
    const initial = DATA.brand.charAt(0);
    $("#gateLogo").textContent = initial;
    $("#appLogo").textContent  = initial;

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
      if (!btn) return;
      enterApp(btn.dataset.profile);
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
    if (heroScrollApply) heroScrollApply();   // reset title scale/fade
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

    $("#sidebarAvatar").className = "av " + profile.avatarClass;
    $("#sidebarAvatar").innerHTML = AV_ICON[profile.id] || ICON.user;
    $("#sidebarProfileName").textContent = profile.name;

    $("#btnResume").href = DATA.resumeUrl;

    $("#heroPoster").style.backgroundImage =
      `url(https://i.ytimg.com/vi/${profile.video.id}/maxresdefault.jpg)`;

    $$(".ic").forEach((el) => { el.innerHTML = ICON[el.dataset.i] || ""; });
    syncSoundIcon();
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

  /* Sound is ON by default. Autoplay-with-audio is blocked by browsers, so
     every source starts muted (which is always allowed to autoplay) and is
     unmuted the instant playback begins — legal because selecting a profile
     was a real user gesture. If a browser still refuses, the icon re-syncs
     to reality rather than lying about the state. */
  let ytPlayer = null, ytTimer = null, localVideo = null, muted = false;

  function syncSoundIcon() {
    $("#btnSound").innerHTML = muted ? ICON.muted : ICON.sound;
  }

  function applyDesiredVolume() {
    if (localVideo) localVideo.muted = muted;
    if (ytPlayer && ytPlayer.unMute) {
      if (muted) ytPlayer.mute();
      else { ytPlayer.unMute(); if (ytPlayer.setVolume) ytPlayer.setVolume(100); }
      // the player may veto the unmute — reflect whatever actually happened
      setTimeout(() => {
        if (ytPlayer && ytPlayer.isMuted) { muted = ytPlayer.isMuted(); syncSoundIcon(); }
      }, 300);
    }
    syncSoundIcon();
  }

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
    $("#heroVideo").className = "hero-video";
    $("#heroVideo").innerHTML = "";
    $("#heroVideo").appendChild(v);
    localVideo = v;
    v.play()
      .then(() => { v.muted = muted; syncSoundIcon(); })   // unmute once rolling
      .catch(() => showPoster());
  }

  function useYouTube() {
    if (!window.YT || !window.YT.Player) {
      window.onYouTubeIframeAPIReady = useYouTube;
      setTimeout(() => { if (!ytPlayer && !localVideo) showPoster(); }, 4000);
      return;
    }
    const { id, start, end } = profile.video;
    const mount = document.createElement("div");
    // .yt overscales the iframe so YouTube's title/branding overlay, which
    // sits in the top-left of the video frame, is cropped outside the hero
    $("#heroVideo").className = "hero-video yt";
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
        onReady: (e) => { e.target.playVideo(); hidePoster(); },
        onError: showPoster,
        onStateChange: (e) => {
          if (e.data === YT.PlayerState.PLAYING) {
            hidePoster();
            applyDesiredVolume();          // unmute now that it's rolling
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
    applyDesiredVolume();
  }

  function replay() {
    if (localVideo) { localVideo.currentTime = 0; localVideo.play(); }
    else if (ytPlayer && ytPlayer.seekTo) { ytPlayer.seekTo(profile.video.start, true); ytPlayer.playVideo(); }
  }

  /* ====================================================== HERO SCROLL === */
  /* Netflix billboard behaviour: as you scroll off the hero, the title
     shrinks and settles downward while everything beneath it fades away.
     Driven off rAF so it stays smooth and never blocks the scroll thread. */
  function initHeroScroll() {
    const title = $("#heroTitle");
    const sub   = $("#heroSub");
    const kick  = $("#heroKicker");
    const hero  = document.querySelector(".hero");
    if (!title || !hero) return;

    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    let ticking = false;

    // smoothstep — eases in and out, no linear "sliding" feel
    const smooth = (t) => t * t * (3 - 2 * t);

    function apply() {
      ticking = false;
      const travel = hero.offsetHeight * 0.62;      // scroll distance to settle
      const raw = Math.min(1, Math.max(0, window.scrollY / travel));
      const p = smooth(raw);

      // title: shrink toward bottom-left and drift down a touch
      const scale = 1 - p * 0.34;
      const drop  = p * 26;
      title.style.transform = `translate3d(0,${drop.toFixed(2)}px,0) scale(${scale.toFixed(4)})`;

      // supporting copy fades slightly faster than the title shrinks
      const subP = Math.min(1, raw * 1.45);
      const subE = smooth(subP);
      sub.style.opacity   = (1 - subE).toFixed(3);
      sub.style.transform = `translate3d(0,${(subE * 16).toFixed(2)}px,0)`;
      kick.style.opacity  = (1 - Math.min(1, raw * 2.2)).toFixed(3);

      // stop the faded block from swallowing clicks once invisible
      sub.style.pointerEvents = subE > 0.96 ? "none" : "";
    }

    addEventListener("scroll", () => {
      if (!ticking) { ticking = true; requestAnimationFrame(apply); }
    }, { passive: true });
    addEventListener("resize", apply, { passive: true });

    apply();
    heroScrollApply = apply;   // let profile switches re-sync it
  }
  let heroScrollApply = null;

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
    $("#sidebarSwitch").addEventListener("click", backToGate);

    $("#modal").addEventListener("click", (e) => { if (e.target.closest("[data-close]")) closeModal(); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeModal(); });

    initHeroScroll();

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
