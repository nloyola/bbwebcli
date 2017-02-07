/* eslint no-sync: "off" */
/* eslint no-console: "off" */
/* global process */

const prompt = require('prompt'),
      moment = require('moment');

exports.dateToDisplayString = function (date) {
   return moment(date).local().format('YYYY-MM-DD');
};

/* Local Variables:  */
/* mode: js2-mode    */
/* End:              */
