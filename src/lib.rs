/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

mod bug;

use bug::exports::vscode::example::types::{ GuestEngine, Guest };

struct MyEngine {
}

impl GuestEngine for MyEngine {

	fn new() -> Self {
		MyEngine {
		}
	}

	fn execute(&self) -> u32 {
		return 10;
	}
}

struct Implementation;
impl Guest for Implementation {
	type Engine = MyEngine;
}

bug::export!(Implementation with_types_in bug);