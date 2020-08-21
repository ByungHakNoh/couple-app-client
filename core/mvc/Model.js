export default class Model {
  //TODO: 예시 지우기
  // ?what=getStoryData&&coupleID=39&&page=1
  constructor() {
    this.serverUrl = 'https://couple-app.tk/'
    this.responseCode = null
  }

  // 서버와 통신하는 메소드 : GET, POST, PUT, DELETE의 메소드에 따라 request 가능
  // 만약 data가 비어있다면 header에는 빈 객체를 전송 -> GET 메소드에 사용
  senHttpRequest = async (method, url, data) => {
    const response = await fetch(url, {
      method: method,
      headers: data ? { 'Content-Type': 'application/json' } : {},
      body: JSON.stringify(data),
    }).catch(error => console.error(`senHttpRequest : ${error}`)) // 에러 생겼을 때 에러 로그 출력
    // console.log(response.text())
    // 서버에서 반환한 responseCode를 저장
    this.responseCode = response.status
    // 서버에서 반화하는 데이터가 없으면 바로 return
    if (response.statusText == 'No Content') return console.log('Model : 서버에서 반환하는 데이터가 없음')
    // 서버에서 fetch한 데이터가 있다면 데이터를 json으로 변환하여 반환
    return response.json()
  }

  // GET request : 요청하는 페이지와 요청 정보를 파라미터로 받는다 -> 명확하게 분리하여 혼동되지 않도록
  getRequest = async (page, request) => {
    return await this.senHttpRequest('GET', this.serverUrl + page + request)
  }

  postReqeust = async (page, data) => {
    return await this.senHttpRequest('POST', this.serverUrl + page, data)
  }

  putReqeust = async (page, data) => {
    return await this.senHttpRequest('PUT', this.serverUrl + page, data)
  }

  deleteReqeust = async (page, data) => {
    return await this.senHttpRequest('DELETE', this.serverUrl + page, data)
  }
}
