import * as esprima from 'esprima';

let lines=[];let types=[];let names=[];let conds=[];let values=[];let stackOp=[];let other=[];let expBuild='';
let some='';
const parseCode = (codeToParse) => {
    some=codeToParse;
    return esprima.parseScript(codeToParse, {loc: true});
};



function getAllParsedCode(parsedCode) {
    some=some.split('\n');
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
    str=str+'<tr>';
    str=str+'<td>'+'Line'+'</td>';
    str=str+'<td>'+'Type'+'</td>';
    str=str+'<td>'+'Name'+'</td>';
    str=str+'<td>'+'Condition'+'</td>';
    str=str+'<td>'+'Value'+'</td></tr>';
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
    values.push(' ');
    if(exp.consequent.body==null){
        route(exp.consequent);
    }
    else{
        allOthers(exp.consequent.body);
    }
    if(exp.alternate!=undefined){
        if(exp.alternate.type=='IfStatement')
            elseIfEXP(exp.alternate);
        else
            retEXP(exp.alternate);
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
    route(exp.alternate);
}

function retEXP(exp) {
    lines.push(exp.loc.start.line);
    types.push(exp.type);
    names.push(' ');
    conds.push(' ');
    values.push(some[exp.argument.loc.start.line-1].substring(exp.argument.loc.start.column,exp.argument.loc.end.column));
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
    if(exp.type=='BlockStatement'){
        allOthers(exp.body);
    }
    else if(exp.type=='ExpressionStatement'){
        expState(exp.expression);
    }
    else if(exp.type=='IfStatement'){
        ifEXP(exp);
    }
    else{
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
    values.push(some[exp.right.loc.start.line-1].substring(exp.right.loc.start.column,exp.right.loc.end.column));
}

function binaryEXP(temp) {
    return some[temp.loc.start.line-1].substring(temp.loc.start.column,temp.loc.end.column);
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
        str=binaryEXP(exp);
    }
    values.push(str);
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