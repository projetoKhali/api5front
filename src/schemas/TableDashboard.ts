export interface TableRow { // Interface para as linhas da tabela, permitindo dados flexíveis.
    [key: string]: any;
}

export interface TableRequest { // Interface genérica para requisições com filtros dinâmicos.
    [key: string]: any;
}

export default interface TableRowResponse { // Interface para a resposta contendo os dados da tabela.
    tableData: TableRow[];
}

