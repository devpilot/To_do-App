const { isBefore, isSameDay, isTomorrow, isSameYear, isYesterday } = require('date-fns')

/**
 * Inject formatting and additional data in task objects
 * @param {Array} tasks It takes result from db
 * @returns Modified or unmodified task objects
 */
module.exports = (tasks) => {
  if (tasks.length > 0) {
    let result = Object.keys(tasks).map(function (key) {
      const data = tasks[key].dueDate ? dtf(tasks[key].dueDate) : {dueDate: 'No due date', taskGroup: 'noDue'}
      return { ...tasks[key], ...data }
    })
    return result
  }
  return tasks
}

/**
 * Format timestamp to human readable
 * @param {String} timestamp db timestamp
 * @returns object
 */
const dtf = (timestamp) => {
  timestamp = new Date(timestamp)
  let option = {}
  if (isSameDay(timestamp, Date.now())) {
    option = { hour: 'numeric', minute: 'numeric' }
    return {
      dueDate: Intl.DateTimeFormat('en', option).format(timestamp),
      taskGroup: 'today'
    }
  } else if (isTomorrow(timestamp, Date.now())) {
    option = { hour: 'numeric', minute: 'numeric' }
    return {
      dueDate: 'Tomorrow ' + Intl.DateTimeFormat('en', option).format(timestamp),
      taskGroup: 'soon'
    }
  } else if (isYesterday(timestamp, Date.now())) {
    option = { hour: 'numeric', minute: 'numeric' }
    return {
      dueDate: 'Yesterday ' + Intl.DateTimeFormat('en', option).format(timestamp),
      taskGroup: 'past'
    }
  } else if (isBefore(timestamp, Date.now())) {
    option = { month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' }
    !isSameYear(timestamp, Date.now()) && (option = Object.assign(option, { year: 'numeric' }))
    return {
      dueDate: Intl.DateTimeFormat('en', option).format(timestamp),
      taskGroup: 'soon'
    }
  } else {
    let option = { month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' }
    !isSameYear(timestamp, Date.now()) && (option = Object.assign(option, { year: 'numeric' }))
    return {
      dueDate: Intl.DateTimeFormat('en', option).format(timestamp),
      taskGroup: 'past'
    }
  }
}
