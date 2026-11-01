const marketYield=document.getElementById('market-yield');
if(marketYield){
  const updateBond=()=>{
    const y=Number(marketYield.value)/100;
    if(!Number.isFinite(y)||y<0||y>.1)return;
    const price=4/(1+y)+4/((1+y)**2)+104/((1+y)**3);
    document.getElementById('yield-value').textContent=(y*100).toFixed(2)+'%';
    document.getElementById('bond-price').textContent='$'+price.toFixed(2);
    document.getElementById('current-yield').textContent=(400/price).toFixed(2)+'%';
    document.getElementById('bond-comparison').textContent=Math.abs(price-100)<.001?'At par: the price equals the $100 face value.':price>100?'Above par: a lower market yield makes the fixed coupon more valuable.':'Below par: a higher market yield makes the fixed coupon less valuable.';
  };
  marketYield.addEventListener('input',updateBond);
  updateBond();
}
