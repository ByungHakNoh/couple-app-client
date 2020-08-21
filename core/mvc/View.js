export default class View {
  constructor() {
    this.header = this.getElement('#header')
    this.main = this.getElement('#main')
    this.footer = this.getElement('#footer')
    this.navigation = this.createElement('nav', 'header__navigation') // header 네비게이션 바
  }

  // footer를 제외한 header와 main의 children tag를 모두 지운다
  refreshTemplate = () => {
    this.removeAllChild(this.header)
    this.removeAllChild(this.main)
    this.removeAllChild(this.footer)
  }

  // 메인으로 사용하는 header를 템플릿 생성
  createDefaultHeader = () => {
    const homeLogo = this.createATagElement('header__link link--home', '#/home', 'Couple App', 'label', 'header__logo')
    const ulTag = this.createElement('ul', 'header__list')
    const homeMenu = this.createATagElement('header__link link--navigation', '#/home', 'Home', 'li', 'header__item')
    const myPageMenu = this.createATagElement('header__link link--navigation', '#/my-page', 'My Page', 'li', 'header__item')
    const logoutMenu = this.createATagElement('header__link link--navigation', '', 'LogOut', 'li', 'header__item')

    ulTag.append(homeMenu, myPageMenu, logoutMenu)
    this.navigation.append(homeLogo, ulTag)

    this.header.append(this.navigation)
  }

  // 메인으로 사용하는 footer를 템플릿 생성
  createDefaultFooter = () => {
    const pTagcopyright = this.createElement('p', 'footer__copyright')
    pTagcopyright.innerHTML = 'copyright@2020 private project powered by ByungHak Noh'
    this.footer.append(pTagcopyright)
  }

  // root의 자식 노드를 모두 없애는 메소드 -> SPA가 아니면 사용하지 않을 것 같다
  removeAllChild = element => {
    while (element.hasChildNodes()) element.removeChild(element.firstChild)
  }

  // view element를 querySelector를 이용해서 가져오는 메소드
  getElement = selector => {
    const element = document.querySelector(selector)
    return element
  }

  // 여러 view element를 가져오는 메소드
  getMultipleElements = selector => {
    const elements = document.querySelectorAll(selector)
    return elements
  }

  // 가장 기본적인 view element를 만드는 메소드 (클래스 이름을 기본적으로)
  createElement = (tag, className, id) => {
    const element = document.createElement(tag)
    if (className) element.className = className
    if (id) element.id = id
    return element
  }

  createTextElement = (tag, className, innerHTML) => {
    const textElement = document.createElement(tag)
    if (className) textElement.className = className
    if (innerHTML) textElement.innerHTML = innerHTML
    return textElement
  }

  // input(type) - submit을 제외한 input을 생성할 때 사용하는 메소드
  createInputElement = (className, type, name, placeholder, value) => {
    const inputTag = document.createElement('input')
    inputTag.type = type
    inputTag.name = name
    if (placeholder) inputTag.placeholder = placeholder
    if (className) inputTag.className = className
    if (value) inputTag.value = value
    return inputTag
  }

  // input(type) - submit을 생성할 때 사용
  createSubmitElement = (className, value) => {
    const submitTag = document.createElement('input')
    submitTag.type = 'submit'
    submitTag.value = value
    if (className) submitTag.className = className
    return submitTag
  }

  createBtnElement = (className, innerHTML) => {
    const buttonTag = document.createElement('button')
    if (innerHTML) buttonTag.innerHTML = innerHTML
    if (className) buttonTag.className = className
    return buttonTag
  }

  // a 태그는 li 태그나 다른 태그들로 감싸는 경우가 많아 파라미터에 containerTag 추가
  createATagElement = (className, href, innerHTML, containerTag, containerClassName) => {
    const aTag = document.createElement('a')
    aTag.href = href
    if (innerHTML) aTag.innerHTML = innerHTML
    if (className) aTag.className = className
    // 컨테이너 태그가 선언되어 있다면
    if (containerTag) {
      const container = document.createElement(containerTag)
      container.append(aTag)
      if (containerClassName) container.className = containerClassName
      return container
    }
    return aTag
  }

  createImgElement = (className, src, alt) => {
    const imgTag = document.createElement('img')
    if (src) imgTag.src = src
    if (alt) imgTag.alt = alt
    if (className) imgTag.className = className
    return imgTag
  }
}
