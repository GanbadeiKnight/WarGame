export default {
  name: 'drag',
  data () {
    return {
      flags: false,
      position: {x: 0, y: 0, left: 0, top: 0},
      top: 0,
      left: 0,
      width: window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
      height: window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
    }
  },
  methods: {
    down () { // 拖动开始的操作
      this.flags = true
      const refs = this.$refs.move_div.getBoundingClientRect()
      let touch = event
      if (event.touches) {
        touch = event.touches[0]
      }
      this.position.x = touch.clientX
      this.position.y = touch.clientY
      this.position.left = refs.left
      this.position.top = refs.top
    },
    move () { // 拖动中的操作
      if (this.flags) {
        let touch = event
        if (event.touches) {
          touch = event.touches[0]
        }
        const xPum = this.position.left + touch.clientX - this.position.x
        const yPum = this.position.top + touch.clientY - this.position.y
        this.left = xPum
        this.top = yPum
        this.banOut()
        // 阻止页面的滑动默认事件
        document.addEventListener('touchmove', function () {
          event.preventDefault()
        }, {passive: false})
      }
    },
    end () { // 拖动结束的操作
      this.flags = false
      this.banOut()
    },
    banOut () { // 避免拖动出界的限制
      const refs = this.$refs.move_div.getBoundingClientRect()
      if (this.left < 0) {
        this.left = 0
      } else if (this.left > this.width - refs.width) {
        this.left = this.width - refs.width
      }
      if (this.top < 0) {
        this.top = 0
      } else if (this.top > this.height - refs.height) {
        this.top = this.height - refs.height
      }
    }
  }
}