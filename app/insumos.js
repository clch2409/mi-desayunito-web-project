import insumosData from '../json/insumos.json' with {type: 'json'}

const insumos = insumosData.length > 0 ? insumosData : [];
const tipoInsumos = Array.from(new Set(insumos.map(insumo => insumo.tipoInsumo)));
const proveedores = Array.from(new Set(insumos.map(insumo => insumo.proveedor)));
let insumosSelected = []
let insumosFiltered = insumos;


const insumoContainer = document.querySelector('.insumo-container');
const insumoSelect = document.getElementById('insumo-select');
const insumosDataList = document.getElementById('filter-insumo');
const insumoSearch = document.getElementById('insumo-search');
const insumoButtonSearch = document.getElementById('insumo-button-search')
const insumoButtonClear = document.getElementById('insumo-button-clear')

insumoContainer.addEventListener('click', addColorLabel);
insumoSelect.addEventListener('change', agregarDatosListaFiltros);
insumoButtonSearch.addEventListener('click', filtrarInsumos);
insumoButtonClear.addEventListener('click', limpiarInsumos)

mostrarInsumosLabels();

function addColorLabel(event){
  const target = event.target;
  if (target.tagName === 'LABEL'){
    target.classList.toggle('selected');
  }
  
}

function mostrarInsumosLabels(){
  insumosFiltered.forEach(insumo => {
    crearLabelInputInsumo(insumo.nombre)
  })
}

function crearLabelInputInsumo(nombreInsumo){
  const insumoLabelElement = document.createElement('label');
  // const insumoInputElement = crearInputInsumo(nombreInsumo)

  insumoLabelElement.textContent = nombreInsumo.toUpperCase();
  insumoLabelElement.classList.add('insumo-name');
  insumoLabelElement.htmlFor = nombreInsumo;

  // insumoLabelElement.insertAdjacentElement('beforeend', insumoInputElement)

  insumoContainer.appendChild(insumoLabelElement);
}

// function crearInputInsumo(nombreInsumo){
//   const inputElement = document.createElement('input');
//   inputElement.type = 'checkbox';
//   inputElement.id = nombreInsumo;
//   inputElement.classList.add('insumo-check');
//   return inputElement;
// }

function agregarDatosListaFiltros(){
  mostrarNombresEnFiltro(insumoSelect.value)
}

function mostrarNombresEnFiltro(tipoFiltro){
  let tipoFiltroArray;
  if (tipoFiltro === 'todos'){
    tipoFiltroArray = [];
  }
  else if (tipoFiltro === 'tipoInsumo'){
    tipoFiltroArray = tipoInsumos;
  }
  else{
    tipoFiltroArray = proveedores;
  }
  insumosDataList.innerHTML = '';
  tipoFiltroArray.forEach(nombre => {
    insumosDataList.appendChild(crearDatosListaFiltro(nombre))
  })
}

function crearDatosListaFiltro(nombreTipoFiltro){
  const optionElement = document.createElement('option');
  optionElement.value = nombreTipoFiltro;

  return optionElement;
}

function filtrarInsumos(evento){
  evento.preventDefault();
  const tipoFiltro = insumoSelect.value;
  const nombreFiltro = insumoSearch.value;

  if (tipoFiltro === 'todos'){
    insumosFiltered = insumos;
  }
  else if (tipoFiltro === 'tipoInsumo'){
    insumosFiltered = insumos.filter(insumo => insumo.tipoInsumo === nombreFiltro);
  }
  else{
    insumosFiltered = insumos.filter(insumo => insumo.proveedor === nombreFiltro);
  }
  insumoContainer.innerHTML = '';
  mostrarInsumosLabels()
}

function limpiarInsumos(evento){
  evento.preventDefault()
  insumoSelect.value = 'todos';
  insumoSearch.value = '';
  filtrarInsumos(evento);
}