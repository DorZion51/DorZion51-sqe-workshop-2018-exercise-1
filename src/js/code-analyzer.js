import * as esprima from 'esprima';

let lines=[];let types=[];let names=[];let conds=[];let values=[];let stackOp=[];let other=[];let expBuild='';

const parseCode = (codeToParse) => {
    return esprima.parseScript(codeToParse,{loc:true});
};

function getAllParsedCode(parsedCode) {
    lines=[];types=[];names=[];conds=[];values=[];stackOp=[];other=[];expBuild='';
    if(parsedCode.body[0]==null){true;}
    else if(parsedCode.body[0].type=='FunctionDeclaration') {
        let funcDec = parsedCode.body[0];
        decFunc(funcDec, lines, types, names, conds, values);
        decParams(funcDec.params, lines, types, names, conds, values, stackOp, other, expBuild);
        let code = funcDec.body.body;
        allOthers(code, lines, types, names, conds, values, stackOp, other, expBuild);
    }
    else{ allOthers(parsedCode.body);}
    return buildTable();
}


function buildTable() {
    var str='<table border="2">';
    for (let i = 0; i <lines.length ; i++) {
        str=str+'<tr>';
        str=str+'<td>'+lines[i]+'</td>';
        str=str+'<td>'+types[i]+'</td>';
        str=str+'<td>'+names[i]+'</td>';
        str=str+'<td>'+conds[i].replace('<',' < ')+'</td>';
        str=str+'<td>'+values[i]+'</td>';
        str=str+'</tr>';
    }
    str=str+'</table>';
    return str;
}


function allOthers(code) {
    for (let i = 0; i <code.length ; i++) {
        if(code[i].type=='VariableDeclaration'){
            varDec(code[i].declarations);
        }
        else if(code[i].type=='ExpressionStatement'){
            expState(code[i].expression);
        }
        else {
            //if,while,return exp
            otherEXP(code[i]);
        }
    }
}

function otherEXP(exp) {
    if(exp.type=='WhileStatement'){
        whileEXP(exp);
    }
    else if(exp.type=='IfStatement'){
        ifEXP(exp);
    }
    else if(exp.type=='ReturnStatement'){
        retEXP(exp);
    }
    else {
        forStatement(exp);
    }
}

function whileEXP(exp) {
    lines.push(exp.loc.start.line);
    types.push(exp.type);
    names.push(' ');
    let str=binaryEXP(exp.test);
    conds.push(str);
    expBuild='';
    values.push(' ');
    routeRetExp(exp.body);
    routeWhileIf(exp.body);
}

function ifEXP(exp) {
    lines.push(exp.loc.start.line);
    types.push(exp.type);
    names.push(' ');
    let str=binaryEXP(exp.test);
    conds.push(str);
    expBuild='';
    values.push(' ');
    if(exp.consequent.body==null){
        route(exp.consequent);
    }
    else{
        allOthers(exp.consequent.body);
    }
    if(exp.alternate!=null){
        elseIfEXP(exp.alternate);
    }
}

function elseIfEXP(exp) {
    lines.push(exp.loc.start.line);
    let str=binaryEXP(exp.test);
    conds.push(str);
    expBuild='';
    values.push(' ');
    names.push(' ');
    types.push('ElseIfStatement');
    route(exp.consequent);
    if(exp.alternate!=null) {
        route(exp.alternate);
    }
}

function retEXP(exp) {
    lines.push(exp.loc.start.line);
    types.push(exp.type);
    names.push(' ');
    conds.push(' ');
    if(exp.argument.type=='Literal'){
        values.push(exp.argument.value);
    }
    else if(exp.argument.type=='Identifier'){
        values.push(exp.argument.name);
    }
    else if(exp.argument.type=='BinaryExpression'){
        let str=binaryEXP(exp.argument);
        values.push(str);
        expBuild='';
    }
    else {
        unaryEXP(exp.argument);
    }
}


function routeRetExp(exp) {
    for (let i = 0; i <exp.body.length ; i++) {
        if (exp.body[i].type == 'ExpressionStatement') {
            expState(exp.body[i].expression);
        }
        else if (exp.body[i].type == 'ReturnStatement') {
            retEXP(exp.body[i]);
        }
        else if (exp.body[i].type=='VariableDeclaration'){
            varDec(exp.body[i].declarations);
        }
    }
}
function routeWhileIf(exp) {
    for (let i = 0; i <exp.body.length ; i++) {
        if(exp.body[i].type=='IfStatement'){
            ifEXP(exp.body[i]);
        }
        else if(exp.body[i].type=='WhileStatement'){
            whileEXP(exp.body[i]);
        }
    }
}

function route(exp) {
    if(exp.type=='ExpressionStatement'){
        expState(exp.expression);
    }
    else {
        //if,while,return exp
        otherExpRoute(exp);
    }
}

function otherExpRoute(exp) {
    if(exp.type=='ReturnStatement'){
        retEXP(exp);
    }
}

function varDec(dec) {
    for (let j = 0; j <dec.length ; j++) {
        lines.push(dec[j].id.loc.start.line);
        types.push('VariableDeclaration');
        names.push(dec[j].id.name);
        conds.push(' ');
        if(dec[j].init==null){
            values.push(null);
        }
        else if(dec[j].init.type=='Literal'){
            values.push(dec[j].init.value);
        }
        else if(dec[j].init.type=='Identifier'){
            values.push(dec[j].init.name);
        }
        else{
            setValue(dec[j].init);
        }
    }
}

function setValue(exp) {
    if(exp.type=='UnaryExpression'){
        unaryEXP(exp);
    }
    else {
        let str=binaryEXP(exp);
        values.push(str);
    }
}
function decFunc(funcDec) {
    lines.push(1);
    types.push(funcDec.type);
    names.push(funcDec.id.name);
    conds.push(' ');
    values.push(' ');
}

function decParams(params) {
    for (let i = 0; i <params.length ; i++) {
        lines.push(params[i].loc.start.line);
        types.push('VariableDeclaration');
        names.push(params[i].name);
        conds.push(' ');
        values.push(' ');
    }
}

function expState(exp) {
    lines.push(exp.left.loc.start.line);
    types.push(exp.type);
    names.push(exp.left.name);
    conds.push(' ');
    if(exp.right.type=='Literal'){
        values.push(exp.right.value);
    }
    else{
        let temp=exp.right;
        let str =binaryEXP(temp);
        values.push(str);
        expBuild='';

    }
}

function binaryEXP(temp) {
    var flag=false;
    while(temp.left.type=='BinaryExpression'){
        stackOp.push(temp.operator);
        other.push(temp.right.value);
        temp = temp.left;
        flag=true;
    }
    stackOp.push(temp.operator);
    literalOrId(temp);
    let str=buildEXP(flag);
    stackOp=[];
    other=[];
    return str;
}

function unaryEXP(exp) {
    var str='';
    str+=exp.operator;
    if(exp.argument.type=='Identifier'){
        str+=exp.argument.name;
    }
    else if(exp.argument.type=='Literal'){
        str+=exp.argument.value;
    }
    else {
        str=binaryEXP(exp.argument);
        expBuild='';
    }
    values.push(str);
}

//help functions to binaryEXP
function literalOrId(temp) {
    if(temp.right.type=='Literal'){
        other.push(temp.right.value);
    }
    else if(temp.right.type=='Identifier'){
        other.push(temp.right.name);
    }
    checkMembership(temp.right);
    if(temp.left.type=='Literal'){
        other.push(temp.left.value);
    }
    else if(temp.left.type=='Identifier'){
        other.push(temp.left.name);
    }
    checkMembership(temp.left);
}
function buildEXP(flag) {
    let str='';
    if(!flag) {
        for (let j = 0; j <= other.length + 1; j++) {
            str = str+other.pop();
            if (stackOp.length > 0) {
                str = str+stackOp.pop()  ;
            }
        }
    }
    else{
        str=reverse(stackOp,other);
    }
    return str;
}



function reverse(stackOp,other) {
    var str='';
    for (let j = 0; j <= other.length + 1; j++) {
        str =str+ other.pop();
        if (stackOp.length > 0) {
            str =str+stackOp.pop();
        }
    }
    return str;
}
function checkMembership(temp) {
    if(temp.type=='MemberExpression'){
        if(temp.property.type=='Literal'){
            other.push(temp.object.name+'['+temp.property.value+']');
        }
        else if(temp.property.type=='Identifier'){
            other.push(temp.object.name+'['+temp.property.name+']');
        }
        else {
            var str=binaryNested(temp.property);
            stackOp.push(str[str.length-1]);
            other.push(temp.object.name+'['+str.substring(0,str.length-1)+']');
        }
    }
}

function binaryNested(temp) {
    var flag=false;
    while(temp.left.type=='BinaryExpression'){
        stackOp.push(temp.operator);
        if(temp.right.type=='Literal'){
            other.push(temp.right.value);
        }
        else {
            other.push(temp.right.name);
        }
        temp=temp.left;
        flag=true;}
    stackOp.push(temp.operator);
    literalOrId(temp);
    let str=buildEXP(flag);
    stackOp=[];
    other=[];

    return str;
}

function  forStatement(stat) {
    types.push('ForStatement');
    names.push(' ');
    lines.push(stat.loc.start.line);
    values.push(' ');
    let str='';
    str=binaryEXP(stat.test);
    conds.push(str);
    routeRetExp(stat.body);
    routeWhileIf(stat.body);
}

export {parseCode,getAllParsedCode};