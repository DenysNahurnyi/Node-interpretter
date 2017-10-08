const app = require('../app.js');

exports.funcResult = function(func, lineDescribeObject, GlobalContext) {
    let funcName = (/(\w+)[(].+[)]/.exec(func))[1];
    switch(funcName){
        case 'ConsistIn': {
            let result = [];
            [result[1], result[2]] = getArguments(func);

            console.log(`Results of exec : ${result[1]} and ${result[2]}`)
            let regexp = result[1], string = result[2];
            if(app.isFunction(regexp)) {
                while(app.isFunction(regexp)){
                    console.log(`Result 1 before transform: ${regexp}`)
                    regexp = exports.funcResult(regexp, lineDescribeObject, GlobalContext)
                    console.log(`Result 1 after transform: ${regexp} and it's function: ${app.isFunction(regexp)}`)    
                }            
            } else {
                regexp = GlobalContext[result[1]];
                console.log(`Value 1: ${regexp}`)
            }
            if(app.isFunction(string)) {
                while(app.isFunction(string)){
                    console.log(`Result 2 before transform: ${string}`)
                    string = exports.funcResult(string, lineDescribeObject, GlobalContext)
                    console.log(`Result 2 after transform: ${string} and it's function: ${app.isFunction(string)}`)    
                }            
            } else {
                string = GlobalContext[result[2]].toString();
                console.log(`Value 2: ${string}`)
            }
            lineDescribeObject.comment = "Processing function ConsistIn";
            lineDescribeObject.parentId = -1;
            regexp = new RegExp(regexp);

            return regexp.test(string);
        }
        case 'IndexOf': {
            let result = [];
            [result[1], result[2]] = getArguments(func);
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
                console.log(`Value 1: ${value}`)
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

function getArguments(funcLine) {
    if(/^\w+[(](\w+[(].+[)])[,].+/.test(funcLine)){
        let result = /^\w+[(](\w+[(].+[)])[,][ ]?(.+)[)]/.exec(funcLine);
        return [result[1], result[2]];
    } else {
        let result = /^\w+[(](\w+)[,][ ]?(.+)[)]/.exec(funcLine);
        return [result[1], result[2]];
    }
}