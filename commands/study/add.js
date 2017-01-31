#!/usr/bin/env node

// -*-:mode: js2-mode; -*-

/* eslint no-console: "off" */

exports.command = 'add <name> [description]';
exports.describe = 'adds a study';
exports.builder = function() {};
exports.handler = function(argv) {
   const { name, description = ''} = argv;
   console.log('name: "%s"', name);
   console.log('description: "%s"', description);
};
