const prisma = require("../data/prisma");

const listar = async (req, res) => {
    const estadias = await prisma.estadia.findMany();
    return res.status(200).json(estadias);
};

const cadastrar = async (req, res) => {
    const data = req.body;

    const estadia = await prisma.estadia.create({
        data: {
            placa: data.placa,
            entrada: data.entrada ? new Date(data.entrada) : undefined,
            saida: data.saida ? new Date(data.saida) : undefined,
            valorHora: Number(data.valorHora),
            valorTotal: data.valorTotal ? Number(data.valorTotal) : undefined
        }
    });

    return res.status(201).json(estadia);
};

const buscar = async (req, res) => {
    const { id } = req.params;

    const estadia = await prisma.estadia.findUnique({
        where: { id: Number(id) }
    });

    return res.status(200).json(estadia);
};

const atualizar = async (req, res) => {
    const { id } = req.params;
    const data = req.body;

    const estadia = await prisma.estadia.update({
        where: { id: Number(id) },
        data: {
            placa: data.placa,
            entrada: data.entrada ? new Date(data.entrada) : undefined,
            saida: data.saida ? new Date(data.saida) : undefined,
            valorHora: data.valorHora ? Number(data.valorHora) : undefined,
            valorTotal: data.valorTotal ? Number(data.valorTotal) : undefined
        }
    });

    return res.status(200).json(estadia);
};

const excluir = async (req, res) => {
    const { id } = req.params;

    const estadia = await prisma.estadia.delete({
        where: { id: Number(id) }
    });

    return res.status(200).json(estadia);
};

const encerrar = async (req, res) => {
    const { id } = req.params;
    const data = req.body;

    const estadiaExistente = await prisma.estadia.findUnique({
        where: { id: Number(id) }
    });

    const saida = data.saida ? new Date(data.saida) : new Date();
    const horas = Math.ceil((saida - estadiaExistente.entrada) / (1000 * 60 * 60));
    const valorTotal = horas * estadiaExistente.valorHora;

    const estadia = await prisma.estadia.update({
        where: { id: Number(id) },
        data: {
            saida,
            valorTotal
        }
    });

    return res.status(200).json(estadia);

};

module.exports = {
    cadastrar,
    listar,
    buscar,
    atualizar,
    excluir,
    encerrar
};