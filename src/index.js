'use strict'

var GoogleSpreadsheet = require('google-spreadsheet')
var _ = require('lodash-getpath')
var BPromise = require('bluebird')
var utils = require('./utils')
var _p = BPromise.promisify

// With auth -- read + write
var creds = require('../google-generated-creds.json')

// spreadsheet key is the long id in the sheets URL
var my_sheet = new GoogleSpreadsheet('1fyGsYhinmTRNpJyw_uVDpI3wYmWz9FXIYgR2DuobZ_w')
// https://docs.google.com/spreadsheets/d/1fyGsYhinmTRNpJyw_uVDpI3wYmWz9FXIYgR2DuobZ_w/edit

my_sheet.useServiceAccountAuth(creds, err => {
  if (err) { }

  var getInfo_p = _p(my_sheet.getInfo)

  getInfo_p()
  .then(sheet_info => {
    console.log(`${sheet_info.title} is loaded`)
    console.log(JSON.stringify(sheet_info))
    // # is worksheet id - IDs start at 1
    // my_sheet.getRows(1, function(err, row_data) {
    //   console.log('pulled in ' + row_data.length + ' rows')
    // })
    // use worksheet object if you want to stop using the # in your calls
    return sheet_info.worksheets[0]
  })
  .then(sheet1 => {
    console.log(utils.getColumnData(sheet1))

    var getRows_p = _p(sheet1.getRows)
    var addRow_p = _p(sheet1.addRow)

    getRows_p()
    .then(rows => {
      console.log(`length: ${rows.length}`)
      rows[0].Name = `A${Date.now()}`
      return _p(rows[0].save)()
      // rows[0].del()  // async and takes a callback
    })
    .then(data => console.log(`saved name: ${data['gsx:name']}`))
    .then(() => addRow_p({ name: Math.random() }))
    .then(data => console.log(`added name: ${data.title}`))
    .then(() => getRows_p({
      start: 1,       // start index
      num: 100,         // number of rows to pull
      orderby: 'name'  // column to order results by
    }))
    .then(row_data => console.log('names: ', _.getPath(row_data, '[].name')))
    .then(() => getRows_p())
    .then(rows => console.log(`length: ${rows.length}`))
  })
})
