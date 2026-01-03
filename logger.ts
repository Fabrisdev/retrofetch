import chalk from "chalk";

function log() {
	const logger = {
		success(message: string) {
			console.log(chalk.green(message));
			return this as Omit<typeof log, "crash">;
		},
		error(message: string) {
			console.error(chalk.red(message));
			return this as Omit<typeof log, "exit">;
		},
		crash() {
			process.exit(1);
		},
		exit() {
			process.exit(0);
		},
	};
	return logger as Pick<typeof logger, "success" | "crash">;
}
