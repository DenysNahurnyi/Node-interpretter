const app = require('../app.js');

exports.funcResult = function(func, lineDescribeObject, GlobalContext) {
    let funcName = (/(\w+)[(].+[)]/.exec(func))[1];
    switch(funcName){
        case 'ConsistIn': {
            let result = /^ConsistIn[(](.+), (.+)[)]/.exec(func);
            result[1] = app.isFunction(result[1]) ? exports.funcResult(result[1], lineDescribeObject, GlobalContext) : result[1];
            result[2] = app.isFunction(result[2]) ? exports.funcResult(result[2], lineDescribeObject, GlobalContext) : result[2];
            let regexp = new RegExp(GlobalContext[result[1]]);
            let string = GlobalContext[result[2]];
            lineDescribeObject.comment = "Processing function ConsistIn";
            lineDescribeObject.parentId = -1;

            return regexp.test(string);
        }
        case 'IndexOf': {
            let result = /^IndexOf[(](.+), (.+)[)]/.exec(func);
            console.log(`Results of exec : ${result[1]} and ${result[2]}`)
            let value = result[1], string = result[2];
            if(app.isFunction(value)) {
                while(app.isFunction(value)){
                    console.log(`Result 1 before transform: ${value}`)
                    value = exports.funcResult(value, lineDescribeObject, GlobalContext)
                    console.log(`Result 1 after transform: ${value} and it's function: ${app.isFunction(value)}`)    
                }            
            } else {
                value = GlobalContext[result[1]];
                console.log(`Value 1 : ${value}`)
            }
            if(app.isFunction(string)) {
                while(app.isFunction(string)){
                    console.log(`Result 1 before transform: ${string}`)
                    value = exports.funcResult(string, lineDescribeObject, GlobalContext)
                    console.log(`Result 1 after transform: ${string} and it's function: ${app.isFunction(string)}`)    
                }            
            } else {
                console.log(`Value 2: ${GlobalContext[result[2]]}`)
                string = GlobalContext[result[2]].toString();
            }
            lineDescribeObject.comment = "Processing fuction IndexOf";
            lineDescribeObject.parentId = -1;

            return string.indexOf(value);
        }
    }
}