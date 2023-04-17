#!/usr/bin/env node

import fs from "fs";
import path from "path";
import inquirer from "inquirer";
import chalk from "chalk";
import { render } from "./utils/template.js";
import { URL } from "url";
import shell from "shelljs";

let __dirname = decodeURI(new URL(".", import.meta.url).pathname);

// Checks if the path starts with a slash, in case of Windows OS
__dirname =
  __dirname.startsWith("/") && process.platform === "win32"
    ? __dirname.substring(1)
    : __dirname;

const CHOICES = fs.readdirSync(
  path.join(__dirname, "templates").split(path.sep).join("/"),
);

const QUESTIONS = [
  {
    name: "template",
    type: "list",
    message: "What template would you like to use?",
    choices: CHOICES,
  },
  {
    name: "name",
    type: "input",
    message: "Please input a new project name:",
  },
  {
    name: "version",
    type: "input",
    message: "Please input a version:",
  },
  {
    name: "description",
    type: "input",
    message: "Please input a description:",
  },
  {
    name: "author",
    type: "input",
    message: "Please input an author:",
  },
];

export interface CliOptions {
  projectName: string;
  templateName: string;
  templatePath: string;
  targetPath: string;
}

const CURR_DIR = process.cwd();

inquirer.prompt(QUESTIONS).then((answers) => {
  const projectChoice = answers["template"];
  const projectName = answers["name"];
  const version = answers["version"];
  const description = answers["description"];
  const author = answers["author"];

  //@ts-ignore
  const templatePath = path.join(__dirname, "templates", projectChoice);
  //@ts-ignore
  const targetPath = path.join(CURR_DIR, projectName);

  const options: CliOptions = {
    //@ts-ignore
    projectName,
    //@ts-ignore
    templateName: projectChoice,
    templatePath,
    targetPath,
  };

  if (!createProject(targetPath)) {
    return;
  }

  //@ts-ignore
  createDirectoryContents(
    templatePath,
    projectName,
    version,
    description,
    author,
  );

  postProcess(options);
});

function createProject(projectPath: string) {
  if (fs.existsSync(projectPath)) {
    console.log(
      chalk.red(`Folder ${projectPath} exists. Delete or use another name.`),
    );
    return false;
  }
  fs.mkdirSync(projectPath);

  return true;
}

const SKIP_FILES = ["node_modules", ".template.json"];

function createDirectoryContents(
  templatePath: string,
  projectName: string,
  version: string,
  description: string,
  author: string,
) {
  // read all files/folders (1 level) from template folder
  const filesToCreate = fs.readdirSync(templatePath);
  // loop each file/folder
  filesToCreate.forEach((file) => {
    const origFilePath = path.join(templatePath, file);

    // get stats about the current file
    const stats = fs.statSync(origFilePath);

    // skip files that should not be copied
    if (SKIP_FILES.indexOf(file) > -1) return;

    if (stats.isFile()) {
      // read file content and transform it using template engine
      let contents = fs.readFileSync(origFilePath, "utf8");
      contents = render(contents, {
        projectName,
        version,
        description,
        author,
      });
      // write file to destination folder
      const writePath = path.join(CURR_DIR, projectName, file);
      fs.writeFileSync(writePath, contents, "utf8");
    } else if (stats.isDirectory()) {
      // create folder in destination folder
      fs.mkdirSync(path.join(CURR_DIR, projectName, file));
      // copy files/folder inside current folder recursively
      createDirectoryContents(
        path.join(templatePath, file),
        path.join(projectName, file),
        path.join(version, file),
        path.join(description, file),
        path.join(author, file),
      );
    }
  });
}

function postProcess(options: CliOptions) {
  const isNode = fs.existsSync(path.join(options.templatePath, "package.json"));
  if (isNode) {
    shell.cd(options.targetPath);
    shell.echo("\nInstalling npm packages ...");

    const result = shell.exec("npm install");
    if (result.code !== 0) {
      return false;
    }

    const prismaResult = shell.exec("npx prisma generate");
    if (prismaResult.code !== 0) {
      return false;
    }
  }

  return true;
}
