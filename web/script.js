const automoveis = JSON.parse(localStorage.getItem("acme_automoveis")) || [];
const estadias = JSON.parse(localStorage.getItem("acme_estadias")) || [];

let veiculoEdicao = null;
let estadiaEdicao = null;

const secaoEstadias = document.getElementById("secao-estadias");
const secaoAutomoveis = document.getElementById("secao-automoveis");
const navEstadias = document.getElementById("nav-estadias");
const navAutomoveis = document.getElementById("nav-automoveis");

const modalVeiculo = document.getElementById("modal-veiculo");
const formVeiculo = document.getElementById("form-veiculo");
const tituloModalVeiculo = document.getElementById("titulo-modal-veiculo");

const modalEstadia = document.getElementById("modal-estadia");
const formEstadia = document.getElementById("form-estadia");
const tituloModalEstadia = document.getElementById("titulo-modal-estadia");
const btnSalvarEstadia = document.getElementById("btn-salvar-estadia");
const alertaSemVeiculos = document.getElementById("alerta-sem-veiculos");
const grupoSelectVeiculo = document.getElementById("grupo-select-veiculo");

const inputVeiculoPlaca = document.getElementById("veiculo-placa");
const inputVeiculoProprietario = document.getElementById("veiculo-proprietario");
const inputVeiculoTipo = document.getElementById("veiculo-tipo");
const inputVeiculoModelo = document.getElementById("veiculo-modelo");

const selectEstadiaPlaca = document.getElementById("estadia-placa");
const inputEstadiaValorHora = document.getElementById("estadia-valor-hora");
const inputEstadiaEntrada = document.getElementById("estadia-entrada");

document.addEventListener("DOMContentLoaded", () => {
    listarEstadias();
    listarVeiculos();
    atualizarEstatisticas();
    setInterval(atualizarValoresTempoReal, 30000);
});

function trocarAba(aba) {
    if (aba === "estadias") {
        secaoEstadias.classList.add("active");
        secaoAutomoveis.classList.remove("active");
        navEstadias.classList.add("active");
        navAutomoveis.classList.remove("active");
        listarEstadias();
    } else {
        secaoEstadias.classList.remove("active");
        secaoAutomoveis.classList.add("active");
        navEstadias.classList.remove("active");
        navAutomoveis.classList.add("active");
        listarVeiculos();
    }
}

function salvarDados() {
    localStorage.setItem("acme_automoveis", JSON.stringify(automoveis));
    localStorage.setItem("acme_estadias", JSON.stringify(estadias));
    atualizarEstatisticas();
}

function abrirModal(modal) {
    modal.classList.remove("oculto");
}

function fecharModal(modal) {
    modal.classList.add("oculto");
}

function abrirModalVeiculo(veiculo = null) {
    formVeiculo.reset();
    veiculoEdicao = veiculo;
    
    removerBotaoExcluirAuto();

    if (veiculo) {
        inputVeiculoPlaca.value = veiculo.placa;
        inputVeiculoPlaca.disabled = true;
        inputVeiculoProprietario.value = veiculo.proprietario;
        inputVeiculoTipo.value = veiculo.tipo;
        inputVeiculoModelo.value = veiculo.modelo || "";
        tituloModalVeiculo.innerText = "Editar Veículo";

        const btnExcluir = document.createElement("button");
        btnExcluir.type = "button";
        btnExcluir.id = "btn-excluir-auto";
        btnExcluir.classList.add("btn", "btn-danger");
        btnExcluir.innerHTML = '<i class="fa-solid fa-trash"></i> Excluir';
        btnExcluir.onclick = () => excluirVeiculo(veiculo.placa);
        
        const footer = modalVeiculo.querySelector(".modal-footer");
        footer.insertBefore(btnExcluir, footer.firstChild);
    } else {
        inputVeiculoPlaca.disabled = false;
        tituloModalVeiculo.innerText = "Cadastrar Veículo";
    }
    abrirModal(modalVeiculo);
}

function fecharModalVeiculo() {
    fecharModal(modalVeiculo);
    removerBotaoExcluirAuto();
}

function removerBotaoExcluirAuto() {
    const btn = document.getElementById("btn-excluir-auto");
    if (btn) btn.remove();
}

function salvarVeiculo(e) {
    e.preventDefault();
    const placa = inputVeiculoPlaca.value.trim().toUpperCase();
    const proprietario = inputVeiculoProprietario.value.trim();
    const tipo = inputVeiculoTipo.value;
    const modelo = inputVeiculoModelo.value.trim();

    if (!veiculoEdicao) {
        const existe = automoveis.find(a => a.placa === placa);
        if (existe) {
            alert("Este veículo já está cadastrado!");
            return;
        }
        automoveis.push({ placa, proprietario, tipo, modelo });
    } else {
        const index = automoveis.findIndex(a => a.placa === veiculoEdicao.placa);
        if (index !== -1) {
            automoveis[index] = { placa: veiculoEdicao.placa, proprietario, tipo, modelo };
        }
    }

    salvarDados();
    fecharModalVeiculo();
    listarVeiculos();
}

function excluirVeiculo(placa) {
    if (!confirm(`Excluir o veículo ${placa}? Todas as estadias ligadas a ele serão apagadas.`)) return;
    
    const index = automoveis.findIndex(a => a.placa === placa);
    if (index !== -1) {
        automoveis.splice(index, 1);
        
        for (let i = estadias.length - 1; i >= 0; i--) {
            if (estadias[i].placa === placa) {
                estadias.splice(i, 1);
            }
        }
    }
    
    salvarDados();
    fecharModalVeiculo();
    listarVeiculos();
}

function listarVeiculos() {
    const container = document.getElementById("lista-automoveis");
    container.innerHTML = "";

    if (automoveis.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fa-solid fa-car"></i>
                <p>Nenhum veículo cadastrado ainda.</p>
            </div>
        `;
        return;
    }

    automoveis.forEach(auto => {
        const card = document.createElement("div");
        card.classList.add("card");
        card.innerHTML = `
            <div class="card-header">
                <span class="card-title">${auto.placa}</span>
                <span class="badge badge-muted">${auto.tipo}</span>
            </div>
            <div class="card-body">
                <p><strong>Proprietário:</strong> ${auto.proprietario}</p>
                <p><strong>Modelo:</strong> ${auto.modelo || "Não informado"}</p>
            </div>
            <div class="card-footer">
                <button class="btn btn-secondary btn-sm" onclick="abrirModalVeiculo(${JSON.stringify(auto).replace(/"/g, '&quot;')})">
                    <i class="fa-solid fa-pen"></i> Editar
                </button>
            </div>
        `;
        container.appendChild(card);
    });
}

function atualizarSelectPlacas() {
    selectEstadiaPlaca.innerHTML = "";
    if (automoveis.length === 0) {
        alertaSemVeiculos.classList.remove("oculto");
        grupoSelectVeiculo.classList.add("oculto");
        btnSalvarEstadia.disabled = true;
    } else {
        alertaSemVeiculos.classList.add("oculto");
        grupoSelectVeiculo.classList.remove("oculto");
        btnSalvarEstadia.disabled = false;

        automoveis.forEach(auto => {
            const option = document.createElement("option");
            option.value = auto.placa;
            option.innerText = `${auto.placa} - ${auto.proprietario}`;
            selectEstadiaPlaca.appendChild(option);
        });
    }
}

function irParaVeiculos() {
    fecharModalEstadia();
    trocarAba("automoveis");
    abrirModalVeiculo();
}

function abrirModalEstadia() {
    formEstadia.reset();
    
    const agora = new Date();
    agora.setMinutes(agora.getMinutes() - agora.getTimezoneOffset());
    inputEstadiaEntrada.value = agora.toISOString().slice(0, 16);

    atualizarSelectPlacas();
    abrirModal(modalEstadia);
}

function fecharModalEstadia() {
    fecharModal(modalEstadia);
}

function salvarEstadia(e) {
    e.preventDefault();
    const placa = selectEstadiaPlaca.value;
    const valorHora = parseFloat(inputEstadiaValorHora.value);
    const entrada = new Date(inputEstadiaEntrada.value).toISOString();

    const existeAtiva = estadias.find(est => est.placa === placa && est.saida === null);
    if (existeAtiva) {
        alert("Este veículo já está estacionado no pátio!");
        return;
    }

    const novaEstadia = {
        id: Date.now(),
        placa,
        entrada,
        saida: null,
        valorHora,
        valorTotal: null
    };

    estadias.push(novaEstadia);
    salvarDados();
    fecharModalEstadia();
    listarEstadias();
}

function quickCheckout(id) {
    const estadia = estadias.find(e => e.id === id);
    if (!estadia) return;

    if (!confirm(`Realizar o check-out do veículo de Placa ${estadia.placa}?`)) return;

    const agora = new Date();
    estadia.saida = agora.toISOString();
    
    const entrada = new Date(estadia.entrada);
    const horas = Math.ceil((agora - entrada) / (1000 * 60 * 60));
    const horasCobrar = Math.max(1, horas);
    estadia.valorTotal = horasCobrar * estadia.valorHora;

    salvarDados();
    listarEstadias();
    
    alert(`Check-out efetuado!\nPlaca: ${estadia.placa}\nCobrado: R$ ${estadia.valorTotal.toFixed(2)}`);
}

function excluirEstadia(id) {
    if (!confirm("Deseja apagar permanentemente este registro de estadia?")) return;
    
    const index = estadias.findIndex(e => e.id === id);
    if (index !== -1) {
        estadias.splice(index, 1);
    }
    
    salvarDados();
    listarEstadias();
}

function listarEstadias() {
    const container = document.getElementById("lista-estadias");
    container.innerHTML = "";

    if (estadias.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fa-solid fa-clock"></i>
                <p>Nenhuma estadia registrada ainda.</p>
            </div>
        `;
        return;
    }

    estadias.sort((a, b) => {
        if (a.saida === null && b.saida !== null) return -1;
        if (a.saida !== null && b.saida === null) return 1;
        return new Date(b.entrada) - new Date(a.entrada);
    });

    estadias.forEach(estadia => {
        const card = document.createElement("div");
        card.classList.add("card");
        
        const isAtiva = estadia.saida === null;
        const dtEntrada = new Date(estadia.entrada);
        
        let visualSaida = "";
        let visualValor = "";
        let visualAcao = "";

        if (isAtiva) {
            visualSaida = `<p><strong>Tempo:</strong> <span class="tempo-decorrido" data-entrada="${estadia.entrada}">Calculando...</span></p>`;
            visualValor = `<span class="price active valor-decorrido" data-entrada="${estadia.entrada}" data-valorhora="${estadia.valorHora}">R$ 0,00</span>`;
            visualAcao = `
                <button class="btn btn-primary btn-sm" onclick="quickCheckout(${estadia.id})">
                    <i class="fa-solid fa-arrow-right-from-bracket"></i> Check-out
                </button>
            `;
        } else {
            const dtSaida = new Date(estadia.saida);
            const totalMinutos = Math.max(1, Math.ceil((dtSaida - dtEntrada) / 60000));
            const horas = Math.floor(totalMinutos / 60);
            const minutos = totalMinutos % 60;
            const tempoTexto = `${String(horas).padStart(2, '0')}h ${String(minutos).padStart(2, '0')}m`;

            visualSaida = `
                <p><strong>Saída:</strong> ${dtSaida.toLocaleString('pt-BR')}</p>
                <p><strong>Duração:</strong> ${tempoTexto}</p>
            `;
            visualValor = `<span class="price">R$ ${(estadia.valorTotal || 0).toFixed(2)}</span>`;
            visualAcao = `
                <button class="btn btn-danger btn-sm" onclick="excluirEstadia(${estadia.id})">
                    <i class="fa-solid fa-trash"></i> Excluir
                </button>
            `;
        }

        card.innerHTML = `
            <div class="card-header">
                <span class="card-title">${estadia.placa}</span>
                <span class="badge ${isAtiva ? 'badge-success' : 'badge-muted'}">${isAtiva ? 'No Pátio' : 'Finalizado'}</span>
            </div>
            <div class="card-body">
                <p><strong>Entrada:</strong> ${dtEntrada.toLocaleString('pt-BR')}</p>
                ${visualSaida}
                <p><strong>Valor Hora:</strong> R$ ${estadia.valorHora.toFixed(2)}</p>
            </div>
            <div class="card-footer">
                ${visualValor}
                ${visualAcao}
            </div>
        `;
        container.appendChild(card);
    });

    atualizarValoresTempoReal();
}

function atualizarEstatisticas() {
    const ativas = estadias.filter(e => e.saida === null);
    const concluidas = estadias.filter(e => e.saida !== null);

    document.getElementById("total-ativos").innerText = ativas.length;

    const faturamentoTotal = concluidas.reduce((acc, curr) => acc + (curr.valorTotal || 0), 0);
    document.getElementById("faturamento-total").innerText = `R$ ${faturamentoTotal.toFixed(2)}`;
}

function atualizarValoresTempoReal() {
    const agora = new Date();
    
    document.querySelectorAll(".tempo-decorrido").forEach(el => {
        const entrada = new Date(el.getAttribute("data-entrada"));
        const difMs = agora - entrada;
        const totalMinutos = Math.max(1, Math.ceil(difMs / 60000));
        const horas = Math.floor(totalMinutos / 60);
        const minutos = totalMinutos % 60;
        el.innerText = `${String(horas).padStart(2, '0')}h ${String(minutos).padStart(2, '0')}m`;
    });

    document.querySelectorAll(".valor-decorrido").forEach(el => {
        const entrada = new Date(el.getAttribute("data-entrada"));
        const valorHora = parseFloat(el.getAttribute("data-valorhora"));
        const horas = Math.ceil((agora - entrada) / (1000 * 60 * 60));
        const horasCobrar = Math.max(1, horas);
        const valorEstimado = horasCobrar * valorHora;
        el.innerText = `R$ ${valorEstimado.toFixed(2)}`;
    });
}
