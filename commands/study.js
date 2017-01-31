#!/usr/bin/env node

// -*-:mode: js2-mode; -*-

exports.command = 'study <command>';
exports.describe = 'commands related to studies';
exports.builder = function (yargs) {
   return yargs.commandDir('study');
};
exports.handler = function () {};
