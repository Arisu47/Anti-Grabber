const fs = require("fs")
const colors = require("colors")
const glob = require("glob");
const readline = require('readline');
const { exec } = require('child_process');
const { promisify } = require('util');
const { resolve } = require('path');
const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);

const LOCAL = process.env.LOCALAPPDATA
const blocked_words = ["https://discordapp.com/api/v6/users/@me", "\\.minecraft\\launcher_profiles.json", "0x", "MinecraftStealer", "TokenStealer", "CHROME_DATA", "USERPROFILE", "WEBHOOK_URL", "webhooks", "mfa", "email", "password", "EMAIL", "PASSWORD", "Grabber", "leveldb", "local storage", "grabber", "appdata", "AppData", 'APPDATA', 'LOCALAPPDATA', `/"mfa.[\d\w_-]{84}"/;`, `/"[\d\w_-]{24}\.[\d\w_-]{6}\.[\d\w_-]{27}"/`, 'Local Storage', 'tokens', "GrabToken", 'grabtoken', 'webhook', 'LOCAL', 'ROAMING', 'local', 'Local', 'Roaming', 'roaming', 'User Data', 'WEBHOOK']

console.log('[ANTI-GRABBER] Iniciando...'.green)

var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question("Escolha um metodo de escaneamento \n \n[1] Stealer \n[2] Arquivo \n[3] Monitorar Discord \n\nInput: ", function (answer) {

    if (answer == 1) {
        fs.readdirSync(`${LOCAL}/Temp`).forEach(temp => {

            fs.rmSync(`${LOCAL}/Temp/${temp}`, { recursive: true, force: true }, err => { if (err) return })

        })
        console.log(`[X] Procurando Stealer...`.green)

        var discords = [];
        fs.readdirSync(LOCAL).forEach(file => {
            if (file.includes("iscord")) {
                discords.push(LOCAL + '\\' + file)

            } else {
                return;
            }
        });

        discords.forEach(file => {

            const pattern = `${file}` + "\\app-*\\modules\\discord_desktop_core-*\\discord_desktop_core\\index.js"
            glob.sync(pattern).map(files => {

                fs.readFile(files, 'utf-8', (err, data) => {
                    const removeGrabber = fs.writeFileSync(files, `module.exports = require('./core.asar')`)

                    if (err) {
                        return console.log(`[V] Erro foi encontrado: ${err}`.red)
                    }

                    function checkWords(words) {
                        if (data.includes(words)) {
                            console.log(`[X] Foi encontrada a palavra ${words} na pasta ${file}!`.red)
                        
                        } else {
                            return;
                        }

                    }

                    blocked_words.forEach(checkWords, removeGrabber)

                })

            })

        })
        console.log(`[✔] Nenhum Token Grabber foi encontrado em alguma pasta do discord! Checando os proximos`.green)
    }

    if (answer == 2) {
        rl.question("O arquivo que será verificado está na pasta Verificar na pasta inicial do programa? ", function (answer) {
            console.log('[X] Procurando Grabber...'.green)

            async function getFiles(dir) {
                const subdirs = await readdir(dir);
                const files = await Promise.all(subdirs.map(async (subdir) => {
                    const res = resolve(dir, subdir);
                    return (await stat(res)).isDirectory() ? getFiles(res) : res;
                }));
                return files.reduce((a, f) => a.concat(f), []);
            }

            getFiles('./Verificar/')
                .then(files => {
                    files.forEach(file => {
                        if (file.endsWith(".exe")) {
                            fs.readFile(file, 'binary', (err, data) => {
                                if (err) {
                                    return console.log(`[V] Erro foi encontrado: ${err}`.red)
                                }

                                function checkWords(words) {
                                    if (data.includes(words)) {
                                        console.log(`[X] Foi encontrada a palavra ${words} na pasta ${file}!`.red)

                                    }
                                }
                                blocked_words.forEach(checkWords)
                            })
                        }
                        if (file.endsWith(".js") || file.endsWith(".bat") || file.endsWith(".cmd") || file.endsWith(".py") || file.endsWith(".ps1") || file.endsWith(".lua") || file.endsWith(".java") || file.endsWith(".php") || file.endsWith(".go")) {

                            fs.readFile(file, 'utf-8', (err, data) => {
                                if (err) {
                                    return console.log(`[V] Erro foi encontrado: ${err}`.red)
                                }

                                function checkWords(words) {
                                    if (data.includes(words)) {
                                        console.log(`[X] Foi encontrada a palavra ${words} na pasta ${file}!`.red)
                                        if (data.includes("0x")) {
                                            console.log(`[*] 0x foi encontrado no codigo! Usado normalmente em ofuscação de codigo para dificultar, tome cuidado com o arquivo!`.yellow)
                                        }
                                    }
                                }
                                blocked_words.forEach(checkWords)
                            })
                        }
                    })
                })
                .catch(e => console.error(e));
            console.log(`[✔] Nenhum Token Grabber foi encontrado em uma pasta`.green)

        })
        
    }
    if(answer == 3) {
        console.log(`Estarei monitorando, se algo for alterado, reinicie seu Discord.`)

        setInterval(() => {
            var discords = [];
            fs.readdirSync(LOCAL).forEach(file => {
                if (file.includes("iscord")) {
                    discords.push(LOCAL + '\\' + file)
    
                } else {
                    return;
                }
            });
    
            discords.forEach(file => {
    
                const pattern = `${file}` + "\\app-*\\modules\\discord_desktop_core-*\\discord_desktop_core\\index.js"
                glob.sync(pattern).map(files => {
    
                    fs.readFile(files, 'utf-8', (err, data) => {
                        const removeGrabber = fs.writeFileSync(files, `module.exports = require('./core.asar');`)

                        if (err) {
                            return console.log(`[V] Erro foi encontrado: ${err}`.red)
                        }
    
                        function checkWords(words) {
                            if (data.includes(words)) {
                                console.log(`[X] Foi encontrada a palavra ${words} na pasta ${file}!`.red)
                                     
                                       
                            }
                            if(err == null) return null
                        }
                        
                        blocked_words.forEach(checkWords, removeGrabber)
                        
                    })
                })
    
            })            
        }, 1);
    }

});