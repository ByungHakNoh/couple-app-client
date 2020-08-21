export default class Controller {
  constructor() {
    // this.serverUrl = 'https://couple-space.tk/'
    //TODO : 테스트하는 동안 다음 url 사용 시현할 때 고치기
    this.serverUrl = 'http://couple-space.tk:5500/'
  }

  // 다른 페이지로 이동할 때 사용하는 메소드
  // request : default는 비워두는 것으로 설정
  navigatePage = (page, request = '') => {
    window.location.href = this.serverUrl + page + request
  }
}
