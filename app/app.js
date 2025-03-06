import data from '../json/insumos.json' with { type: 'json' };

const insumos = data;

const listado = document.querySelector('ul')

function crearInsumo(nombreInsumo){
  const insumoElemento = document.createElement('li');
  insumoElemento.textContent = nombreInsumo;
  listado.appendChild(insumoElemento);
}

insumos.forEach(insumo => crearInsumo(insumo.nombre))