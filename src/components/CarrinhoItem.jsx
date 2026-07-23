export default function CarrinhoItem({ item, aoAlterarQuantidade, aoRemover }) {
  return (
    <div className="flex items-center gap-4 bg-white rounded-lg shadow p-3">
      <img
        src={item.imagemUrl}
        alt={item.nome}
        className="w-20 h-20 object-cover rounded-lg"
      />

      <div className="flex-1">
        <h3 className="font-semibold">{item.nome}</h3>
        <p className="text-green-700 font-bold">
          R$ {item.preco.toFixed(2).replace(".", ",")}
        </p>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => aoAlterarQuantidade(item.id, item.quantidade - 1)}
          className="w-8 h-8 bg-gray-200 rounded-full font-bold"
        >
          -
        </button>
        <span className="w-6 text-center">{item.quantidade}</span>
        <button
          onClick={() => aoAlterarQuantidade(item.id, item.quantidade + 1)}
          className="w-8 h-8 bg-gray-200 rounded-full font-bold"
        >
          +
        </button>
      </div>

      <button
        onClick={() => aoRemover(item.id)}
        className="text-red-600 text-sm font-medium ml-2"
      >
        Remover
      </button>
    </div>
  );
}