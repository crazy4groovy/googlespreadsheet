'use strict'

const _ = require('lodash-getpath')
const co = require('co')
const BPromise = require('bluebird')
const _p = BPromise.promisify

function getColumnData (sheet) {
  // const getRows_p = _p(sheet1.getRows)
  const getCells_p = _p(sheet.getCells)

  return co(function *() {
    console.log('getColumnData')
    let cells = [ 'name' ]

    try {
      cells = yield getCells_p({ 'min-row': 1, 'max-row': 1, 'min-col': 1, 'max-col': 20 })
      // console.log('cells: ' + JSON.stringify(cells))
      cells = _.getPath(cells, '[].value')
    } catch (err) { console.log(err) }

    return cells
  })
}

module.exports = {
  getColumnData
}
