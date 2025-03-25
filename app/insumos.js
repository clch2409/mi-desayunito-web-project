import insumosData from '../json/insumos.json' with {type: 'json'}

const insumos = insumosData.length > 0 ? insumosData : []

const insumoForm = document.getElementById('insumo-form');


insumoForm.addEventListener('click', addColorLabel)

mostrarInsumosLabels();

function addColorLabel(event){
  const target = event.target;
  target.classList.toggle('selected')
}

function mostrarInsumosLabels(){
  insumos.forEach(insumo => {
    crearLabelInputInsumo(insumo.nombre)
  })
}

function crearLabelInputInsumo(nombreInsumo){
  const insumoLabelElement = document.createElement('label');
  const insumoInputElement = crearInputInsumo(nombreInsumo)

  insumoLabelElement.textContent = nombreInsumo.toUpperCase();
  insumoLabelElement.classList.add('insumo-name');
  insumoLabelElement.htmlFor = nombreInsumo;

  insumoLabelElement.insertAdjacentElement('beforeend', insumoInputElement)

  insumoForm.appendChild(insumoLabelElement);
}

function crearInputInsumo(nombreInsumo){
  const inputElement = document.createElement('input');
  inputElement.type = 'checkbox';
  inputElement.id = nombreInsumo;
  inputElement.classList.add('insumo-check');
  return inputElement;
}