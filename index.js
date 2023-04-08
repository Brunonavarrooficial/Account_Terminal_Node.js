// modulos externos
const inquirer = require('inquirer')
const chalk = require('chalk')

//modulops internos
const fs = require('fs')

operation()

function operation() {
    inquirer.prompt([
        {
            type: 'list',
            name: 'action',
            message: 'O que você deseja fazer?',
            choices: [
                'Criar Conta',
                'Consultar Saldo',
                'Depositar',
                'Sacar',
                'Sair'
            ],
        },
    ])
        .then((answer) => {
            const action = answer['action']

            if (action === 'Criar Conta') {
                createAccount()
            } else if (action === 'Depositar') {
                deposit()
            } else if (action === 'Consultar Saldo') {
                getAccountBalance()
            } else if (action === 'Sacar') {
                withDraw()
            } else if (action === 'Sair') {
                console.log(chalk.bgBlue.black('Obrigado por usar o Accounts! '))
                process.exit()
            }
        })
        .catch((err) => console.log(err))
}

function createAccount() {
    console.log(chalk.bgGreen.black('Parabéns por escolher o nosso banco!'))
    console.log(chalk.green('Defina as opções da sua conta'))
    buildAccount()
}

function buildAccount() {

    inquirer.prompt([
        {
            name: 'accountName',
            message: 'Digite um nome para sua conta',
        },
    ]).then((answer) => {
        const accountName = answer['accountName']
        console.info(accountName)

        if (!fs.existsSync('accounts')) {
            fs.mkdirSync('accounts')
        }

        if (fs.existsSync(`accounts/${accountName}.json`)) {
            console.log(chalk.bgRed.black('Está conta já existe, Crie com outro nome'))
            buildAccount()
            return
        }

        fs.writeFileSync(
            `accounts/${accountName}.json`,
            '{ "balance": 0 }',
            function (err) {
                console.log(err)
            },
        )

        console.log(chalk.green(`Parabéns, sua conta: ${accountName} foi criada com sucesso! `))
        operation()

    }).catch((err) => console.log(err))
}