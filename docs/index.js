/** @type {HTMLTemplateElement} */
const template = document.getElementById('news-template')
/** @type {HTMLDivElement} */
const newsContainer = document.getElementById('news-container')

/** @returns {Promise<News[]>} */
const loadNewsFeed = async () => {
  const res = await fetch('news.json')
  const data = await res.json()
  return data
}

/** @param {News[]} feed */
const renderNewsFeed = async (feed) => {
  feed.forEach(news => {
    /** @type {DocumentFragment} */
    const elem = template.content.cloneNode(true)
    /** @type {HTMLImageElement} */
    const img = elem.querySelector('.news-img')
    /** @type {HTMLHeadingElement} */
    const title = elem.querySelector('.news-title')
    /** @type {HTMLParagraphElement} */
    const resume = elem.querySelector('.news-resume')
    /** @type {HTMLAnchorElement} */
    const link = elem.querySelector('.news-link')

    img.src = news.imgUrl
    img.alt = news.title
    title.textContent = news.title
    resume.textContent = news.resume
    link.href = news.url
    newsContainer.append(elem)
  })
}

const run = async () => {
  try {
    const newsFeed = await loadNewsFeed()
    renderNewsFeed(newsFeed)
  } catch (error) {
    console.error(error)
    alert(error.message)
  }
}

run()
