import crypto from 'crypto'
import Cookies from 'universal-cookie'
export const getLearntCookie = (req) => {
  const cookies = new Cookies(req ? req.headers.cookie : null)
  return cookies.get('_learnt', { path: '/' }) || []
}

export const setLearntCookie = async (learnt) => {
  const cookies = new Cookies()
  await cookies.set('_learnt', learnt, { path: '/' })
}
export const pushLearntCookie = async (toAdd) => {
  const learnt = getLearntCookie()
  if (!learnt.includes(toAdd)) {
    learnt.push(toAdd)
    await setLearntCookie(learnt)
  }
  return learnt
}

export const getChapters = async ($content) => {
  return await $content('/')
    .only(['title', 'description', 'slug', 'path'])
    .sortBy('path')
    .fetch()
}

export const getSteps = async ($content, chapter) => {
  return await $content(chapter)
    .only(['title', 'description', 'slug', 'path', 'test'])
    .sortBy('path')
    .fetch()
}
export const getChapter = async ($content, chapter) => {
  return await $content('/')
    .only(['title', 'description'])
    .where({ path: `/${chapter}` })
    .fetch()
}

export const getLearntCode = (path) => {
  return crypto
    .createHash('md5')
    .update(path)
    .digest('hex')
}
export const putLearntCode = (list, learnt) => {
  return list.map((l) => {
    l.learntCode = getLearntCode(l.path)
    l.learnt = learnt.includes(l.learntCode)
    return l
  })
}
export const checkChapters = (learnt, params, chapters = [], steps = []) => {
  chapters = putLearntCode(chapters, learnt)
  steps = putLearntCode(steps, learnt)
  const checkChapterIndex = chapters.findIndex(c => c.path === `/${params.chapter}`)
  let lastChapterIndexLearnt = chapters.findLastIndex(c => c.learnt)
  lastChapterIndexLearnt += 1
  if (checkChapterIndex > lastChapterIndexLearnt) {
    return `/course${chapters[lastChapterIndexLearnt].path}`
  } else if (checkChapterIndex === lastChapterIndexLearnt) {
    const checkStepIndex = steps.findIndex(s => s.path === `/${params.chapter}/${params.step}`)
    const lastStepIndexLearnt = steps.findLastIndex(c => c.learnt)
    if (checkStepIndex > lastStepIndexLearnt + 1) {
      return `/course${steps[lastStepIndexLearnt + 1].path}`
    }
  }
}
export const functionStringify = fn => fn.toString()
  .split('\n')
  .slice(1, -1)
  .map(line => line.replace('    ', ''))
  .join('\n')

export default {
  getLearntCookie,
  getChapters,
  getSteps,
  getChapter,
  getLearntCode,
  checkChapters,
  functionStringify
}
