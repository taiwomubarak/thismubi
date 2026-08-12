// ============================================
// MUBI — Skills Orbit (CSS electron spin + icons)
// ============================================

(function initSkillsOrbit() {
  const root = document.getElementById('skills-orbit');
  if (!root) return;

  const icon = (folder, file = `${folder}-original.svg`) =>
    `https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${folder}/${file}`;

  const SHELLS = [
    {
      id: 'inner',
      label: 'Frontend',
      radius: 160,
      duration: 12,
      reverse: false,
      tilt: 0,
      squash: 1,
      skills: [
        { name: 'HTML', src: icon('html5') },
        { name: 'CSS', src: icon('css3') },
        { name: 'JavaScript', src: icon('javascript') },
        { name: 'TypeScript', src: icon('typescript') },
      ],
    },
    {
      id: 'mid',
      label: 'Frameworks',
      radius: 230,
      duration: 18,
      reverse: true,
      tilt: 60,
      squash: 0.42,
      skills: [
        { name: 'React', src: icon('react') },
        { name: 'Vue', src: icon('vuejs') },
        { name: 'Vite', src: icon('vitejs') },
        { name: 'PHP', src: icon('php') },
      ],
    },
    {
      id: 'outer',
      label: 'Backend / Stacks',
      radius: 300,
      duration: 26,
      reverse: false,
      tilt: 120,
      squash: 0.42,
      skills: [
        { name: 'Laravel', src: icon('laravel') },
        { name: 'Python', src: icon('python') },
        { name: 'SQL', src: icon('mysql') },
        { name: 'MEAN', src: icon('mongodb') },
        { name: 'MERN', src: icon('nodejs') },
      ],
    },
  ];

  function build() {
    root.querySelectorAll('.orbit-shell, .orbit-nucleus-ring').forEach((el) => el.remove());

    const maxR = Math.max(...SHELLS.map((s) => s.radius));
    root.style.setProperty('--orbit-size', `${maxR * 2 + 120}px`);

    const nuc = document.createElement('div');
    nuc.className = 'orbit-nucleus-ring';
    nuc.setAttribute('aria-hidden', 'true');
    root.appendChild(nuc);

    SHELLS.forEach((shell) => {
      const shellEl = document.createElement('div');
      shellEl.className = `orbit-shell orbit-shell--${shell.id}`;
      shellEl.style.setProperty('--orbit-r', `${shell.radius}px`);
      shellEl.style.setProperty('--orbit-dur', `${shell.duration}s`);
      shellEl.style.setProperty('--orbit-tilt', `${shell.tilt}deg`);
      shellEl.style.setProperty('--orbit-squash', String(shell.squash));
      shellEl.style.setProperty('--orbit-unsquash', String(1 / shell.squash));
      if (shell.reverse) shellEl.classList.add('is-reverse');
      shellEl.setAttribute('aria-label', `${shell.label} skills`);

      const path = document.createElement('div');
      path.className = 'orbit-path';
      path.setAttribute('aria-hidden', 'true');

      const spinner = document.createElement('div');
      spinner.className = 'orbit-spinner';

      const n = shell.skills.length;
      shell.skills.forEach((skill, i) => {
        const node = document.createElement('div');
        node.className = 'orbit-node';
        node.style.setProperty('--i', String(i));
        node.style.setProperty('--n', String(n));
        node.setAttribute('role', 'img');
        node.setAttribute('aria-label', skill.name);
        node.title = skill.name;

        node.innerHTML = `
          <div class="orbit-node-face">
            <div class="orbit-node-billboard">
              <button type="button" class="orbit-electron" aria-label="${skill.name}">
                <img class="orbit-icon" src="${skill.src}" alt="${skill.name}" width="28" height="28" loading="eager">
              </button>
            </div>
          </div>
        `;

        spinner.appendChild(node);
      });

      shellEl.appendChild(path);
      shellEl.appendChild(spinner);
      root.appendChild(shellEl);
    });

    // Pause all shells while hovering any electron
    root.querySelectorAll('.orbit-electron').forEach((btn) => {
      btn.addEventListener('mouseenter', () => root.classList.add('is-paused'));
      btn.addEventListener('mouseleave', () => root.classList.remove('is-paused'));
      btn.addEventListener('focus', () => root.classList.add('is-paused'));
      btn.addEventListener('blur', () => root.classList.remove('is-paused'));
    });
  }

  function fit() {
    const w = Math.min(window.innerWidth, 960);
    const scale = w < 720 ? (w < 480 ? 0.48 : 0.64) : 1;
    root.style.setProperty('--orbit-scale', String(scale));
  }

  // Always visible — don't wait on .reveal
  root.classList.remove('reveal');
  root.classList.add('visible');

  build();
  fit();
  window.addEventListener('resize', fit);

  window.MubiSkillsOrbit = { shells: SHELLS, rebuild: build };
})();
