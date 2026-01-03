import chalk from "chalk";

export const logger = {
	success(message: string) {
		console.log(chalk.green(`✅ ${message}`));
		return {
			exit() {
				process.exit(0);
			},
		};
	},
	error(message: string) {
		console.error(chalk.red(`❌ ${message}`));
		return {
			crash() {
				process.exit(1);
			},
		};
	},
};
