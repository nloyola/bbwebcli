/* eslint no-sync: "off" */
/* eslint no-console: "off" */

const prompt = require('prompt'),
      moment = require('moment');

exports.dateToDisplayString = function (date) {
   return moment(date).local().format('YYYY-MM-DD');
};

exports.datetimeToDisplayString = function (date) {
   return moment(date).local().format('YYYY-MM-DD HH:MM');
};

/* Local Variables: */
/* mode: js2        */
/* End:             */
