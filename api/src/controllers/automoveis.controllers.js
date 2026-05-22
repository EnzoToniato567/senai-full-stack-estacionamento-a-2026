const prisma = require("../data/prisma");

const listar = async (req, res) => {
    const automoveis = await prisma.automovel.findMany();
    return res.status(200).json(automoveis);
};

const cadastrar = async (req, res) => {
    const data = req.body;

    const automovel = await prisma.automovel.create({
        data: {
            placa: data.placa,
            proprietario: data.proprietario || data.proprietário,
            tipo: data.tipo,
            modelo: data.modelo,
            marca: data.marca,
            cor: data.cor,
            ano: data.ano ? Number(data.ano) : null,
            telefone: data.telefone
        }
    });

    return res.status(201).json(automovel);
};

const buscar = async (req, res) => {
    const { placa } = req.params;

    const automovel = await prisma.automovel.findUnique({
        where: { placa }
    });

    return res.status(200).json(automovel);
};

const atualizar = async (req, res) => {
    const { placa } = req.params;
    const data = req.body;

    const automovel = await prisma.automovel.update({
        where: { placa },
        data: {
            proprietario: data.proprietario || data.proprietário,
            tipo: data.tipo,
            modelo: data.modelo,
            marca: data.marca,
            cor: data.cor,
            ano: data.ano ? Number(data.ano) : undefined,
            telefone: data.telefone
        }
    });

    return res.status(200).json(automovel);
};

const excluir = async (req, res) => {
    const { placa } = req.params;

    const automovel = await prisma.automovel.delete({
        where: { placa }
    });

    return res.status(200).json(automovel);
};

module.exports = {
    cadastrar,
    listar,
    buscar,
    atualizar,
    excluir
};