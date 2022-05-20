(async () => {
  const data1 = await fetch("./data.json").then(r => r.json());

  var datanames = data1.data[0];
  var datascores = data1.data[1];
  
  datanames = JSON.stringify(datanames);
  datascores = JSON.stringify(datascores);
  
  datanames = datanames.replace('{"name":"','');
  datanames = datanames.replace('"}','');
  datascores = datascores.replace('{"scores":"','');
  datascores = datascores.replace('"}','');


  while (datanames.includes('+')){
    datanames = datanames.replace('+',' ');
  }
  while (datascores.includes('+')){
    datascores = datascores.replace('+',' ');
  }

  var names = datanames.split('&=');
  var scores = datascores.split('&=');

  let i = 0;
  while (i < names.length){
    let display = document.getElementById('leaderboard generated');
    display.innerHTML += "<h1>"+names[i]+"  "+ scores[i].split('&t')[0]+"  "+ scores[i].split('&t')[1]+"</h1>";
    i += 1;
  }

})();
