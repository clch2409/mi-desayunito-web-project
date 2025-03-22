import insumosData from '../json/insumos.json' with {type: 'json'}

const insumos = insumosData.length > 0 ? insumosData : []

const insumoForm = document.getElementById('insumo-form');




insumoForm.addEventListener('click', addColorLabel)

function addColorLabel(event){
  const target = event.target;
  target.classList.toggle('selected');

  console.log({target})
}