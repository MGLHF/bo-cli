#!/usr/bin/env node
const fs = require('fs');
const program = require('commander');
const download = require('download-git-repo');
const handlebars = require('handlebars');
const inquirer = require('inquirer');
const ora = require('ora');
const chalk = require('chalk');
const symbols = require('log-symbols');
program.version('1.0.0', '-v, --version')
  .command('init <name>')
  .action((name) => {
    if (!fs.existsSync(name)) {
      inquirer.prompt([
        {
          type: 'list',
          name: 'proType',
          message: '请选择项目类型',
          choices: [
            { name: '普通react项目', value: 'https://github.com:MGLHF/clone-demo#master' },
            { name: 'vue+react微前端项目', value: 'https://github.com:MGLHF/bo-cli-pro#master' }
          ]
        },
        {
          type: 'input',
          name: 'description',
          message: '请输入项目描述'
        },
        {
          name: 'author',
          message: '请输入作者名称'
        }
      ]).then((answers) => {
        const spinner = ora('正在下载模板...');
        spinner.start();
        download(answers.proType, name, { clone: true }, (err) => {
          if (err) {
            spinner.stop();
            console.log(symbols.error, chalk.red(err));
            return;
          } else {
            const fileName = `${name}/package.json`;
            const meta = {
              name,
              description: answers.description,
              author: answers.author
            }
            if (fs.existsSync(fileName)) {
              const content = fs.readFileSync(fileName).toString();
              const result = handlebars.compile(content)(meta);
              fs.writeFileSync(fileName, result);
            }
            spinner.stop();
            console.log(`${symbols.success} ${chalk.green('项目初始化完成')}`);
            console.log(`${chalk.bgWhite.black('项目启动')}`);
            console.log(`${chalk.yellow(`cd ${name}`)}`);
            console.log(`${chalk.yellow('npm install')}`);
            console.log(`${chalk.yellow('npm run dev')}`);
            // console.log(`${chalk.green(`访问地址：localhost:8082`)}`);
          }
        })
      })
    } else {
      // 错误提示项目已存在，避免覆盖原有项目
      console.log(symbols.error, chalk.red('项目已存在'));
    }
  })
program.parse(process.argv);