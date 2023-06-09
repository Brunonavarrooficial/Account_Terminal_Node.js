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
                'Transferencia',
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
            } else if (action === 'Transferencia') {
                transfer()
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

function deposit() {
    inquirer.prompt([
        {
            name: 'accountName',
            message: 'Qual o nome da sua conta?'
        }
    ])
        .then((answer) => {
            const accountName = answer['accountName']

            if (!checkAccount(accountName)) {
                return deposit()
            }

            inquirer.prompt([
                {
                    name: 'amount',
                    message: 'Quanto você deseja depositar',
                },
            ]).then((answer) => {
                const amount = answer['amount']

                addAmount(accountName, amount)
                operation()

            }).catch((err) => console.log(err))
        })
        .catch((err) => console.log(err))
}

function checkAccount(accountName) {
    if (!fs.existsSync(`accounts/${accountName}.json`)) {
        console.log(chalk.bgRed.black('Esta conta não existe, escolha outro nome!'))
        return false
    }
    return true
}

function addAmount(accountName, amount) {
    const accountData = getAccount(accountName)

    if (!amount) {
        console.log(chalk.bgRed.black('Ocorreu um erro, tente novamente mais tarde!'))
        return deposit()
    }

    accountData.balance = parseFloat(amount) + parseFloat(accountData.balance)

    fs.writeFileSync(
        `accounts/${accountName}.json`,
        JSON.stringify(accountData),
        function (err) {
            console.log(err)
        },
    )

    console.log(chalk.green(`Foi Depositado o valor de R$${amount} na sua conta!`))


}

function getAccount(accountName) {
    const accountJSON = fs.readFileSync(`accounts/${accountName}.json`, {
        encoding: 'utf-8',
        flag: 'r'
    })

    return JSON.parse(accountJSON)

}

function getAccountBalance() {
    inquirer.prompt([
        {
            name: 'accountName',
            message: 'Qual o nome da sua conta?'
        }
    ]).then((answer) => {
        const accountName = answer['accountName']

        if (!checkAccount(accountName)) {
            return getAccountBalance()
        }

        const accountData = getAccount(accountName)

        console.log(chalk.bgBlue.black(
            `Olá, o saldo da sua conta é de R$${accountData.balance}`
        ))

        operation()

    }).catch((err) => console.log(err))
}

function withDraw() {
    inquirer.prompt([
        {
            name: 'accountName',
            message: 'Qual o nome da sua conta?'
        }
    ]).then((answer) => {

        const accountName = answer['accountName']

        if (!checkAccount(accountName)) {
            return withDraw()
        }

        inquirer.prompt([
            {
                name: 'amount',
                message: 'Quanto você deseja sacar?'
            }
        ]).then((answer) => {

            const amount = answer['amount']

            removeAmount(accountName, amount)

        }).catch(err => console.log(err))

    }).catch((err) => console.log(err))
}

function removeAmount(accountName, amount) {

    const accountData = getAccount(accountName)

    if (!amount) {
        console.log(chalk.bgRed.black('Ocorreu um erro tente novamente mais tarde!'))
        return withDraw()
    }

    if (accountData.balance < amount) {
        console.log(chalk.bgRed.black('saldo atual é: ' + 'R$' + accountData.balance + ' você tem R$1000 de saldo no cheque especial'))
    }

    accountData.balance = parseFloat(accountData.balance) - parseFloat(amount)

    if (accountData.balance < -1000) {
        console.log(chalk.bgRed.black('Valor limite indisponível! o valor solicitado de: ' + 'R$' + amount + ' ultrapassou o cheque especial !'))
        return withDraw()
    }

    fs.writeFileSync(
        `accounts/${accountName}.json`,
        JSON.stringify(accountData),
        function (err) {
            console.log(err)
        }
    )

    console.log(chalk.green(`Foi Realizado um saque de R$${amount} da sua conta!`))
    chalkResult(accountData)

    operation()

}

function transfer() {
    inquirer.prompt([
        {
            name: 'accountName',
            message: 'Qual o nome da sua conta?'
        },
        {
            name: 'accountTransfer',
            message: 'Qual conta deseja realizar a transferência?'
        },
        {
            name: 'amount',
            message: 'Quanto deseja transferir?'
        }
    ]).then((answer) => {

        const accountName = answer['accountName']
        const accountTransfer = answer['accountTransfer']
        const amount = answer['amount']

        if (!checkAccount(accountName)) {
            return transfer()
        }

        if (!checkAccount(accountTransfer)) {
            return transfer()
        }

        if (!amount) {
            console.log(chalk.bgRed.black('Ocorreu um erro tente novamente mais tarde!'))
            return transfer()
        }

        transferAmount(accountName, accountTransfer, amount)

    }).catch((err) => console.log(err))
}



function transferAmount(accountName, accountTranfer, amount) {
    const accountData = getAccount(accountName)
    const accountDataTransfer = getAccount(accountTranfer)

    if (accountData.balance < amount) {
        console.log(chalk.bgRed.black('saldo atual é: ' + 'R$' + accountData.balance + ' você tem R$1000 de saldo no cheque especial'))
    }

    accountData.balance = parseFloat(accountData.balance) - parseFloat(amount)
    accountDataTransfer.balance = parseFloat(accountDataTransfer.balance) + parseFloat(amount)

    if (accountData.balance < -1000) {
        console.log(chalk.bgRed.black('Valor limite indisponível! o valor solicitado de: ' + 'R$' + amount + ' ultrapassou o cheque especial !'))
        return transfer()
    }

    compileFile(accountData, accountName)
    compileFile(accountDataTransfer, accountTranfer)

    console.log(chalk.green(`Foi Realizado uma transferência no valor de R$${amount} para conta ${accountTranfer}!`))
    chalkResult(accountData)

    operation()

}

function chalkResult(acount) {
    if (acount.balance > 0) {
        console.log(chalk.green(`Saldo Atual é de: R$${acount.balance}`))
    } else {
        console.log(chalk.bgRed.black(`Saldo Atual é de: R$${acount.balance}`))
    }
}

function compileFile(file, fileOriginal) {
    return fs.writeFileSync(
        `accounts/${fileOriginal}.json`,
        JSON.stringify(file),
        function (err) {
            console.log(err)
        }
    )
}