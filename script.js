'use strict';

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const nav = document.querySelector('.nav');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');

///
//up button
const upBtn = document.createElement('button');
upBtn.classList.add('btnUP');

upBtn.innerHTML = '<button class="btnUP">&UpArrow;</button>';

///////////////////////////////////////
// Modal window

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

///////////////////////////////////////
// Button scrolling
btnScrollTo.addEventListener('click', function (e) {
  const s1coords = section1.getBoundingClientRect();
  console.log(s1coords);

  console.log(e.target.getBoundingClientRect());

  console.log('Current scroll (X/Y)', window.pageXOffset, window.pageYOffset);

  console.log(
    'height/width viewport',
    document.documentElement.clientHeight,
    document.documentElement.clientWidth
  );

  section1.scrollIntoView({ behavior: 'smooth' });
});

document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();

  // Matching strategy
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

///////////////////////////////////////
// Tabbed component

tabsContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');

  // Guard clause
  if (!clicked) return;

  // Remove active classes
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  tabsContent.forEach(c => c.classList.remove('operations__content--active'));

  // Activate tab
  clicked.classList.add('operations__tab--active');

  // Activate content area
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

///////////////////////////////////////
// Menu fade animation
const handleHover = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};

// Passing "argument" into handler
nav.addEventListener('mouseover', handleHover.bind(0.5));
nav.addEventListener('mouseout', handleHover.bind(1));

///////////////////////////////////////
// Sticky navigation: Intersection Observer API

const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;

const stickyNav = function (entries) {
  const [entry] = entries;
  // console.log(entry);

  if (!entry.isIntersecting) {
    nav.classList.add('sticky');
    document.body.prepend(upBtn);
    document
      .querySelector('.btnUP')
      .addEventListener('click', () =>
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
      );
  } else {
    nav.classList.remove('sticky');
    if (document.body.contains(upBtn)) upBtn.parentElement.removeChild(upBtn);
  }
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});

headerObserver.observe(header);

///////////////////////////////////////
// Reveal sections
const allSections = document.querySelectorAll('.section');

const revealSection = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

allSections.forEach(function (section) {
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
});

// Lazy loading images
const imgTargets = document.querySelectorAll('img[data-src]');

const loadImg = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  // Replace src with data-src
  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });

  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: '200px',
});

imgTargets.forEach(img => imgObserver.observe(img));

///////////////////////////////////////
// Slider
const slider = function () {
  const slides = document.querySelectorAll('.slide');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  const dotContainer = document.querySelector('.dots');

  let curSlide = 0;
  const maxSlide = slides.length;

  // Functions
  const createDots = function () {
    slides.forEach(function (_, i) {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };

  const activateDot = function (slide) {
    document
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));

    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add('dots__dot--active');
  };

  const goToSlide = function (slide) {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
    );
  };

  // Next slide
  const nextSlide = function () {
    if (curSlide === maxSlide - 1) {
      curSlide = 0;
    } else {
      curSlide++;
    }

    goToSlide(curSlide);
    activateDot(curSlide);
  };

  const prevSlide = function () {
    if (curSlide === 0) {
      curSlide = maxSlide - 1;
    } else {
      curSlide--;
    }
    goToSlide(curSlide);
    activateDot(curSlide);
  };

  const init = function () {
    goToSlide(0);
    createDots();

    activateDot(0);
  };
  init();

  // Event handlers
  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', prevSlide);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') prevSlide();
    e.key === 'ArrowRight' && nextSlide();
  });

  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      const { slide } = e.target.dataset;
      goToSlide(slide);
      activateDot(slide);
    }
  });
};
slider();

///////////////////////////////////////

///////////////////////////////////////

///////Draw points

var cvs = document.createElement('canvas'),
  context = cvs.getContext('2d');

cvs.classList.add('overlayWeb');

const parentEl = document.querySelector('.header__title');
parentEl.appendChild(cvs);
//document.body.appendChild(cvs);

var numDots = 200,
  n = numDots,
  currDot,
  maxRad = cvs.width,
  minRad = 30,
  radDiff = maxRad - minRad,
  dots = [],
  pairs = [],
  PI = Math.PI,
  centerPt = { x: 0, y: 0 };

resizeHandler();
parentEl.onresize = resizeHandler;

// create dots
n = numDots;
while (n--) {
  currDot = {};
  currDot.x = currDot.y = 0;
  currDot.radius = minRad + Math.random() * radDiff;
  (currDot.radiusV = 10 + Math.random() * 50),
    (currDot.radiusVS = (1 - Math.random() * 2) * 0.015),
    (currDot.radiusVP = Math.random() * PI),
    (currDot.ang = (1 - Math.random() * 2) * PI);
  currDot.speed = 0.05 - Math.random() / 20;

  currDot.fillColor = 'black';
  dots.push(currDot);
}

//create all pairs
let ni;
n = numDots;
while (n--) {
  ni = n;
  while (ni--) {
    pairs.push([n, ni]);
  }
}

const drawPoints = function () {
  n = numDots;
  var _centerPt = centerPt,
    _context = context,
    dX = 0,
    dY = 0;

  _context.clearRect(0, 0, cvs.width, cvs.height);

  var radDiff;
  //move dots
  n = numDots;
  while (n--) {
    currDot = dots[n];
    currDot.radiusVP += currDot.radiusVS;
    radDiff = currDot.radius + Math.sin(currDot.radiusVP) * currDot.radiusV;
    currDot.x = _centerPt.x + Math.sin(currDot.ang) * radDiff;
    currDot.y = _centerPt.y + Math.cos(currDot.ang) * radDiff;

    //currDot.ang += currDot.speed;
    currDot.ang += (currDot.speed * radDiff) / 200000;
  }

  var pair,
    dot0,
    dot1,
    dist,
    maxDist = Math.pow(40, 2);
  //draw lines
  n = pairs.length;
  while (n--) {
    pair = pairs[n];
    dot0 = dots[pair[0]];
    dot1 = dots[pair[1]];
    dist = Math.pow(dot1.x - dot0.x, 2) + Math.pow(dot1.y - dot0.y, 2);
    if (dist < maxDist) {
      _context.beginPath();
      _context.moveTo(dot0.x, dot0.y);
      _context.lineTo(dot1.x, dot1.y);
      _context.lineWidth = 0.1;
      _context.strokeStyle = 'black';
      _context.stroke();
    }
  }

  //draw dots
  n = numDots;
  while (n--) {
    _context.beginPath();
    _context.arc(dots[n].x, dots[n].y, 0.8, 0, 2 * Math.PI, false);
    _context.fillStyle = 'black';

    _context.fill();
    _context.lineWidth = 1;
    _context.strokeStyle = 'blue';
    _context.stroke();
  }
  window.requestAnimationFrame(drawPoints);
};

function resizeHandler() {
  cvs.width = cvs.height = 900;

  centerPt.x = Math.round((cvs.width * 1) / 5);
  centerPt.y = Math.round(cvs.height / 3);
}

drawPoints();
