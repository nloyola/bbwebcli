#!/usr/bin/env node

exports.command = 'participant <command>';
exports.describe = 'Commands related to participants.';
exports.builder = (yargs) => yargs.commandDir('participant');
exports.handler = () => {};

/* Local Variables:  */
/* mode: js2         */
/* End:              */
