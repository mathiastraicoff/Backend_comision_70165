import cluster from "cluster";
import os from "os";
import logger from "./src/utils/logger.js";

const numCPUs = os.cpus().length;

if (cluster.isPrimary) {
	logger.info(`Master [PID: ${process.pid}] iniciando ${numCPUs} workers...`);
	for (let i = 0; i < numCPUs; i++) {
		cluster.fork();
	}
	cluster.on("exit", (worker, code, signal) => {
		logger.error(
			`Worker [PID: ${worker.process.pid}] finalizó. Iniciando uno nuevo...`,
		);
		cluster.fork();
	});
} else {
	import("./src/app.js").then(() => {
		logger.info(`Worker [PID: ${process.pid}] iniciado.`);
	});
}
