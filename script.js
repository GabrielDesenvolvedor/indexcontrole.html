let listaProdutos = []
let listaRemovidos = []
let total = 0

function adicionarProduto() {
  const funcionario = document.getElementById("funcionario").value
  const produto = document.getElementById("produto").value
  const quantidade = parseInt(document.getElementById("quantidade").value, 10)
  const valor = parseFloat(document.getElementById("valor").value)

  if (!funcionario || !produto || isNaN(quantidade) || isNaN(valor)) {
    alert("Preencha todos os campos corretamente.")
    return
  }

  const produtoObj = {
    funcionario,
    produto,
    quantidade,
    valor,
    subtotal: quantidade * valor,
  }

  listaProdutos.push(produtoObj)
  calcularTotal()
  atualizarLista()

  // Limpar os campos após adicionar o produto
  document.getElementById("funcionario").value = ""
  document.getElementById("produto").value = ""
  document.getElementById("quantidade").value = ""
  document.getElementById("valor").value = ""

  // Focar no campo de funcionário para facilitar a entrada subsequente
  document.getElementById("funcionario").focus()
}

// Adiciona o evento de escuta para a tecla "Enter"
document.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    // Obtém o elemento ativo (focado)
    const activeElement = document.activeElement

    // Verifica se o elemento ativo é um campo de entrada
    if (activeElement.tagName === "INPUT") {
      // Obtém todos os campos de entrada
      const inputFields = Array.from(document.querySelectorAll("input"))

      // Obtém o índice do campo de entrada ativo
      const currentIndex = inputFields.indexOf(activeElement)

      // Move para o próximo campo de entrada ou o primeiro se for o último
      const nextIndex = (currentIndex + 1) % inputFields.length
      inputFields[nextIndex].focus()
    }
  }
})

function excluirProduto(index) {
  const produtoRemovido = listaProdutos.splice(index, 1)[0]
  listaRemovidos.push(produtoRemovido)
  calcularTotal()
  atualizarLista()
}

function limparLista() {
  listaRemovidos = listaRemovidos.concat(listaProdutos)
  listaProdutos = []
  calcularTotal()
  atualizarLista()
}

function restaurarLista() {
  if (listaRemovidos.length === 0) {
    alert("Nenhum produto para restaurar.")
    return
  }

  const produtoRestaurado = listaRemovidos.pop()
  listaProdutos.push(produtoRestaurado)
  calcularTotal()
  atualizarLista()
}

function atualizarLista() {
  const listaElement = document.getElementById("lista-produtos")
  listaElement.innerHTML = ""

  listaProdutos.forEach((produto, index) => {
    const li = document.createElement("li")
    li.innerHTML = `
            ${produto.funcionario} - ${produto.produto} - Quantidade: ${
      produto.quantidade
    } - Subtotal: R$ ${produto.subtotal.toFixed(
      2
    )} <span class="excluir-btn" onclick="excluirProduto(${index})">❌</span>
        `
    listaElement.appendChild(li)
  })

  const totalElement = document.getElementById("total-value")
  totalElement.innerHTML = `Total: R$ ${total.toFixed(
    2
  )} <span class="limpar-btn" onclick="limparLista()">🧹</span> <span class="limpar-btn" onclick="restaurarLista()">↩</span>`
}

function calcularTotal() {
  total = listaProdutos.reduce((acc, produto) => acc + produto.subtotal, 0)
}

function gerarRelatorioPDF() {
  // Se não houver produtos, não faz sentido gerar um relatório
  if (listaProdutos.length === 0) {
    alert("Adicione produtos antes de gerar o relatório.");
    return;
  }

  // Cria um novo container para o relatório
  const relatorioContainer = document.createElement("div");

  // Adiciona estilos ao relatório
  relatorioContainer.style.width = "80mm"; // Largura do papel Roll Paper 80mm
  relatorioContainer.style.height = "97mm"; // Altura do papel Roll Paper 297mm
  relatorioContainer.style.padding = "0px";
  relatorioContainer.style.border = "1px solid #ddd";
  relatorioContainer.style.borderRadius = "8px";

  // Adiciona a lista de produtos ao relatório
  const listaElement = document.createElement("ul");
  listaElement.style.listStyleType = "none";
  listaElement.style.padding = "0";

  listaProdutos.forEach((produto) => {
    const li = document.createElement("li");
    li.style.borderBottom = "1px solid #ddd";
    li.style.padding = "0px 0";
    li.textContent = `${produto.funcionario} - ${
      produto.produto
    }  ${
      produto.quantidade
    } - Subtotal: R$ ${produto.subtotal.toFixed(2)}`;
    listaElement.appendChild(li);
  });

  relatorioContainer.appendChild(listaElement);

  // Adiciona o total ao relatório
  const totalElement = document.createElement("p");
  totalElement.style.marginTop = "10px";
  totalElement.style.paddingTop = "0px";
  totalElement.style.borderTop = "1px solid #ddd";
  totalElement.style.fontWeight = "bold";
  totalElement.style.fontSize = "18px";
  totalElement.style.color = "#e74c3c";
  totalElement.textContent = `Total: R$ ${total.toFixed(2)}`;
  relatorioContainer.appendChild(totalElement);

  // Converte o HTML do relatório para PDF
  html2pdf(relatorioContainer, {
    margin: 10,
    filename: "relatorio.pdf",
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2 },
  });
}
