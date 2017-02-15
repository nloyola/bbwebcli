#!/usr/bin/env node

exports.command = 'pannot <command>';
exports.describe = 'Commands related to participant annotations.';
exports.builder = (yargs) => yargs.commandDir('pannot');
exports.handler = () => {};

/* Local Variables:   */
/* mode: js2         */
/* End:              */
