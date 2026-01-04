import os from "node:os";
import { $ } from "bun";
import chalk from "chalk";

const { username, shell } = os.userInfo();
const hostname = os.hostname();
const shellWithoutPath = shell.split("/").at(-1);
const timeFormatter = new Intl.RelativeTimeFormat("en", { style: "long" });
const screenRes = await getScreenResolution(); // Optimize this with promises (promisify) later
const osInfo = `${await getOsName()} ${await getArchitecture()}`;
const de = await getDE();
const cpu = await getCPU();
const memory = await getMemory();

export function getUserStats() {
	return `${username}@${hostname}
--------------
OS: ${osInfo}
Kernel: 6.4.4-arch1-1
Uptime: ${timeFormatter.format(-os.uptime() / 60 / 60 / 24, "days")}
Shell: ${shellWithoutPath}
Resolution: ${screenRes}
DE: ${de}
Theme: deepin-dark [GTK2/3]
Icons: bloom [GTK2/3]
Terminal: alacritty
Terminal Font: Cascadia Code
CPU: ${cpu}
GPU: NVIDIA GeForce GTX 1060 3GB
Memory: ${memory}`;
}

async function getMemory() {
	const info = (await $`cat /proc/meminfo | head -2`.text())
		.trim()
		.split(os.EOL);
	const [rawMemTotal, rawMemFree] = info;
	const memTotal = rawMemTotal.slice(16);
	const memFree = rawMemFree.slice(16);
	return `${memFree} / ${memTotal}`;
}

async function getCPU() {
	return (await $`cat /proc/cpuinfo | grep "model name" | head -n1`.text())
		.trim()
		.slice(13);
}

async function getDE() {
	return (await $`echo $XDG_CURRENT_DESKTOP`.text()).trim();
}

async function getOsName() {
	return (await $`bash -c 'source /etc/os-release; echo $NAME'`.text()).trim();
}

async function getArchitecture() {
	return (await $`uname -m`.text()).trim();
}

async function getScreenResolution() {
	if (process.platform === "win32") {
		console.error(
			chalk.red(
				"❌ An error ocurred while trying to get the screen resolution: Unsupported platform",
			),
		);
		process.exit(1);
	}
	const output = await $`wayland-info | awk '
/name:/ {
  output = $2
}

$0 ~ /width:/ && $0 ~ /height:/ && $0 ~ /refresh:/ {
  for (i = 1; i <= NF; i++) {
    if ($i == "width:")   w = $(i+1)
    if ($i == "height:")  h = $(i+1)
    if ($i == "refresh:") hz = int($(i+1))
  }
}

/flags: current/ {
  type = (output ~ /^eDP/) ? "Internal" : "External"
  printf "%s: %sx%s @ %d Hz [%s]\n", output, w, h, hz, type
}'
`.catch((error) => {
		console.error(
			chalk.red(
				`❌ An error ocurred while trying to get the screen resolution: ${error}`,
			),
		);
		process.exit(1);
	});
	return output.text().trim();
}
