// Require the framework
import Fastify from "fastify";
import FastifyVite from '@fastify/vite'

// Require library to exit fastify process, gracefully (if possible)
import closeWithGrace from "close-with-grace";

// Import your application
import appService, { options } from "./router.mjs";
import { url } from "inspector";
import { register } from "module";
//import type { root } from "postcss";
import { argv } from "process";
import vite from "@intlify/unplugin-vue-i18n/vite";
import path from "node:path"
import { get } from "node:http";

//
export const server = async () => {
    // Instantiate Fastify with some config
    const app = Fastify({
        ...options,
        logger: true,
    });

    // Register your application as a normal plugin.
    await app.register(FastifyVite, {
        root: path.resolve(import.meta.dirname, "../"),
        dev: process.argv.includes("--dev"),
        renderer: "@fastify/vue",
        spa: true
    })

    // delay is the number of milliseconds for the graceful close to finish
    const closeListeners = closeWithGrace(
        { delay: process.env.FASTIFY_CLOSE_GRACE_DELAY || 500 },
        async function ({ signal, err, manual }) {
            if (err) {
                app.log.error(err);
            }
            await app.close();
        }
    );

    //
    app.addHook("onClose", async (instance, done) => {
        closeListeners.uninstall();
        done();
    });

    //
    await app.vite.ready()
    await app.register(appService);

    //
    app.get('/', (req, reply) => {
        return reply.html()
    })

    //
    return app;
};

//
export default server;
