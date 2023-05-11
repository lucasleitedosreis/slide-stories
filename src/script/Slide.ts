import Timeout from "./Timeout.js";

export default class Slide {
  container: Element;
  slides: Element[];
  controls: Element;
  time: number;
  index: number;
  slide: Element;
  timeout: Timeout | null;
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

    this.timeout = null;
    this.index = 0;
    this.slide = this.slides[this.index];
    this.init();
  }
  //----------------------------------------------------
  //remove a classe active através do index
  hide(el: Element) {
    el.classList.remove("active");
  }
  //----------------------------------------------------
  //index dos slides
  //adiciona a classe active
  //armazena o index
  //armazena o slid atual
  show(index: number) {
    this.index = index;
    this.slide = this.slides[this.index];
    this.slides.forEach((el) => {
      this.hide(el);
    });
    this.slide.classList.add("active");
    this.auto(this.time);
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
    const prev = this.index > 0 ? this.index - 1 : this.slides.length - 1;
    this.show(prev);
  }
  //----------------------------------------------------
  //Método dos botões avançar
  next() {
    //ternário para avançar slide
    const next = this.index + 1 < this.slides.length ? this.index + 1 : 0;
    this.show(next);
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
    //chama os métodos
    prevButton.addEventListener("pointerup", () => this.prev());
    nextButton.addEventListener("pointerup", () => this.next());
  }

  private init() {
    this.addCOntrols();
    this.show(this.index);
  }
}
