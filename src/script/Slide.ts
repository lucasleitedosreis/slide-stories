import Timeout from "./Timeout.js";

export default class Slide {
  container: Element;
  slides: Element[];
  controls: Element;
  time: number;
  index: number;
  slide: Element;
  timeout: Timeout | null;
  pausedTimeout: Timeout | null;
  paused: boolean;
  constructor(
    container: Element,
    slides: Element[],
    controls: Element,
    time: number = 3000
  ) {
    this.container = container;
    this.slides = slides;
    this.controls = controls;
    this.time = time;

    this.pausedTimeout = null;
    this.paused = false;
    this.timeout = null;
    this.index = localStorage.getItem("activeSlide")
      ? Number(localStorage.getItem("activeSlide"))
      : 0;
    this.slide = this.slides[this.index];
    this.init();
  }
  //----------------------------------------------------
  //remove a classe active através do index
  hide(el: Element) {
    el.classList.remove("active");
    if (el instanceof HTMLVideoElement) {
      el.currentTime = 0;
      el.pause();
    }
  }
  //----------------------------------------------------
  //index dos slides
  //adiciona a classe active
  //armazena o index
  //armazena o slid atual
  show(index: number) {
    this.index = index;
    this.slide = this.slides[this.index];
    localStorage.setItem("activeSlide", String(index));
    this.slides.forEach((el) => {
      this.hide(el);
    });
    this.slide.classList.add("active");
    if (this.slide instanceof HTMLVideoElement) {
      this.autoVideo(this.slide);
    } else {
      this.auto(this.time);
    }
  }
  autoVideo(video: HTMLVideoElement) {
    let firstPlay = true;
    video.muted = true;
    video.play();
    video.addEventListener("playing", () => {
      if (firstPlay) this.auto(video.duration * 1000);
      firstPlay = false;
    });
  }
  //----------------------------------------------------
  //Métodos para slides avançarem automaticamente
  auto(time: number) {
    this.timeout?.clear();
    this.timeout = new Timeout(() => this.next(), time);
  }
  //----------------------------------------------------
  //Método dos botões voltar e avançar
  prev() {
    //ternário para voltar slide
    if (this.paused) return;
    const prev = this.index > 0 ? this.index - 1 : this.slides.length - 1;
    this.show(prev);
  }
  //----------------------------------------------------
  //Método dos botões avançar
  next() {
    //ternário para avançar slide
    if (this.paused) return;
    const next = this.index + 1 < this.slides.length ? this.index + 1 : 0;
    this.show(next);
  }
  //----------------------------------------------------
  //Método para pausar slides
  pause() {
    this.pausedTimeout = new Timeout(() => {
      this.timeout?.pause();
      this.paused = true;
      if (this.slide instanceof HTMLVideoElement) this.slide.pause();
    }, 300);
  }
  //----------------------------------------------------
  //Método para pausar slides
  continue() {
    this.pausedTimeout?.clear();
    if (this.paused) {
      this.paused = false;
      this.timeout?.continue();
      if (this.slide instanceof HTMLVideoElement) this.slide.play();
    }
  }

  //----------------------------------------------------
  private addCOntrols() {
    //criando os botões de controle
    const prevButton = document.createElement("button");
    const nextButton = document.createElement("button");
    prevButton.innerText = "Slide anterior";
    nextButton.innerText = "Próximo slide";
    //adicionando os botões de controle
    this.controls.appendChild(prevButton);
    this.controls.appendChild(nextButton);

    //Usando a arrow function não precisa fazer o bind
    //Ativa os métodos ao clicar nos botões voltar e avançar
    prevButton.addEventListener("pointerup", () => this.prev());
    nextButton.addEventListener("pointerup", () => this.next());

    //----------------------------------------------------
    //Ativa o método pause ao clicar e segurar
    this.controls.addEventListener("pointerdown", () => this.pause());
    //----------------------------------------------------

    //Ativa o método pause ao clicar e segurar
    this.controls.addEventListener("pointerup", () => this.continue());
  }

  private init() {
    this.addCOntrols();
    this.show(this.index);
  }
}
