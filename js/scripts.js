$(document).ready(function () {

  // ─── Blob shapes for morphing at different scroll positions ───
  var shapes = [
    { wave1: { amplitude: 76.923, frequency: 0.879, phase: 0 }, wave2: { amplitude: 60, frequency: 0.165, phase: 0 }, wave3: { amplitude: 50, frequency: 0, phase: 0 } },
    { wave1: { amplitude: 0, frequency: 0, phase: 0 }, wave2: { amplitude: 0, frequency: 0, phase: 0 }, wave3: { amplitude: 35, frequency: 10, phase: 0 } },
    { wave1: { amplitude: 200, frequency: 7.692, phase: 6.283 }, wave2: { amplitude: 200, frequency: 7.912, phase: 6.283 }, wave3: { amplitude: 200, frequency: 10, phase: 6.283 } },
    { wave1: { amplitude: 34.066, frequency: 5.934, phase: 0 }, wave2: { amplitude: 20.879, frequency: 6.154, phase: 0 }, wave3: { amplitude: 50.549, frequency: 0, phase: 0 } }
  ];

  var blobSettings = {
    BLOB_SIZE: 250,
    BLOB_DISTANCE: 1000,
    DETALISATION: 60,
    PERSPECTIVE_DISTORTION: 1,
    ROTATION_SPEED: 5,
    DOT_SIZE: $(window).width() > 480 ? 1.5 : 1,
    DOT_COLOR: '#d0d0d0',
    MOUSE_DISTANCE_MIN: 20,
    MOUSE_DISTANCE_MAX: 400,
    MOUSE_SENSITIVITY: 1,
    INERTIAL_TIME: 4,
    INITIAL_SHAPE: shapes[0],
    USE_WAVE_MOTION: true,
    USE_WAVE_SWING: true,
    USE_MORPHING: true,
    MORPHING_AUTOPLAY: true,
    MORPHING_DURATION: 1,
    MORPHING_DELAY: 0,
    MORPHING_TRANSITION_TYPE: 'cubic',
    MORPHING_SHAPES: [shapes[0]],
    WAVE_1_MOTION_SPEED: 1.3,
    WAVE_2_MOTION_SPEED: 0.8
  };

  // ─── Initialize BlobAnimation ───
  $('body').addClass('animated');
  var blob = new BlobAnimation('blob_container', blobSettings);

  // blob_container styled inline in HTML

  // ─── Viewport check ───
  function isInViewport(elem) {
    if (!elem) return false;
    var b = elem.getBoundingClientRect();
    return b.top >= 0 && b.left >= 0 &&
      b.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      b.right <= (window.innerWidth || document.documentElement.clientWidth);
  }

  // ─── Smooth blob distance/perspective animation ───
  var intDistance, intPerspective;
  var ctrlDistance = false, ctrlPerspective = false;
  var curAni = 1;

  function animateDistance(end, index) {
    if (curAni !== index) { ctrlDistance = false; curAni = index; clearInterval(intDistance); }
    if (ctrlDistance) return;
    ctrlDistance = true;
    var step;
    if (blob.blobDistance >= end) {
      step = (blob.blobDistance - end) / 100;
      intDistance = setInterval(function () {
        if (blob.blobDistance > end) {
          blob.blobDistance = (blob.blobDistance - step > end) ? blob.blobDistance - step : end;
        } else { ctrlDistance = false; clearInterval(intDistance); }
      }, 1);
    } else {
      step = (end - blob.blobDistance) / 100;
      intDistance = setInterval(function () {
        if (blob.blobDistance < end) {
          blob.blobDistance = (blob.blobDistance + step < end) ? blob.blobDistance + step : end;
        } else { ctrlDistance = false; clearInterval(intDistance); }
      }, 1);
    }
  }

  function animatePerspective(end, index) {
    if (curAni !== index) { ctrlPerspective = false; curAni = index; clearInterval(intPerspective); }
    if (ctrlPerspective) return;
    ctrlPerspective = true;
    if (blob.perspectiveDistortion >= end) {
      intPerspective = setInterval(function () {
        if (blob.perspectiveDistortion > end) blob.perspectiveDistortion -= 1;
        else { ctrlPerspective = false; clearInterval(intPerspective); }
      }, 2);
    } else {
      intPerspective = setInterval(function () {
        if (blob.perspectiveDistortion < end) blob.perspectiveDistortion += 1;
        else { ctrlPerspective = false; clearInterval(intPerspective); }
      }, 2);
    }
  }

  // ─── Elements for scroll detection ───
  var introEl = document.getElementById('intro');
  var textEl = document.getElementById('delegato-testo-1');
  var collabEl = document.getElementById('delegato-testo-2');
  var title1El = document.getElementById('delegato-testo-3');
  var serviceEl = document.getElementById('delegato-testo-4');
  var ftitleEl = document.getElementById('delegato-testo-5');
  var aaLoghiEl = document.getElementById('aa-loghi');

  // ─── Scroll handler ───
  var numbersAnimated = false;

  window.addEventListener('scroll', function () {
    // Blob morph based on visible section
    if (isInViewport(introEl)) {
      blob.morphTo(shapes[0]);
      blob.blobSize = 250;
      animateDistance(1000, 1);
      animatePerspective(1, 1);
      blob.dotSize = $(window).width() > 480 ? 1.5 : 1;
    }
    if (isInViewport(textEl)) {
      blob.morphTo(shapes[1]);
      blob.blobSize = 220;
      animateDistance(0, 2);
      animatePerspective(3, 2);
      blob.dotSize = $(window).width() > 480 ? 1 : 0.8;
    }
    if (isInViewport(title1El)) {
      blob.morphTo(shapes[2]);
      blob.blobSize = 220;
      animateDistance(1000, 3);
      animatePerspective(1, 3);
      blob.dotSize = $(window).width() > 480 ? 1.021 : 0.6;
    }
    if (isInViewport(ftitleEl)) {
      blob.morphTo(shapes[3]);
      blob.blobSize = 220;
      animateDistance(1000, 4);
      animatePerspective(1, 4);
      blob.dotSize = $(window).width() > 480 ? 1.021 : 0.6;
    }

    // Body dark/light toggle
    if (isInViewport(introEl)) {
      $('body').addClass('animated');
    } else {
      $('body').removeClass('animated');
    }
    if (isInViewport(title1El) || isInViewport(ftitleEl) || isInViewport(introEl)) {
      $('#blob_container').addClass('animated');
      $('body').addClass('animated');
    } else {
      $('#blob_container').removeClass('animated');
      $('body').removeClass('animated');
    }

    // Section reveal animations
    if (isInViewport(textEl)) {
      $('#text1').addClass('animated');
    }
    if (isInViewport(collabEl)) {
      $('#collaborations, .customer-clients').addClass('animated');
      // Testimonials
      $('#testimonials-title').addClass('animated');
      $('#testimonials-subtitle').css({ opacity: 1, transform: 'translateY(0)' });
      $('.testimonials-grid').addClass('animated');
    }
    if (isInViewport(aaLoghiEl)) {
      $('#aa-title, #aa-loghi').addClass('animated');
      $('#award-text').addClass('animated');
      if (!numbersAnimated) { numbersAnimated = true; animateNumbers(); }
    }
    if (isInViewport(serviceEl)) {
      $('#services, .work-1, .work-2, .work-3, .work-4, #social-media, #branding, #web-design, #advertising').addClass('animated');
    }
    if (isInViewport(ftitleEl)) {
      $('#ftitle, .footer-box-center, #address, .footer-box-right').addClass('animated');
    }
  }, false);

  // ─── Animation delay setup ───
  function setAnimationDelay(id, startDelay) {
    startDelay = startDelay || 0;
    $('#' + id).find('span').each(function (i) {
      $(this).css('transition-delay', ((i * 30) + startDelay) + 'ms');
    });
  }
  function setAnimationDelayLi(id, startDelay) {
    startDelay = startDelay || 0;
    $('#' + id).find('li').each(function (i) {
      $(this).css('transition-delay', ((i * 20) + startDelay) + 'ms');
    });
  }

  setAnimationDelay('intro');
  setAnimationDelay('text1', 100);
  setAnimationDelay('award-text', 100);
  setAnimationDelay('aa-title', 100);
  setAnimationDelay('services', 100);
  setAnimationDelay('collaborations', 100);
  setAnimationDelay('testimonials-title', 100);
  // Stagger testimonial cards
  $('.testimonial-card').each(function (i) {
    $(this).css('transition-delay', (100 + i * 120) + 'ms');
  });
  setAnimationDelay('ftitle', 400);
  setAnimationDelayLi('branding', 1200);
  setAnimationDelayLi('web-design', 1600);
  setAnimationDelayLi('advertising', 2000);
  setAnimationDelayLi('social-media', 2400);

  // ─── Number animation for awards ───
  var awNumbers = [];
  $('.customer-awwwards li').each(function (i) {
    var span = $(this).find('span');
    awNumbers[i] = span.text().trim();
    span.text('').addClass('not_animated');
  });

  function animateNumbers() {
    $('.customer-awwwards li').each(function (i) {
      var span = $(this).find('span.not_animated');
      if (span.length && awNumbers[i]) {
        span.removeClass('not_animated');
        var end = parseInt(awNumbers[i]);
        var z = end - 1;
        var tmz = 500 + Math.floor(Math.random() * 2000);
        var tmr = setInterval(function () {
          span.text(z);
          z = z === 9 ? 0 : z + 1;
        }, 50);
        setTimeout(function () { clearInterval(tmr); span.text(end); }, tmz);
      }
    });
  }

  // ─── Contact form ───
  $('#ftitle').on('click', function (e) {
    $('.contact_overlay').css({ top: e.clientY, left: e.clientX });
    $('.mainBody').css('overflow', 'hidden');
    $('.contact_overlay').addClass('opened');
    setTimeout(function () { $('#contactframe').addClass('animated'); }, 300);
  });

  $('#edit_button').on('click', function () {
    $('.edit_button_overlay').addClass('actived');
    $('.mainBody').css('overflow', 'hidden');
    setTimeout(function () { $('#contactframe').addClass('animated'); }, 300);
  });

  $(document).on('keydown', function (e) {
    if (e.key === 'Escape') closeContactForm();
  });

  window.closeContactForm = function () {
    $('#contactframe').removeClass('animated');
    setTimeout(function () {
      $('.contact_overlay').removeClass('opened');
      $('.mainBody').css('overflow-y', 'inherit');
      $('.edit_button_overlay').removeClass('actived');
      setTimeout(function () {
        $('.contact_overlay').css({ top: '-1px', left: '-1px' });
      }, 700);
    }, 400);
  };

  // ─── Social link hover colors ───
  $('.footer-box-right li:first-child a').on('mouseover', function () {
    $('body').addClass('body_blu');
  }).on('mouseout', function () {
    $('body').removeClass('body_blu');
  });
  $('.footer-box-right li:nth-child(2) a').on('mouseover', function () {
    $('body').addClass('body_instagram');
  }).on('mouseout', function () {
    $('body').removeClass('body_instagram');
  });
  $('.footer-box-right li:nth-child(3) a').on('mouseover', function () {
    $('body').addClass('body_linkedin');
  }).on('mouseout', function () {
    $('body').removeClass('body_linkedin');
  });

  // ─── Edit button parallax + magnetic effect ───
  var editElm = document.getElementById('edit_button');
  if (editElm) {
    var currentPixel = window.pageYOffset;
    var delta = $(window).width() < 480 ? 0 : 5;
    (function looper() {
      var newPixel = window.pageYOffset;
      var speed = (newPixel - currentPixel) * delta;
      editElm.style.top = -speed + 'px';
      currentPixel = newPixel;
      requestAnimationFrame(looper);
    })();

    var cX = 0, cY = 0;
    $(document).on('mousemove', function (e) { cX = e.clientX; cY = e.clientY; });

    (function magnetic() {
      var bound = editElm.getBoundingClientRect();
      var centerX = bound.width / 2 + bound.x;
      var centerY = bound.height / 2 + bound.y;
      var diagonal = Math.sqrt(bound.width * bound.width + bound.height * bound.height);
      var distance = Math.sqrt((centerX - cX) * (centerX - cX) + (centerY - cY) * (centerY - cY));
      var maxDist = (diagonal + distance) / 2;
      if (distance < maxDist) {
        var pct = 1 - distance / maxDist;
        editElm.style.transform = 'translate(' + Math.round((cX - centerX) * pct) + 'px, ' + Math.round((cY - centerY) * pct) + 'px)';
      } else {
        editElm.style.transform = '';
      }
      requestAnimationFrame(magnetic);
    })();

    $('#edit_button').on('mouseover', function () {
      $('.cursor').addClass('cursor_onbutton');
    }).on('mouseout', function () {
      $('.cursor').removeClass('cursor_onbutton');
    });
  }

  // ─── Fade in content ───
  $('body').removeClass('bodypreloader');
  $('.box, footer, .container, section, .bottom_nav').animate({ opacity: 1 }, 300, function () {
    $('#intro').addClass('animated');
  });

  // ─── Contact form submission ───
  $('#contact-form').on('submit', function (e) {
    e.preventDefault();
    $(this).fadeOut(300, function () {
      $('#form-success').fadeIn(300);
    });
  });

  // ─── Smooth scroll ───
  $('a[href^="#"]').on('click', function (e) {
    var target = $($(this).attr('href'));
    if (target.length) {
      e.preventDefault();
      $('html, body').animate({ scrollTop: target.offset().top }, 600);
    }
  });

  // ─── Case study overlay for portfolio cards ───
  var caseStudies = {
    'Humanizer AI': {
      url: 'https://humanizer-eta-one.vercel.app',
      img: 'images/portfolio/humanizer.png',
      type: 'AI Writing Tool',
      overview: 'Humanizer AI is an advanced content tool that transforms AI-generated text into natural, human-sounding prose. Built for content creators, marketers, and students who need authentic-sounding copy.',
      challenge: 'The client needed a fast, intuitive web app that could process text in real-time while maintaining a clean, distraction-free interface. Performance was critical — users expect instant results.',
      solution: 'We built a single-page application with a minimal UI focused entirely on the core task. The design uses generous whitespace, clear typography, and a streamlined two-panel layout for input and output.',
      results: 'The platform launched to strong adoption, with users praising the speed and simplicity of the interface. Conversion rates exceeded expectations thanks to the frictionless onboarding flow.'
    },
    'JobLink Antigua': {
      url: 'https://joblinkantigua.com',
      img: 'images/portfolio/joblink.png',
      type: 'Job Board Platform',
      overview: 'JobLink Antigua is the leading job board platform connecting employers and job seekers across Antigua and Barbuda. A full-featured marketplace for local employment.',
      challenge: 'The Caribbean job market lacked a modern, mobile-friendly platform. Existing solutions were outdated and difficult to navigate, leading to low engagement from both employers and candidates.',
      solution: 'We designed and built a responsive job board with advanced search, employer dashboards, and a streamlined application flow. The design reflects the vibrant local culture while maintaining professional credibility.',
      results: 'JobLink became the go-to employment platform in Antigua, with hundreds of active listings and a growing user base of both local and international employers.'
    },
    'Durham Plumber 247': {
      url: 'https://durhamplumber247.com',
      img: 'images/portfolio/durhamplumber.png',
      type: 'Local Service Website',
      overview: 'Durham Plumber 247 is a local plumbing service website designed to convert visitors into booked appointments. Every element is optimized for lead generation.',
      challenge: 'The client needed a website that would rank locally in search results and immediately communicate trust, availability, and professionalism to homeowners in need of emergency plumbing.',
      solution: 'We built a fast-loading, SEO-optimized site with prominent call-to-action buttons, service area maps, and trust signals like reviews and certifications placed above the fold.',
      results: 'The site achieved first-page Google rankings for key local search terms within 8 weeks. Phone inquiries increased significantly, and the client reported a steady stream of new bookings.'
    },
    'PokeRater': {
      url: 'https://pokerater.xyz',
      img: 'images/portfolio/pokerater.png',
      type: 'Interactive Web App',
      overview: 'PokeRater is a fun, interactive web application where users can rate and discover Pokemon. Built as a showcase of modern frontend development with engaging UI interactions.',
      challenge: 'The project needed to balance playful, game-inspired aesthetics with smooth performance and intuitive navigation across a large dataset of characters.',
      solution: 'We created a visually rich interface with card-based layouts, smooth transitions, and an addictive rating mechanic. The app loads quickly despite the large image library thanks to lazy loading and optimization.',
      results: 'The app gained traction in the Pokemon community with users spending significant time exploring and rating. It demonstrates our ability to build engaging, interactive experiences.'
    }
  };

  // Generic case study for non-client projects
  var genericStudy = {
    overview: 'A showcase project demonstrating our ability to design and develop high-quality digital experiences across different industries and use cases.',
    challenge: 'Each project presented unique design and technical challenges that required creative problem-solving and a deep understanding of the target audience.',
    solution: 'We delivered a polished, responsive website with modern design principles, optimized performance, and a seamless user experience across all devices.',
    results: 'The project was delivered on time and exceeded client expectations, resulting in measurable improvements in engagement and conversion metrics.'
  };

  $(document).on('click', '.liquid-card-inner', function () {
    var title = $(this).find('.liquid-card-title').text();
    var desc = $(this).find('.liquid-card-desc').text();
    var imgSrc = $(this).find('.liquid-card-img img').attr('src');
    var study = caseStudies[title] || null;

    var html = '';
    if (study) {
      html = '<h1>' + title + '</h1>' +
        '<span class="cs-type">' + study.type + '</span>' +
        '<img class="cs-hero-img" src="' + study.img + '" alt="' + title + '">' +
        '<h2>Overview</h2><p>' + study.overview + '</p>' +
        '<h2>The Challenge</h2><p>' + study.challenge + '</p>' +
        '<h2>Our Solution</h2><p>' + study.solution + '</p>' +
        '<h2>Results</h2><p>' + study.results + '</p>' +
        '<a class="cs-visit" href="' + study.url + '" target="_blank">Visit Live Site &rarr;</a>';
    } else {
      html = '<h1>' + title + '</h1>' +
        '<span class="cs-type">' + desc + '</span>' +
        '<img class="cs-hero-img" src="' + imgSrc + '" alt="' + title + '">' +
        '<h2>Overview</h2><p>' + genericStudy.overview + '</p>' +
        '<h2>The Challenge</h2><p>' + genericStudy.challenge + '</p>' +
        '<h2>Our Solution</h2><p>' + genericStudy.solution + '</p>' +
        '<h2>Results</h2><p>' + genericStudy.results + '</p>';
    }

    $('#case-study-content').html(html);
    $('#case-study-overlay').addClass('active');
    $('body').css('overflow', 'hidden');
  });

  $('#case-study-close').on('click', function () {
    $('#case-study-overlay').removeClass('active');
    $('body').css('overflow', '');
  });

  $(document).on('keydown', function (e) {
    if (e.key === 'Escape' && $('#case-study-overlay').hasClass('active')) {
      $('#case-study-overlay').removeClass('active');
      $('body').css('overflow', '');
    }
  });

});
