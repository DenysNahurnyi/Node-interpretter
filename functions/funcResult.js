

exports.funcResult = function(func, lineDescribeObject, GlobalContext) {
    let funcName = (/(\w+)[(].+[)]/.exec(func))[1];
    switch(funcName){
        case 'ConsistIn': {
            lineDescribeObject.comment = "Processing function ConsistIn";
            lineDescribeObject.parentId = -1;
            let result = /^ConsistIn[(](\w+), (\w+)[)]/.exec(func);

            let regexp = new RegExp(GlobalContext[result[1]]);
            let string = GlobalContext[result[2]];
            return regexp.test(string);
        }
        case 'IndexOf': {
            lineDescribeObject.comment = "Processing fuction IndexOf";
            lineDescribeObject.parentId = -1;
            let result = /^IndexOf[(](\w+), (\w+)[)]/.exec(func);

            let value = GlobalContext[result[1]];
            let string = GlobalContext[result[2]].toString();

            return string.indexOf(value);
        }
    }
}