'use strict'

var _ = require('lodash-getpath')
var co = require('co')
var BPromise = require('bluebird')
var _p = BPromise.promisify

function getColumnData (sheet) {
  // var getRows_p = _p(sheet1.getRows)
  var getCells_p = _p(sheet.getCells)

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
