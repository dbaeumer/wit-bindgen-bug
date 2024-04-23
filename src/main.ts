/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import path from 'path';
import fs from 'fs/promises';

async function main(): Promise<void> {
	const filename = path.join('target', 'wasm32-unknown-unknown', 'debug', 'resource.wasm');
	const bits = await fs.readFile(filename);
	const module = await WebAssembly.compile(bits);

	const imports = {
		'[export]vscode:example/types' : {
			'[resource-new]engine': (rep: number): number => {
				return rep;
			},
			'[resource-rep]engine': (handle: number): number => {
				return handle;
			},
			'[resource-drop]engine': (handle: number): void => {
			}
		}
	}

	let handleCounter: number = 1;
	const h2r = new Map<number, number>();
	const importsFail = {
		'[export]vscode:example/types' : {
			'[resource-new]engine': (rep: number): number => {
				const result = handleCounter++;
				h2r.set(result, rep);
				return result;
			},
			'[resource-rep]engine': (handle: number): number => {
				return h2r.get(handle)!;
			},
			'[resource-drop]engine': (handle: number): void => {
				h2r.delete(handle);
			}
		}
	}

	const instance = await WebAssembly.instantiate(module, imports);
	const exports = instance.exports as {
		"vscode:example/types#[constructor]engine": () => number;
		"vscode:example/types#[method]engine.execute": (handle: number) => number;
		"vscode:example/types#[dtor]engine": (handle: number) => void;
	}

	const handle = exports['vscode:example/types#[constructor]engine']();
	const result = exports['vscode:example/types#[method]engine.execute'](handle);
	console.log('Result:', result);
}

main().catch(console.error);