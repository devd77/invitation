/* =========================================================
   ELEMENTS
   ========================================================= */

const intro =
  document.getElementById("intro");

const stage =
  document.getElementById("envelopeStage");

const seal =
  document.getElementById("seal");

const hint =
  document.getElementById("openHint");

const site =
  document.getElementById("site");

const music =
  document.getElementById("music");

const musicBtn =
  document.getElementById("musicBtn");


/* =========================================================
   STATE
   ========================================================= */

let opened = false;

let openingTimer = null;


/* =========================================================
   OPEN INVITATION
   ========================================================= */

function openInvitation(){

  if(opened){
    return;
  }

  opened = true;


  /*
   * Prevent accidental double taps.
   */

  seal.disabled = true;


  /*
   * Start cinematic envelope animation.
   */

  stage.classList.add("opening");


  /*
   * Smoothly hide opening text via CSS transition
   * (Fix 2: No instant snapping/hiding)
   */

  if(hint){
    hint.classList.add("fade-out");
  }


  /*
   * Start music after user interaction.
   */

  music
    .play()
    .then(() => {

      musicBtn.classList.add(
        "playing"
      );

    })
    .catch(() => {

      /*
       * Browser may block autoplay.
       * User can still start it using
       * the music button.
       */

    });


  musicBtn.classList.add(
    "visible"
  );


  /*
   * Wait for the complete envelope
   * choreography.
   */

  openingTimer =
    window.setTimeout(() => {


      /*
       * Show invitation underneath.
       */

      site.classList.add(
        "show"
      );


      /*
       * Hide the envelope stage.
       */

      stage.classList.add(
        "opened"
      );


      /*
       * IMPORTANT:
       *
       * intro is fixed full-screen.
       * Hiding only stage would leave the
       * intro sitting above the invitation.
       */

      intro.classList.add(
        "hide"
      );


      /*
       * Restore normal page scrolling.
       */

      document.body.style.overflowX =
        "hidden";

      document.body.style.overflowY =
        "auto";


      /*
       * Position at the invitation hero.
       */

      window.setTimeout(() => {

        document
          .querySelector(".hero")
          ?.scrollIntoView({
            behavior:"smooth",
            block:"start"
          });

      },140);


    },2200);

}


/* =========================================================
   RESET INVITATION
   ========================================================= */

function resetInvitation(){

  /*
   * Cancel timer.
   */

  window.clearTimeout(
    openingTimer
  );


  opened = false;


  /*
   * Re-enable seal.
   */

  seal.disabled = false;


  /*
   * Reset envelope.
   */

  stage.classList.remove(
    "opening",
    "opened"
  );


  /*
   * Hide invitation.
   */

  site.classList.remove(
    "show"
  );


  /*
   * Bring envelope back.
   */

  intro.classList.remove(
    "hide"
  );


  /*
   * Reset opening hint classes.
   */

  if(hint){
    hint.classList.remove("fade-out");
    hint.style.opacity = "";
    hint.style.pointerEvents = "";
  }


  /*
   * Reset scroll.
   */

  document.body.style.overflowX =
    "hidden";

  document.body.style.overflowY =
    "hidden";


  window.scrollTo(
    0,
    0
  );


  /*
   * Reset music.
   */

  music.pause();

  music.currentTime = 0;

  musicBtn.classList.remove(
    "playing",
    "visible"
  );

}


/* =========================================================
   SEAL & HINT CLICK
   ========================================================= */

seal.addEventListener(
  "click",
  openInvitation
);

if(hint){
  hint.addEventListener(
    "click",
    openInvitation
  );
}


/* =========================================================
   KEYBOARD ACCESSIBILITY
   ========================================================= */

seal.addEventListener(
  "keydown",
  (event) => {

    if(
      event.key === "Enter" ||
      event.key === " "
    ){

      event.preventDefault();

      openInvitation();

    }

  }
);


/* =========================================================
   MUSIC BUTTON
   ========================================================= */

musicBtn.addEventListener(
  "click",
  () => {

    if(music.paused){

      music
        .play()
        .then(() => {

          musicBtn.classList.add(
            "playing"
          );

        })
        .catch(() => {});

    }else{

      music.pause();

      musicBtn.classList.remove(
        "playing"
      );

    }

  }
);


/* =========================================================
   COUNTDOWN
   ========================================================= */

const weddingDate =
  new Date(
    "2026-11-26T18:00:00+05:30"
  ).getTime();


function updateCountdown(){

  const distance =
    weddingDate -
    Date.now();


  const ids = [
    "days",
    "hours",
    "minutes",
    "seconds"
  ];


  if(distance <= 0){

    ids.forEach(
      (id) => {

        const element =
          document.getElementById(id);

        if(element){

          element.textContent =
            "00";

        }

      }
    );

    return;

  }


  const days =
    Math.floor(
      distance /
      86400000
    );


  const hours =
    Math.floor(
      (distance % 86400000) /
      3600000
    );


  const minutes =
    Math.floor(
      (distance % 3600000) /
      60000
    );


  const seconds =
    Math.floor(
      (distance % 60000) /
      1000
    );


  document.getElementById(
    "days"
  ).textContent =
    String(days).padStart(
      2,
      "0"
    );


  document.getElementById(
    "hours"
  ).textContent =
    String(hours).padStart(
      2,
      "0"
    );


  document.getElementById(
    "minutes"
  ).textContent =
    String(minutes).padStart(
      2,
      "0"
    );


  document.getElementById(
    "seconds"
  ).textContent =
    String(seconds).padStart(
      2,
      "0"
    );

}


updateCountdown();


window.setInterval(
  updateCountdown,
  1000
);


/* =========================================================
   SCROLL REVEAL
   ========================================================= */

const observer =
  new IntersectionObserver(
    (entries) => {

      entries.forEach(
        (entry) => {

          if(
            entry.isIntersecting
          ){

            entry.target.classList.add(
              "visible"
            );

          }

        }
      );

    },
    {
      threshold:.12
    }
  );


document
  .querySelectorAll(".reveal")
  .forEach(
    (element) => {

      observer.observe(
        element
      );

    }
  );


/* =========================================================
   FLOATING PETALS (Fix 5: Continuous Falling Animation)
   ========================================================= */

const canvas =
  document.getElementById(
    "petals"
  );


const ctx =
  canvas.getContext(
    "2d"
  );


let particles = [];


/* =========================================================
   CANVAS RESIZE
   ========================================================= */

function resizeCanvas(){

  const ratio =
    Math.min(
      window.devicePixelRatio || 1,
      2
    );


  canvas.width =
    window.innerWidth *
    ratio;

  canvas.height =
    window.innerHeight *
    ratio;


  canvas.style.width =
    window.innerWidth + "px";

  canvas.style.height =
    window.innerHeight + "px";


  ctx.setTransform(
    ratio,
    0,
    0,
    ratio,
    0,
    0
  );

}


resizeCanvas();


window.addEventListener(
  "resize",
  resizeCanvas
);


/* =========================================================
   PETAL CLASS
   ========================================================= */

class Petal{

  constructor(){

    this.reset(true);

  }


  reset(initial=false){

    this.x =
      Math.random() *
      window.innerWidth;


    this.y =
      initial
        ? Math.random() *
          window.innerHeight
        : -25;


    this.size =
      4.5 +
      Math.random() * 5;


    this.speed =
      0.6 +
      Math.random() * 0.85;


    /* Fixed typo: added parenthesis to Math.random() */
    this.drift =
      (Math.random() - 0.5) *
      0.75;


    this.rot =
      Math.random() *
      Math.PI *
      2;


    this.spin =
      (Math.random() - 0.5) *
      0.024;


    this.opacity =
      0.35 +
      Math.random() *
      0.45;


    /* Festive floral shades */
    const palette = [
      "#7d2029",
      "#9e2a3b",
      "#c27d42",
      "#b98a42",
      "#8b1522"
    ];

    this.color =
      palette[Math.floor(Math.random() * palette.length)];

  }


  update(){

    this.y +=
      this.speed;


    this.x +=
      this.drift +
      Math.sin(this.y * 0.008) * 0.35;


    this.rot +=
      this.spin;


    if(
      this.y >
      window.innerHeight + 25 ||
      this.x < -30 ||
      this.x > window.innerWidth + 30
    ){

      this.reset();

    }

  }


  draw(){

    ctx.save();


    ctx.translate(
      this.x,
      this.y
    );


    ctx.rotate(
      this.rot
    );


    ctx.globalAlpha =
      this.opacity;


    ctx.fillStyle =
      this.color;


    ctx.beginPath();


    ctx.ellipse(
      0,
      0,
      this.size * 1.45,
      this.size * 0.72,
      0,
      0,
      Math.PI * 2
    );


    ctx.fill();


    ctx.restore();

  }

}


/* =========================================================
   CREATE PETALS (35 Continuous Petals)
   ========================================================= */

for(
  let i=0;
  i<35;
  i++
){

  particles.push(
    new Petal()
  );

}


/* =========================================================
   ANIMATE PETALS
   ========================================================= */

function animate(){

  ctx.clearRect(
    0,
    0,
    window.innerWidth,
    window.innerHeight
  );


  particles.forEach(
    (petal) => {

      petal.update();

      petal.draw();

    }
  );


  requestAnimationFrame(
    animate
  );

}


animate();


/* =========================================================
   REPLAY
   Press R
   ========================================================= */

window.addEventListener(
  "keydown",
  (event) => {

    if(
      event.key.toLowerCase() === "r"
    ){

      resetInvitation();

    }

  }
);