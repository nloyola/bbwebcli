#!/usr/bin/env node

exports.command = 'annot <subcommand>';
exports.describe = 'Commands related to annotations in collection events.';
exports.builder = (yargs) => yargs.commandDir('annot');
exports.handler = () => {};

/* Local Variables:  */
/* mode: js2         */
/* End:              */
