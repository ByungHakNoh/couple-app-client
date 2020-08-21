export default class Router {
  constructor() {
    this.routes = []
    window.addEventListener('hashchange', this.onHashChange)
    window.addEventListener('DOMContentLoaded', this.onHashChange) // TODO : 필요한지 확인하기
  }

  // 라우트를 추가할 때 페이지 경로와 콜백함수를 저장
  addRoute = (path, callback) => {
    this.routes.push({ path, callback })
  }

  // TODO : 사용하지 않음 -> request가 있는 get url 때 사용해야할 거 같다
  clearSlashes = path => {
    return path.toString().replace('?', '').replace(/^\?/, '')
  }

  // hash가 변했을 때 사용하는 콜백 메소드
  onHashChange = () => {
    const hash = window.location.hash

    // hash 존재 여부에 따라 홈페이지인지 아닌지를 결정
    if (hash) {
      const route = this.routes.find(route => {
        if (route.path != '') return hash.match(route.path)
      })

      if (route) {
        return route.callback() // url과 라우트 path가 일치한다면 라우트 콜백함수 실행
      } else {
        this.emptyPage() // url과 라우트가 일치하지 않으면 커스텀 제작한 404 페이지 보여주기
      }
    } else {
      return this.routes.find(route => {
        if (route.path == '') return route.callback() // 홈페이지인 경우
      })
    }
  }

  emptyPage = () => {
    const header = document.querySelector('#header')
    const main = document.querySelector('#main')
    const footer = document.querySelector('#footer')

    this.removeAllChild(header)
    this.removeAllChild(main)
    this.removeAllChild(footer)

    const h1TagNotFound = document.createElement('h1')
    const pTagDescription = document.createElement('p')
    h1TagNotFound.innerHTML = 'Not Found'
    pTagDescription.innerHTML = 'The requested URL was not found on this server.'
    main.append(h1TagNotFound, pTagDescription)
  }

  removeAllChild = element => {
    while (element.hasChildNodes()) element.removeChild(element.firstChild)
  }
}
