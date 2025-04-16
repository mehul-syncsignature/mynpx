#!/usr/bin/env node

// src/cli.ts
import { Command as Command2 } from "commander";

// src/commands/add.ts
import { Command } from "commander";
import inquirer from "inquirer";
import path from "path";
import fs from "fs-extra";
import chalk from "chalk";
import { fileURLToPath } from "url";
import { execSync } from "child_process";
var __filename = fileURLToPath(import.meta.url);
var __dirname = path.dirname(__filename);
var REGISTRY_PATH = path.resolve(__dirname, "../component-registry");
async function getRegistry() {
  try {
    const registryIndexPath = path.join(REGISTRY_PATH, "registry/index.json");
    console.log(chalk.magenta(`[DEBUG] __filename (in getRegistry): ${__filename}`));
    console.log(chalk.magenta(`[DEBUG] __dirname (in getRegistry): ${__dirname}`));
    console.log(chalk.magenta(`[DEBUG] Calculated REGISTRY_PATH: ${REGISTRY_PATH}`));
    console.log(chalk.magenta(`[DEBUG] Checking for registry index at: ${registryIndexPath}`));
    if (!await fs.pathExists(registryIndexPath)) {
      console.error(chalk.red(`Registry index not found at expected path: ${registryIndexPath}`));
      console.error(chalk.yellow(`Check if the 'component-registry' directory exists inside your CLI project (${path.resolve(REGISTRY_PATH, "..")}) and is structured correctly.`));
      process.exit(1);
    }
    const registryContent = await fs.readJson(registryIndexPath);
    return registryContent;
  } catch (error) {
    console.error(chalk.red("Error reading component registry:"), error);
    process.exit(1);
  }
}
async function detectProjectType(projectRoot) {
  try {
    const packageJsonPath = path.join(projectRoot, "package.json");
    if (!await fs.pathExists(packageJsonPath)) {
      console.warn(chalk.yellow("No package.json found, assuming React project"));
      return "react";
    }
    const packageJson = await fs.readJson(packageJsonPath);
    const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };
    if (dependencies.next) {
      console.log(chalk.blue("Detected Next.js project"));
      return "next";
    }
    console.log(chalk.blue("Detected React project"));
    return "react";
  } catch (error) {
    console.warn(chalk.yellow("Error detecting project type, assuming React project"), error);
    return "react";
  }
}
async function getProjectConfig(targetCwd) {
  const cwd = targetCwd;
  const projectType = await detectProjectType(cwd);
  const utilsPathTs = path.join(cwd, "./src/lib/utils.ts");
  const utilsPathJs = path.join(cwd, "./src/lib/utils.js");
  const hasUtils = await fs.pathExists(utilsPathTs) || await fs.pathExists(utilsPathJs);
  const componentsBasePath = path.join(cwd, projectType === "next" ? "./app" : "./src");
  return {
    // Default paths are relative to the target project's CWD
    componentsPath: path.join(cwd, "./components/instant-branding"),
    // Use your requested path
    utilsPath: path.join(cwd, "./src/lib/utils"),
    projectRoot: cwd,
    hasUtils,
    projectType
  };
}
async function detectPackageManager(projectRoot) {
  try {
    const hasBunLock = await fs.pathExists(path.join(projectRoot, "bun.lock"));
    if (hasBunLock) return "bun";
    const hasYarnLock = await fs.pathExists(path.join(projectRoot, "yarn.lock"));
    if (hasYarnLock) return "yarn";
    const hasPnpmLock = await fs.pathExists(path.join(projectRoot, "pnpm-lock.yaml"));
    if (hasPnpmLock) return "pnpm";
    try {
      const packageJsonPath = path.join(projectRoot, "package.json");
      if (await fs.pathExists(packageJsonPath)) {
        const packageJson = await fs.readJson(packageJsonPath);
        if (packageJson.engines && packageJson.engines.bun) {
          return "bun";
        }
        if (packageJson.packageManager) {
          if (packageJson.packageManager.startsWith("bun@")) return "bun";
          if (packageJson.packageManager.startsWith("yarn@")) return "yarn";
          if (packageJson.packageManager.startsWith("pnpm@")) return "pnpm";
          if (packageJson.packageManager.startsWith("npm@")) return "npm";
        }
      }
    } catch (e) {
    }
    return "npm";
  } catch {
    return "npm";
  }
}
async function installDependencies(dependencies, projectRoot) {
  if (!dependencies || dependencies.length === 0) {
    return;
  }
  const packageManager = await detectPackageManager(projectRoot);
  let installCommand;
  switch (packageManager) {
    case "yarn":
      installCommand = `yarn add ${dependencies.join(" ")}`;
      break;
    case "pnpm":
      installCommand = `pnpm add ${dependencies.join(" ")}`;
      break;
    case "bun":
      installCommand = `bun add ${dependencies.join(" ")}`;
      break;
    case "npm":
    default:
      installCommand = `npm install ${dependencies.join(" ")}`;
      break;
  }
  console.log(chalk.blue(`
Installing ${dependencies.length} dependenc${dependencies.length > 1 ? "ies" : "y"} using ${packageManager}: ${dependencies.join(", ")}...`));
  try {
    execSync(installCommand, { cwd: projectRoot, stdio: "inherit" });
    console.log(chalk.green("Dependencies installed successfully."));
  } catch (error) {
    console.error(chalk.red("Failed to install dependencies:"), error);
    console.log(chalk.yellow("Please try installing them manually in the target project directory:"));
    console.log(chalk.cyan(`cd ${projectRoot} && ${installCommand}`));
  }
}
var addCommand = new Command().name("add").description("Add component(s) to your project").argument("[components...]", "Names of the components to add").option("-y, --yes", "Skip confirmation prompts", false).option("-o, --overwrite", "Overwrite existing files without prompting", false).option("-p, --path <path>", "Custom path relative to project root for components (e.g., ./components/my-ui)").option("-c, --cwd <path>", "The working directory. Defaults to the current directory.", process.cwd()).option("--target-dir <path>", "Target directory structure for components (default: components/instant-branding)", "components/instant-branding").option("--project-type <type>", "Explicitly set project type (next or react)", "").action(async (componentsToAdd, options) => {
  const targetCwd = path.resolve(options.cwd);
  console.log(chalk.bold.blue(`Running 'add' command in target directory: ${targetCwd}`));
  if (targetCwd !== process.cwd()) {
    if (!await fs.pathExists(targetCwd)) {
      console.error(chalk.red(`Specified working directory does not exist: ${targetCwd}`));
      process.exit(1);
    }
    console.log(chalk.yellow(`Operating on specified directory (--cwd) instead of current directory.`));
  }
  try {
    let resolveRegistryDeps2 = function(componentName) {
      if (processed.has(componentName)) return;
      const component = registry.find((c) => c.name === componentName);
      if (!component) return;
      componentsToProcess.add(componentName);
      component.dependencies?.forEach((dep) => dependenciesToInstall.add(dep));
      processed.add(componentName);
      component.registryDependencies?.forEach((depName) => {
        if (!processed.has(depName)) {
          resolveRegistryDeps2(depName);
        }
      });
    };
    var resolveRegistryDeps = resolveRegistryDeps2;
    const registry = await getRegistry();
    const availableComponents = registry.map((c) => c.name);
    const config = await getProjectConfig(targetCwd);
    if (options.projectType && (options.projectType === "next" || options.projectType === "react")) {
      config.projectType = options.projectType;
      console.log(chalk.blue(`Using specified project type: ${options.projectType}`));
    }
    let selectedComponents = componentsToAdd || [];
    if (selectedComponents.length === 0) {
      if (options.yes) {
        console.log(chalk.yellow("No components specified and '--yes' flag used. Exiting."));
        process.exit(0);
      }
      const answers = await inquirer.prompt([
        {
          type: "checkbox",
          name: "components",
          message: "Which components would you like to add?",
          choices: availableComponents,
          validate: (input) => input.length > 0 ? true : "Please select at least one component."
        }
      ]);
      selectedComponents = answers.components;
    }
    const invalidComponents = selectedComponents.filter((c) => !availableComponents.includes(c));
    if (invalidComponents.length > 0) {
      console.error(chalk.red(`Unknown components: ${invalidComponents.join(", ")}`));
      console.log(chalk.yellow(`Available components: ${availableComponents.join(", ")}`));
      process.exit(1);
    }
    console.log(chalk.blue(`
Selected components: ${selectedComponents.join(", ")}`));
    const targetComponentDir = options.path ? path.resolve(targetCwd, options.path) : options.targetDir ? path.resolve(targetCwd, options.targetDir) : config.componentsPath;
    console.log(chalk.gray(`Target component directory: ${path.relative(targetCwd, targetComponentDir) || "."}`));
    console.log(chalk.blue(`Project type: ${config.projectType}`));
    await fs.ensureDir(targetComponentDir);
    const componentsToProcess = /* @__PURE__ */ new Set();
    const processed = /* @__PURE__ */ new Set();
    const dependenciesToInstall = /* @__PURE__ */ new Set();
    selectedComponents.forEach(resolveRegistryDeps2);
    console.log(chalk.blue(`
Will process and potentially add: ${Array.from(componentsToProcess).join(", ")}`));
    for (const componentName of componentsToProcess) {
      const component = registry.find((c) => c.name === componentName);
      if (!component) continue;
      console.log(chalk.cyan(`
Processing ${component.name}...`));
      for (const relativeFilePath of component.files) {
        const sourcePath = path.join(REGISTRY_PATH, relativeFilePath);
        if (!await fs.pathExists(sourcePath)) {
          console.warn(chalk.yellow(`  Source file not found for ${componentName}: ${relativeFilePath} (looked in ${REGISTRY_PATH}). Skipping.`));
          continue;
        }
        const fileName = path.basename(relativeFilePath);
        const destinationPath = path.join(targetComponentDir, fileName);
        try {
          const fileExists = await fs.pathExists(destinationPath);
          let shouldCopy = true;
          if (fileExists && !options.overwrite) {
            if (options.yes) {
              console.log(chalk.yellow(`  Skipping existing file ${fileName} (--yes flag used).`));
              shouldCopy = false;
            } else {
              const { confirmOverwrite } = await inquirer.prompt([
                {
                  type: "confirm",
                  name: "confirmOverwrite",
                  message: `File ${chalk.yellow(path.relative(targetCwd, destinationPath))} already exists. Overwrite?`,
                  default: false
                }
              ]);
              if (!confirmOverwrite) {
                console.log(chalk.gray(`  Skipping ${fileName}.`));
                shouldCopy = false;
              }
            }
          }
          if (shouldCopy) {
            console.log(chalk.gray(`  Copying ${relativeFilePath} to ${path.relative(targetCwd, destinationPath)}`));
            await fs.ensureDir(path.dirname(destinationPath));
            await fs.copy(sourcePath, destinationPath, { overwrite: true });
          }
        } catch (copyError) {
          console.error(chalk.red(`  Error copying ${fileName}:`), copyError);
        }
      }
    }
    if (dependenciesToInstall.size > 0) {
      await installDependencies(Array.from(dependenciesToInstall), targetCwd);
    } else {
      console.log(chalk.green("\nNo external dependencies to install for selected components."));
    }
    if (!config.hasUtils && Array.from(componentsToProcess).some((c) => {
      const comp = registry.find((r) => r.name === c);
      return comp?.files.some((f) => f.includes("utils.ts"));
    })) {
      console.log(chalk.yellow("\nSome components may require a utils.ts file with common utilities."));
      if (!options.yes) {
        const { addUtils } = await inquirer.prompt([{
          type: "confirm",
          name: "addUtils",
          message: "Would you like to add a utils.ts file with common utilities?",
          default: true
        }]);
        if (addUtils) {
          const utilsDirPath = path.dirname(config.utilsPath);
          await fs.ensureDir(utilsDirPath);
          const utilsContent = `import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}`;
          const utilsFilePath = `${config.utilsPath}.ts`;
          await fs.writeFile(utilsFilePath, utilsContent);
          console.log(chalk.green(`Created utils file at ${path.relative(targetCwd, utilsFilePath)}`));
          const utilsDeps = ["clsx", "tailwind-merge"];
          const newUtilsDeps = utilsDeps.filter((dep) => !dependenciesToInstall.has(dep));
          if (newUtilsDeps.length > 0) {
            await installDependencies(newUtilsDeps, targetCwd);
          }
        }
      }
    }
    console.log(chalk.bold.green("\nComponents added successfully! \u{1F389}"));
    console.log(chalk.yellow("Make sure you have the necessary base setup (like Tailwind, clsx, tailwind-merge) for your components."));
    if (config.projectType === "next") {
      console.log(chalk.blue("\nFor Next.js projects:"));
      console.log(chalk.yellow('  - Components are added to the "components/instant-branding" directory'));
      console.log(chalk.yellow("  - Make sure to import them with the correct path in your Next.js pages/components"));
    } else {
      console.log(chalk.blue("\nFor React projects:"));
      console.log(chalk.yellow('  - Components are added to the "components/instant-branding" directory'));
      console.log(chalk.yellow("  - Make sure to import them with the correct path in your React components"));
    }
  } catch (error) {
    if (error.isTtyError) {
      console.error(chalk.red("Prompt failed because the environment is not interactive. Use --yes to skip prompts."));
    } else {
      console.error(chalk.red("\nAn error occurred during the add operation:"), error.message);
    }
    process.exit(1);
  }
});

// src/cli.ts
process.on("SIGINT", () => process.exit(0));
process.on("SIGTERM", () => process.exit(0));
async function main() {
  const program = new Command2();
  program.name("my-ui").description("Add UI components to your project").version("0.1.0", "-v, --version", "Output the current version");
  program.addCommand(addCommand);
  program.parse(process.argv);
}
main().catch((error) => {
  console.error("An unexpected error occurred:", error);
  process.exit(1);
});
