'use strict'

const utils = require('./utils')
const GoogleSpreadsheet = require('google-spreadsheet')
const _ = require('lodash-getpath')
const co = require('co')
const BPromise = require('bluebird')
const _p = BPromise.promisify

// With auth -- read + write
const creds = require('../google-generated-creds.json')

// spreadsheet key is the long id in the sheets URL
const my_sheet = new GoogleSpreadsheet('1fyGsYhinmTRNpJyw_uVDpI3wYmWz9FXIYgR2DuobZ_w')
// https://docs.google.com/spreadsheets/d/1fyGsYhinmTRNpJyw_uVDpI3wYmWz9FXIYgR2DuobZ_w/edit

my_sheet.useServiceAccountAuth(creds, err => {
  if (err) { }

  const getInfo_p = _p(my_sheet.getInfo)

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
    const getRows_p = _p(sheet1.getRows)
    const addRow_p = _p(sheet1.addRow)

    // async block #1 /////////////////////////////////////
    utils.getColumnData(sheet1)
    .then(columns => { console.log('cols: ' + columns) })
    .then(() => getRows_p())
    .then(rows => {
      console.log(`start length: ${rows.length}`)
      // update name in row 1
      rows[0].Name = `A${Date.now()}`
      return _p(rows[0].save)() // return the promise
      // rows[0].del()  // async, takes a callback
    })
    .then(data => console.log(`saved name: ${data['gsx:name']}`))
    .then(() => addRow_p({ name: Math.random() }))
    .then(data => console.log(`added name: ${data.title}`))
    .then(() => getRows_p({ start: 1, num: 10, orderby: 'name' }))
    .then(rows => {
      console.log('names: ', _.getPath(rows, '[].name'))
      console.log('ages: ', _.getPath(rows, '[].age'))
      console.log('all: ', rows.map(d => `${d.name} : ${d.age}`))
      console.log(`end length: ${rows.length}`)
    })
    .catch(err => console.log(err))

    // async block #2 /////////////////////////////////////
    co(function *() {
      let cols, rows, data

      try {
        cols = yield utils.getColumnData(sheet1)
        console.log('>co cols: ' + cols)
        rows = yield getRows_p()
        console.log(`>co start length: ${rows.length}`)
        data = yield addRow_p({ name: Math.random(), age: Date.now() / (1 * 1000 * 1000 * 1000) | 0 })
        console.log(`>co added name: ${data.title}`)
        rows = yield getRows_p({ start: 1, num: 10, orderby: 'name' })
        console.log('>co names: ', _.getPath(rows, '[].name'))
        console.log('>co ages: ', _.getPath(rows, '[].age'))
        console.log('>co all: ', rows.map(d => `${d.name} : ${d.age}`))
        console.log(`>co end length: ${rows.length}`)
      } catch (err) { console.log(err) }
    })
  })
})
