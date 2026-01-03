import chalk from "chalk";

class Logger {
	success(message: string) {
		console.log(chalk.green(message));
	}
	error(message: string) {
		console.error(chalk.red(message));
	}
}
