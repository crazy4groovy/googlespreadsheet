var GoogleSpreadsheet = require("google-spreadsheet");
// With auth -- read + write
var creds = require('./google-generated-creds.json');

// spreadsheet key is the long id in the sheets URL
var my_sheet = new GoogleSpreadsheet('1fyGsYhinmTRNpJyw_uVDpI3wYmWz9FXIYgR2DuobZ_w');
//https://docs.google.com/spreadsheets/d/1fyGsYhinmTRNpJyw_uVDpI3wYmWz9FXIYgR2DuobZ_w/edit

// # is worksheet id - IDs start at 1
// my_sheet.getRows(1, function(err, row_data){
//   console.log( 'pulled in ' + row_data.length + ' rows');
// });

my_sheet.useServiceAccountAuth(creds, function(err){
  // getInfo returns info about the sheet and an array or "worksheet" objects
  my_sheet.getInfo( function( err, sheet_info ){
    console.log( sheet_info.title + ' is loaded' );
    //console.log( JSON.stringify(sheet_info) );
    // use worksheet object if you want to stop using the # in your calls
    var sheet1 = sheet_info.worksheets[0];
    sheet1.getRows( function( err, rows ){
      console.log( JSON.stringify(rows, null, " ") );
      rows[0].Name = String(Date.now());
      rows[0].save();  //async and takes a callback
      //rows[0].del();  //async and takes a callback
    });
  });

  // column names are set by google and are based
  // on the header row (first row) of your sheet
  my_sheet.addRow( 2, { colname: 'col value'} );

  my_sheet.getRows( 2, {
    start: 100,       // start index
    num: 100,         // number of rows to pull
    orderby: 'name'  // column to order results by
  }, function(err, row_data){
    // do something...
  });
})
