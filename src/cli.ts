#!/usr/bin/env node

// src/cli.ts

import { Command } from 'commander';
import { addCommand } from './commands/add.js'; // Use .js extension for ESM imports
// import { initCommand } from './commands/init.js'; // If you create an init command

// Ensure process ends even if there are lingering async operations
process.on('SIGINT', () => process.exit(0));
process.on('SIGTERM', () => process.exit(0));

async function main() {
    const program = new Command();

    program
        .name("my-ui") // Match the command name in package.json bin
        .description("Add UI components to your project")
        .version("0.1.0", "-v, --version", "Output the current version"); // Use your actual version

    // Register commands
    program.addCommand(addCommand);
    // program.addCommand(initCommand);

    program.parse(process.argv); // Parse arguments from the command line
}

main().catch((error) => {
    console.error("An unexpected error occurred:", error);
    process.exit(1);
});
