
const URL = "https://hqtqbprrvaymchhaucfx.supabase.co";
const KEY = "sb_publishable_CGVN66a-EdSQH6AQ_saMTg_VsDBBTJn";

// ELEMENTOS DA PÁGINA
const campo = (id) => document.getElementById(id);

// VALIDAR ENDEREÇO DA IMAGEM
function imagemValida(endereco) {
    try {
        const url = new URL(endereco);
        return url.protocol === "https:" || url.protocol === "http:";
    } catch {
        return false;
    }
}

// SALVAR PRODUTO
async function salvar() {
    const nome = campo("nome").value.trim();
    const imagem = campo("imagem").value.trim();
    const precoTexto = campo("preco").value.trim();
    const descricao = campo("descricao").value.trim();
    const mensagem = campo("mensagem");

    if (!nome || !imagem || !precoTexto || !descricao) {
        mensagem.textContent = "Preencha todos os campos!";
        return;
    }

    if (!imagemValida(imagem)) {
        mensagem.textContent = "Digite um link válido para a imagem!";
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
                apikey: KEY,
                Authorization: `Bearer ${KEY}`,
                "Content-Type": "application/json",
                Prefer: "return=minimal"
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
            mensagem.textContent = "Erro ao salvar produto: " + erro;
            return;
        }

        mensagem.textContent = "Produto salvo com sucesso!";

        campo("nome").value = "";
        campo("imagem").value = "";
        campo("preco").value = "";
        campo("descricao").value = "";

        await listarProdutos();

    } catch (erro) {
        console.error(erro);
        mensagem.textContent = "Erro de conexão com o Supabase.";
    }
}


// LISTAR PRODUTOS
async function listarProdutos() {
    const lista = campo("lista");

    if (!lista) {
        console.error("Elemento lista não encontrado!");
        return;
    }

    try {
        lista.innerHTML = "Carregando produtos...";

        const resposta = await fetch(
            `${URL}/rest/v1/produtos?select=*&order=id.desc`,
            {
                method: "GET",
                headers: {
                    apikey: KEY,
                    Authorization: `Bearer ${KEY}`
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
                background: white;
            `;

            // NOME
            const titulo = document.createElement("h3");
            titulo.textContent = produto.nome || "Produto sem nome";

            // IMAGEM
            const foto = document.createElement("img");
            const endereco = produto.imagem;

            foto.alt = produto.nome || "Imagem do produto";

            foto.style.cssText = `
                width: 100%;
                max-width: 300px;
                height: 220px;
                object-fit: cover;
                border-radius: 8px;
            `;

            if (endereco && imagemValida(endereco)) {
                foto.src = endereco;

                foto.onerror = function () {
                    this.alt = "Não foi possível carregar a imagem";
                    this.style.display = "none";
                };
            } else {
                foto.style.display = "none";
            }

            // DESCRIÇÃO
            const textoDescricao = document.createElement("p");
            textoDescricao.textContent =
                produto.descricao || "Sem descrição";

            // PREÇO
            const textoPreco = document.createElement("strong");

            textoPreco.textContent = Number(produto.preco).toLocaleString(
                "pt-BR",
                {
                    style: "currency",
                    currency: "BRL"
                }
            );

            // ADICIONAR ELEMENTOS
            item.appendChild(titulo);
            item.appendChild(foto);
            item.appendChild(textoDescricao);
            item.appendChild(textoPreco);

            lista.appendChild(item);
        });

    } catch (erro) {
        console.error("Erro ao listar produtos:", erro);
        lista.textContent = "Erro ao carregar produtos: " + erro.message;
    }
}


// CARREGAR AUTOMATICAMENTE
document.addEventListener("DOMContentLoaded", () => {
    listarProdutos();
});
