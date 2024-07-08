const modifiers = [
  '똑똑한',
  '멍청한',
  '솔직한',
  '건강한',
  '자랑스러운',
  '아기자기한',
  '귀여운',
  '깜찍한',
  '사랑스러운',
  '끔찍한',
  '악랄한',
  '게걸스러운',
  '진중한',
  '성실한',
  '모범적인',
  '훌륭한',
  '나태한',
  '게으른',
  '차가운',
  '따뜻한',
  '미지근한',
  '뜨거운',
  '장난스러운',
  '역겨운',
  '진부한',
  '창의적인',
  '착실한',
  '찬양하고픈',
  '순진한',
  '순수한',
  '시험망친',
  '우쭐한',
  '애같은',
  '성숙한',
  '배고픈',
  '짜증나는',
  '화내는',
  '억울한',
  '앙증맞은',
  '미친',
  '감성적인',
  '강직한',
  '애잔한',
  '박식한',
  '해박한',
  '무지한',
  '진지한',
  '무해한',
  '정직한',
  '불쌍한',
  '정석적인',
  '단단한',
  '단순한',
  '고집스러운',
  '배짱있는',
  '착한',
  '망할',
  '큰',
  '작은',
  '어리석은',
  '잘생긴',
  '못생긴',
]

const subjects = [
  '청년',
  '아기',
  '아이',
  '중년',
  '청춘',
  '소년',
  '소녀',
  '노년',
  '미중년',
  '학생',
  '바보',
  'MZ',
  '광인',
  '작가',
  '선생',
  '형',
  '누나',
  '동생',
  '오빠',
  '언니',
  '히틀러',
  '척준경',
  '어머니',
  '아버지',
  '토끼',
  '개',
  '고양이',
  '의사',
  '전문가',
  '인싸',
  '해커',
  '교수',
  '강사',
  '연예인',
  '아이돌',
  '가수',
  '마라탕후루',
]

const randomRange = (max) => {
  return Math.floor(Math.random() * max)
}

const createSpinList = (array) => {
  const list = document.createElement('ul')
  list.classList.add('spin-list')
  list.style.setProperty('--items', array.length)

  for (let i = 0; i < array.length; i++) {
    const item = document.createElement('li')
    item.style.setProperty('--i', i)
    item.textContent = array[i]
    list.append(item)
  }

  return list
}

const createWordItem = (name, words) => {
  return {
    words,
    $output: document.querySelector(`.${name}`),
    $spinList: createSpinList(words),
    longestChars: words.map(({ length }) => length).sort((a, b) => b - a)[0],
    lastPicked: 0
  }
}

const wordItems = [
  createWordItem('modifier', modifiers),
  createWordItem('subject', subjects),
]

const getFullText = () => {
  return wordItems.map(({ words, lastPicked }) => words[lastPicked]).join(' ') + '.'
}

const $spinButton = document.querySelector('.spin')
const $copyButton = document.querySelector('.copy')
const $shareButton = document.querySelector('.share')

for (const { $output, longestChars } of wordItems) {
  $output.style.setProperty('--longest-chars', longestChars)
}

$spinButton.addEventListener('click', async () => {
  $spinButton.disabled = true
  const promises = []

  for (let i = 0; i < wordItems.length; i++) {
    const { words, $output, $spinList, lastPicked } = wordItems[i]
    const { resolve, promise } = Promise.withResolvers()
    promises.push(promise)

    const nextIndex = randomRange(words.length - 1)

    const $newSpinList = $spinList.cloneNode(true)
    $newSpinList.style.setProperty('--spin-duration', CSS.s(0.06 * words.length))
    $newSpinList.style.setProperty('--spin-start-index', lastPicked)
    
    $output.append($newSpinList)

    const targetItem = [...$newSpinList.children][(nextIndex + 1) % words.length]
    const lastAnimation = targetItem.getAnimations()[0]
    
    lastAnimation.finished.then(() => {
      $newSpinList.remove()
      $output.querySelector('span').textContent = words[nextIndex]
      resolve()
    })

    wordItems[i].lastPicked = nextIndex
  }

  Promise.all(promises).then(() => {
    $spinButton.disabled = false
  })  
})

// copy

$copyButton.addEventListener('click', async () => {
  try {
    navigator.clipboard.writeText(getFullText())
    $copyButton.textContent = '복사됨'
    await new Promise((res) => setTimeout(res, 2000))
    $copyButton.textContent = '복사'
  } catch {}
})

// share

const baseShareData = {
  url: location.href,
  text: ''
}

if (navigator.canShare?.(baseShareData)) {
  $shareButton.addEventListener('click', () => {
    navigator.share({ ...baseShareData, text: getFullText() })
  })
} else {
  $shareButton.hidden = true
}