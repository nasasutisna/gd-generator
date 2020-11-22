#!/usr/bin/env node
const inquirer = require('inquirer');
const { mkdirSync, existsSync, writeFile, readFile } = require('fs');

String.prototype.capitalize = function () {
  return this.replace(/^(.)|\s+(.)/g, c => c.toUpperCase());
}

const MainFolder = {
  "core": "core",
  "modules": "modules",
  "shared": "shared"
}

const SubFolder = {
  "authentication": "authentication",
  "guard": "guard",
  "http": "http",
  "interceptors": "interceptores",
  "services": "services",
  "storage": "storage",
  "utils": "utils",
  "components": "components",
  "helper": "helper",
  "directives": "directives",
  "pipes": "pipes"
};

const SubFolder2 = {
  "bloc": "bloc",
  "library": "library",
  "native": "native",
  "api": "api",
  "dto": "dto",
  "helper": "helper"
};

Object.freeze(MainFolder);
Object.freeze(SubFolder);
Object.freeze(SubFolder2);

const createServiceTSFile = function _createServiceTSFile(className, pageName, folder, extension) {
  /** replace file */
  const templateService = '/gd-generator/example-service.ts';
  const cwd = process.cwd();

  readFile(cwd + templateService, 'utf-8', function (err, data) {
    if (err) console.log(err);
    let newValue = data.replace(/ExampleClassName/g, `${className}${extension.capitalize()}`);
    writeFile(`${cwd}/${folder}/${pageName}.${extension}.ts`, newValue, 'utf-8', function (err) {
      if (err) throw err;
      createServiceSpecFile(className, pageName, folder, extension);
    });
  });
  /** end */
}

const createEmptyFile = function _createEmptyFile(pageName, folder, extension) {
  /** replace file */
  // const template = '/src/template/dto/example.dto.ts';
  const cwd = process.cwd();
  writeFile(`${cwd}/${folder}/${pageName}.${extension}.ts`, '', 'utf-8', function (err) {
    if (err) throw err;
    console.info(`Successfully created! ${folder}/${pageName}.${extension}.ts`);
  });
  /** end */
}

const createServiceSpecFile = function _createServiceSpecFile(className, pageName, folder, extension) {
  /** replace template spec */
  const cwd = process.cwd();
  const templateSpecService = '/gd-generator/example-service.spec.ts';
  readFile(cwd + templateSpecService, 'utf-8', function (err, data) {
    if (err) console.log(err);
    let newValue2 = data.replace(/ExampleClassName/g, `${className}${extension.capitalize()}`);
    newValue2 = newValue2.replace(/example.service/g, `${pageName}.${extension}`);

    writeFile(`${cwd}/${folder}/${pageName}.${extension}.spec.ts`, newValue2, 'utf-8', function (err) {
      if (err) throw err;
      console.info(`Successfully created! ${folder}/${pageName}.${extension}.ts`);
    });
  });
  /** end */
}

const createDirectory = async function _createDir(main = null, subFolder = null, subFolder2 = null, subFolder3 = null) {
  let dir = `./src/app/${main}`;
  if (subFolder && !subFolder2 && !subFolder3) {
    dir = `./src/app/${main}/${subFolder}`;
  } else if (subFolder && subFolder2 && !subFolder3) {
    dir = `./src/app/${main}/${subFolder}/${subFolder2}`;
  } else if (subFolder && subFolder2 && subFolder3) {
    dir = `./src/app/${main}/${subFolder}/${subFolder2}/${subFolder3}`;
  }

  if (!existsSync(dir)) {
    mkdirSync(dir);
  }
}

const createPage = async function _createPage(pageType, pageName, className) {
  let folder = '';
  switch (pageType) {
    case "bloc":
      folder = `./src/app/core/services/bloc/${pageName}`;
      await createDirectory(MainFolder.core);
      await createDirectory(MainFolder.core, SubFolder.services);
      await createDirectory(MainFolder.core, SubFolder.services, SubFolder2.bloc);
      await createDirectory(MainFolder.core, SubFolder.services, SubFolder2.bloc, pageName);
      createServiceTSFile(className, pageName, folder, pageType);
      break;
    case "library":
      folder = `./src/app/core/services/library/${pageName}`;
      await createDirectory(MainFolder.core);
      await createDirectory(MainFolder.core, SubFolder.services);
      await createDirectory(MainFolder.core, SubFolder.services, SubFolder2.library);
      await createDirectory(MainFolder.core, SubFolder.services, SubFolder2.library, pageName);
      createServiceTSFile(className, pageName, folder, pageType);
      break;
    case "native":
      folder = `./src/app/core/services/native/${pageName}`;
      await createDirectory(MainFolder.core);
      await createDirectory(MainFolder.core, SubFolder.services);
      await createDirectory(MainFolder.core, SubFolder.services, SubFolder2.native);
      await createDirectory(MainFolder.core, SubFolder.services, SubFolder2.native, pageName);
      createServiceTSFile(className, pageName, folder, pageType);
      break;
    case "api":
      folder = `./src/app/core/http/api/${pageName}`;
      await createDirectory(MainFolder.core);
      await createDirectory(MainFolder.core, SubFolder.http);
      await createDirectory(MainFolder.core, SubFolder.http, SubFolder2.api);
      await createDirectory(MainFolder.core, SubFolder.http, SubFolder2.api, pageName);
      createServiceTSFile(className, pageName, folder, pageType);
      break;
    case "dto":
      folder = `./src/app/core/http/dto`;
      await createDirectory(MainFolder.core);
      await createDirectory(MainFolder.core, SubFolder.http);
      await createDirectory(MainFolder.core, SubFolder.http, SubFolder2.dto);
      createEmptyFile(pageName, folder, pageType);
      break;
    case "helper":
      folder = `./src/app/shared/helper`;
      await createDirectory(MainFolder.shared);
      await createDirectory(MainFolder.shared, SubFolder.helper);
      createEmptyFile(pageName, folder, pageType);
      break;
    default:
      break;
  }
}

const inputFileName = function _inputFileName(pageType) {
  inquirer
    .prompt([
      {
        type: "input",
        message: "Input filename:",
        name: "fileName",
      }
    ])
    .then(async (result) => {
      if (result.fileName) {
        const pageName = result.fileName.split(' ').join('-');
        const splitClassName = result.fileName.split('-').join(' ').capitalize();
        const className = splitClassName.split(' ').join('');
        createPage(pageType, pageName, className)
      }
    })
}

const main = function _typePage() {
  inquirer
    .prompt([
      {
        type: "list",
        message: "Select type page:",
        name: "page",
        choices: ["library", "bloc", "native", "api", "dto", "helper"]
      }
    ])
    .then(async ({ page }) => {
      inputFileName(page);
    })
    .catch(error => {
      console.log(error);

      if (error.isTtyError) {
        // Prompt couldn't be rendered in the current environment
      } else {
        // Something else went wrong
      }
    });
}

main();
