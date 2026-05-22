-- CreateTable
CREATE TABLE `Automovel` (
    `placa` VARCHAR(191) NOT NULL,
    `proprietario` VARCHAR(191) NOT NULL,
    `tipo` VARCHAR(191) NOT NULL,
    `modelo` VARCHAR(191) NULL,
    `marca` VARCHAR(191) NULL,
    `cor` VARCHAR(191) NULL,
    `ano` INTEGER NULL,
    `telefone` VARCHAR(191) NULL,

    PRIMARY KEY (`placa`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Estadia` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `placa` VARCHAR(191) NOT NULL,
    `entrada` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `saida` DATETIME(3) NULL,
    `valorHora` DOUBLE NOT NULL,
    `valorTotal` DOUBLE NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Estadia` ADD CONSTRAINT `Estadia_placa_fkey` FOREIGN KEY (`placa`) REFERENCES `Automovel`(`placa`) ON DELETE RESTRICT ON UPDATE CASCADE;
