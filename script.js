
const URL = "https://hqtqbprrvaymchhaucfx.supabase.co";
const KEY = "sb_publishable_CGVN66a-EdSQH6AQ_saMTg_VsDBBTJn";

// SALVAR PRODUTO
async function salvar() {
    const nome = document.getElementById("nome").value.trim();
    const imagem = document.getElementById("imagem").value.trim();
    const precoTexto = document.getElementById("preco").value.trim();
    const descricao = document.getElementById("descricao").value.trim();
    const mensagem = document.getElementById("mensagem");

    if (!nome || !imagem || !precoTexto || !descricao) {
        mensagem.textContent = "Preencha todos os campos!";
        return;
    }

    const preco = Number(precoTexto.replace(",", "."));

    if (!Number.isFinite(preco) || preco <= 0) {
        mensagem.textContent = "Digite um preço válido!";
        return;
    }

    try {
        mensagem.textContent = "Salvando produto...";

        const resposta = await fetch(`${URL}/rest/v1/produtos`, {
            method: "POST",
            headers: {
                "apikey": KEY,
                "Authorization": `Bearer ${KEY}`,
                "Content-Type": "application/json",
                "Prefer": "return=minimal"
            },
            body: JSON.stringify({
                nome,
                imagem,
                preco,
                descricao
            })
        });

        if (!resposta.ok) {
            const erro = await resposta.text();
            console.error("Erro Supabase:", erro);
            mensagem.textContent = "Erro ao salvar: " + erro;
            return;
        }

        mensagem.textContent = "Produto salvo com sucesso!";

        document.getElementById("nome").value = "";
        document.getElementById("imagem").value = "";
        document.getElementById("preco").value = "";
        document.getElementById("descricao").value = "";

        await listarProdutos();

    } catch (erro) {
        console.error(erro);
        mensagem.textContent = "Erro de conexão com o Supabase.";
    }
}


// LISTAR PRODUTOS
async function listarProdutos() {
    const lista = document.getElementById("lista");

    try {
        lista.innerHTML = "<li>Carregando produtos...</li>";

        const resposta = await fetch(
            `${URL}/rest/v1/produtos?select=*&order=id.desc`,
            {
                method: "GET",
                headers: {
                    "apikey": KEY,
                    "Authorization": `Bearer ${KEY}`
                }
            }
        );

        if (!resposta.ok) {
            throw new Error(await resposta.text());
        }

        const produtos = await resposta.json();

        lista.innerHTML = "";

        if (produtos.length === 0) {
            lista.textContent = "Nenhum produto cadastrado.";
            return;
        }

        produtos.forEach(produto => {
            const item = document.createElement("li");

            item.style.cssText = `
                list-style: none;
                border: 1px solid #ddd;
                border-radius: 10px;
                padding: 15px;
                margin-bottom: 15px;
                max-width: 350px;
            `;

            const titulo = document.createElement("h3");
            titulo.textContent = produto.nome;

            const foto = document.createElement("img");
            foto.src = produto.imagem;
            foto.alt = produto.nome;
            foto.style.cssText = `
                width: 100%;
                max-width: 300px;
                height: 220px;
                object-fit: cover;
                border-radius: 8px;
            `;

            foto.onerror = () => {
                foto.alt = "Imagem não encontrada";
                foto.style.display = "none";
            };

            const textoDescricao = document.createElement("p");
            textoDescricao.textContent = produto.descricao;

            const textoPreco = document.createElement("strong");
            textoPreco.textContent = Number(produto.preco).toLocaleString(
                "pt-BR",
                {
                    style: "currency",
                    currency: "BRL"
                }
            );

            item.appendChild(titulo);
            item.appendChild(foto);
            item.appendChild(textoDescricao);
            item.appendChild(textoPreco);

            lista.appendChild(item);
        });

    } catch (erro) {
        console.error("Erro ao listar:", erro);
        lista.textContent = "Erro ao carregar produtos: " + erro.message;
    }
}


// CARREGAR PRODUTOS AO ABRIR A PÁGINA
document.addEventListener("DOMContentLoaded", () => {
    listarProdutos();
});
