export default function ProdutoCard({ produto, aoAdicionar }) {
  return (
    <div className="bg-white rounded-xl shadow overflow-hidden flex flex-col">
      <img
        src={produto.imagemUrl}
        alt={produto.nome}
        className="w-full h-40 object-cover"
      />
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-bold text-lg">{produto.nome}</h3>
        <p className="text-gray-500 text-sm mt-1 flex-1">{produto.descricao}</p>
        <div className="flex items-center justify-between mt-4">
          <span className="text-green-700 font-bold text-lg">
            R$ {produto.preco.toFixed(2).replace(".", ",")}
          </span>
          <button
            onClick={() => aoAdicionar(produto)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-700"
          >
            Adicionar
          </button>
        </div>
      </div>
    </div>
  );
}