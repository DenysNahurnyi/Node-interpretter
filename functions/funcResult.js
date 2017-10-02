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