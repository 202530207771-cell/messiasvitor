```javascript
const URL = "https://hqtqbprrvaymchhaucfx.supabase.co";
const KEY = "sb_publishable_CGVN66a-EdSQH6AQ_saMTg_VsDBBTJn";

// SALVAR PRODUTO
async function salvar() {
    const nome = document.getElementById("nome").value.trim();
    const imagem = document.getElementById("imagem").value.trim();
    const preco = document.getElementById("preco").value;
    const descricao = document.getElementById("descricao").value.trim();

    if (!nome || !imagem || !preco || !descricao) {
        alert("Preencha todos os campos!");
        return;
    }

    if (!Number.isFinite(Number(preco)) || Number(preco) <= 0) {
        alert("Digite um preço válido!");
        return;
    }

    try {
        const resposta = await fetch(
            URL + "/rest/v1/produtos",
            {
                method: "POST",
                headers: {
                    "apikey": KEY,
                    "Authorization": "Bearer " + KEY,
                    "Content-Type": "application/json",
                    "Prefer": "return=minimal"
                },
                body: JSON.stringify({
                    nome: nome,
                    imagem: imagem,
                    preco: Number(preco),
                    descricao: descricao
                })
            }
        );

        if (!resposta.ok) {
            const erro = await resposta.text();
            console.error(erro);
            document.getElementById("mensagem").innerText =
                "Erro ao salvar. Confira as colunas e as permissões do Supabase.";
            return;
        }

        document.getElementById("mensagem").innerText =
            "Produto salvo com sucesso!";

        document.getElementById("nome").value = "";
        document.getElementById("imagem").value = "";
        document.getElementById("preco").value = "";
        document.getElementById("descricao").value = "";

        await listarProdutos();

    } catch (erro) {
        console.error(erro);
        document.getElementById("mensagem").innerText =
            "Erro de conexão com o banco de dados.";
    }
}


// LISTAR PRODUTOS
async function listarProdutos() {
    const lista = document.getElementById("lista");

    try {
        const resposta = await fetch(
            URL + "/rest/v1/produtos?select=*&order=id.desc",
            {
                method: "GET",
                headers: {
                    "apikey": KEY,
                    "Authorization": "Bearer " + KEY
                }
            }
        );

        if (!resposta.ok) {
            throw new Error(await resposta.text());
        }

        const produtos = await resposta.json();

        lista.innerHTML = "";

        produtos.forEach(produto => {
            const item = document.createElement("li");

            item.style.listStyle = "none";
            item.style.border = "1px solid #ddd";
            item.style.borderRadius = "10px";
            item.style.padding = "15px";
            item.style.marginBottom = "15px";
            item.style.maxWidth = "350px";

            const titulo = document.createElement("h3");
            titulo.textContent = produto.nome;

            const foto = document.createElement("img");
            foto.src = produto.imagem;
            foto.alt = produto.nome;
            foto.style.width = "100%";
            foto.style.maxWidth = "300px";
            foto.style.height = "220px";
            foto.style.objectFit = "cover";
            foto.style.borderRadius = "8px";

            foto.onerror = function () {
                this.alt = "Não foi possível carregar a imagem";
                this.style.display = "none";
            };

            const textoDescricao
