import insumosData from '../json/insumos.json' with {type: 'json'}

const insumos = Array.from(insumosData.length > 0 ? insumosData : []).map(insumo => {
  return  {
    ...insumo,
    nombre: insumo.nombre.toUpperCase()
  }
});
const tiposInsumo = Array.from(new Set(insumos.map(insumo => insumo.tipoInsumo)));
const proveedores = Array.from(new Set(insumos.map(insumo => insumo.proveedor)));
let insumosElementsSelected = [];
let insumosFiltered = insumos;

const tipoFilterTodos = 'todos';
const tipoFilterTipoInsumo = 'tipoInsumo';
const selectedClass = 'selected';

const insumoContainer = document.querySelector('.insumo-container');
const insumoSelect = document.getElementById('insumo-select');
const insumosDataList = document.getElementById('filter-insumo');
const insumoSearch = document.getElementById('insumo-search');
const insumoButtonSearch = document.getElementById('insumo-button-search')
const insumoButtonClear = document.getElementById('insumo-button-clear')

insumoContainer.addEventListener('click', selectInsumos);
insumoSelect.addEventListener('change', agregarDatosListaFiltros);
insumoButtonSearch.addEventListener('click', filtrarInsumos);
insumoButtonClear.addEventListener('click', limpiarInsumos)

mostrarInsumosLabels();

//Funciones para mostrar los insumos en pantalla
function mostrarInsumosLabels(){
  console.log(insumosFiltered)
  insumosFiltered.forEach((insumo, index) => {
    if (verificarNombreInsumoRepetido(insumo, index)){
      crearLabelInputInsumo(`${insumo.nombre} - ${insumo.proveedor}`);
    }
    else{
      crearLabelInputInsumo(insumo.nombre)
    }
  })
}

function verificarNombreInsumoRepetido(insumo, index){
  return index > 0 && index < (insumosFiltered.length - 1) && (insumo.nombre === insumosFiltered[index+1].nombre
  || insumo.nombre === insumosFiltered[index-1].nombre);
}

function crearLabelInputInsumo(nombreInsumo){
  const insumoLabelElement = document.createElement('label');
  // const insumoInputElement = crearInputInsumo(nombreInsumo)

  insumoLabelElement.textContent = nombreInsumo;
  insumoLabelElement.classList.add('insumo-name');
  insumoLabelElement.htmlFor = nombreInsumo;

  // insumoLabelElement.insertAdjacentElement('beforeend', insumoInputElement)

  if (verificarInsumoEnInsumosSelected(nombreInsumo)){
    insumoLabelElement.classList.add(selectedClass)
  }

  insumoContainer.appendChild(insumoLabelElement);
}

// function crearInputInsumo(nombreInsumo){
//   const inputElement = document.createElement('input');
//   inputElement.type = 'checkbox';
//   inputElement.id = nombreInsumo;
//   inputElement.classList.add('insumo-check');
//   return inputElement;
// }

//Función para mostrar en color los elementos seleccionados 
function addColorLabel(target){
  if (target.tagName === 'LABEL'){
    target.classList.toggle(selectedClass);
  }
}

//Funciones para persistencia de insumos seleccionados
function selectInsumos(evento){
  const target = evento.target
  addColorLabel(target);
  const targetSeleccionado = verificarInsumoSeleccionado(target);
  if (targetSeleccionado){
    insumosElementsSelected.push(target)
  }
  else{
    insumosElementsSelected = insumosElementsSelected.filter(elemento => elemento.textContent !== target.textContent)
  }
}

function verificarInsumoSeleccionado(target){
  return target.classList.contains(selectedClass)
}

function verificarInsumoEnInsumosSelected(nombreInsumo){
  return insumosElementsSelected.find(insumo => insumo.textContent === nombreInsumo);
}

//Funciones para realizar los filtros de los insumos
function agregarDatosListaFiltros(){
  mostrarNombresEnFiltro(insumoSelect.value)
}

function mostrarNombresEnFiltro(tipoFiltro){
  let tipoFiltroArray;
  if (tipoFiltro === tipoFilterTodos){
    tipoFiltroArray = [];
  }
  else if (tipoFiltro === tipoFilterTipoInsumo){
    tipoFiltroArray = tiposInsumo;
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
  const nombreFiltro = insumoSearch.value.trim();
  let nombreFiltroValido;

  if (tipoFiltro === tipoFilterTodos || nombreFiltro === ''){
    insumosFiltered = insumos;
  }
  else if (tipoFiltro === tipoFilterTipoInsumo){
    insumosFiltered = insumos.filter(insumo => insumo.tipoInsumo === nombreFiltro);
  }
  else{
    insumosFiltered = insumos.filter(insumo => insumo.proveedor === nombreFiltro);
  }

  nombreFiltroValido = verificarNombreFiltro(tipoFiltro, nombreFiltro)

  if(!nombreFiltroValido){
    alert('Ingrese una búsqueda válida')
  }
  else{
    insumoContainer.innerHTML = '';
    mostrarInsumosLabels()
  }
}

function verificarNombreFiltro(tipoFiltro, filtroNombre){
  if (tipoFiltro === tipoFilterTipoInsumo){
    return tiposInsumo.find(tipoInsumo => tipoInsumo === filtroNombre)
  }
  else{
    return proveedores.find(proveedor => proveedor === filtroNombre)
  }
}

function limpiarInsumos(evento){
  evento.preventDefault()
  insumoSelect.value = tipoFilterTodos;
  insumoSearch.value = '';
  // filtrarInsumos(evento);
  insumoContainer.innerHTML = '';
  insumosFiltered = insumos;
  mostrarInsumosLabels()
}