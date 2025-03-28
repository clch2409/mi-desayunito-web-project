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
let insumosFiltered = insumos.sort((a, b) => a.proveedor.localeCompare(b.proveedor, 'es'));

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
  insumosFiltered.forEach((insumo, index) => {
    crearLabelInputInsumo(`${insumo.nombre} - ${insumo.proveedor}`, insumo.id);
  })
  validarInfoDeSelect(insumoSelect.value)
}

// function verificarNombreInsumoRepetido(insumo, index){
//   return index > 0 && index < (insumosFiltered.length - 1) && (insumo.nombre === insumosFiltered[index+1].nombre
//   || insumo.nombre === insumosFiltered[index-1].nombre);
// }

function crearLabelInputInsumo(nombreInsumo, id){
  const insumoLabelElement = document.createElement('label');
  const insumoInputElement = crearInputInsumo(id)

  insumoLabelElement.textContent = nombreInsumo;
  insumoLabelElement.classList.add('insumo-name');
  insumoLabelElement.id = id;

  insumoLabelElement.insertAdjacentElement('beforeend', insumoInputElement)

  if (verificarInsumoEnInsumosSelected(id)){
    insumoLabelElement.classList.add(selectedClass)
  }

  insumoContainer.appendChild(insumoLabelElement);
}

function crearInputInsumo(id){
  const inputElement = document.createElement('input');
  inputElement.type = 'checkbox';
  inputElement.id = id;
  inputElement.classList.add('insumo-check');
  return inputElement;
}

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
    insumosSelected.push(obtenerInsumo(target.id))
  }
  else{
    insumosSelected = insumosSelected.filter(insumo => insumo.id !== target.id)
  }
  localStorage.setItem('insumosSelected', JSON.stringify(insumosSelected));
}

function obtenerInsumo(id){
  return insumosFiltered.find(insumo => insumo.id == id)
}

function verificarInsumoSeleccionado(target){
  return target.classList.contains(selectedClass)
}

function verificarInsumoEnInsumosSelected(id){
  return insumosSelected.find(insumo => insumo.id === id);
}

//Funciones para realizar los filtros de los insumos
function mostrarNombresEnFiltro(){
  const tipoFiltro = insumoSelect.value
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
  validarInfoDeSelect(tipoFiltro)
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
  if (confirm(mensajeValidacion())){
    enviarMensaje()
    limpiarSelecciones(evento)
  }
  
}

function mensajeValidacion(){
  let mensaje = '¿Desea agregar los siguientes insumos?\n';
  if (insumosSelected.length > 0){
    insumosSelected.forEach(insumo => {
      mensaje += `- ${insumo.nombre}\n`
    })
  }
  else{
    mensaje = 'Primero selecciones los insumos antes de enviar el mensaje'
  }
  return mensaje;
}

function validarInfoDeSelect(tipoFiltro){
  if (tipoFiltro == tipoFilterTodos){
    deshabilitarSearch();
  }
  else{
    habilitarSearch();
  }
}

function enviarMensaje(){
  let mensaje = `LISTA DE COMPRAS: ${new Date().toLocaleDateString()}\n\n`;
  insumosSelected.forEach(insumo => {
    mensaje += `- ${insumo.nombre} -- ${insumo.proveedor}\n`
  })
  let telefono = "+51919059437";
  let url = `https://wa.me/${telefono}?text=${encodeURIComponent(mensaje)}`;

  window.open(url, "_blank");

}