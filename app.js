const fs = require('fs');
const f = require('./functions/funcResult.js')
const GlobalContext = {};
GlobalContext.code = []

let text = (fs.readFileSync(`${__dirname}/files/text.txt`)).toString();
let code = (fs.readFileSync(`${__dirname}/files/code.txt`)).toString();

// console.log(`${code} and ${text}`);

let whileReg = new RegExp(/\w+/);

codeArr = code.split('\r\n');
codeArr = codeArr.filter(item => item.length)
GlobalContext.ifIsOpened = false;
let tmp, action = null;
try {
    for(let i = 0; i < codeArr.length; i++){

        tmp = {
            Id: i + 1
        };
        action = whatAction(codeArr[i]);
        if(notCondition(action)) processLine(codeArr[i], tmp, action);
        else {
            console.log("cond")
        }

        GlobalContext.code.push(tmp);
        console.log(`Line ${i} processed...\n`)
    }
} catch(err) {
    console.log(`Error happened with "${tmp.comment}" on line ${tmp.Id}`);
    throw err
}
console.log(GlobalContext);

function processLine(line, tmp, action) {
    console.log("qwdwq",action)
    switch(action) {// Variable declaration
    case "VarDecl" :
        varDecl(line, tmp);
        break;
    // My own console.log
    case "ShowFunc":
        Show(line, tmp);
        break;
    // Intendation of smth to variable
    case "funcIntendation":
        let func = (/^(\w+) = (\w+[(].+[)])/.exec(line));
        GlobalContext[func[1]] = f.funcResult(func[2], tmp, GlobalContext);
        break;
        // This is string intendation
    case "stringIntendation": 
        tmp.comment = "Processing intentdation String value to variable";
        tmp.parentId = -1;
        let result = /^(\w) = ["](\w+)["]/.exec(line);
        GlobalContext[result[1]] = result[2];
        break;
    default: return;
    // else if(/^if/.test(line)) {
    //     let result = /^if[()](\w+)[)]/.exec(line);

    // }
    // else if(/^else/.test(line)) console.log("else cond");
    // else if(/^while/.test(line)) console.log("While cond");}
    }
}

function notCondition(action) {
    if(action == "ifCond") return false;
    else if(action == "elseCond") return false;
    else if(action == "whileCond") return false;
    else return true;
}

function whatAction(line) {
    if(/^var/.test(line)) return "VarDecl";
    else if(/^Show/.test(line)) return "ShowFunc";
    // Some kind of intendation
    else if(/^\w = .+/.test(line)) {
        if(/^\w = (\w+)[(]/.test(line)) return "funcIntendation";
        if(/^\w = ["](\w+)["]/.test(line)) return "stringIntendation";
    }
}

function Show(line, tmp) {
    tmp.comment = "Showing variable content";
    tmp.parentId = -1;
    let result = /^Show[(](.+)[)]/.exec(line);
    let varName = result[1];
    console.log(`Showing variable "${varName}" content: ${GlobalContext[varName]}`)
}

function varDecl(line, tmp) {
    tmp.comment = "Variable declaration";
    tmp.parentId = -1;
    let result = /^var (.+)/.exec(line);
    tmp.variableName = result[1];
    GlobalContext[tmp.variableName] = "Hello";
}

