import crypto from 'crypto'
// eslint-disable-next-line require-await
export const getLearnt = async () => {
  const learnt = localStorage.getItem('learnjs_learnt')
  if (learnt) {
    return JSON.parse(localStorage.getItem('learnjs_learnt'))
  } else {
    return []
  }
}
export const setLearnt = async (learnt) => {
  await localStorage.setItem('learnjs_learnt', JSON.stringify(learnt))
}
// eslint-disable-next-line require-await
export const getTest = async (path) => {
  return localStorage.getItem(`learnjs_learnt_${path}`) || null
}
export const setTest = async (data) => {
  await localStorage.setItem(`learnjs_learnt_${data.path}`, data.content)
}

// TODO: change name
export const pushLearntCookie = async (toAdd) => {
  const learnt = await getLearnt()
  if (!learnt.includes(toAdd)) {
    learnt.push(toAdd)
    await setLearnt(learnt)
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
    return `/corso${chapters[lastChapterIndexLearnt].path}`
  } else if (checkChapterIndex === lastChapterIndexLearnt) {
    const checkStepIndex = steps.findIndex(s => s.path === `/${params.chapter}/${params.step}`)
    const lastStepIndexLearnt = steps.findLastIndex(c => c.learnt)
    if (checkStepIndex > lastStepIndexLearnt + 1) {
      return `/corso${steps[lastStepIndexLearnt + 1].path}`
    }
  }
}
export const functionStringify = fn => fn.toString()
  .split('\n')
  .slice(1, -1)
  .map(line => line.replace('    ', ''))
  .join('\n')

export default {
  getLearnt,
  getChapters,
  getSteps,
  getChapter,
  getLearntCode,
  checkChapters,
  functionStringify
}
