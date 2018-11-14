import $ from 'jquery';
import {parseCode,getAllParsedCode} from './code-analyzer';



$(document).ready(function () {
    $('#codeSubmissionButton').click(() => {
        let codeToParse = $('#codePlaceholder').val();
        let parsedCode = parseCode(codeToParse);
        $('#parsedCode').val(JSON.stringify(parsedCode, null, 2));
        var table=getAllParsedCode(parsedCode);
        var showtd=document.getElementById('Showtable');
        showtd.innerHTML=table;

    });
});













