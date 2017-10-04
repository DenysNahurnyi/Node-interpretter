const fs = require('fs');
const f = require('./functions/funcResult.js')
const GlobalContext = {};
GlobalContext.code = []

let text = (fs.readFileSync(`${__dirname}/files/text.txt`)).toString();
let code = (fs.readFileSync(`${__dirname}/files/code.txt`)).toString();

// console.log(`${code} and ${text}`);

exports.isFunction = function (str) {
    return /\w+[(].+[)]/.test(str)
}


codeArr = code.split('\r\n');
codeArr = codeArr.filter(item => item.length)
GlobalContext.ifIsOpened = false;
function main(codeArrLocal){
    let tmp, action = null;
    try {
        for(let i = 0; i < codeArrLocal.length; i++){
            tmp = {
                Id: i + 1
            };
            action = whatAction(codeArrLocal[i]);
            if(notCondition(action)) processLine(codeArrLocal[i], tmp, action);
            else {
                i += processCondition(codeArrLocal[i], tmp, action, codeArrLocal, i)
            }

            GlobalContext.code.push(tmp);
            console.log(`Line ${i} processed...\n`)
        }
    } catch(err) {
        console.log(`Error happened with "${tmp.comment}" on line ${tmp.Id}`);
        console.log(`This is Syntax error`);
        console.log(GlobalContext);
        throw err
    } finally {
        // console.log(GlobalContext);
    }
}

function processCondition(line, tmp, action, codeArrLocal, outerIndex) {
    GlobalContext.ifIsOpened = true
    if(action == 'ifCond') {
        tmp.ifContentLength = 0;
        tmp.ifCodeContent = [];
        for(let j = outerIndex + 1; j < codeArrLocal.length; j++) {
            if(/^\t.+/.test(codeArrLocal[j])) {
                tmp.ifContentLength++;
                tmp.ifCodeContent.push(codeArrLocal[j]);
            } else if(/^if.+/.test(codeArrLocal[j])){
                tmp.elseId = -1;
                break;
            } else if(/^else.+/.test(codeArrLocal[j])){
                tmp.elseId = j;
                break;
            }
        }
        let conditionFunc = /^if[ ]?[(](.+)[)]/.exec(codeArrLocal[outerIndex])[1];
        const conditionResult = f.funcResult(conditionFunc, tmp, GlobalContext);
        tmp.ifCodeContent = tmp.ifCodeContent.map(item =>  item.replace(/^\t/, ""))
        tmp.ifCodeContent.map(item => console.log(`ifCodeContent item: ${item}`));
        if(conditionResult) {
            console.log(`If on line ${tmp.Id} executing`)
            main(tmp.ifCodeContent)
        } else {
            console.log(`If on line ${tmp.Id} not executing`)
        }
        return tmp.ifCodeContent.length;    
    }
    else if(action == 'whileCond') {
        
    }
    else if(action == 'elseCond') throw new Error("Else can not be without if");
}


function processLine(line, tmp, action) {
    switch(action) {// Variable declaration
    case "VarDecl" :{
        varDecl(line, tmp);
        break;
    }
    // My own console.log
    case "ShowFunc": {
        Show(line, tmp);
        break;
    }
    // Intendation of smth to variable
    case "funcIntendation":{
        let func = (/^(\w+) = (\w+[(].+[)])/.exec(line));
        GlobalContext[func[1]] = f.funcResult(func[2], tmp, GlobalContext);
        break;
    }
        // This is string intendation
    case "stringIntendation":{ 
        tmp.comment = "Processing intentdation String value to variable";
        tmp.parentId = -1;
        let result = /^(\w) = ["](.+)["]/.exec(line);
        GlobalContext[result[1]] = result[2];
        break;
    }
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
        if(exports.isFunction(line)) return "funcIntendation";
        if(/^\w = ["](.+)["]/.test(line)) return "stringIntendation";
    }
    else if(/^if[(]/.test(line)) return "ifCond";
    else if(/^else[(]/.test(line)) return "elseCond";
    else if(/^while[(]/.test(line)) return "whileCond";
    // throw new Error(`Syntax error, unknown code: ${line}`)
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
    let result = /^var (\S+)/.exec(line);
    tmp.variableName = result[1];
    GlobalContext[tmp.variableName] = "Hello";
}

main(codeArr);

