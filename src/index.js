'use strict'

var GoogleSpreadsheet = require('google-spreadsheet')
var _ = require('lodash-getpath')
var BPromise = require('bluebird')
var utils = require('./utils')

// With auth -- read + write
var creds = require('../google-generated-creds.json')

// spreadsheet key is the long id in the sheets URL
var my_sheet = new GoogleSpreadsheet('1fyGsYhinmTRNpJyw_uVDpI3wYmWz9FXIYgR2DuobZ_w')
// https://docs.google.com/spreadsheets/d/1fyGsYhinmTRNpJyw_uVDpI3wYmWz9FXIYgR2DuobZ_w/edit

var getInfo_p = BPromise.promisify(my_sheet.getInfo)

my_sheet.useServiceAccountAuth(creds, err => {
  if (err) { }

  getInfo_p()
  .then(sheet_info => {
    console.log(sheet_info.title + ' is loaded')
    console.log(JSON.stringify(sheet_info))
    // use worksheet object if you want to stop using the # in your calls
    var sheet1 = sheet_info.worksheets[0]
    console.log(utils.getColumnData(sheet1))

    // # is worksheet id - IDs start at 1
    // my_sheet.getRows(1, function(err, row_data) {
    //   console.log('pulled in ' + row_data.length + ' rows')
    // })

    sheet1.getRows((err, rows) => {
      if (err) { }
      console.log(rows.length)
      rows[0].Name = 'A' + Date.now()
      rows[0].save(() => console.log('saved'))  // async and takes a callback
      // rows[0].del()  // async and takes a callback
    })
    // column names are set by google and are based
    // on the header row (first row) of your sheet
    sheet1.addRow({ name: String(Math.random()) })

    sheet1.getRows({
      start: 1,       // start index
      num: 100,         // number of rows to pull
      orderby: 'name'  // column to order results by
    }, (err, row_data) => {
      if (err) { }
      console.log('names', _.getPath(row_data, '[].name'))
    })
  })
})
