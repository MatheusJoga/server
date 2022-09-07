var automacao = document.getElementById("automacao").value
console.log(automacao)

if (automacao == "85_DIG_SMX_CORRENTISTA"){
    document.getElementById("carteira").textContent = "BRADESCO CORRENTISTA"
    document.getElementById("img").src = "imagens/bancos/bradesco.png"
    document.getElementById("grupo").value = "digital"
}