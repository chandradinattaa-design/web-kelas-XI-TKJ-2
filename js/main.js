// ===== LOADING SCREEN =====
(function () {
  const loadingScreen = document.getElementById('loadingScreen');
  const loadingTitle = document.getElementById('loadingTitle');
  const loadingBarFill = document.getElementById('loadingBarFill');
  const loadingPercent = document.getElementById('loadingPercent');

  if (!loadingScreen) return;

  // Letter by letter "XI TKJ 2"
  const titleText = 'XI TKJ 2';
  let titleHTML = '';
  titleText.split('').forEach((char, i) => {
    if (char === ' ') {
      titleHTML += '<span class="letter" style="animation-delay: ' + (i * 0.1) + 's">&nbsp;</span>';
    } else {
      titleHTML += '<span class="letter" style="animation-delay: ' + (i * 0.1) + 's">' + char + '</span>';
    }
  });
  loadingTitle.innerHTML = titleHTML;

  // Progress bar bertahap — 3.5 detik
  const steps = [0, 15, 30, 45, 60, 75, 85, 95, 100];
  const totalDuration = 3500;
  const stepDuration = totalDuration / steps.length;

  let currentStep = 0;
  const interval = setInterval(() => {
    if (currentStep < steps.length) {
      const val = steps[currentStep];
      loadingBarFill.style.width = val + '%';
      loadingPercent.textContent = val + '%';
      currentStep++;
    } else {
      clearInterval(interval);
      setTimeout(() => {
        loadingScreen.classList.add('hidden');
        document.body.style.overflow = '';
      }, 300);
    }
  }, stepDuration);

  document.body.style.overflow = 'hidden';
})();

// ===== CUSTOM CURSOR =====
(function () {
  if (window.innerWidth < 1024) return;

  const cursor = document.createElement('div');
  cursor.className = 'custom-cursor';
  document.body.appendChild(cursor);

  const trail = document.createElement('div');
  trail.className = 'custom-cursor-trail';
  document.body.appendChild(trail);

  let mouseX = 0;
  let mouseY = 0;
  let trailX = 0;
  let trailY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top = mouseY + 'px';
  });

  function animateTrail() {
    trailX += (mouseX - trailX) * 0.15;
    trailY += (mouseY - trailY) * 0.15;
    trail.style.left = trailX + 'px';
    trail.style.top = trailY + 'px';
    requestAnimationFrame(animateTrail);
  }
  animateTrail();

  const hoverTargets = document.querySelectorAll('a, button, .coverflow-item, .student-card, .timeline-content, .filter-btn');
  hoverTargets.forEach((el) => {
    el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
  });
})();

import * as THREE from 'three';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';

// ===== MAIN — TAHAP 4A (TEKS 3D RESPONSIVE) =====

document.addEventListener('DOMContentLoaded', async () => {
  const container = document.getElementById('hero3dContainer');
  if (!container) return;

  const loadingEl = document.getElementById('loading-3d');
  if (loadingEl) loadingEl.style.display = 'none';

  // ===== SCENE =====
  const scene = new THREE.Scene();

  let width = container.clientWidth;
  let height = container.clientHeight;

  const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);

  // ===== FUNGSI HITUNG JARAK KAMERA OTOMATIS =====
  // Makin lebar layar, makin deket kamera (teks keliatan gede)
  // Makin sempit layar, makin jauh kamera (teks tetep muat)
  function getCameraDistance() {
    const aspect = width / height;
    if (width < 600) return 22;      // HP kecil
    if (width < 900) return 20;      // Tablet
    if (width < 1200) return 16;     // Laptop kecil
    return 14;                        // Laptop/desktop gede
  }

  camera.position.set(0, 0, getCameraDistance());
  camera.lookAt(0, 0, 0);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.3;
  container.appendChild(renderer.domElement);

  // ===== LIGHTING =====
  scene.add(new THREE.AmbientLight(0xffffff, 1.2));

  const keyLight = new THREE.DirectionalLight(0xffffff, 2);
  keyLight.position.set(5, 5, 5);
  scene.add(keyLight);

  const purpleLight = new THREE.PointLight(0xB8A9D9, 3, 20);
  purpleLight.position.set(-4, 2, 6);
  scene.add(purpleLight);

  const silverLight = new THREE.PointLight(0xC0C0C0, 2, 20);
  silverLight.position.set(4, -1, 6);
  scene.add(silverLight);

  // ===== LOAD FONT & BIKIN TEKS =====
  const fontLoader = new FontLoader();
  let textMesh1 = null;
  let textMesh2 = null;

  fontLoader.load(
    'assets/3d/fonts/helvetiker_bold.typeface.json',
    (font) => {
      // Teks 1: "WELCOME TO"
      const geo1 = new TextGeometry('WELCOME TO', {
        font: font,
        size: 0.8,
        height: 0.25,
        curveSegments: 12,
        bevelEnabled: true,
        bevelThickness: 0.04,
        bevelSize: 0.02,
        bevelOffset: 0,
        bevelSegments: 5,
      });
      geo1.center();

      const mat1 = new THREE.MeshStandardMaterial({
        color: 0x8B7AB8,
        metalness: 0.6,
        roughness: 0.2,
        emissive: 0xB8A9D9,
        emissiveIntensity: 0.5,
      });

      textMesh1 = new THREE.Mesh(geo1, mat1);
      textMesh1.position.set(-20, 1.2, 0);
      scene.add(textMesh1);

      // Teks 2: "CLAS XI TKJ 2"
      const geo2 = new TextGeometry('CLAS XI TKJ 2', {
        font: font,
        size: 0.8,
        height: 0.25,
        curveSegments: 12,
        bevelEnabled: true,
        bevelThickness: 0.04,
        bevelSize: 0.02,
        bevelOffset: 0,
        bevelSegments: 5,
      });
      geo2.center();

      const mat2 = new THREE.MeshStandardMaterial({
        color: 0xC0C0C0,
        metalness: 0.8,
        roughness: 0.15,
        emissive: 0xC0C0C0,
        emissiveIntensity: 0.4,
      });

      textMesh2 = new THREE.Mesh(geo2, mat2);
      textMesh2.position.set(20, -1.0, 0);
      scene.add(textMesh2);
    },
    undefined,
    (err) => console.error('Gagal load font 3D:', err)
  );

  // ===== ANIMASI =====
  const startTime = performance.now();

  function animate() {
    requestAnimationFrame(animate);
    const elapsed = (performance.now() - startTime) / 1000;

    if (textMesh1) {
      textMesh1.position.x += (0 - textMesh1.position.x) * 0.03;
      textMesh1.position.y = 1.2 + Math.sin(elapsed * 1.2) * 0.15;
      textMesh1.rotation.y = Math.sin(elapsed * 0.5) * 0.1;
    }

    if (textMesh2) {
      textMesh2.position.x += (0 - textMesh2.position.x) * 0.03;
      textMesh2.position.y = -1.0 + Math.sin(elapsed * 1.2 + 1) * 0.15;
      textMesh2.rotation.y = Math.sin(elapsed * 0.5 + 1) * 0.1;
    }

    if (textMesh1 && textMesh1.material) {
      textMesh1.material.emissiveIntensity = 0.4 + Math.sin(elapsed * 2) * 0.3;
    }
    if (textMesh2 && textMesh2.material) {
      textMesh2.material.emissiveIntensity = 0.3 + Math.sin(elapsed * 2 + 1) * 0.3;
    }

    purpleLight.position.x = Math.sin(elapsed * 0.8) * 5;
    silverLight.position.x = Math.cos(elapsed * 0.7) * 5;

    renderer.render(scene, camera);
  }
  animate();

  // ===== RESIZE (AUTO-RESPONSIVE) =====
  window.addEventListener('resize', () => {
    width = container.clientWidth;
    height = container.clientHeight;
    camera.aspect = width / height;
    camera.position.z = getCameraDistance();
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  });

// ===== HERO BACKGROUND SLIDESHOW =====
const bgPhoto1 = document.getElementById('bgPhoto1');
const bgPhoto2 = document.getElementById('bgPhoto2');

if (bgPhoto1 && bgPhoto2) {
  let currentBg = 1;

  setInterval(() => {
    if (currentBg === 1) {
      bgPhoto1.classList.remove('active');
      bgPhoto2.classList.add('active');
      currentBg = 2;
    } else {
      bgPhoto2.classList.remove('active');
      bgPhoto1.classList.add('active');
      currentBg = 1;
    }
  }, 3500);
}

  // ===== NAVBAR =====
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const navMenu = document.getElementById('navMenu');
  if (hamburgerBtn && navMenu) {
    hamburgerBtn.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      hamburgerBtn.classList.toggle('active');
    });

    document.addEventListener('click', (e) => {
      if (!hamburgerBtn.contains(e.target) && !navMenu.contains(e.target)) {
        navMenu.classList.remove('open');
        hamburgerBtn.classList.remove('active');
      }
    });
  }

  const guestbookForm = document.getElementById('guestbookForm');
  if (guestbookForm) {
    guestbookForm.addEventListener('submit', (e) => e.preventDefault());
  }

  // ===== DAFTAR SISWA (GENERATE OTOMATIS) =====
  const studentsGrid = document.getElementById('studentsGrid');
  if (studentsGrid) {
    const students = [
      { nama: 'Siswa 1', sosmed: '@siswa1' },
      { nama: 'Siswa 2', sosmed: '@siswa2' },
      { nama: 'Siswa 3', sosmed: '@siswa3' },
      { nama: 'Siswa 4', sosmed: '@siswa4' },
      { nama: 'Siswa 5', sosmed: '@siswa5' },
      { nama: 'Siswa 6', sosmed: '@siswa6' },
      { nama: 'Siswa 7', sosmed: '@siswa7' },
      { nama: 'Siswa 8', sosmed: '@siswa8' },
    ];

    students.forEach((s, i) => {
      const card = document.createElement('div');
      card.className = 'student-card';
      card.innerHTML = `
        <img src="assets/img/siswa-${i + 1}.jpg" alt="${s.nama}" class="student-photo" onerror="this.style.background='#C0C0C0'" />
        <p class="student-name">${s.nama}</p>
        <p class="student-social">${s.sosmed}</p>
      `;
      studentsGrid.appendChild(card);
    });
  }

  // ===== TENTANG KELAS (TYPEWRITER + SUARA) =====
  const aboutText = document.getElementById('aboutText');
  const typingSound = document.getElementById('typingSound');
  if (aboutText) {
    const aboutContent = 'Kelas XI TKJ 2 merupakan keluarga yang penuh kehangatan, semangat, dan kebersamaan. Setiap siswa di dalamnya memiliki karakter ceria, ramah, serta saling mendukung satu sama lain. Prestasi menjadi bagian dari keseharian kami, bukan hanya di bidang akademik, tetapi juga dalam berbagai kegiatan sekolah. Di balik semua itu, sosok wali kelas kami hadir sebagai panutan yang penyayang dan sabar dalam membimbing setiap langkah kami. Kami tumbuh bersama, belajar bersama, dan terus berusaha menjadi pribadi yang humble, rajin, serta pantang menyerah. Inilah kami, XI TKJ 2 — solid, hangat, dan siap melangkah menuju masa depan.';
    let i = 0;
    let soundEnabled = false;
    let started = false;

    function playTypingSound() {
      if (soundEnabled && typingSound) {
        typingSound.currentTime = 0;
        typingSound.play().catch(() => {});
      }
    }

    function typeAbout() {
      if (i < aboutContent.length) {
        aboutText.textContent += aboutContent.charAt(i);
        playTypingSound();
        i++;
        setTimeout(typeAbout, 50);
      }
    }

    const aboutObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !started) {
          started = true;
          document.body.addEventListener('click', () => { soundEnabled = true; }, { once: true });
          typeAbout();
        }
      });
    }, { threshold: 0.3 });
    aboutObserver.observe(aboutText);
  }

  // ===== ENTRANCE ANIMATION (SEMUA SECTION) =====
  const sections = document.querySelectorAll('section');
  sections.forEach((s) => s.classList.add('section-hidden'));

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('section-visible');
        entry.target.classList.remove('section-hidden');
      }
    });
  }, { threshold: 0.1 });

  sections.forEach((s) => sectionObserver.observe(s));

  // ===== JEJAK KELAS (TIMELINE 3D) =====
  const timelineWrapper = document.getElementById('timelineWrapper');
  if (timelineWrapper) {
    const momen = [
      {
        judul: 'Awal Masuk Kelas X',
        teks: 'Segalanya dimulai dari sebuah ruangan yang penuh wajah asing. Kami datang dari latar belakang yang berbeda, membawa cerita masing-masing. Tidak ada yang tahu apa yang akan terjadi. Namun di hari pertama itu, kami belajar satu hal: kebersamaan tidak lahir begitu saja, ia dibangun perlahan, satu perkenalan demi satu perkenalan. Kelas XI TKJ 2 bukan sekadar tempat belajar — ia adalah awal dari sebuah keluarga yang kami banggakan.'
      },
      {
        judul: 'Masa Orientasi',
        teks: 'Masa orientasi menjadi gerbang pertama kami. Di sana kami belajar arti disiplin, kerja sama, dan menghargai perbedaan. Ada lelah, ada tawa, ada cerita yang tak akan terlupakan. Kami yang awalnya canggung mulai menemukan kenyamanan satu sama lain. Dari sinilah fondasi kebersamaan kami mulai terbentuk — kuat, hangat, dan penuh makna.'
      },
      {
        judul: 'Pertama Kali Lomba',
        teks: 'Momen pertama kami mengikuti lomba 17 Agustusan menjadi salah satu kenangan paling berkesan. Kami berlatih bersama, berjuang bersama, dan tertawa bersama. Menang atau kalah bukanlah tujuan utama — yang terpenting adalah semangat kebersamaan yang tumbuh di setiap langkah. Dari lomba itu, kami belajar bahwa kekompakan adalah kekuatan terbesar kami.'
      },
      {
        judul: 'Belajar di Lab',
        teks: 'Laboratorium TKJ menjadi saksi perjalanan kami. Di sana kami mengenal komputer lebih dalam, belajar jaringan, dan memahami dunia teknologi yang kelak menjadi masa depan kami. Ada momen bingung, ada momen frustrasi, tetapi ada juga momen bangga ketika kami berhasil menyelesaikan tantangan. Setiap detik di lab adalah bagian dari cerita yang tak ternilai harganya.'
      },
      {
        judul: 'Classmeet',
        teks: 'Classmeet menjadi ajang kami menunjukkan kekompakan. Kami berkompetisi dengan sportif, mendukung satu sama lain tanpa henti. Ada sorak kemenangan, ada tangis kekalahan — tetapi semuanya kami jalani bersama. Classmeet bukan hanya soal perlombaan, tetapi tentang bagaimana kami tumbuh sebagai satu kesatuan yang solid.'
      },
      {
        judul: 'Prestasi & Penghargaan',
        teks: 'Perjalanan kami tidak lepas dari prestasi. Anggota kelas XI TKJ 2 berhasil meraih berbagai penghargaan, baik di bidang akademik maupun non-akademik. Setiap prestasi adalah hasil dari kerja keras, doa, dan dukungan satu sama lain. Kami bangga, bukan hanya karena penghargaan itu, tetapi karena kami meraihnya bersama-sama — sebagai satu kelas, satu keluarga, satu tujuan.'
      }
    ];

    momen.forEach((m, i) => {
      const item = document.createElement('div');
      item.className = 'timeline-item';
      item.innerHTML = `
        <div class="timeline-content">
          <div class="timeline-number">0${i + 1}</div>
          <h3 class="timeline-title">${m.judul}</h3>
          <p class="timeline-text">${m.teks}</p>
        </div>
      `;
      timelineWrapper.appendChild(item);
    });

    const timelineObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.2 });

    document.querySelectorAll('.timeline-item').forEach((item) => {
      timelineObserver.observe(item);
    });
  }

  // ===== GALERI — COVERFLOW 3D =====
  const coverflow = document.getElementById('coverflow');
  const caption = document.getElementById('coverflowCaption');
  const filterBtns = document.querySelectorAll('.filter-btn');
  const prevBtn = document.getElementById('coverflowPrev');
  const nextBtn = document.getElementById('coverflowNext');

  if (coverflow) {
    const galeriData = [
  { kat: 'agustus', label: 'Lomba 17 Agustusan', jumlah: 9 },
  { kat: 'batik', label: 'Hari Batik Nasional', jumlah: 12 },
  { kat: 'bukber', label: 'Bukber', jumlah: 5 },
  { kat: 'lab', label: 'Belajar di Lab', jumlah: 6 },
  { kat: 'prestasi', label: 'Prestasi', jumlah: 1 },
  { kat: 'wali', label: 'Bersama Wali Kelas', jumlah: 6 },
];

    // Bikin array foto lengkap
    const allPhotos = [];
    galeriData.forEach((g) => {
      for (let i = 1; i <= g.jumlah; i++) {
        allPhotos.push({
  kat: g.kat,
  label: `${g.label} ${i}`,
  src: `assets/img/${g.kat}-${i}.jpeg`,
});
      }
    });

    let currentPhotos = [...allPhotos];
    let currentIndex = 0;

    // Render coverflow
    function renderCoverflow() {
      coverflow.innerHTML = '';
      currentPhotos.forEach((photo, i) => {
        const item = document.createElement('div');
        item.className = 'coverflow-item';
        item.dataset.index = i;

        const offset = i - currentIndex;
        let posClass = 'pos-hidden';

        if (offset === 0) posClass = 'pos-0';
        else if (offset === 1) posClass = 'pos-1';
        else if (offset === 2) posClass = 'pos-2';
        else if (offset === -1) posClass = 'pos--1';
        else if (offset === -2) posClass = 'pos--2';

        item.classList.add(posClass);

        item.innerHTML = `
          <img src="${photo.src}" alt="${photo.label}" onerror="this.style.display='none'; this.parentElement.querySelector('.img-placeholder').style.display='flex';" />
          <div class="img-placeholder" style="display:none;">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <circle cx="8.5" cy="8.5" r="1.5"></circle>
              <polyline points="21 15 16 10 5 21"></polyline>
            </svg>
            <span>${photo.label}</span>
          </div>
          <div class="item-overlay">${photo.label}</div>
        `;

        item.addEventListener('click', () => {
          currentIndex = i;
          renderCoverflow();
          updateCaption();
        });

        coverflow.appendChild(item);
      });
      updateCaption();
    }

    function updateCaption() {
      if (caption && currentPhotos[currentIndex]) {
        caption.textContent = currentPhotos[currentIndex].label;
      }
    }

    // Navigasi
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % currentPhotos.length;
        renderCoverflow();
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + currentPhotos.length) % currentPhotos.length;
        renderCoverflow();
      });
    }

    // Filter kategori
    filterBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        filterBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.dataset.filter;
        if (filter === 'semua') {
          currentPhotos = [...allPhotos];
        } else {
          currentPhotos = allPhotos.filter((p) => p.kat === filter);
        }
        currentIndex = 0;
        renderCoverflow();
      });
    });

    // Keyboard navigasi
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') {
        currentIndex = (currentIndex + 1) % currentPhotos.length;
        renderCoverflow();
      } else if (e.key === 'ArrowLeft') {
        currentIndex = (currentIndex - 1 + currentPhotos.length) % currentPhotos.length;
        renderCoverflow();
      }
    });

    // Initial render
    renderCoverflow();
  }

  // ===== BUKU TAMU (LOCALSTORAGE) =====
  const guestbookFormEl = document.getElementById('guestbookForm');
  const guestbookCards = document.getElementById('guestbookCards');

  if (guestbookFormEl && guestbookCards) {
    const STORAGE_KEY = 'drawebsite_guestbook';

    function getPesan() {
      try {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : [];
      } catch (e) {
        return [];
      }
    }

    function simpanPesan(pesan) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(pesan));
      } catch (e) {
        console.error('Gagal simpan pesan:', e);
      }
    }

    function formatWaktu(timestamp) {
      const d = new Date(timestamp);
      const tgl = d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
      const jam = d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
      return `${tgl} • ${jam}`;
    }

    function renderPesan() {
      const pesan = getPesan();
      guestbookCards.innerHTML = '';

      if (pesan.length === 0) {
        guestbookCards.innerHTML = '<div class="guestbook-empty">Belum ada pesan. Jadi yang pertama! ✨</div>';
        return;
      }

      pesan.slice().reverse().forEach((p) => {
        const card = document.createElement('div');
        card.className = 'guest-card';
        card.innerHTML = `
          <div class="guest-card-name">${escapeHtml(p.nama)}</div>
          <div class="guest-card-time">${formatWaktu(p.waktu)}</div>
          <div class="guest-card-msg">${escapeHtml(p.pesan)}</div>
        `;
        guestbookCards.appendChild(card);
      });
    }

    function escapeHtml(str) {
      const div = document.createElement('div');
      div.textContent = str;
      return div.innerHTML;
    }

    guestbookFormEl.addEventListener('submit', (e) => {
      e.preventDefault();
      const namaInput = document.getElementById('guestName');
      const pesanInput = document.getElementById('guestMessage');
      const nama = namaInput.value.trim();
      const pesan = pesanInput.value.trim();

      if (!nama || !pesan) return;

      const pesanBaru = getPesan();
      pesanBaru.push({
        nama: nama,
        pesan: pesan,
        waktu: Date.now(),
      });
      simpanPesan(pesanBaru);

      namaInput.value = '';
      pesanInput.value = '';
      renderPesan();
    });

    renderPesan();
  }

  // ===== NAVBAR LINKS (SMOOTH SCROLL) =====
  document.querySelectorAll('.nav-links a').forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href');
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ===== BACK TO TOP =====
  const backToTop = document.getElementById('backToTop');
  if (backToTop) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) {
        backToTop.classList.add('show');
      } else {
        backToTop.classList.remove('show');
      }
    });

    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ===== SCROLL PROGRESS BAR =====
  const progressBar = document.createElement('div');
  progressBar.className = 'scroll-progress';
  document.body.appendChild(progressBar);

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = progress + '%';
  });
});