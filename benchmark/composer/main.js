/**
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*
*/


'use strict';

const Util = require('../../src/comm/util');

let configFile;
let networkFile;

/**
 * Set the system configuration file
 * @param {String} file path to the configuration file
 */
function setConfig(file) {
    configFile = file;
}

/**
 * Set the system network file
 * @param {String} file path to the configuration file
 */
function setNetwork(file) {
    networkFile = file;
}

/**
 * Main function for running the benchmark
 */
function main() {
    let program = require('commander');
    program.version('0.1')
        .option('-c, --config <file>', 'config file of the benchmark, default is config.json', setConfig)
        .option('-n, --network <file>', 'config file of the blockchain system under test, if not provided, blockchain property in benchmark config is used', setNetwork)
        .parse(process.argv);

    let path = require('path');
    let fs = require('fs-extra');
    let absConfigFile;
    if(typeof configFile === 'undefined') {
        absConfigFile = path.join(__dirname, 'config-composer.json');
    }
    else {
        absConfigFile = path.join(__dirname, configFile);
    }
    if(!fs.existsSync(absConfigFile)) {
        Util.log('file ' + absConfigFile + ' does not exist');
        return;
    }

    let absNetworkFile;
    let absCaliperDir = path.join(__dirname, '../..');
    if(typeof networkFile === 'undefined') {
        try{
            let config = require(absConfigFile);
            absNetworkFile = path.join(absCaliperDir, config.blockchain.config);
        }
        catch(err) {
            Util.log('failed to find blockchain.config in ' + absConfigFile);
            return;
        }
    }
    else {
        absNetworkFile = path.join(__dirname, networkFile);
    }
    if(!fs.existsSync(absNetworkFile)) {
        Util.log('file ' + absNetworkFile + ' does not exist');
        return;
    }

    let framework = require('../../src/comm/bench-flow.js');
    framework.run(absConfigFile, absNetworkFile);
}

main();