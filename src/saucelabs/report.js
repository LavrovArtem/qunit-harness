import chalk from 'chalk';


function checkFailures (results) {
    var errors = [];

    results[0].forEach(function (platformResults) {
        var msg      = [];
        var platform = [platformResults.platform[0], platformResults.platform[1], platformResults.platform[2] ||
                                                                                  ''].join(' ');

        var runningError = typeof platformResults.result === 'string';
        var failed       = platformResults.result.failed || runningError;

        msg.push(chalk.bold(failed ? chalk.red('FAILURES:') : chalk.green('OK:')));
        msg.push(platform);

        if (runningError)
            msg.push(chalk.bold(platformResults.result));
        else {
            msg.push(chalk.bold('Total:'), platformResults.result.total);
            msg.push(chalk.bold('Failed:'), platformResults.result.failed);
        }

        console.log(msg.join(' '));

        if (platformResults.result.errors) {
            platformResults.result.errors.forEach(function (error) {
                error.platform = platform;
                errors.push(error);
            });
        }
    });

    return errors;
}

function reportFailures (errors) {
    console.log(chalk.bold.red('ERRORS:'));

    errors.forEach(function (error) {
        console.log(chalk.bold(error.platform + ' - ' + error.testPath));
        console.log(chalk.bold('Test: ' + error.testName));

        if (error.customMessage)
            console.log('message: ' + error.customMessage);

        if (error.expected) {
            console.log('expected: ' + error.expected);
            console.log('actual: ' + error.actual);
        }

        console.log('-------------------------------------------');
        console.log();
    });
}


export default function (report) {
    var errors = checkFailures(report);

    if (errors.length) {
        reportFailures(errors);
        return false;
    }

    return true;
}