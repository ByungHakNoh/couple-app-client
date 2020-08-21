import View from '../../core/mvc/View.js'

export default class PageView extends View {
  constructor() {
    super()
  }

  // 어떤 템플릿을 사용할지에 따라 뷰를 생성 : 메소드가 실행되면 header와 main을 모두 지운다
  showTemplate = whichPage => {
    this.refreshTemplate()
    switch (whichPage) {
      case 'signIn':
        this.createSignInPage()
        break

      case 'myPage':
        this.createMyPage()
        break

      case 'editProfile':
        this.createEditProfile()
        break

      case 'admin':
        this.createAdminPage()
        break

      case 'home':
        this.createHomePage()
        break

      case 'addStory':
        this.createUpsertStoryPage()
        break

      case 'modifyStory':
        this.createUpsertStoryPage()
        break
    }
  }
  // ------------------------------------------------ SignIn(메인) page ------------------------------------------------
  // signin page -> 처음 도메인만 입력했을 때 보여지는 페이지
  createSignInPage = () => {
    const homeLogo = this.createATagElement('header__link link--home', '/', 'Couple App', 'label', 'header__logo')
    this.navigation.append(homeLogo)
    this.header.append(this.navigation)

    // main 부분 elements 생성
    const signInSection = this.createElement('section', 'signin')
    const formSignIn = this.createElement('form', 'signin__form form--Signin')
    const h2Title = this.createElement('h2', 'signin__title')
    const inputEmail = this.createInputElement('signin__input', 'text', 'email', 'email')
    const inputPassword = this.createInputElement('signin__input', 'password', 'password', 'password')
    const smallAlert = this.createElement('small', 'signin__faied-alert', 'failed-alert')
    const submitSignIn = this.createSubmitElement('signin__submit', '로그인')

    h2Title.innerHTML = 'SIGN IN'
    smallAlert.innerHTML = '아이디 혹은 비밀번호를 확인해주세요'
    smallAlert.hidden = true

    formSignIn.append(h2Title, inputEmail, inputPassword, smallAlert, submitSignIn)
    signInSection.append(formSignIn)
    this.main.append(signInSection)
    this.createDefaultFooter()
  }

  createMyPage = () => {
    const dateFormat = new Date(+sessionStorage.getItem('birthday'))
    const birthdayText = `${dateFormat.getFullYear()}-${dateFormat.getMonth() + 1}-${dateFormat.getDate()}`

    this.createDefaultHeader()
    const profileSection = this.createElement('section', 'profile-section')

    // 프로필 이미지
    const profileBox = this.createElement('article', 'profile')
    const photoBox = this.createElement('figure', 'profile-photo-box')
    const profilePhoto = this.createImgElement('profile-photo-box__photo', sessionStorage.getItem('profileImageUrl'), '')

    const baseProfileBox = this.createElement('figcaption', 'profile-photo-box__base-profile-box')
    const baseInfoBox = this.createElement('div', 'profile-photo-box__base-info-box')
    const name = this.createTextElement('h3', 'profile-photo-box__text text--name', sessionStorage.getItem('name'))
    const status = this.createTextElement('h4', 'profile-photo-box__text text--status', sessionStorage.getItem('status'))
    const modifyProfileBtn = this.createBtnElement('profile-photo-box__button button--modify-profile', '프로필 수정')
    baseProfileBox.append(name, status, modifyProfileBtn)
    photoBox.append(profilePhoto, baseProfileBox)

    // 나의 정보 목록
    const myInfoBox = this.createElement('div', 'my-info')
    const myInfoTitle = this.createTextElement('h2', 'my-info__title', '나의 정보')
    const emailNotice = this.createTextElement('h3', 'my-info__notice notice--email', '● 회원 이메일')
    const email = this.createTextElement('h4', 'my-info__text text--email', sessionStorage.getItem('email'))
    const birthdayNotice = this.createTextElement('h3', 'my-info__notice notice--birthday', '● 생일')
    const birthday = this.createTextElement('h4', 'my-info__text text--birthday', birthdayText)
    const sexNotice = this.createTextElement('h3', 'my-info__notice notice--sex', '● 성별')
    const sex = this.createTextElement('h4', 'my-info__text text-sex', sessionStorage.getItem('sex'))
    myInfoBox.append(myInfoTitle, emailNotice, email, birthdayNotice, birthday, sexNotice, sex)

    profileBox.append(photoBox, myInfoBox)
    profileSection.append(profileBox)
    this.main.append(profileSection)

    this.createDefaultFooter()
  }

  // ------------------------------------------------ edit-profile page ------------------------------------------------
  createEditProfile = () => {
    this.createDefaultHeader()

    // 메인 view 생성하기
    const profileSection = this.createElement('section', 'edit-profile-section')

    const pageTitleBox = this.createElement('div', 'edit-page-title')
    const pageTitle = this.createTextElement('label', 'edit-page-title__label', '프로필 수정')
    pageTitleBox.append(pageTitle) // 프로필 수정이라고 페이지의 제목을 알려주는 박스

    const editProfileBox = this.createElement('article', 'edit-profile')
    const photoBox = this.createElement('figure', 'eidt-photo-box')
    const profilePhoto = this.createImgElement('eidt-photo-box__photo', sessionStorage.getItem('profileImageUrl'), '')
    const photoInfoBox = this.createElement('figcaption', 'eidt-photo-box__base-info-box')
    const modifyFileInput = this.createInputElement('eidt-photo-box__file file--modify-photo', 'file', 'profile_image')
    const modifyPhotoBtn = this.createBtnElement('eidt-photo-box__button button--modify-photo', '프로필 사진 변경')

    modifyFileInput.style.display = 'none'
    modifyFileInput.style.accept = 'image/jpg'

    photoInfoBox.append(modifyFileInput, modifyPhotoBtn) // 프로필 사진 관련 정보를 담고 있는 box
    photoBox.append(profilePhoto, photoInfoBox) // 프로필 사진과 정보를 모두 담고 있는 figure 태그

    // 수정 정보
    const editProfileForm = this.createElement('form', 'edit-profile__form form--edit-profile')
    const nameBox = this.addEditBox('name', '이름')
    const statusBox = this.addEditBox('status', '상태 메시지')
    const birthdayBox = this.addEditBox('birthday', '생일')
    const sexBox = this.addEditBox('sex', '성별')
    const submitBtn = this.createSubmitElement('edit-profile__submit', '프로필 수정')
    editProfileForm.append(nameBox, statusBox, birthdayBox, sexBox, submitBtn) // 수정한 프로필 정보를 서버로 보낼 form box

    editProfileBox.append(photoBox, editProfileForm)
    profileSection.append(pageTitleBox, editProfileBox)

    const sexChoiceModal = this.addSexChoiceModal() // 성별 선택하는 모달 생성
    const modalOverlay = this.createElement('div', 'modal-overlay')

    this.main.append(profileSection, sexChoiceModal, modalOverlay) // 메인 태그에 프로필 수정, 성별 선택 모달 추가

    this.createDefaultFooter()
  }

  // 프로필 수정하는 템플릿 만드는 메소드
  addEditBox = (tartgetEdit, tartgetValue) => {
    const tartgetEditBox = this.createElement('div', `edit-profile__box box--${tartgetEdit}`)
    const tartgetEditLabel = this.createTextElement('h3', `edit-profile__label label--${tartgetEdit}`, tartgetValue)
    let targetElement

    // 생일인 경우 date type input 생성
    switch (tartgetEdit) {
      case 'birthday':
        const dateFormat = new Date(+sessionStorage.getItem('birthday'))
        const birthdayText = `${dateFormat.getFullYear()}-0${dateFormat.getMonth() + 1}-0${dateFormat.getDate()}` // TODO : 달력 포맷 예외처리 필요함
        targetElement = this.createInputElement(`edit-profile__date date--${tartgetEdit}`, 'date', tartgetEdit, null, birthdayText)
        break

      case 'sex':
        targetElement = this.createBtnElement(`edit-profile__edit edit--${tartgetEdit}`, sessionStorage.getItem(tartgetEdit))
        break

      default:
        targetElement = this.createInputElement(`edit-profile__edit edit--${tartgetEdit}`, 'text', tartgetEdit, null, sessionStorage.getItem(tartgetEdit))
        break
    }
    tartgetEditBox.append(tartgetEditLabel, targetElement)

    return tartgetEditBox
  }

  // 성별을 선택하는 모달 박스 추가하는 메소드
  addSexChoiceModal = () => {
    const modalBox = this.createElement('div', 'modal modal--sex-choice', 'modal-box')

    const modalHeader = this.createElement('div', 'modal__header')
    const modalTitle = this.createTextElement('h2', 'modal__title', '성별 선택')
    const closeBtn = this.createBtnElement('modal__btn btn--close', '&times')
    modalHeader.append(modalTitle, closeBtn) // 모달의 해더 : title + 닫기 버튼

    const modalBody = this.createElement('div', 'modal__body')

    const manSelectionBox = this.addRadioListElement('man', '남자')
    const womanSelectionBox = this.addRadioListElement('woman', '여자')
    modalBody.append(manSelectionBox, womanSelectionBox) // 모달의 바디 : 성별 선택 라디오 버튼들 추가

    const modalFooter = this.createElement('div', 'modal__footer')
    const confirmBtn = this.createBtnElement('modal__btn btn--confirm', '확인')
    modalFooter.append(confirmBtn) // 모달의 푸터 : 확인 버튼 추가

    modalBox.append(modalHeader, modalBody, modalFooter) // 모달 박스에 헤더, 바디, 푸터 추가

    return modalBox
  }

  // 성별 선택하는 라디오 버튼 박스 만드는 메소드
  addRadioListElement = (itemName, itemInnerHTML) => {
    const radioLabel = this.createElement('label', `modal__label label--${itemName}`)
    const radioBtn = this.createInputElement(`modal__radio radio--${itemName}`, 'radio', 'sex', null, itemInnerHTML)

    radioLabel.append(radioBtn) // 먼저 라디오 버튼을 추가하고
    radioLabel.innerHTML += itemInnerHTML // 라디오 버튼의 이름을 추가

    return radioLabel
  }

  // ------------------------------------------------ admin page ------------------------------------------------
  createAdminPage = () => {
    const adminTitle = this.createATagElement('header__link link--home', '/#/admin', '관리자 페이지', 'label', 'header__logo')
    const ulTag = this.createElement('ul', 'header__list')
    const signOutMenu = this.createATagElement('header__link link--sgin-out', '', '관리자 로그아웃', 'li', 'header__item')
    ulTag.append(signOutMenu)
    this.navigation.append(adminTitle, ulTag)
    this.header.append(this.navigation)

    // 네비게이션 버튼 박스
    const buttonBox = this.createElement('nav', 'admin-button-box')
    const showAllBtn = this.createBtnElement('admin-button-box__button button--show-all', '전체')
    const monthlyBtn = this.createBtnElement('admin-button-box__button button--monthly-chart', '월별')
    const countriesBtn = this.createBtnElement('admin-button-box__button button--countries-chart', '국가별')
    const browsersBtn = this.createBtnElement('admin-button-box__button button--browsers-chart', '브라우저별')

    // 메인 섹션 생성
    const adminSection = this.createElement('section', 'admin-section')
    const visitorsBox = this.createElement('article', 'chart-box chart-box--visitors')
    const countriesBox = this.createElement('article', 'chart-box chart-box--countries')
    const browserBox = this.createElement('article', 'chart-box chart-box--browsers')

    buttonBox.append(showAllBtn, monthlyBtn, countriesBtn, browsersBtn)
    adminSection.append(buttonBox, visitorsBox, countriesBox, browserBox)
    this.main.append(adminSection)
    this.createDefaultFooter()
  }

  // 차트 정보를 담는 artigle element들을 생성하고 section에 추가
  addChartTitle = (selector, titleText) => {
    const chartTitle = this.createElement('h2', 'chart-box__title')
    chartTitle.innerHTML = titleText
    this.getElement(selector).append(chartTitle)
  }

  // MEMO : 변수 앞에 + 붙이는 이유 : json object는 default 변수 타입이 string 이기 때문에 number로 변경하기 위해
  buildVisitorsChart = (mothlyVisitors, chartScale) => {
    console.log(mothlyVisitors)

    this.addChartTitle('.chart-box--visitors', '- 월별 방문자 수')

    const chartWidth = 800 * chartScale
    const chartHeight = 500 * chartScale

    const countriesChart = d3.select('.chart-box--visitors').append('svg').classed('chart-box__chart chart--visitors', true).attr('width', chartWidth).attr('height', chartHeight)

    const xValue = data => data.timeStamp // x 축에는 시간
    const yValue = data => data.visitorsCount // y 축에는 방문자 수
    const xAxisLabel = '방문 날짜(월)'
    const yAxisLabel = '방문자 수(명)'

    const margin = { top: 60, right: 40, bottom: 88, left: 150 } // margin 사용 하는 곳 : range, inner- width, height 값 결정
    const innerWidth = chartWidth - margin.left - margin.right // 차트 내부 width
    const innerHeight = chartHeight - margin.top - margin.bottom // 차트 내부 height

    const xScale = d3.scaleTime().domain(d3.extent(mothlyVisitors, xValue)).range([0, innerWidth])
    const yScale = d3.scaleLinear().domain(d3.extent(mothlyVisitors, yValue)).range([innerHeight, 0])

    const graph = countriesChart.append('g').attr('transform', `translate(${margin.left},${margin.top})`)
    const xAxis = d3.axisBottom(xScale).tickSize(-innerHeight).tickPadding(15) // x축
    const yAxis = d3.axisLeft(yScale).tickSize(-innerWidth).tickPadding(10) // y축

    // y 축 관련
    const yAxisGraph = graph.append('g').call(yAxis)

    yAxisGraph
      .append('text')
      .attr('class', '.chart-box__axis-label axis-label--y')
      .attr('y', -93)
      .attr('x', -innerHeight / 2)
      .attr('fill', 'black')
      .attr('transform', 'rotate(-90)')
      .attr('text-anchor', 'middle')
      .text(yAxisLabel)

    // x 축 관련
    const xAxisGraph = graph.append('g').call(xAxis).attr('transform', `translate(0,${innerHeight})`)

    xAxisGraph.select('.domain').remove()
    xAxisGraph
      .append('text')
      .attr('class', 'axis-label')
      .attr('y', 75)
      .attr('x', innerWidth / 2)
      .attr('fill', 'black')
      .text(xAxisLabel)

    const areaGenerator = d3
      .area()
      .x(data => xScale(xValue(data)))
      .y1(data => yScale(yValue(data)))
      .y0(innerHeight)
      .curve(d3.curveBasis)

    graph.append('path').attr('class', 'chart-box__line-path').attr('d', areaGenerator(mothlyVisitors))
  }

  // 국가별 방문자 수 차트
  buildCountriesChart = (countriesData, chartScale) => {
    this.addChartTitle('.chart-box--countries', '- 국가별 방문자 수')

    const chartWidth = 630 * chartScale
    const chartHeight = 360 * chartScale
    // 국가 차트를 담당하는 svg 추가
    const countriesChart = d3.select('.chart-box--countries').append('svg').classed('chart-box__chart chart--countries', true).attr('width', chartWidth).attr('height', chartHeight)

    // MEMO :
    const projection = d3
      .geoMercator()
      .center([0, 20])
      .scale(100 * chartScale)
      .translate([chartWidth / 2, chartHeight / 2])

    // TODO : 변수명 제대로 짓기
    // 대륙에 따른 방문자 수 원으로 나타낼 때 사용
    const domainMinAndMax = d3.extent(countriesData, data => {
      return +data.visitorsCount
    })
    const visitorsToRadius = d3.scaleSqrt().domain(domainMinAndMax).range([1, 50])
    const continentToColorScale = d3
      .scaleOrdinal()
      .domain(d3.map(countriesData, data => data.continent).keys())
      .range(d3.schemeCategory10)

    // GeoMap 틀 만들기
    d3.json('https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson').then(geoData => {
      const pathBuilder = d3.geoPath(projection) // MEMO :

      countriesChart
        .append('g')
        .selectAll('path')
        .data(geoData.features)
        .enter()
        .append('path')
        .attr('d', eachFeatures => {
          return pathBuilder(eachFeatures)
        })
        .attr('fill', 'grey')
        .attr('opacity', 0.3)

      //지역 내 인구 수 표현
      countriesChart
        .append('g')
        .selectAll('circle')
        .data(countriesData)
        .enter()
        .append('circle')
        .attr('cx', eachCircle => {
          return projection([eachCircle.longitude, eachCircle.latitude])[0]
        })
        .attr('cy', eachCircle => {
          return projection([eachCircle.longitude, eachCircle.latitude])[1]
        })
        .attr('r', eachCircle => {
          return visitorsToRadius(eachCircle.visitorsCount)
        })
        .attr('fill', data => continentToColorScale(data.continent))
        .attr('stroke', eachCircle => {
          if (eachCircle.visitorsCount > 2000) return 'red'
          else return 'none'
        })
        .attr('stroke-width', 0.1)
        .attr('fill-opacity', 0.4)
    })
  }

  // 브라우저 차트 만드는 메소드
  buildBrowsersChart = (browsersData, chartScale) => {
    this.addChartTitle('.chart-box--browsers', '- 브라우저별 방문자 수')

    const chartWidth = 750 * chartScale
    const chartHeight = 500 * chartScale
    const segmentColors = d3.scaleOrdinal(d3.schemeDark2)
    // 국가 차트를 담당하는 svg 추가
    const browsersChart = d3.select('.chart-box--browsers').append('svg').classed('chart-box__chart chart--browsers', true).attr('width', chartWidth).attr('height', chartHeight)

    const pieData = d3
      .pie()
      .sort(null)
      .value(data => {
        return data.visitorsCount
      })(browsersData)
    // padAngle : segment 사이 간격, padRadius : segment 사이 곡률
    const segments = d3
      .arc()
      .innerRadius(100)
      .outerRadius(200 * chartScale)
      .padAngle(0.1)
      .padRadius(50)

    // 파이 차트 추가
    const sections = browsersChart
      .append('g')
      .attr('transform', `translate(${250 * chartScale}, ${250 * chartScale})`) // 위치 가운데로 옮기기
      .selectAll('path')
      .data(pieData)
      .enter()

    sections
      .append('path')
      .attr('d', segments)
      .attr('fill', d => {
        return segmentColors(d.data.visitorsCount)
      }) // data : pieData 속성 중 data

    const legends = browsersChart
      .append('g')
      .attr('transform', `translate(${500 * chartScale}, ${100 * chartScale})`)
      .selectAll('.legends')
      .data(pieData)
    const legend = legends
      .enter()
      .append('g')
      .classed('legends', true)
      .attr('transform', (d, i) => {
        return `translate(0,${(i + 1) * 30 * chartScale})`
      })
    legend
      .append('rect')
      .attr('width', 20 * chartScale)
      .attr('height', 20 * chartScale)
      .attr('fill', d => {
        return segmentColors(d.data.visitorsCount)
      })
    legend
      .append('text')
      .classed('chat-box__label label--browser', true)
      .text(d => {
        return `${d.data.browser} : ${d.data.visitorsCount}명`
      })
      .attr('fill', d => {
        return segmentColors(d.data.visitorsCount)
      })
      .attr('x', 30 * chartScale)
      .attr('y', 20 * chartScale)
  }

  // ------------------------------------------------ home page ------------------------------------------------
  createHomePage = () => {
    this.createDefaultHeader()
    const homeSection = this.createElement('section', 'home-section') // home 메인 내용이 들어가는 section
    const coupleProfile = this.createElement('aside', 'home-profile') // 프로필 내용 + 스토리 추가 버튼이 들어가는 aside

    const asideBox = this.createElement('div', 'home-profile__aside-box') // aside 내용을 담는 box

    const profileTitleBox = this.createElement('div', 'home-profile__label-box label-box--profile')
    const profileLabel = this.createTextElement('label', 'home-profile__label label--title', '프로필 정보')
    const editProfileBtn = this.createElement('i', 'home-profile__btn btn--add-story fa fa-user fa-2x')
    const editProfileLink = this.createATagElement('home-profile__link', '/#/my-page')
    editProfileLink.append(editProfileBtn)
    profileTitleBox.append(profileLabel, editProfileLink)

    const addStoryLabelBox = this.createElement('div', 'home-profile__label-box label-box--add-story')
    const addStoryLabel = this.createTextElement('label', 'home-profile__label label--add-story', '스토리 추가하기')
    const addStoryBtn = this.createElement('i', 'home-profile__btn btn--add-story fa fa-plus-circle fa-2x')
    const addStoryLink = this.createATagElement('home-profile__link', '/#/add-story')
    addStoryLink.append(addStoryBtn)
    addStoryLabelBox.append(addStoryLabel, addStoryLink)

    const userProfile = this.createElement('figure', 'home-profile__photo-box') // 유저 프로필 정보가 들어가는 figure
    const userImage = this.createImgElement('home-profile__image image--user') // 유저 이미지 들어가는 image
    const userInfoBox = this.createElement('figcaption', 'home-profile__box box--user') // 유저 정보 박스
    const userName = this.createElement('p', 'home-profile__name name--user')
    const userStatus = this.createElement('small', 'home-profile__status status--user') // 유저 상태 메시지 small
    userInfoBox.append(userName, userStatus)
    userProfile.append(userImage, userInfoBox)

    const loveIcon = this.createElement('figure', 'home-profile__icon-box icon-box--love')
    const loveImage = this.createImgElement('home-profile__icon icon--love', '/style/images/love_icon.png')
    loveIcon.append(loveImage)

    const opponentProfile = this.createElement('figure', 'home-profile__photo-box') // 상대 프로필 정보가 들어가는 figure
    const opponentImage = this.createImgElement('home-profile__image image--opponent') // 상대 이미지 들어가는 image
    const opponentInfoBox = this.createElement('figcaption', 'home-profile__box box--opponent') // 유저 정보 박스
    const opponentName = this.createElement('p', 'home-profile__name name--opponent') // 상대 이름 p
    const opponentStatus = this.createElement('small', 'home-profile__status status--opponent') // 상대 상태 메시지 small
    opponentInfoBox.append(opponentName, opponentStatus)
    opponentProfile.append(opponentImage, opponentInfoBox)

    asideBox.append(profileTitleBox, userProfile, loveIcon, opponentProfile, addStoryLabelBox)
    coupleProfile.append(asideBox)

    const modalBox = this.addMoreFunctionModal()
    const modalOverlay = this.createElement('div', 'modal-overlay')

    this.main.append(homeSection, coupleProfile, modalBox, modalOverlay)
    const intersector = this.createElement('div', 'home-intersector') // 무한 스크롤링 observer target div
    this.footer.append(intersector)
    this.createDefaultFooter()
  }

  addMoreFunctionModal = () => {
    const modalBox = this.createElement('div', 'modal modal--home-story')

    const modalBody = this.createElement('div', 'modal__home')
    const modifyBtn = this.createTextElement('p', 'modal__btn btn--modify', '스토리 수정')
    const deleteBtn = this.createTextElement('p', 'modal__btn btn--delete', '스토리 삭제')
    const cancelBtn = this.createTextElement('p', 'modal__btn btn--cancel', '취소')
    modalBody.append(modifyBtn, deleteBtn, cancelBtn) // 모달의 바디 : 성별 선택 라디오 버튼들 추가

    modalBox.append(modalBody) // 모달 박스에 헤더, 바디, 푸터 추가

    return modalBox
  }

  setCoupleProfile = profileData => {
    let userProfile
    let opponentProfile
    switch (sessionStorage.getItem('userId')) {
      case profileData['senderProfile'][0]['id']:
        userProfile = profileData['senderProfile'][0]
        opponentProfile = profileData['receiverProfile'][0]
        break

      case profileData['receiverProfile'][0]['id']:
        userProfile = profileData['receiverProfile'][0]
        opponentProfile = profileData['senderProfile'][0]
        break
    }
    this.getElement('.image--user').src = userProfile['profile_image']
    this.getElement('.name--user').innerHTML = userProfile['name']
    this.getElement('.status--user').innerHTML = userProfile['state_message']
    this.getElement('.image--opponent').src = opponentProfile['profile_image']
    this.getElement('.name--opponent').innerHTML = opponentProfile['name']
    this.getElement('.status--opponent').innerHTML = opponentProfile['state_message']
  }

  addStoryItem = (storyDataList, handleItemListener) => {
    const homeSection = this.getElement('.home-section')
    storyDataList.forEach(storyData => {
      const articleStory = this.createElement('article', 'home-story')
      articleStory.data = storyData['id']

      const titleBox = this.createElement('div', 'home-story__title-box')
      const storyLabelImage = this.createElement('i', 'home-story__icon icon--story fa fa-archive')
      const h2StoryTitle = this.createTextElement('h2', 'home-story__title', storyData['title'])
      const moreBtn = this.createElement('i', 'home-story__btn btn--more fa fa-ellipsis-h')

      moreBtn.addEventListener('click', handleItemListener)
      // const iage
      titleBox.append(storyLabelImage, h2StoryTitle, moreBtn) // 스토리 제목 관련 박스

      const imageFigure = this.createElement('figure', 'home-story__photo-box')
      imageFigure.data = storyData['photo_path'].length // 이미지 총 갯수

      // 스토리 이미지 추가
      storyData['photo_path'].forEach(imagePath => {
        // TODO : image - alt 넣기
        const storyImage = this.createImgElement('home-story__photo', imagePath, '')
        imageFigure.append(storyImage)
      })
      const pTagImageCount = this.createTextElement('p', 'home-story__current-status', `1 / ${storyData['photo_path'].length} `) // 현재 보여지는 이미지 갯수를 담고 있는 태그
      pTagImageCount.data = 0 // 현재 스토리 이미지 index

      const storyDescriptionBox = this.createElement('div', 'home-story__description-box')
      const date = new Date(parseInt(storyData['date'])) // timeinmills를 Date 형식으로 변환
      const h3Date = this.createTextElement('h3', 'home-story__date', `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDay()}`)
      const h4Description = this.createTextElement('h4', 'home-story__description', storyData['description'])
      storyDescriptionBox.append(h3Date, h4Description) // 스토리 내용을 담고있는 박스

      // 사진이 한개 이상인지 여부에 따라 슬라이드 버튼 생성 여부 결정
      if (storyData['photo_path'].length > 1) {
        const buttonBox = this.createElement('div', 'home-story__box box--button')
        const previousBtn = this.createElement('i', 'home-story__button button--previous fa fa-chevron-circle-left fa-2x')
        const nextBtn = this.createElement('i', 'home-story__button button--next fa fa-chevron-circle-right fa-2x')
        buttonBox.append(previousBtn, nextBtn)
        // 리스너 추가 : 아이템이 동적으로 변하는 경우 view에서 리스너를 달아준다
        previousBtn.addEventListener('click', handleItemListener)
        nextBtn.addEventListener('click', handleItemListener)
        articleStory.append(titleBox, imageFigure, pTagImageCount, storyDescriptionBox, buttonBox)
      } else {
        articleStory.append(titleBox, imageFigure, pTagImageCount, storyDescriptionBox)
      }
      homeSection.append(articleStory)
    })
  }

  // ------------------------------------------------ Add OR Modify Story page ------------------------------------------------
  createUpsertStoryPage = () => {
    this.createDefaultHeader()

    // 메인 view 생성하기
    const profileSection = this.createElement('section', 'edit-profile-section')

    const pageTitleBox = this.createElement('div', 'add-story-title')
    const pageTitle = this.createTextElement('label', 'add-story-title__label', '스토리')
    pageTitleBox.append(pageTitle) // 프로필 수정이라고 페이지의 제목을 알려주는 박스

    const addStoryBox = this.createElement('article', 'add-story') // 스토리 수정하는 article

    const addImageBox = this.createElement('div', 'add-story__box box--image')
    const imageLabelBox = this.createElement('div', 'add-story__label-box')
    const imageLabel = this.createTextElement('label', 'add-story__label label--add-image', '스토리 사진 추가하기')
    const addImageBtn = this.createElement('i', 'add-story__btn-image btn--image fa fa-plus-circle fa-2x')
    const deleteImageBtn = this.createElement('i', 'add-story__btn-image btn--image-delete fa fa-trash fa-2x')
    const fileInput = this.createInputElement('add-story__file file--image', 'file', 'image')
    imageLabelBox.append(imageLabel, addImageBtn, deleteImageBtn, fileInput)

    const imageFigure = this.createElement('figure', 'add-story__photo-box')
    addImageBox.append(imageLabelBox, imageFigure) // 스토리 이미지 추가하는 박스

    const addTitleBox = this.createElement('div', 'add-story__box box--title')
    const storyTitleLabel = this.createTextElement('label', 'add-story__label label--story-title', '제목')
    const editStoryTitle = this.createInputElement('add-story__edit edit--story-title', 'text', 'title', '스토리 제목을 입력해주세요')
    addTitleBox.append(storyTitleLabel, editStoryTitle)

    const descriptionBox = this.createElement('div', 'add-story__box box--description')
    const descriptionLabel = this.createTextElement('label', 'add-story__label label--description', '그날의 기억')
    const editDescriptionTitle = this.createInputElement('add-story__edit edit--description', 'text', 'description', '스토리 설명을 해주세요')
    descriptionBox.append(descriptionLabel, editDescriptionTitle)

    const dateBox = this.createElement('div', 'add-story__box box--date')
    const dateLabel = this.createTextElement('label', 'add-story__label label--date', '날짜')
    const datePicker = this.createInputElement('add-story__date', 'date', 'date')
    dateBox.append(dateLabel, datePicker)

    const submitBtnBox = this.createElement('div', 'add-story__box box--btn')
    const submitBtn = this.createBtnElement('add-story__btn btn--submit', '확인')
    submitBtnBox.append(submitBtn)

    // 사진이 한개 이상인지 여부에 따라 슬라이드 버튼 생성 여부 결정
    addStoryBox.append(addImageBox, addTitleBox, descriptionBox, dateBox, submitBtnBox)
    profileSection.append(pageTitleBox, addStoryBox)
    this.main.append(profileSection) // 메인 태그에 프로필 수정, 성별 선택 모달 추가

    this.createDefaultFooter()
  }

  addStoryImage = (imageSrc, handleItemListener) => {
    const storyImageBox = this.createElement('div', 'add-story__item-box item-box--photo')
    const storyImage = this.createImgElement('add-story__photo photo--story', imageSrc)
    const selectionIcon = this.createElement('i', 'add-story__selection fa fa-check fa-4x')

    storyImage.addEventListener('click', handleItemListener)

    storyImageBox.append(storyImage, selectionIcon)
    this.getElement('.add-story__photo-box').append(storyImageBox)
  }

  // ------------------------------------------------ Modify Story page ------------------------------------------------
  setInitModifyPage = (storyData, handleItemListener) => {
    const iamgeList = storyData['storyPhotoList']
    const date = new Date(storyData['date'])
    const dateText = `${date.getFullYear()}-0${date.getMonth() + 1}-0${date.getDate()}`

    iamgeList.forEach(imageSrc => {
      this.addStoryImage(imageSrc, handleItemListener)
    })

    this.getElement('.btn--submit').classList.add('modify') // 수정한다는 클래스 명 추가
    this.getElement('.btn--submit').data = storyData['id']
    // 초기 수정 데이터 추가
    this.getElement('.edit--story-title').value = storyData['title']
    this.getElement('.edit--description').value = storyData['description']
    this.getElement('.add-story__date').value = dateText
  }
}
