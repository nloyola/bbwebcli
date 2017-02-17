#!/usr/bin/env node

exports.command = 'centre <command>';
exports.describe = 'Commands related to centres.';
exports.builder = (yargs) => yargs.commandDir('centre');
exports.handler = () => {};

/* Local Variables:  */
/* mode: js2         */
/* End:              */
