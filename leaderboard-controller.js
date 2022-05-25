(async () => {
  const data1 = await fetch("./data.json").then(r => r.json());
  const data2 = await fetch("./data2.json").then(r => r.json());

  var datanames = data1.data[0];
  var datascores = data1.data[1];
  var datanames2 = data2.data[0];
  var datascores2 = data2.data[1];
  
  datanames = JSON.stringify(datanames);
  datascores = JSON.stringify(datascores);
  datanames2 = JSON.stringify(datanames2);
  datascores2 = JSON.stringify(datascores2);
  
  datanames = datanames.replace('{"name":"','');
  datanames = datanames.replace('"}','');
  datascores = datascores.replace('{"scores":"','');
  datascores = datascores.replace('"}','');
  datanames2 = datanames2.replace('{"name":"','');
  datanames2 = datanames2.replace('"}','');
  datascores2 = datascores2.replace('{"scores":"','');
  datascores2 = datascores2.replace('"}','');


  while (datanames.includes('+')){
    datanames = datanames.replace('+',' ');
  }
  while (datascores.includes('+')){
    datascores = datascores.replace('+',' ');
  }
  while (datanames2.includes('+')){
    datanames2 = datanames2.replace('+',' ');
  }
  while (datascores2.includes('+')){
    datascores2 = datascores2.replace('+',' ');
  }

  datanames = datanames + datanames2;
  datascores = datascores + datascores2;

  datanames = datanames.replaceAll("Developers: Shubham Parab, Anindit Pati, and Agastya Pawate Design: Anindit Pati and Shubham Parab Music: Advaita Guruprasad",'Contributers(thats too long)');

  var names = datanames.split('&=');
  var scores = datascores.split('&=');


  console.log(names,scores);

  // names = ['Shubham','skparab1','poisonfy','Shubham','skparab1','poisonfy','Shubham','skparab1','poisonfy','Shubham','skparab1','poisonfy','Shubham','skparab1','poisonfy','Shubham','skparab1','poisonfy'];
  // scores = ['&=8&t36.997','&=7&t18.458','&=2&t38.261','&=8&t36.997','&=7&t18.458','&=2&t38.261','&=8&t36.997','&=7&t18.458','&=2&t38.261','&=8&t36.997','&=7&t18.458','&=2&t38.261','&=8&t36.997','&=7&t18.458','&=2&t38.261','&=8&t36.997','&=7&t18.458','&=2&t38.261'];
  let points = [];
  let times = [];
  let i = 0;
  while (i < scores.length){
    points.push(scores[i].split('&t')[0].replace('&=',''));
    times.push(scores[i].split('&t')[1]);
    i += 1;
  }

  // now we need to order it properly
  var rankscores = [];
  i = 0;
  while (i < names.length){
    rankscores.push(parseFloat(points[i])+parseFloat(times[i])/1000);
    i += 1;
  }

  var ranks = [];
  var subjlist = [];
  i = 0;
  while (i < rankscores.length){
    subjlist.push(rankscores[i]);
    i += 1;
  }

  let ranker = 1;
  //console.log(subjlist);
  while (subjlist.length > 0){
    let max = (subjlist.reduce(function(a, b) {
      return Math.max(a, b);
    }, -Infinity));

    //console.log('max '+max);
    //console.log('index '+rankscores.indexOf(max));
    //console.log('lst '+subjlist);
    ranks.push(rankscores.indexOf(max));
    subjlist.splice(subjlist.indexOf(max),1);

    // add the div

    i = rankscores.indexOf(max);

    if ((rankscores[i] != 0 && points[i] != 0)){
      let display = document.getElementById('leaderboard generated');
      let bgclr;
      if (ranker == 1){
        bgclr = "rgb(100,100,0)";
      } else if (ranker == 2){
        bgclr = "rgb(170,170,170)";
      } else if (ranker == 3 ){
        bgclr = "rgb(85,85,85)";
      } else {
        bgclr = "black";
      }

      //255*3 = 765

      if (ranker == 1){
        display.innerHTML += `
        <div style="background-color: `+bgclr+`" class="fullwidth">
        <div id="d1" style="background: linear-gradient(to right, rgb(255,0,0), rgb(0,0,255));" class="left-container">
          <h1 style="color: black">`+ranker+`</h1>
        </div>
        <div id="d2" style="background-color: `+bgclr+`;" class="right-container">
          <h1 style="color: black">`+names[i].substring(0, 23)+`</h1>
        </div>
        <div id="d3" style="background-color: `+bgclr+`" class="mid-container">
          <h1 style="color: black">`+points[i]+`</h1>
        </div>
        <div id="d4" style="background-color: `+bgclr+`" class="mid-container">
          <h1 style="color: black">`+times[i]+`</h1>
        </div>
        <div id="d5" style="background-color: `+bgclr+`" class="center-container">
          <h1 style="color: black">`+rankscores[i]+`</h1>
        </div>
      </div>
      <br>`;
      } else if (names[i] == ' ' || names[i] == ''){
        display.innerHTML += `
        <div style="background-color: `+bgclr+`" class="fullwidth">
        <div style="background-color: `+bgclr+`" class="left-container">
          <h1>`+ranker+`</h1>
        </div>
        <div style="background-color: `+bgclr+`" class="right-container">
          <h1>`+names[i].substring(0, 23)+`</h1>
        </div>
        <div style="background-color: `+bgclr+`" class="mid-container">
          <h1>`+points[i]+`</h1>
        </div>
        <div style="background-color: `+bgclr+`" class="mid-container">
          <h1>`+times[i]+`</h1>
        </div>
        <div style="background-color: `+bgclr+`" class="center-container">
          <h1>`+rankscores[i]+`</h1>
        </div>
      </div>
      <br>`;
    } else {
      display.innerHTML += `
        <div style="background-color: `+bgclr+`" class="fullwidth">
        <div style="background-color: `+bgclr+`" class="left-container">
          <h1>`+ranker+`</h1>
        </div>
        <div style="background-color: `+bgclr+`" class="right-container">
          <h1>`+names[i].substring(0, 23)+`</h1>
        </div>
        <div style="background-color: `+bgclr+`" class="mid-container">
          <h1>`+points[i]+`</h1>
        </div>
        <div style="background-color: `+bgclr+`" class="mid-container">
          <h1>`+times[i]+`</h1>
        </div>
        <div style="background-color: `+bgclr+`" class="center-container">
          <h1>`+rankscores[i]+`</h1>
        </div>
      </div>
      <br>`;
    }
    ranker += 1;
  }
  }

  //console.log(rankscores);
  //console.log(ranks);

  // i = 0;
  // while (i < names.length){
  //   let display = document.getElementById('leaderboard generated');
  //   display.innerHTML += `
  //   <div class="fullwidth">
  //   <div class="left-container">
  //     <h1>Rank</h1>
  //   </div>
  //   <div class="right-container">
  //     <h1>`+names[i]+`</h1>
  //   </div>
  //   <div class="mid-container">
  //     <h1>`+points[i]+`</h1>
  //   </div>
  //   <div class="mid-container">
  //     <h1>`+times[i]+`</h1>
  //   </div>
  //   <div class="center-container">
  //     <h1>`+rankscores[i]+`</h1>
  //   </div>
  // </div>
  // <br>`;
  //   i += 1;
  // }

  const sleep = ms => new Promise(res => setTimeout(res, ms));
  (async () => {
    let loader = document.getElementById('loader');
    loader.style.display="none"
    let clr = -765;
    let dir = 'left';
    while (true){
      let d = document.getElementById("d1");
      d.style.background = "linear-gradient(to right, rgb("+Math.abs(255-clr)+","+Math.abs(510-clr)+","+(Math.abs(765-clr)+Math.abs(0-clr))+"), rgb("+Math.abs(255-(clr+153))+","+Math.abs(510-(clr+153))+","+(Math.abs(765-(clr+153))+Math.abs(-255-(clr+153)))+")";
      d = document.getElementById("d2");
      d.style.background = "linear-gradient(to right, rgb("+Math.abs(255-(clr+153))+","+Math.abs(510-(clr+153))+","+(Math.abs(765-(clr+153))+Math.abs(0-(clr+153)))+"), rgb("+Math.abs(255-(clr+306))+","+Math.abs(510-(clr+306))+","+(Math.abs(765-(clr+306))+Math.abs(-255-(clr+306)))+")";
      d = document.getElementById("d3");
      d.style.background = "linear-gradient(to right, rgb("+Math.abs(255-(clr+306))+","+Math.abs(510-(clr+306))+","+(Math.abs(765-(clr+306))+Math.abs(0-(clr+306)))+"), rgb("+Math.abs(255-(clr+459))+","+Math.abs(510-(clr+459))+","+(Math.abs(765-(clr+459))+Math.abs(-255-(clr+459)))+")";
      d = document.getElementById("d4");
      d.style.background = "linear-gradient(to right, rgb("+Math.abs(255-(clr+459))+","+Math.abs(510-(clr+459))+","+(Math.abs(765-(clr+459))+Math.abs(0-(clr+459)))+"), rgb("+Math.abs(255-(clr+612))+","+Math.abs(510-(clr+612))+","+(Math.abs(765-(clr+612))+Math.abs(-255-(clr+612)))+")";
      d = document.getElementById("d5");
      d.style.background = "linear-gradient(to right, rgb("+Math.abs(255-(clr+612))+","+Math.abs(510-(clr+612))+","+(Math.abs(765-(clr+612))+Math.abs(0-(clr+612)))+"), rgb("+Math.abs(255-(clr+765))+","+Math.abs(510-(clr+765))+","+(Math.abs(765-(clr+765))+Math.abs(-255-(clr+765)))+")";


      if (clr >= 765){
        clr = -765;
      }
      clr += 0.5;
      await sleep(2);
    }
  })();

})();
