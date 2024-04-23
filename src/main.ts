/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import path from 'path';
import fs from 'fs/promises';

async function main(): Promise<void> {
	const filename = path.join('..', 'target', 'wasm32-unknown-unknown', 'debug', 'resource.wasm');
	const bits = await fs.readFile(filename);
	const module = await WebAssembly.compile(bits);

	const imports = {
		'[export]vscode:example/types' : {
			'[resource-drop]engine': (...args: any[]) => {
			},
			'[resource-new]engine': (...args: any[]) => {
				return args[0];
			}
		}
	}

	const instance = await WebAssembly.instantiate(module, imports);
	const exports = instance.exports as {
		"vscode:example/types#[constructor]engine": () => number;
		"vscode:example/types#[method]engine.execute": (arg0: number) => number;
	}

}