#!/usr/bin/env node

exports.command = 'specimen <subcommand>';
exports.describe = 'Commands related to specimens in collection events.';
exports.builder = (yargs) => yargs.commandDir('specimen');
exports.handler = () => {};

/* Local Variables:  */
/* mode: js2         */
/* End:              */
