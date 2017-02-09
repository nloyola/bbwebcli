#!/usr/bin/env node

// -*-:mode: js2; -*-

exports.command = 'study <command>';
exports.describe = 'Commands related to studies.';
exports.builder = function (yargs) {
   return yargs.commandDir('study');
};
exports.handler = function () {};
