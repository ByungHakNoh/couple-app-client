import Router from './core/Router.js'
import PageController from './app/controller/PageController.js'
import HackerController from './app/controller/HackerController.js'
const router = new Router()

// TODO : Teamnova Hackerton 끝나고 지우기
router.addRoute('', () => {
  new HackerController().signIn()
})

// router.addRoute('', () => {
//   new PageController().signIn()
// })
// router.addRoute(/^#\/home$/, () => {
//   new PageController().home()
// })
// router.addRoute(/^#\/add-story$/, () => {
//   new PageController().addStory()
// })
// router.addRoute(/^#\/modify-story$/, () => {
//   new PageController().modifyStory()
// })
// router.addRoute(/^#\/admin$/, () => {
//   new PageController().admin()
// })
// router.addRoute(/^#\/my-page$/, () => {
//   new PageController().myPage()
// })
// router.addRoute(/^#\/edit-profile$/, () => {
//   new PageController().editProfile()
// })

const options = {
  autoplay: true,
  muted: true,
}

const video = videojs('player', options)
