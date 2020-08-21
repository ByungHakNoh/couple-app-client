import Controller from '../../core/mvc/Controller.js'
import PageModel from '../model/PageModel.js'
import PageView from '../view/PageView.js'

export default class PageController extends Controller {
  constructor() {
    super()
    this.model = new PageModel()
    this.view = new PageView()
  }
  // ---------------- 페이지 실행관련 메소드 메소드 ----------------

  // -- 유저 관련 페이지 모음 --
  // 로그인 페이지
  signIn = () => {
    sessionStorage.clear()
    this.view.showTemplate('signIn')
    this.setSignInListener()
    this.uploadVisitedDay()
    this.uploadUserLocation()
    this.uploadUserBrowser()
    console.log(window.location.href)
  }

  addStory = () => {
    this.view.showTemplate('addStory')
    this.setUpsertStoryListener()
  }

  modifyStory = () => {
    this.view.showTemplate('addStory')
    this.setInitModifyStory()
    this.setUpsertStoryListener()
  }

  // 마이 페이지 : 프로필 보여주는 페이지
  myPage = () => {
    this.view.showTemplate('myPage')
    this.setMyPageListener()
  }

  // 프로필 수정 페이지 : 프로필 수정하는 페이지
  editProfile = () => {
    this.view.showTemplate('editProfile')
    this.setEditProfileInitValue()
    this.setEditProfileListener()
  }

  // 관리자 페이지
  admin = () => {
    this.view.showTemplate('admin')
    this.buildAllCharts()
    this.setAdminListener()
  }

  // -- 홈 관련 페이지 --
  // 홈 페이지 : 스토리 보여주는 페이지
  home = () => {
    this.storyPage = 0
    this.storyId = null
    this.selectedStoryItem = null
    this.view.showTemplate('home')
    this.setCoupleProfile()
    this.setHomeListener()
    this.setHomeObserver()
  }

  // ------------------------------------------------ SignIn(메인) 페이지 관련 메소드 ------------------------------------------------
  setSignInListener = () => {
    this.view.getElement('.signin__form').addEventListener('submit', this.handleSignInListener)
  }

  handleSignInListener = event => {
    switch (event.target.classList[1]) {
      case 'form--Signin':
        event.preventDefault() // form 이벤트 막기
        const email = this.view.getElement('[name="email"]').value
        const password = this.view.getElement('[name="password"]').value

        if (!email || !password) return console.log('TODO : 이메일, 비밀번호 예외처리')

        const data = { what: 'signIn', email: email, password: password, firebaseMessagingToken: null }

        this.model.signIn(data).then(responseCode => {
          if (responseCode == 204) return (this.view.getElement('#failed-alert').hidden = false)
          if (responseCode == 200) {
            if (sessionStorage.getItem('isAdmin')) return this.navigatePage('#/admin')
            return this.navigatePage('#/home')
          }
        })
        break
    }
  }
  // 방문 날짜 서버에 업로드하는 메소드
  uploadVisitedDay = () => {
    this.model.postVisitedDay().then(response => {
      if (response != 201) console.error('uploadVisitedDay : 서버에서 에러 발생')
    })
  }

  // 방문자의 위치를 서버에 업로드하는 메소드
  uploadUserLocation = async () => {
    this.model.postUserLocation().then(response => {
      console.log(response)

      if (response != 201) console.error('uploadUserLocation : 서버에서 에러 발생')
    })
  }

  // 방문자의 브라우저를 서버에 업로드하는 메소드
  uploadUserBrowser = () => {
    this.model.postUserBrowser().then(response => {
      if (response != 201) console.error('uploadUserBrowser : 서버에서 에러 발생')
    })
  }

  // ------------------------------------------------ admin 페이지 관련 메소드 ------------------------------------------------
  setAdminListener = () => {
    this.view.getElement('.link--sgin-out').addEventListener('click', this.handleAdminListener)
    this.view.getElement('.button--show-all').addEventListener('click', this.handleAdminListener)
    this.view.getElement('.button--monthly-chart').addEventListener('click', this.handleAdminListener)
    this.view.getElement('.button--countries-chart').addEventListener('click', this.handleAdminListener)
    this.view.getElement('.button--browsers-chart').addEventListener('click', this.handleAdminListener)
  }

  handleAdminListener = event => {
    switch (event.target.classList[1]) {
      // 관리자페이지 로그아웃 버튼 : 로그인 페이지로 넘어간다.
      case 'link--sgin-out':
        event.preventDefault()
        this.navigatePage('')
        break

      // 관리자 차트 전체 보여주는 텝
      case 'button--show-all':
        this.refreshAllChart()
        this.buildAllCharts()
        break

      // 월별 차트 텝
      case 'button--monthly-chart':
        this.refreshAllChart()
        this.buildMonthlyVisitors(1.5)
        break

      // 국가별 차트 텝
      case 'button--countries-chart':
        this.refreshAllChart()
        this.buildCountriesChart(1.5)
        break

      // 브라우저 차트 텝
      case 'button--browsers-chart':
        this.refreshAllChart()
        this.buildBrowsersChart(1.5)
        break
    }
  }

  // 다른 텝으로 들어갈 때 차트를 모두 지워주는 메소드
  refreshAllChart = () => {
    const chartBoxes = this.view.getMultipleElements('.chart-box')
    chartBoxes.forEach(element => {
      this.view.removeAllChild(element)
    }) // 각 차트 박스의 모든 element를 삭제
  }

  // 모든 차트를 다 그려주는 메소드
  buildAllCharts = () => {
    this.buildMonthlyVisitors(1)
    this.buildCountriesChart(1)
    this.buildBrowsersChart(1)
  }

  // 월별 차트 빌드
  buildMonthlyVisitors = chartScale => {
    this.model.getMonthlyVisitors(this.makeAdminRequest('getMonthlyVisitors')).then(response => {
      if (response == 204) return console.log('getMonthlyVisitors : 서버에 월별 방문자(차트) 데이터가 없음')
      this.view.buildVisitorsChart(response, chartScale)
    })
  }

  // 국가별 차트 빌드
  buildCountriesChart = chartScale => {
    this.model.getDefaultAdminData(this.makeAdminRequest('getCountriesData')).then(response => {
      if (response == 204) return console.log('getCountriesData : 서버에 국가별(차트) 데이터가 없음')
      this.view.buildCountriesChart(response, chartScale)
    })
  }

  // 브라우저 차트 빌드
  buildBrowsersChart = chartScale => {
    this.model.getDefaultAdminData(this.makeAdminRequest('getBrowsersData')).then(response => {
      if (response == 204) return console.log('getMonthlyVisitors : 서버에 브라우저별(차트) 데이터가 없음')
      this.view.buildBrowsersChart(response, chartScale)
    })
  }

  makeAdminRequest = what => {
    return `?what=${what}`
  }

  // ------------------------------------------------ 마이 페이지 관련 메소드 ------------------------------------------------
  setMyPageListener = () => {
    this.view.getElement('.button--modify-profile').addEventListener('click', this.handleMyPageListener)
  }

  handleMyPageListener = () => {
    // 프로필 수정 버튼 눌렀을 때 수정 페이지로 이동 : 버튼이 늘어나면 switch 구문 사용하기
    this.navigatePage('#/edit-profile')
  }

  // ------------------------------------------------ 프로필 수정 관련 메소드 ------------------------------------------------
  setEditProfileInitValue = () => {
    // 성별 선택 모달 박스 라디오 버튼 초기 버튼 체크
    if (sessionStorage.getItem('sex') == '남자') this.view.getElement('.radio--man').checked = true
    if (sessionStorage.getItem('sex') == '여자') this.view.getElement('.radio--woman').checked = true
  }

  setEditProfileListener = () => {
    this.view.getElement('.file--modify-photo').addEventListener('change', this.handleEditProfileListener)
    this.view.getElement('.form--edit-profile').addEventListener('submit', this.handleEditProfileListener)
    this.view.getElement('.button--modify-photo').addEventListener('click', this.handleEditProfileListener)
    this.view.getElement('.edit--sex').addEventListener('click', this.handleEditProfileListener)
    this.view.getElement('.btn--close').addEventListener('click', this.handleEditProfileListener)
    this.view.getElement('.btn--confirm').addEventListener('click', this.handleEditProfileListener)
  }

  handleEditProfileListener = event => {
    switch (event.type) {
      // form submit 시 사용 -> 프로필 수정한 데이터 서버로 보내는 메소드
      case 'submit':
        event.preventDefault()
        const imageUrl = this.view.getElement('.eidt-photo-box__photo').src
        const name = this.view.getElement('.edit--name').value
        const status = this.view.getElement('.edit--status').value
        const birthday = new Date(this.view.getElement('.date--birthday').value).getTime()
        const sex = this.view.getElement('.edit--sex').innerHTML

        this.model.modifyProfile(imageUrl, name, status, birthday, sex).then(response => {
          if (response != 200) return console.error('modifyProfile : 서버에서 에러 발생')
          this.navigatePage('#/my-page')
        })
        break

      // 새로운 프로필 이미지로 변경 됬을 때 -> 이미지 소스 base64로 변환
      case 'change':
        const file = this.view.getElement('.file--modify-photo').files[0]
        if (file) {
          const fileReader = new FileReader()
          fileReader.addEventListener('load', () => {
            console.log(this.view.getElement('.eidt-photo-box__photo'))

            this.view.getElement('.eidt-photo-box__photo').src = fileReader.result
          })
          fileReader.readAsDataURL(file)
        }
        break

      // 버튼 클릭 시 사용
      case 'click':
        switch (event.target.classList[1]) {
          // 프로필 이미지 수정 버튼
          case 'button--modify-photo':
            this.view.getElement('.file--modify-photo').click() // 프로필 수정 버튼 클릭 -> 숨겨진 input-file 작동
            break

          // 성별 수정 버튼
          case 'edit--sex':
            event.preventDefault() // form 내부 버튼은 submit으로 인식
            this.handleEditProfileModal(true)
            break

          // 모달 닫기 버튼
          case 'btn--close':
            this.handleEditProfileModal(false)
            break

          // 확인 버튼 누르면 : 라디오 버튼 텍스트를 성별 버튼의 innerHTML 변경
          case 'btn--confirm':
            const manRadioBtn = this.view.getElement('.radio--man')
            const womanRadioBtn = this.view.getElement('.radio--woman')

            if (manRadioBtn.checked) this.view.getElement('.edit--sex').innerHTML = manRadioBtn.value
            if (womanRadioBtn.checked) this.view.getElement('.edit--sex').innerHTML = womanRadioBtn.value

            this.handleEditProfileModal(false)
            break
        }
        break
    }
  }
  // 성별 선택하는 모달을 보여줄지 말지를 결정하는 메소드
  handleEditProfileModal = isOpened => {
    if (isOpened) {
      this.view.getElement('.modal--sex-choice').classList.add('active')
      this.view.getElement('.modal-overlay').classList.add('active')
    } else {
      this.view.getElement('.modal--sex-choice').classList.remove('active')
      this.view.getElement('.modal-overlay').classList.remove('active')
    }
  }

  // ------------------------------------------------ 홈 페이지 관련 메소드 ------------------------------------------------
  setHomeListener = () => {
    this.view.getElement('.btn--modify').addEventListener('click', this.handleHomeListener)
    this.view.getElement('.btn--delete').addEventListener('click', this.handleHomeListener)
    this.view.getElement('.btn--cancel').addEventListener('click', this.handleHomeListener)
  }

  setHomeObserver = () => {
    const options = {
      root: null,
      rootMargins: '0px',
      threshold: 0,
    }
    const observer = new IntersectionObserver(this.handleIntersect, options)
    observer.observe(this.view.getElement('.home-intersector'))
  }

  handleHomeListener = event => {
    switch (event.target.classList[1]) {
      case 'btn--modify':
        const modifyStoryArticle = this.selectedStoryItem
        const storyPhotoBox = modifyStoryArticle.childNodes[1].childNodes
        const dateText = modifyStoryArticle.childNodes[3].childNodes[0].innerHTML

        const title = modifyStoryArticle.childNodes[0].childNodes[1].innerHTML
        const dateTimeInMills = new Date(dateText).getTime()
        const description = modifyStoryArticle.childNodes[3].childNodes[1].innerHTML
        const storyPhotoList = []

        storyPhotoBox.forEach(element => {
          storyPhotoList.push(element.src)
        })

        const storyData = {
          id: this.storyId,
          title: title,
          date: dateTimeInMills,
          description: description,
          storyPhotoList: storyPhotoList,
        }

        sessionStorage.setItem('modifyStoryData', JSON.stringify(storyData))
        this.navigatePage('#/modify-story')
        break

      case 'btn--delete':
        const deletedStoryId = this.storyId
        const deletedStoryArticle = this.selectedStoryItem

        this.model.deleteStoryData(deletedStoryId).then(response => {
          if (response == 200) {
            deletedStoryArticle.remove()
            this.handleHomeModal(false)
          }
        })
        break

      case 'btn--cancel':
        this.handleHomeModal(false)
        break
    }
  }

  // 스토리 아이템과 같이 동적으로 추가되는 리스너는 view에서 달아준다 -> interface와 비슷한 원리
  handleHomeItemListener = event => {
    switch (event.target.classList[1]) {
      case 'btn--more':
        console.log('what')

        const storyArticle = event.target.parentNode.parentNode // 스토리 정보를 담고 있는 article tag

        this.selectedStoryItem = storyArticle // 삭제 시 선택한 태그의 아이템 포지션
        this.storyId = storyArticle.data // 스토리 article 태그에는 스토리 id 저장되어 있다
        this.handleHomeModal(true)
        break

      case 'button--previous': // 이전 버튼
        this.controlImageSlide('previous')
        break

      case 'button--next': // 다음 버튼
        this.controlImageSlide('next')
        break
    }
  }

  // TODO : 물어보기 왜 메소드로는 에러가 뜨는지...
  /* 
    MEMO : observe하는 element가 보이면 콜백 메소드가 실행되고 파라미터로 entries를 전달.
    enbtries의 proto 속성 중 isIntersecting이 있는데, 이 속성으로 intersecting 여부를 판단.
    따라서 element가 보일 때, 사라질 때 총 두번 콜백메소드가 실행되는데 그 중 isIntersecting이 true인 경우에만 데이터 불러오기
    */
  handleIntersect = entries => {
    if (entries[0].isIntersecting) this.handleStory(this.storyPage)
  }

  // 모델에게 스토리 데이터 쿼리를 요청 -> 서버에 데이터가 있으면 뷰에 새로운 item 추가를 요청
  handleStory = storyPage => {
    this.model.getStoryData(this.makeHomeRequest('getStoryData', storyPage)).then(response => {
      if (response == 204) return console.log('handleStoryData : 스토리 데이터가 없음')
      this.view.addStoryItem(response, this.handleHomeItemListener)
      this.storyPage++
      console.log(response)
    })
  }

  // 모델에게 커플 프로필 데이터를 요청 -> 서버에 데이터가 있으면 뷰에 커플 프로필 생성을 요청
  setCoupleProfile = () => {
    this.model.getCoupleProfile(this.makeHomeRequest('getCoupleProfile')).then(response => {
      if (response == 204) return console.log('handleCoupleProfile : 스토리 데이터가 없음')
      this.view.setCoupleProfile(response)
      console.log(response)
    })
  }

  handleHomeModal = isOpened => {
    if (isOpened) {
      this.view.getElement('.modal--home-story').classList.add('active')
      this.view.getElement('.modal-overlay').classList.add('active')
    } else {
      this.view.getElement('.modal--home-story').classList.remove('active')
      this.view.getElement('.modal-overlay').classList.remove('active')
    }
  }

  // 스토리 아이템 이미지 넘기는 메소드
  controlImageSlide = pressedBtn => {
    const storyArticle = event.target.parentNode.parentNode // figure Tag
    const imageContainer = storyArticle.childNodes[1]
    const pTagImageCount = storyArticle.childNodes[2] // p Tag : 현재 보여지는 이미지 index를 data에 담고 있음
    const imageSize = imageContainer.childNodes[0].clientWidth
    const totalImageCount = imageContainer.data // figure Tag에 저장되어 있는 data(total image 갯수)

    // 이전 버튼인지 다음 버튼인지에 따라 다르게 반응
    switch (pressedBtn) {
      case 'previous':
        pTagImageCount.data--
        if (pTagImageCount.data < 0) pTagImageCount.data = totalImageCount - 1 // 만약 처음 이미지이면, 마지막 이미지로 넘어감
        break

      case 'next':
        pTagImageCount.data++
        if (pTagImageCount.data == totalImageCount) pTagImageCount.data = 0 // 만약 마지막 이미지이면, 처음 이미지로 넘어감
        break
    }
    imageContainer.style.transition = 'transform 0.4s ease-in-out' // 부드럽게 넘기는 스타일
    imageContainer.style.transform = `translateX(${-imageSize * pTagImageCount.data}px)`
    pTagImageCount.innerHTML = `${pTagImageCount.data + 1} / ${totalImageCount}`
  }

  // GET request를 만들어주는 메소드
  makeHomeRequest = (what, page) => {
    if (what == 'getStoryData') return `?what=${what}&&coupleID=${sessionStorage.getItem('coupleId')}&&page=${page}`
    if (what == 'getCoupleProfile') return `Story?what=${what}&&coupleID=${sessionStorage.getItem('coupleId')}`
  }

  // ------------------------------------------------ 스토리 추가 OR 수정 페이지 관련 메소드 ------------------------------------------------
  setUpsertStoryListener = () => {
    this.view.getElement('.btn--image').addEventListener('click', this.handleUpsertStoryListener)
    this.view.getElement('.btn--image-delete').addEventListener('click', this.handleUpsertStoryListener)
    this.view.getElement('.btn--submit').addEventListener('click', this.handleUpsertStoryListener)
    this.view.getElement('.file--image').addEventListener('change', this.handleUpsertStoryListener)
  }

  // 스토리 수정할 데이터 쿼리하는 메소드
  setInitModifyStory = () => {
    const storyData = JSON.parse(sessionStorage.getItem('modifyStoryData'))
    this.view.setInitModifyPage(storyData, this.handleUpsertStoryItem)
  }

  handleUpsertStoryListener = event => {
    switch (event.type) {
      case 'change':
        const file = this.view.getElement('.file--image').files[0]
        if (file) {
          const fileReader = new FileReader()
          fileReader.addEventListener('load', () => {
            this.view.addStoryImage(fileReader.result, this.handleUpsertStoryItem)
          })
          fileReader.readAsDataURL(file)
        }
        break

      case 'click':
        switch (event.target.classList[1]) {
          // 이미지를 추가하는 버튼
          case 'btn--image':
            this.view.getElement('.file--image').click()
            break

          // 선택한 이미지 지우는 버튼
          case 'btn--image-delete':
            const storyImageBoxes = this.view.getElement('.add-story__photo-box').childNodes

            storyImageBoxes.forEach(element => {
              if (element.classList.contains('active')) element.remove()
            })
            break

          case 'btn--submit':
            const storyTitle = this.view.getElement('.edit--story-title').value
            const description = this.view.getElement('.edit--description').value
            const date = new Date(this.view.getElement('.add-story__date').value).getTime()
            const imageFigure = this.view.getElement('.add-story__photo-box').childNodes
            const iamgeList = []

            imageFigure.forEach(element => {
              const base64ImageString = element.childNodes[0].src

              if (base64ImageString.includes('base64')) {
                iamgeList.push(base64ImageString.split('base64,')[1])
              } else {
                iamgeList.push(base64ImageString)
              }
            })

            // 스토리 수정 시
            if (event.target.classList[2] == 'modify') {
              const storyId = event.target.data

              this.model.updateStoryData(storyId, iamgeList, storyTitle, description, date).then(response => {
                if (response == 200) return this.navigatePage('#/home')
                return console.error('updateStoryData : 서버에서 에러 발생')
              })
              return
            }
            // 스토리 추가 시
            this.model.uploadStoryData(iamgeList, storyTitle, description, date).then(response => {
              if (response == 200) return this.navigatePage('#/home')
              return console.error('updateStoryData : 서버에서 에러 발생')
            })

            break
        }
        break
    }
  }

  handleUpsertStoryItem = event => {
    switch (event.target.classList[1]) {
      case 'photo--story':
        const storyImageBox = event.target.parentNode
        const selectionIcon = storyImageBox.childNodes[1]

        if (selectionIcon.classList.contains('active')) {
          selectionIcon.classList.remove('active')
          storyImageBox.classList.remove('active')
        } else {
          selectionIcon.classList.add('active')
          storyImageBox.classList.add('active')
        }
        break

      default:
        break
    }
  }
}
