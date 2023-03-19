<template>
  <canvas @touchstart="handleTouchStart" @touchmove="handleTouchMove" @touchend="handleTouchEnd"></canvas>
</template>

<script>
export default {
  data() {
    return {
      canvas: null, // canvas元素
      ctx: null, // canvas上下文
      isDrawing: false, // 是否正在绘制
      lastX: 0, // 上次记录的X坐标
      lastY: 0, // 上次记录的Y坐标
    }
  },

  mounted() {
    // 获取canvas元素和上下文
    this.canvas = this.$refs.canvas
    this.ctx = this.canvas.getContext('2d')

    // 设置canvas宽高
    this.canvas.width = window.innerWidth
    this.canvas.height = window.innerHeight

    // 设置canvas背景色
    this.ctx.fillStyle = '#FFF'
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
  },

  methods: {
    // 开始绘制
    handleTouchStart(e) {
      this.isDrawing = true
      this.lastX = e.touches[0].clientX
      this.lastY = e.touches[0].clientY
    },

    // 绘制中
    handleTouchMove(e) {
      if (!this.isDrawing) return

      const currentX = e.touches[0].clientX
      const currentY = e.touches[0].clientY

      this.ctx.beginPath()
      this.ctx.moveTo(this.lastX, this.lastY)
      this.ctx.lineTo(currentX, currentY)
      this.ctx.stroke()

      this.lastX = currentX
      this.lastY = currentY
    },

    // 停止绘制
    handleTouchEnd() {
      this.isDrawing = false
    },
  },
}
</script>