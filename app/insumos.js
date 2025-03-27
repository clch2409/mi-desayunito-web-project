import insumosData from '../json/insumos.json' with {type: 'json'}

const insumos = Array.from(insumosData.length > 0 ? insumosData : []).map(insumo => {
  return  {
    ...insumo,
    nombre: insumo.nombre.toUpperCase()
  }
});
const tiposInsumo = Array.from(new Set(insumos.map(insumo => insumo.tipoInsumo)));
const proveedores = Array.from(new Set(insumos.map(insumo => insumo.proveedor)));
let insumosSelected = localStorage.getItem('insumosSelected') ? JSON.parse(localStorage.getItem('insumosSelected')) : [];
let insumosFiltered = insumos;

const tipoFilterTodos = 'todos';
const tipoFilterTipoInsumo = 'tipoInsumo';
const selectedClass = 'selected';

const insumoContainer = document.querySelector('.insumo-container');
const insumoSelect = document.getElementById('insumo-select');
const insumosDataList = document.getElementById('filter-insumo');
const insumoSearch = document.getElementById('insumo-search');
const insumoButtonSearch = document.getElementById('insumo-button-search');
const insumoButtonClear = document.getElementById('insumo-button-clear');
const insumoButtonClearSelection = document.getElementById('insumo-button-clear-selection');
const insumoButtonSend = document.getElementById('insumo-button-send');

insumoContainer.addEventListener('click', selectInsumos);
insumoSelect.addEventListener('change', mostrarNombresEnFiltro);
insumoButtonSearch.addEventListener('click', filtrarInsumos);
insumoButtonClear.addEventListener('click', limpiarInsumos);
insumoButtonClearSelection.addEventListener('click', limpiarSelecciones)
insumoButtonSend.addEventListener('click', mostrarMensaje)

mostrarInsumosLabels();

//Funciones para mostrar los insumos en pantalla
function mostrarInsumosLabels(){
  console.log(insumosSelected)
  insumosFiltered.forEach((insumo, index) => {
    if (verificarNombreInsumoRepetido(insumo, index)){
      crearLabelInputInsumo(`${insumo.nombre} - ${insumo.proveedor}`);
    }
    else{
      crearLabelInputInsumo(insumo.nombre)
    }
  })
  deshabilitarSearch()
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
    insumosSelected.push(target.textContent)
  }
  else{
    insumosSelected = insumosSelected.filter(elemento => elemento !== target.textContent)
  }
  localStorage.setItem('insumosSelected', JSON.stringify(insumosSelected));
  console.log(localStorage)
}

function verificarInsumoSeleccionado(target){
  return target.classList.contains(selectedClass)
}

function verificarInsumoEnInsumosSelected(nombreInsumo){
  return insumosSelected.find(insumo => insumo === nombreInsumo);
}

//Funciones para realizar los filtros de los insumos
function mostrarNombresEnFiltro(){
  const tipoFiltro = insumoSelect.value
  let tipoFiltroArray;
  if (tipoFiltro === tipoFilterTodos){
    tipoFiltroArray = [];
    deshabilitarSearch();
  }
  else if (tipoFiltro === tipoFilterTipoInsumo){
    tipoFiltroArray = tiposInsumo;
    habilitarSearch();
  }
  else{
    tipoFiltroArray = proveedores;
    habilitarSearch();
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
  limpiarFiltros()
  // filtrarInsumos(evento);
  limpiarContenedor();
  mostrarInsumosLabels()
}

function limpiarContenedor (){
  insumoContainer.innerHTML = '';
  insumosFiltered = insumos;
}

function limpiarFiltros(){
  insumoSelect.value = tipoFilterTodos;
  insumoSearch.value = '';
}

function limpiarSelecciones(evento){
  evento.preventDefault();
  localStorage.removeItem('insumosSelected');
  insumosSelected = []
  limpiarContenedor();
  mostrarInsumosLabels();
}

function deshabilitarSearch(){
  insumoSearch.readOnly = true;
}

function habilitarSearch(){
  insumoSearch.readOnly = false;
}

function mostrarMensaje(evento){
  evento.preventDefault()
  alert(validarMensaje())
  limpiarSelecciones(evento)
}

function validarMensaje(){
  let mensaje = '¿Desea agregar los siguientes mensajes?\n';
  if (insumosSelected.length > 0){
    insumosSelected.forEach(insumo => {
      mensaje += `- ${insumo}\n`
    })
  }
  else{
    mensaje = 'Primero selecciones los insumos antes de enviar el mensaje'
  }
  return mensaje;
}