const growthInput=document.getElementById('eps-growth');
const multipleInput=document.getElementById('pe-multiple');
if(growthInput&&multipleInput){
 const updateScenario=()=>{
  const growth=Number(growthInput.value),multiple=Number(multipleInput.value);
  if(!Number.isFinite(growth)||!Number.isFinite(multiple)||growth< -20||growth>40||multiple<10||multiple>30)return;
  const eps=10*(1+growth/100),price=eps*multiple,change=(price/200-1)*100;
  document.getElementById('growth-value').textContent=growth.toFixed(0)+'%';
  document.getElementById('pe-value').textContent=multiple.toFixed(1)+'×';
  document.getElementById('scenario-price').textContent='$'+price.toFixed(2);
  document.getElementById('scenario-return').textContent='Price change: '+change.toFixed(2)+'%. New EPS: $'+eps.toFixed(2)+'.';
  document.getElementById('scenario-hurdle').textContent='EPS growth needed to preserve $200 at this multiple: '+((20/multiple-1)*100).toFixed(2)+'%.';
 };
 growthInput.addEventListener('input',updateScenario);multipleInput.addEventListener('input',updateScenario);updateScenario();
}
