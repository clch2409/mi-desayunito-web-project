import data from '../json/insumos.json' with { type: 'json' };
import Insumo from '../model/Insumo.mjs'

const insumos = data;

const listado = document.querySelector('ul')

function mostrarInsumo(insumo){
  const insumoElemento = document.createElement('li');
  const insumoObjeto = new Insumo(insumo.nombre, insumo.proveedor, insumo.tipoInsumo)
  insumoElemento.textContent = insumoObjeto.nombre.toUpperCase();
  listado.appendChild(insumoElemento);
}

insumos.forEach(insumo => mostrarInsumo(insumo))