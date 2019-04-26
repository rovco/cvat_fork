/*
* Copyright (C) 2018 Intel Corporation
* SPDX-License-Identifier: MIT
*/

/* global
    require:false
    global:false
*/


(() => {
    const PluginRegistry = require('./plugins');

    const Statistics = require('./statistics');
    const FrameData = require('./frames');
    const ObjectState = require('./object-state');
    const Task = require('./task');
    const Job = require('./task');

    const serverProxy = require('./server-proxy');

    function implementAPI(cvat) {
        cvat.plugins.list.implementation = PluginRegistry.list;
        cvat.plugins.register.implementation = PluginRegistry.register;

        cvat.server.about.implementation = async () => {
            const result = await serverProxy.server.about();
            return result;
        };

        cvat.server.share.implementation = async (directory) => {
            const result = await serverProxy.server.share(directory);
            return result;
        };

        cvat.server.login.implementation = async (username, password) => {
            await serverProxy.server.login(username, password);
        };

        cvat.tasks.get.implementation = async (filter) => {
            let users = null;
            if ('self' in filter && filter.self) {
                users = await serverProxy.getSelf();
            } else {
                users = await serverProxy.getUsers();
            }

            users = users.map(user => new global.cvat.classes.User(user));
            return users;
        };

        cvat.jobs.get.implementation = async (filter) => {
            return [new Job({})];
        };

        cvat.users.get.implementation = async (filter) => {
            return [new User()];
        };

        const hidden = require('./hidden');
        function checkContext(wrappedFunction) {
            return async function wrapper(...args) {
                try {
                    if (this instanceof Task) {
                        hidden.taskID = this.id;
                    } else if (this instanceof Job) {
                        hidden.jobID = this.id;
                        hidden.taskID = this.task.id;
                    } else {
                        throw new global.cvat.exceptions.ScriptingError('Bad context for the function');
                    }
                    const result = await wrappedFunction.call(this, ...args);
                    return result;
                } finally {
                    delete hidden.taskID;
                    delete hidden.jobID;
                }
            };
        }

        cvat.Task.annotations.upload.implementation = checkContext(
            async (file) => {
                // TODO: Update annotations
            },
        );

        cvat.Task.annotations.save.implementation = checkContext(
            async () => {
                // TODO: Save annotation on a server
            },
        );

        cvat.Task.annotations.clear.implementation = checkContext(
            async () => {
                // TODO: Remove all annotations
            },
        );

        cvat.Task.annotations.dump.implementation = checkContext(
            async () => {
                const { host } = global.cvat.config;
                const { api } = global.cvat.config;

                return `${host}/api/${api}/tasks/${this.taskID}/annotations/dump`;
            },
        );

        cvat.Task.annotations.statistics.implementation = checkContext(
            async () => {
                return new Statistics();
            },
        );

        cvat.Task.annotations.put.implementation = checkContext(
            async (arrayOfObjects) => {
                // TODO: Make from objects
            },
        );

        cvat.Task.annotations.get.implementation = checkContext(
            async (frame, filter) => {
                return [new ObjectState()];
                // TODO: Return collection
            },
        );

        cvat.Task.annotations.search.implementation = checkContext(
            async (filter, frameFrom, frameTo) => {
                return 0;
            },
        );

        cvat.Task.annotations.select.implementation = checkContext(
            async (frame, x, y) => {
                return null;
            },
        );

        cvat.Task.frames.get.implementation = checkContext(
            async (frame) => {
                return new FrameData(this.taskID, frame);
            },
        );

        cvat.Task.logs.put.implementation = checkContext(
            async (logType, details) => {
                // TODO: Put log into collection
            },
        );

        cvat.Task.logs.save.implementation = checkContext(
            async () => {

            },
        );

        cvat.Task.actions.undo.implementation = checkContext(
            async (count) => {
                // TODO: Undo
            },
        );

        cvat.Task.actions.redo.implementation = checkContext(
            async (count) => {
                // TODO: Redo
            },
        );

        cvat.Task.actions.clear.implementation = checkContext(
            async () => {
                // TODO: clear
            },
        );

        cvat.Task.events.subscribe.implementation = checkContext(
            async (type, callback) => {
                // TODO: Subscribe
            }
        );

        cvat.Task.events.unsubscribe.implementation = checkContext(
            async (type, callback) => {
                // TODO: Save log collection
            },
        );


        cvat.Job.annotations.upload.implementation = checkContext(
            async (file) => {
                // TODO: Update annotations
            },
        );

        cvat.Job.annotations.save.implementation = checkContext(
            async () => {
                // TODO: Save annotation on a server
            },
        );

        cvat.Job.annotations.clear.implementation = checkContext(
            async () => {
                // TODO: Remove all annotations
            },
        );

        cvat.Job.annotations.dump.implementation = checkContext(
            async () => {
                const { host } = global.cvat.config;
                const { api } = global.cvat.config;

                return `${host}/api/${api}/tasks/${this.taskID}/annotations/dump`;
            },
        );

        cvat.Job.annotations.statistics.implementation = checkContext(
            async () => {
                return new Statistics();
            },
        );

        cvat.Job.annotations.put.implementation = checkContext(
            async (arrayOfObjects) => {
                // TODO: Make from objects
            },
        );

        cvat.Job.annotations.get.implementation = checkContext(
            async (frame, filter) => {
                return [new ObjectState()];
                // TODO: Return collection
            },
        );

        cvat.Job.annotations.search.implementation = checkContext(
            async (filter, frameFrom, frameTo) => {
                return 0;
            },
        );

        cvat.Job.annotations.select.implementation = checkContext(
            async (frame, x, y) => {
                return null;
            },
        );

        cvat.Job.frames.get.implementation = checkContext(
            async (frame) => {
                return new FrameData(this.taskID, frame);
            },
        );

        cvat.Job.logs.put.implementation = checkContext(
            async (logType, details) => {
                // TODO: Put log into collection
            },
        );

        cvat.Job.logs.save.implementation = checkContext(
            async () => {

            },
        );

        cvat.Job.actions.undo.implementation = checkContext(
            async (count) => {
                // TODO: Undo
            },
        );

        cvat.Job.actions.redo.implementation = checkContext(
            async (count) => {
                // TODO: Redo
            },
        );

        cvat.Job.actions.clear.implementation = checkContext(
            async () => {
                // TODO: clear
            },
        );

        cvat.Job.events.subscribe.implementation = checkContext(
            async (type, callback) => {
                // TODO: Subscribe
            }
        );

        cvat.Job.events.unsubscribe.implementation = checkContext(
            async (type, callback) => {
                // TODO: Save log collection
            },
        );

        return cvat;
    }

    module.exports = implementAPI;
})();
