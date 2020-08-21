import Model from '../../core/mvc/Model.js'

export default class PageModel extends Model {
  constructor() {
    super()
  }

  // ------------------------------------------------ 메인 페이지 - SignIn page ------------------------------------------------
  /* 
    로그인 실패 : response에 데이터가 없거나 responsecode가 204(데이터가 없다는 status)를 가리키면 status를 return 
    로그인 성공 : 세션에 사용자 정보를 저장하고 status 200을 반환
    */
  signIn = async data => {
    return await this.postReqeust('SignIn', data).then(response => {
      if (!response || this.responseCode == 204) return this.responseCode

      if (response['is_admin'] == 1) {
        sessionStorage.setItem('isAdmin', true)
      } else {
        sessionStorage.setItem('coupleId', response['couple_column_id'])
        sessionStorage.setItem('userId', response['id'])
        sessionStorage.setItem('email', response['email'])
        sessionStorage.setItem('profileImageUrl', response['profile_image'])
        sessionStorage.setItem('name', response['name'])
        sessionStorage.setItem('status', response['state_message'])
        sessionStorage.setItem('birthday', response['birthday'])
        sessionStorage.setItem('sex', response['sex'])
      }
      return this.responseCode
    })
  }

  // 방문 날짜를 서버에 보내는 메소드(방문자)
  //방문 날짜 : 현재 날짜를 서버에 보낸다
  postVisitedDay = async () => {
    const visitedDate = new Date()
    visitedDate.setHours(0)
    visitedDate.setMinutes(0)
    visitedDate.setSeconds(0)
    visitedDate.setMilliseconds(0)

    const postData = { what: 'uploadVisitedDay', visitedDate: visitedDate }
    return await this.postReqeust('Admin', postData).then(() => {
      return this.responseCode
    })
  }

  // 접속 ip를 통해 유저의 위치 정보를 서버에 보낸다. (관리자 페이지에서 사용)
  postUserLocation = async () => {
    return await fetch('http://ip-api.com/json?fields=status,message,continent,lat,lon')
      .then(response => {
        return response.json()
      })
      .then(async userAccessData => {
        const latitude = userAccessData['lat'].toFixed(1)
        const longitude = userAccessData['lon'].toFixed(1)
        const continent = userAccessData['continent']
        const postData = { what: 'uploadUserCountry', latitude: latitude, longitude: longitude, continent: continent }

        return await this.postReqeust('Admin', postData).then(() => {
          return this.responseCode
        })
      })
      .catch(error => console.error(`uploadUserIPData : 외부 사이트에서 나라 정보 얻는데 실패함 ${error}`))
  }

  // userAgent를 서버로 보내 유저가 사용하는 브라우저를 저장하는 메소드
  postUserBrowser = async () => {
    const postData = { what: 'uploadUserBrowser', userAgent: navigator.userAgent }
    return await this.postReqeust('Admin', postData).then(() => {
      return this.responseCode
    })
  }
  // ------------------------------------------------ 마이 페이지 - my page ------------------------------------------------

  // ------------------------------------------------ 프로필 수정 페이지 - modify profile page ------------------------------------------------
  // 프로필 수정하는 메소드
  modifyProfile = async (imageUrl, name, status, birthday, sex) => {
    const putData = { id: sessionStorage.getItem('userId'), profile_image: imageUrl, name: name, state_message: status, birthday: birthday, sex: sex }
    return await this.putReqeust('ModifyProfile', putData).then(response => {
      if (!response || !this.responseCode == 200) return console.error('modifyProfile : 서버에 데이터가 없거나 에러발생')

      sessionStorage.setItem('profileImageUrl', response['profile_image'])
      sessionStorage.setItem('name', response['name'])
      sessionStorage.setItem('status', response['state_message'])
      sessionStorage.setItem('birthday', response['birthday'])
      sessionStorage.setItem('sex', response['sex'])
      return this.responseCode
    })
  }

  // ------------------------------------------------ 관리자 페이지 - admin page ------------------------------------------------
  // 데이터 변형이 필요없는 쿼리이면 다음 메소드 사용
  getDefaultAdminData = async requestData => {
    return await this.getRequest('Admin', requestData).then(response => {
      if (!response || this.responseCode == 204) return console.error('getAdminData : 서버에 데이터가 없거나 에러발생')
      return response
    })
  }

  // 방문자 데이터는 시간을 데이트 포맷으로 변형해야 하기 때문에 다음 메소드 사용
  getMonthlyVisitors = async requestData => {
    return await this.getRequest('Admin', requestData).then(response => {
      if (!response || this.responseCode == 204) return console.error('getAdminData : 서버에 데이터가 없거나 에러발생')
      const monthlyVisitors = response

      monthlyVisitors.forEach(data => {
        data.visitorsCount = +data.visitorsCount // String을 number 타입으로 변경
        data.timeStamp = new Date(data.timeStamp) // String을 js 시간 포맷을 변경
      })
      return monthlyVisitors
    })
  }

  // ------------------------------------------------ 홈 페이지 - home 관련 로직 ------------------------------------------------
  // 홈 스토리 데이터 가져오는 메소드
  getStoryData = async requestData => {
    return await this.getRequest('', requestData).then(response => {
      if (!response || this.responseCode == 204) return this.responseCode
      return response
    })
  }

  // aside 태그(우측 상단) 커플 프로필 정보 가져오는 메소드
  getCoupleProfile = async requestData => {
    return await this.getRequest('', requestData).then(response => {
      if (!response || this.responseCode == 204) return this.responseCode
      return response
    })
  }

  deleteStoryData = async storyId => {
    const deleteData = { what: 'deleteStory', storyID: storyId, itemPosition: true }
    return await this.deleteReqeust('', deleteData).then(() => {
      return this.responseCode
    })
  }

  // ------------------------------------------------ 스토리 추가 OR 수정 관련 로직 ------------------------------------------------
  // 스토리 추가 시
  uploadStoryData = async (imageList, title, description, date) => {
    const postData = { what: 'addStoryData', couple_id: sessionStorage.getItem('coupleId'), photo_path: imageList, title: title, description: description, date: date }
    return await this.postReqeust('StoryAdd', postData).then(() => {
      return this.responseCode
    })
  }

  // 스토리 수정 시
  updateStoryData = async (storyId, imageList, title, description, date) => {
    const putData = {
      what: 'modifyStoryData',
      id: storyId,
      couple_id: sessionStorage.getItem('coupleId'),
      photo_path: imageList,
      title: title,
      description: description,
      date: date,
    }
    return await this.putReqeust('StoryAdd', putData).then(() => {
      return this.responseCode
    })
  }
}
