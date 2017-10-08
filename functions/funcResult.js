const app = require('../app.js');

exports.funcResult = function(func, lineDescribeObject, GlobalContext) {
    let funcName = (/(\w+)[(].+[)]/.exec(func))[1];
    switch(funcName){
        case 'ConsistIn': {
            let result = [];
            [result[1], result[2]] = getArguments(func);

            let regexp = result[1], string = result[2];
            if(app.isFunction(regexp)) {
                while(app.isFunction(regexp)){
                    regexp = exports.funcResult(regexp, lineDescribeObject, GlobalContext)   
                }            
            } else {
                regexp = GlobalContext[result[1]];
            }
            if(app.isFunction(string)) {
                while(app.isFunction(string)){
                    string = exports.funcResult(string, lineDescribeObject, GlobalContext)    
                }            
            } else {
                string = GlobalContext[result[2]].toString();
            }
            lineDescribeObject.comment = "Processing function ConsistIn";
            lineDescribeObject.parentId = -1;
            regexp = new RegExp(regexp);

            return regexp.test(string);
        }
        case 'IndexOf': {
            let result = [];
            [result[1], result[2]] = getArguments(func);
            let value = result[1], string = result[2];
            if(app.isFunction(value)) {
                while(app.isFunction(value)){
                    value = exports.funcResult(value, lineDescribeObject, GlobalContext)   
                }            
            } else {
                value = GlobalContext[result[1]];
            }
            if(app.isFunction(string)) {
                while(app.isFunction(string)){
                    value = exports.funcResult(string, lineDescribeObject, GlobalContext)  
                }            
            } else {
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