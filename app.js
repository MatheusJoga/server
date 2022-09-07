const express = require('express');
var bodyParser = require('body-parser');
const app = express();
const path = require('path');
const { json } = require('body-parser');
const fs = require('fs');
const $ = require("jQuery");


app.use(express.static(__dirname +'/public'));

app.get("/home.html", function(req, res){
    res.sendFile(path.join(__dirname +"/views/home.html"));
})

app.get("/smx.html", function(req, res){
    res.sendFile(path.join(__dirname +"/views/smx.html"));
})

app.get("/smx_p.html", function(req, res){
    const carteira = req.query.carteira?req.query.carteira:""
    fs.readFile(path.join(__dirname +"/views/smx_p.html"), (err, data)=>{
        let html_texto = data.toString()
        html_texto = html_texto.replaceAll("#{{carteira}}",carteira)
        html_texto = html_texto.replaceAll("#{{carteira_img}}",carteira.toLowerCase())
        res.send(html_texto)
    })
})


//CONFIG BODY PARSER
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));//server para poder trabalhar com metodo POST


app.post('/avon_smx_p_sucess', function(req,res){//ROTA SHAREPOINT(TOKEN E SALVAR) AVON
    res.write(JSON.stringify(req.body));
    res.end()

  //pegando token
  var axios = require('axios');
  var qs = require('qs');
  var data = qs.stringify({
    'grant_type': 'client_credentials',
    'resource': '00000003-0000-0ff1-ce00-000000000000/paschoalotto.sharepoint.com@1de5ae7d-2e25-49b4-b8c0-e28ffe53080a',
    'client_id': '7cb8f140-2bf6-47c2-a9e8-b756047a0801@1de5ae7d-2e25-49b4-b8c0-e28ffe53080a',
    'client_secret': 'rDWi8FlGDhMjTTw2TrAlHWzdBRx9KO+2B9YNZe7rvoQ=' 
  });
  var config = {
    method: 'post',
    url: 'https://accounts.accesscontrol.windows.net/1de5ae7d-2e25-49b4-b8c0-e28ffe53080a/tokens/OAuth/2',
    headers: { 
      'Content-Type': 'application/x-www-form-urlencoded', 
      'Cookie': 'esctx=AQABAAAAAAD--DLA3VO7QrddgJg7WevrkT7YaUz5dD-Eiy5JBpvmHzrW6phVmb5Cs7lSvtuCt0ax5sdJ-_myR4WzjtJqy9t8KJ5AX2snItSAexPkd5VP0oRRc9kBrvl4qqt_8di7uCeQSNzzu9AxfFS0l0pZr-qAtGtucH-fpu6CjclcPsQ1f81x41HWeEQmEll2thZATS8gAA; fpc=AkMgUEObGnlEtH7xVjmi_zFY8SHFAQAAADgxqdoOAAAA; stsservicecookie=estsfd; x-ms-gateway-slice=estsfd'
    },
    data : data
  };

  axios(config)
  .then(function (response) {
    //console.log(JSON.stringify(response.data));

      //depois que pega o token
      // Primeira requisicao, historico
      var data_body = {
        "seg_auto": "ovo",
        "script": JSON.stringify(req.body)
      };

      var config = {
        method: 'post',
        url: 'https://paschoalotto.sharepoint.com/sites/AC2/_api/web/lists/getbytitle(\'teste\')/Items',
        headers: { 
          'Authorization': 'Bearer '+response.data.access_token, 
          'Accept': 'application/json;odata=verbose', 
          'Content-Type': 'application/json'
        },
        data : {
          "Title": "ovo_2.0",
          "carteira": JSON.stringify(req.body)
        }
      };

      axios(config)
      .then(function (response) {
        //console.log(JSON.stringify(response.data));
        console.log("SUCESSO")
      })
      .catch(function (error) {
        console.log(error);
      });

  
  })
  .catch(function (error) {//EM CASO DE ERRO
    console.log(error);
  });


});





app.listen(8081, function(){console.log(
    "##########################################################\n\n                        F.R.I.D.A.Y                       \n                  initialization system                 \n\n##########################################################"
    )})