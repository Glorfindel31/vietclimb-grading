import confetti from 'canvas-confetti'

const count = 200
const defaults = {
  origin: { y: 0.7 },
}

function fire(particleRatio, opts) {
  confetti({
    ...defaults,
    ...opts,
    particleCount: Math.floor(count * particleRatio),
  })
}

export function createConfetti() {
  fire(0.25, {
    spread: 26,
    startVelocity: 55,
  })
  fire(0.2, {
    spread: 60,
  })
  fire(0.35, {
    spread: 100,
    decay: 0.91,
    scalar: 0.8,
  })
  fire(0.1, {
    spread: 120,
    startVelocity: 25,
    decay: 0.92,
    scalar: 1.2,
  })
  fire(0.1, {
    spread: 120,
    startVelocity: 45,
  })
}

export const moreConfetti = () => {
  const duration = 10 * 500
  const animationEnd = Date.now() + duration
  const defaults = {
    startVelocity: 30,
    spread: 360,
    ticks: 60,
    zIndex: 200,
  }

  function randomInRange(min, max) {
    return Math.random() * (max - min) + min
  }

  const interval = setInterval(() => {
    const timeLeft = animationEnd - Date.now()

    if (timeLeft <= 0) {
      clearInterval(interval)
      return
    }

    const particleCount = 50 * (timeLeft / duration)
    // since particles fall down, start a bit higher than random
    window.confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
    })
    window.confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
    })
  }, 250)
}
