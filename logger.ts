import chalk from "chalk";

class Logger {
	success(message: string) {
		console.log(chalk.green(message));
		return this as Omit<Logger, "crash">;
	}
	error(message: string) {
		console.error(chalk.red(message));
		return this as Omit<Logger, "exit">;
	}
	crash() {
		process.exit(1);
	}
	exit() {
		process.exit(0);
	}
}
