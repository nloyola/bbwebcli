#!/usr/bin/env node

exports.command = 'cevent <command>';
exports.describe = 'Commands related to collection events.';
exports.builder = (yargs) => yargs.commandDir('cevent');
exports.handler = () => {};

/* Local Variables:  */
/* mode: js2         */
/* End:              */
