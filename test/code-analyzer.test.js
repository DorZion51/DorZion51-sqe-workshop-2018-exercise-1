import assert from 'assert';
import {parseCode,getAllParsedCode} from '../src/js/code-analyzer';

describe('The javascript parser', () => {
    it('Aviram code with little improvment', () => {
        assert.equal(
            getAllParsedCode(parseCode('function binarySearch(X, V, n){\n' +
                '    let low=n-1, high, mid;\n' +
                '    low = 0;\n' +
                '    high = n - 1;\n' +
                '    while (low <= high) {\n' +
                '        mid = (low + high)/2;\n' +
                '        if (X < V[mid])\n' +
                '            high = mid - 1;\n' +
                '        else if (X > V[mid+1])\n' +
                '            low = mid + 1;\n' +
                '        else\n' +
                '            return mid;\n' +
                '    }\n' +
                '    return -1;\n' +
                '}')),
            '<table border="2"><tr><td>Line</td><td>Type</td><td>Name</td><td>Condition</td><td>Value</td></tr><tr><td>1</td><td>FunctionDeclaration</td><td>binarySearch</td><td> </td><td> </td></tr><tr><td>1</td><td>VariableDeclaration</td><td>X</td><td> </td><td> </td></tr><tr><td>1</td><td>VariableDeclaration</td><td>V</td><td> </td><td> </td></tr><tr><td>1</td><td>VariableDeclaration</td><td>n</td><td> </td><td> </td></tr><tr><td>2</td><td>VariableDeclaration</td><td>low</td><td> </td><td>n-1</td></tr><tr><td>2</td><td>VariableDeclaration</td><td>high</td><td> </td><td>null</td></tr><tr><td>2</td><td>VariableDeclaration</td><td>mid</td><td> </td><td>null</td></tr><tr><td>3</td><td>AssignmentExpression</td><td>low</td><td> </td><td>0</td></tr><tr><td>4</td><td>AssignmentExpression</td><td>high</td><td> </td><td>n-1</td></tr><tr><td>5</td><td>WhileStatement</td><td> </td><td>low < =high</td><td> </td></tr><tr><td>6</td><td>AssignmentExpression</td><td>mid</td><td> </td><td>low+high/2</td></tr><tr><td>7</td><td>IfStatement</td><td> </td><td>X < V[mid]</td><td> </td></tr><tr><td>8</td><td>AssignmentExpression</td><td>high</td><td> </td><td>mid-1</td></tr><tr><td>9</td><td>ElseIfStatement</td><td> </td><td>X>V[mid+1]</td><td> </td></tr><tr><td>10</td><td>AssignmentExpression</td><td>low</td><td> </td><td>mid+1</td></tr><tr><td>12</td><td>ReturnStatement</td><td> </td><td> </td><td>mid</td></tr><tr><td>14</td><td>ReturnStatement</td><td> </td><td> </td><td>-1</td></tr></table>'
        );
    });
    it('expstatment and if ', () => {
        assert.equal(
            getAllParsedCode(parseCode('function david(x){\n' +
                '    let x=n+2;\n' +
                '    let y=1+n;\n' +
                '    let z=n+n;\n' +
                '    let n=1+1;\n' +
                '    if(1>y){\n' +
                '      return 1;\n' +
                '    }\n' +
                '    else if(y>1){\n' +
                '      return -y;\n' +
                '    }\n' +
                '    if(1<2){\n' +
                '      return x;\n' +
                '   }\n' +
                '   return -n\n' +
                '  }')),
            '<table border="2"><tr><td>Line</td><td>Type</td><td>Name</td><td>Condition</td><td>Value</td></tr><tr><td>1</td><td>FunctionDeclaration</td><td>david</td><td> </td><td> </td></tr><tr><td>1</td><td>VariableDeclaration</td><td>x</td><td> </td><td> </td></tr><tr><td>2</td><td>VariableDeclaration</td><td>x</td><td> </td><td>n+2</td></tr><tr><td>3</td><td>VariableDeclaration</td><td>y</td><td> </td><td>1+n</td></tr><tr><td>4</td><td>VariableDeclaration</td><td>z</td><td> </td><td>n+n</td></tr><tr><td>5</td><td>VariableDeclaration</td><td>n</td><td> </td><td>1+1</td></tr><tr><td>6</td><td>IfStatement</td><td> </td><td>1>y</td><td> </td></tr><tr><td>7</td><td>ReturnStatement</td><td> </td><td> </td><td>1</td></tr><tr><td>9</td><td>ElseIfStatement</td><td> </td><td>y>1</td><td> </td></tr><tr><td>12</td><td>IfStatement</td><td> </td><td>1 < 2</td><td> </td></tr><tr><td>13</td><td>ReturnStatement</td><td> </td><td> </td><td>x</td></tr><tr><td>15</td><td>ReturnStatement</td><td> </td><td> </td><td>-n</td></tr></table>'
        );
    });
    it('lonley branch', () => {
        assert.equal(
            getAllParsedCode(parseCode('')),
            '<table border="2"><tr><td>Line</td><td>Type</td><td>Name</td><td>Condition</td><td>Value</td></tr></table>'
        );
    });
    it('nested while and if wnd else if', () => {
        assert.equal(
            getAllParsedCode(parseCode(' function david(x){\n' +
                '  if(x>1){\n' +
                '  }\n' +
                '  else if(x>1){\n' +
                '  }\n' +
                '  while(1>8){\n' +
                '   x=x-1;\n' +
                '   while(1>x){\n' +
                '     x=1;\n' +
                '\t return -1\n' +
                '   }\n' +
                '   while(x>1){\n' +
                '     v=2;\n' +
                '\t return -(1+n)\n' +
                '   }\n' +
                '  }\n' +
                '}')),
            '<table border="2"><tr><td>Line</td><td>Type</td><td>Name</td><td>Condition</td><td>Value</td></tr><tr><td>1</td><td>FunctionDeclaration</td><td>david</td><td> </td><td> </td></tr><tr><td>1</td><td>VariableDeclaration</td><td>x</td><td> </td><td> </td></tr><tr><td>2</td><td>IfStatement</td><td> </td><td>x>1</td><td> </td></tr><tr><td>4</td><td>ElseIfStatement</td><td> </td><td>x>1</td><td> </td></tr><tr><td>6</td><td>WhileStatement</td><td> </td><td>1>8</td><td> </td></tr><tr><td>7</td><td>AssignmentExpression</td><td>x</td><td> </td><td>x-1</td></tr><tr><td>8</td><td>WhileStatement</td><td> </td><td>1>x</td><td> </td></tr><tr><td>9</td><td>AssignmentExpression</td><td>x</td><td> </td><td>1</td></tr><tr><td>10</td><td>ReturnStatement</td><td> </td><td> </td><td>-1</td></tr><tr><td>12</td><td>WhileStatement</td><td> </td><td>x>1</td><td> </td></tr><tr><td>13</td><td>AssignmentExpression</td><td>v</td><td> </td><td>2</td></tr><tr><td>14</td><td>ReturnStatement</td><td> </td><td> </td><td>1+n</td></tr></table>'
        );
    });
    it('empty if else if', () => {
        assert.equal(
            getAllParsedCode(parseCode('if(x>2){\n' +
                '}\n' +
                'else if(1>0){\n' +
                '}')),
            '<table border="2"><tr><td>Line</td><td>Type</td><td>Name</td><td>Condition</td><td>Value</td></tr><tr><td>1</td><td>IfStatement</td><td> </td><td>x>2</td><td> </td></tr><tr><td>3</td><td>ElseIfStatement</td><td> </td><td>1>0</td><td> </td></tr></table>'
        );
    });
    it('return id+name name +id', () => {
        assert.equal(
            getAllParsedCode(parseCode('function binarySearch(X, V, n){\n' +
                '  if(v[1]<n){\n' +
                '    return n+1;\n' +
                '   }\n' +
                '  return 1+n;\n' +
                '\n' +
                '}')),
            '<table border="2"><tr><td>Line</td><td>Type</td><td>Name</td><td>Condition</td><td>Value</td></tr><tr><td>1</td><td>FunctionDeclaration</td><td>binarySearch</td><td> </td><td> </td></tr><tr><td>1</td><td>VariableDeclaration</td><td>X</td><td> </td><td> </td></tr><tr><td>1</td><td>VariableDeclaration</td><td>V</td><td> </td><td> </td></tr><tr><td>1</td><td>VariableDeclaration</td><td>n</td><td> </td><td> </td></tr><tr><td>2</td><td>IfStatement</td><td> </td><td>v[1] < n</td><td> </td></tr><tr><td>3</td><td>ReturnStatement</td><td> </td><td> </td><td>n+1</td></tr><tr><td>5</td><td>ReturnStatement</td><td> </td><td> </td><td>1+n</td></tr></table>'
        );
    });
    it('empty while', () => {
        assert.equal(
            getAllParsedCode(parseCode('while(x>1){}')),
            '<table border="2"><tr><td>Line</td><td>Type</td><td>Name</td><td>Condition</td><td>Value</td></tr><tr><td>1</td><td>WhileStatement</td><td> </td><td>x>1</td><td> </td></tr></table>'
        );
    });
    it('assisment and expstatment', () => {
        assert.equal(
            getAllParsedCode(parseCode('let x=2;\n' +
                'x=8;\n' +
                't=2;\n' +
                'z=2+n;\n' +
                'l=5;')),
            '<table border="2"><tr><td>Line</td><td>Type</td><td>Name</td><td>Condition</td><td>Value</td></tr><tr><td>1</td><td>VariableDeclaration</td><td>x</td><td> </td><td>2</td></tr><tr><td>2</td><td>AssignmentExpression</td><td>x</td><td> </td><td>8</td></tr><tr><td>3</td><td>AssignmentExpression</td><td>t</td><td> </td><td>2</td></tr><tr><td>4</td><td>AssignmentExpression</td><td>z</td><td> </td><td>2+n</td></tr><tr><td>5</td><td>AssignmentExpression</td><td>l</td><td> </td><td>5</td></tr></table>'
        );
    });
    it('Aviram code with little improvment2', () => {
        assert.equal(
            getAllParsedCode(parseCode('function binarySearch(X, V, n){\n' +
                '    let low, high, mid;\n' +
                '    low = 0;\n' +
                '    high = n - 1;\n' +
                '    while (low <= high) {\n' +
                '        mid = (low + high)/2;\n' +
                '        if (X < V[(1+n)+mid])\n' +
                '            high = mid - 1;\n' +
                '        else if (X > V[mid+(n+1)])\n' +
                '            low = mid + 1;\n' +
                '        else\n' +
                '            return mid;\n' +
                '    }\n' +
                '    return -1;\n' +
                '}')),
            '<table border="2"><tr><td>Line</td><td>Type</td><td>Name</td><td>Condition</td><td>Value</td></tr><tr><td>1</td><td>FunctionDeclaration</td><td>binarySearch</td><td> </td><td> </td></tr><tr><td>1</td><td>VariableDeclaration</td><td>X</td><td> </td><td> </td></tr><tr><td>1</td><td>VariableDeclaration</td><td>V</td><td> </td><td> </td></tr><tr><td>1</td><td>VariableDeclaration</td><td>n</td><td> </td><td> </td></tr><tr><td>2</td><td>VariableDeclaration</td><td>low</td><td> </td><td>null</td></tr><tr><td>2</td><td>VariableDeclaration</td><td>high</td><td> </td><td>null</td></tr><tr><td>2</td><td>VariableDeclaration</td><td>mid</td><td> </td><td>null</td></tr><tr><td>3</td><td>AssignmentExpression</td><td>low</td><td> </td><td>0</td></tr><tr><td>4</td><td>AssignmentExpression</td><td>high</td><td> </td><td>n-1</td></tr><tr><td>5</td><td>WhileStatement</td><td> </td><td>low < =high</td><td> </td></tr><tr><td>6</td><td>AssignmentExpression</td><td>mid</td><td> </td><td>low+high/2</td></tr><tr><td>7</td><td>IfStatement</td><td> </td><td>X < V[1+n+mid]</td><td> </td></tr><tr><td>8</td><td>AssignmentExpression</td><td>high</td><td> </td><td>mid-1</td></tr><tr><td>9</td><td>ElseIfStatement</td><td> </td><td>X>V[mid+undefined]</td><td> </td></tr><tr><td>10</td><td>AssignmentExpression</td><td>low</td><td> </td><td>mid+1</td></tr><tr><td>12</td><td>ReturnStatement</td><td> </td><td> </td><td>mid</td></tr><tr><td>14</td><td>ReturnStatement</td><td> </td><td> </td><td>-1</td></tr></table>'
        );
    });
    it('for', () => {
        assert.equal(
            getAllParsedCode(parseCode('function y(){\n' +
                '   for(x=1;x<2;x++){\n' +
                '   x=2;\n' +
                '   let z=2+n;\n' +
                '   while(x<6){\n' +
                '  \n' +
                '\n' +
                '   }\n' +
                '   if(x>3){\n' +
                '   }\n' +
                '   else if(x<3){\n' +
                '   }\n' +
                '   return 5;\n' +
                '\n' +
                '}\n' +
                '   \n' +
                '\n' +
                '\n' +
                '}')),
            '<table border="2"><tr><td>Line</td><td>Type</td><td>Name</td><td>Condition</td><td>Value</td></tr><tr><td>1</td><td>FunctionDeclaration</td><td>y</td><td> </td><td> </td></tr><tr><td>2</td><td>ForStatement</td><td> </td><td>x < 2</td><td> </td></tr><tr><td>3</td><td>AssignmentExpression</td><td>x</td><td> </td><td>2</td></tr><tr><td>4</td><td>VariableDeclaration</td><td>z</td><td> </td><td>2+n</td></tr><tr><td>13</td><td>ReturnStatement</td><td> </td><td> </td><td>5</td></tr><tr><td>5</td><td>WhileStatement</td><td> </td><td>x < 6</td><td> </td></tr><tr><td>9</td><td>IfStatement</td><td> </td><td>x>3</td><td> </td></tr><tr><td>11</td><td>ElseIfStatement</td><td> </td><td>x < 3</td><td> </td></tr></table>'
        );
    });
    it('ddd', () => {
        assert.equal(
            getAllParsedCode(parseCode('function y(){\n' +
                '   if(1<x[(1+1)+2]){\n' +
                '    let z=5;\n' +
                '    while(5>n){\n' +
                '}\n' +
                '   }\n' +
                '   let x=-1;\n' +
                '   let y=x;\n' +
                '}')),
            '<table border="2"><tr><td>Line</td><td>Type</td><td>Name</td><td>Condition</td><td>Value</td></tr><tr><td>1</td><td>FunctionDeclaration</td><td>y</td><td> </td><td> </td></tr><tr><td>2</td><td>IfStatement</td><td> </td><td>1 < x[1+1+2]</td><td> </td></tr><tr><td>3</td><td>VariableDeclaration</td><td>z</td><td> </td><td>5</td></tr><tr><td>4</td><td>WhileStatement</td><td> </td><td>5>n</td><td> </td></tr><tr><td>7</td><td>VariableDeclaration</td><td>x</td><td> </td><td>-1</td></tr><tr><td>8</td><td>VariableDeclaration</td><td>y</td><td> </td><td>x</td></tr></table>'
        );
    });
});

/*
it('is parsing an empty function correctly', () => {
        assert.equal(
        "<table border="2"><tr><td>Line</td><td>Type</td><td>Name</td><td>Condition</td><td>Value</td></tr><tr><td>1</td><td>FunctionDeclaration</td><td>binarySearch</td><td> </td><td> </td></tr><tr><td>1</td><td>VariableDeclaration</td><td>X</td><td> </td><td> </td></tr><tr><td>1</td><td>VariableDeclaration</td><td>V</td><td> </td><td> </td></tr><tr><td>1</td><td>VariableDeclaration</td><td>n</td><td> </td><td> </td></tr><tr><td>2</td><td>VariableDeclaration</td><td>low</td><td> </td><td>null</td></tr><tr><td>2</td><td>VariableDeclaration</td><td>high</td><td> </td><td>null</td></tr><tr><td>2</td><td>VariableDeclaration</td><td>mid</td><td> </td><td>null</td></tr><tr><td>3</td><td>AssignmentExpression</td><td>low</td><td> </td><td>0</td></tr><tr><td>4</td><td>AssignmentExpression</td><td>high</td><td> </td><td>n-1</td></tr><tr><td>5</td><td>WhileStatement</td><td> </td><td>low < =high</td><td> </td></tr><tr><td>6</td><td>AssignmentExpression</td><td>mid</td><td> </td><td>low+high/2</td></tr><tr><td>7</td><td>IfStatement</td><td> </td><td>X < V[mid]</td><td> </td></tr><tr><td>8</td><td>AssignmentExpression</td><td>high</td><td> </td><td>mid-1</td></tr><tr><td>9</td><td>ElseIfStatement</td><td> </td><td>X>V[mid]</td><td> </td></tr><tr><td>10</td><td>AssignmentExpression</td><td>low</td><td> </td><td>mid+1</td></tr><tr><td>12</td><td>ReturnStatement</td><td> </td><td> </td><td>mid</td></tr><tr><td>14</td><td>ReturnStatement</td><td> </td><td> </td><td>-1</td></tr></table>"
            getAllParsedCode(parseCode('')),
            '<table border="2"><tr><td>1</td><td>FunctionDeclaration</td><td>binarySearch</td><td> </td><td> </td></tr><tr><td>1</td><td>VariableDeclaration</td><td>X</td><td> </td><td> </td></tr><tr><td>1</td><td>VariableDeclaration</td><td>V</td><td> </td><td> </td></tr><tr><td>1</td><td>VariableDeclaration</td><td>n</td><td> </td><td> </td></tr><tr><td>2</td><td>VariableDeclaration</td><td>low</td><td> </td><td>null</td></tr><tr><td>2</td><td>VariableDeclaration</td><td>high</td><td> </td><td>null</td></tr><tr><td>2</td><td>VariableDeclaration</td><td>mid</td><td> </td><td>null</td></tr><tr><td>3</td><td>AssignmentExpression</td><td>low</td><td> </td><td>0</td></tr><tr><td>4</td><td>AssignmentExpression</td><td>high</td><td> </td><td>n-1</td></tr><tr><td>5</td><td>WhileStatement</td><td> </td><td>low < =high</td><td> </td></tr><tr><td>6</td><td>AssignmentExpression</td><td>mid</td><td> </td><td>low+high/2</td></tr><tr><td>7</td><td>IfStatement</td><td> </td><td>X < V[n+n+mid]</td><td> </td></tr><tr><td>8</td><td>AssignmentExpression</td><td>high</td><td> </td><td>mid-1</td></tr><tr><td>9</td><td>ElseIfStatement</td><td> </td><td>X>V[mid+undefined]</td><td> </td></tr><tr><td>10</td><td>AssignmentExpression</td><td>low</td><td> </td><td>mid+1</td></tr><tr><td>12</td><td>ReturnStatement</td><td> </td><td> </td><td>mid</td></tr><tr><td>14</td><td>ReturnStatement</td><td> </td><td> </td><td>-1</td></tr></table>'
          );
    });
 */