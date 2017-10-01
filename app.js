const fs = require('fs');
const GlobalContext = {};
GlobalContext.code = []

let text = (fs.readFileSync(`${__dirname}/files/text.txt`)).toString();
let code = (fs.readFileSync(`${__dirname}/files/code.txt`)).toString();

// console.log(`${code} and ${text}`);

let whileReg = new RegExp(/\w+/);

codeArr = code.split('\r\n');
codeArr = codeArr.filter(item => item.length)
let tmp;
try {
    
    codeArr.map((line, index) => {
        tmp = {
            Id: index + 1
        };
        // Variable declaration
        if(/^var/.test(line)) {
            tmp.comment = "Variable declaration";
            tmp.parentId = -1;
            let result = /^var (.+)/.exec(line);
            tmp.variableName = result[1];
            GlobalContext[tmp.variableName] = "Hello";
        }
        // My own console.log
        else if(/^Show/.test(line)) {
            tmp.comment = "Showing variable content";
            tmp.parentId = -1;
            let result = /^Show[(](.+)[)]/.exec(line);
            let varName = result[1];
            console.log(`Showing variable "${varName}" content: ${GlobalContext[varName]}`)
        }
        // If this is variable intendation of result of some function
        else if(/^\w = .+/.test(line)) {
            if(/^\w = (\w+)[(]/.test(line)){
                let func = (/^\w = (\w+)[(]/.exec(line))[1];
                switch(func){
                    case 'ConsistIn': {
                        tmp.comment = "Processing fuction ConsistIn";
                        tmp.parentId = -1;
                        let result = /^(\w) = ConsistIn[(](\w), (\w)[)]/.exec(line);

                        let regexp = new RegExp(GlobalContext[result[2]]);
                        let string = GlobalContext[result[3]];

                        GlobalContext[result[1]] = regexp.test(string)
                        break;
                    }
                    case 'IndexOf': {
                        tmp.comment = "Processing fuction IndexOf";
                        tmp.parentId = -1;
                        let result = /^(\w) = IndexOf[(](\w), (\w)[)]/.exec(line);

                        let value = GlobalContext[result[2]];
                        let string = GlobalContext[result[3]].toString();

                        GlobalContext[result[1]] = string.indexOf(value)
                        break;
                    }
                }
            }
            if(/^\w = ["](\w+)["]/.test(line)) {
                tmp.comment = "Processing intentdation String value to variable";
                tmp.parentId = -1;
                let result = /^(\w) = ["](\w+)["]/.exec(line);
                GlobalContext[result[1]] = result[2]
            }
        }
        else if(/^if/.test(line)) console.log("if cond");
        else if(/^else/.test(line)) console.log("else cond");
        else if(/^while/.test(line)) console.log("While cond");
        GlobalContext.code.push(tmp);
        console.log(`Line ${index} processed...\n`)
    })
} catch(err) {
    console.log(`Error happened with "${tmp.comment}" on line ${tmp.Id}`);
    throw err
}
console.log(GlobalContext);

// for(line of codeArr) {
//     // let tmp = {};

//     console.log("line: ", line)
//     // console.log(whileReg.exec(line));
//     // let result = whileReg.exec(line);

    
// }